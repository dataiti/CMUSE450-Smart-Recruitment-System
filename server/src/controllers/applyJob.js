const ApplyJob = require("../models/applyJob");
const Job = require("../models/job");
const Resume = require("../models/resume");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const firebaseConfig = require("../configs/firebaseConfig");
const pdf = require("pdf-parse");
const { model } = require("../configs/googleAIConfig");
const {
  calculateSkillMatchPercentage,
  processStringArray,
} = require("../utils/fn");

const applyJobById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "Application Id is invalid",
    });
  }

  const applyJob = await ApplyJob.findById(id)
    .populate("candidateId", "firstName lastName email avatar")
    .populate("jobId")
    .populate(
      "employerId",
      "companyLogo companyName companyEmail companyPhoneNumber"
    )
    .populate("resumeId")
    .lean();

  if (!applyJob)
    return res.status(400).json({
      success: true,
      message: "Apply job is not find",
    });

  req.applyJob = applyJob;
  next();
});

const getApplyJobDetail = asyncHandler(async (req, res) => {
  const cvSkills = req.applyJob.resumeId.skills;
  const jobSkills = req.applyJob.jobId.skills;
  const cvExperience = req.applyJob.resumeId.experience;
  const jobExperience = req.applyJob.jobId.experience;

  const extractSkills = (skillString) => {
    const extractedSkills = skillString.split("(")[0].trim().toLowerCase();
    return extractedSkills.split(",").map((skill) => skill.trim());
  };

  const cvSpecificSkills = [].concat(
    ...cvSkills.map((skill) => extractSkills(skill))
  );
  const jobSpecificSkills = [].concat(
    ...jobSkills.map((skill) => extractSkills(skill))
  );

  const commonSkills = cvSpecificSkills.filter((skill) =>
    jobSpecificSkills.includes(skill)
  );

  const matchPercentage =
    (commonSkills.length / jobSpecificSkills.length) * 100;
  const experiencePercentage =
    cvExperience >= jobExperience || jobExperience === 0
      ? 100
      : (cvExperience / jobExperience) * 100;

  const skillMatch = cvSkills.filter((skill) => jobSkills.includes(skill));

  const skillNotMatch = jobSkills.filter((skill) => !cvSkills.includes(skill));

  const overallPercentage = Number(
    ((matchPercentage + experiencePercentage) / 2).toFixed(2)
  );

  return res.status(200).json({
    success: true,
    message: "Get apply job detail is successfully",
    data: {
      ...req.applyJob,
      skillsPercent: matchPercentage,
      experiencePercentage,
      overallPercentage,
      skillNotMatch,
      cvSkills,
      skillMatch,
    },
  });
});

const applyJob = asyncHandler(async (req, res) => {
  const storage = getStorage();
  const storageRef = ref(storage, `pdf-files/${req.file.originalname}`);

  try {
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

    const newApplyJob = new ApplyJob({
      candidateId: req.user._id,
      jobId: req.job._id,
      employerId: req.employer._id,
      CVName: req.file.originalname,
      CVpdf: downloadURL,
      information: req.body.information,
    });

    const savedApplyJob = await newApplyJob.save();

    await Job.findOneAndUpdate(
      { _id: req.job._id },
      {
        $set: {
          appliedIds: [...req.job.appliedIds, savedApplyJob._id],
        },
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          appliedJobs: [...req.user.appliedJobs, req.job._id],
        },
      },
      { new: true }
    );

    const data = await pdf(req.file.buffer);
    const cvText = data.text.toLowerCase();

    const prompt = `${cvText}. Generate a json format number of year work experience and skills in CV, skills is Array contains String . Example format: "{ "experience": 2, skills: ['reactjs', 'nodejs', 'mongodb,]}", no json before {`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let jsonString = JSON.parse(JSON.stringify(response.text()));

    jsonString = jsonString.replace(/^[^{]*([\s\S]*?)[^}]*$/, "$1");

    console.log(jsonString);

    let CVJSON = {};

    try {
      const parsedResult = JSON.parse(jsonString);
      if (parsedResult && typeof parsedResult === "object") {
        CVJSON = parsedResult;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    let newResume;

    if (CVJSON) {
      newResume = new Resume({
        userId: req.user._id,
        applyJobId: newApplyJob._id,
        experience: CVJSON?.experience || 0,
        skills:
          processStringArray(
            CVJSON?.skills?.map((skill) => skill.toLowerCase())
          ) || [],
      });

      await newResume.save();

      if (!newResume) throw new Error("Save resume is fail");
    }

    newApplyJob.resumeId = newResume._id;
    await newApplyJob.save();

    return res.status(200).json({
      success: true,
      message: "Apply Job is successfully",
      data: newApplyJob,
    });
  } catch (error) {
    await deleteObject(storageRef);

    return res.status(500).json({
      success: false,
      message: "Error uploading file and adding ApplyJob",
    });
  }
});

const updateApplyJob = asyncHandler(async (req, res) => {});

const deleteApplyJob = asyncHandler(async (req, res) => {});

const stopApplyJob = asyncHandler(async (req, res) => {});

const responseEmployerForApplyJob = asyncHandler(async (req, res) => {
  const { response } = req.body;

  if (!response) throw new Error("Response field is required");

  const updateApplyJob = await ApplyJob.findOneAndUpdate(
    { _id: req.applyJob._id },
    { $set: { response } },
    { new: true }
  );

  if (!updateApplyJob) throw new Error("Response employer is fail");

  return res.status(200).json({
    success: true,
    message: "Response employer is successfully",
    data: updateApplyJob,
  });
});

const getListApplyJobForEmployer = asyncHandler(async (req, res) => {
  const { query } = req;
  const search = query.search ? query.search : "";
  const status = query.status ? query.status : "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const filterArgs = {
    $or: [{ CVName: { $regex: regex, $options: "i" } }],
    employerId: req.employer._id,
  };

  if (status) filterArgs.status = status;

  let listApplyJobs = [];
  const listApplyJobsWithEvaluation = await ApplyJob.find(filterArgs)
    .sort("-_id")
    .populate("candidateId", "firstName lastName email avatar")
    .populate("jobId", "skills recruitmentTitle experience")
    .populate("resumeId", "skills experience")
    .populate(
      "employerId",
      "companyLogo companyName companyEmail companyPhoneNumber"
    )
    .lean();

  listApplyJobs = listApplyJobsWithEvaluation.map((apply) => {
    const percentage = calculateSkillMatchPercentage({
      jobSkills: apply.jobId?.skills,
      cvSkills: apply.resumeId?.skills,
      jobExperience: apply.jobId?.experience,
      cvExperience: apply.resumeId?.experience,
    });
    return { ...apply, percentage };
  });

  if (req.query.sortBy === "percentage") {
    listApplyJobs.sort((a, b) =>
      req.query.orderBy === "desc"
        ? b.percentage - a.percentage
        : a.percentage - b.percentage
    );
  }

  const countApplyJobs = listApplyJobs.length;
  const totalPage = Math.ceil(countApplyJobs / limit);
  listApplyJobs = listApplyJobs.slice(skip, skip + limit);

  return res.status(200).json({
    success: true,
    message: "Get list apply jobs are successfully",
    totalPage,
    count: countApplyJobs,
    data: listApplyJobs,
  });
});

const getListApplyJobForCandidate = asyncHandler(async (req, res) => {
  const { query } = req;
  const search = query.search ? query.search : "";
  const status = query.status ? query.status : "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const filterArgs = {
    $or: [{ CVName: { $regex: regex, $options: "i" } }],
    candidateId: req.user._id,
  };

  if (status) filterArgs.status = status;

  const countApplyJobs = await ApplyJob.countDocuments(filterArgs);

  const totalPage = Math.ceil(countApplyJobs / limit);

  const listApplyJobs = await ApplyJob.find(filterArgs)
    .sort("-_id")
    .skip(skip)
    .limit(limit)
    .populate("candidateId", "firstName lastName email avatar")
    .populate("jobId")
    .populate(
      "employerId",
      "companyLogo companyName companyEmail companyPhoneNumber"
    );

  return res.status(200).json({
    success: true,
    message: "Get list apply jobs for candidate are successfully",
    totalPage,
    count: countApplyJobs,
    data: listApplyJobs,
  });
});

const testCV = asyncHandler(async (req, res) => {
  const data = await pdf(req.file.buffer);
  const cvText = data.text.toLowerCase().trim();

  const prompt = `${cvText}. Generate a json format number of year work experience and skills in CV, skills is Array contains String . Example format: "{ "experience": 2, skills: ['reactjs', 'nodejs', 'mongodb,]}", no json before {`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let jsonString = JSON.parse(JSON.stringify(response.text()));

  jsonString = jsonString.replace(/^[^{]*([\s\S]*?)[^}]*$/, "$1");

  let CVJSON = {};

  try {
    const parsedResult = JSON.parse(jsonString);
    if (parsedResult && typeof parsedResult === "object") {
      CVJSON = parsedResult;
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  return res.status(200).json({
    success: true,
    message: "Register candidate is successfully",
    data: jsonString,
  });
});

module.exports = {
  applyJobById,
  getApplyJobDetail,
  applyJob,
  updateApplyJob,
  deleteApplyJob,
  stopApplyJob,
  responseEmployerForApplyJob,
  getListApplyJobForEmployer,
  getListApplyJobForCandidate,
  testCV,
};
