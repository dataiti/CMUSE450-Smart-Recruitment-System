const Candidate = require("../models/candidate");
const User = require("../models/user");
const WorkPositionRequired = require("../models/workPositionRequired");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const pdf = require("pdf-parse");
const { model } = require("../configs/googleAIConfig");
const {
  calculateTotalScore,
  calculateExperienceScore,
  calculateSkillsScore,
  getSuggestedCandidates,
} = require("../utils/fn");

const candidateById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "CandidateId is invalid",
    });
  }

  const candidate = await Candidate.findById(id);

  if (!candidate)
    return res.status(400).json({
      success: true,
      message: "Candidate is not find",
    });

  req.candidate = candidate;
  next();
});

const getCandidateDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get candidate detail is successfully",
    data: req.candidate,
  });
});

const registerCandidate = asyncHandler(async (req, res) => {
  const storage = getStorage();
  const storageRef = ref(storage, `pdf-files/${req.file.originalname}`);

  const {
    jobPosition,
    workLocation,
    desiredSalary,
    yourWishes,
    introduceYourself,
  } = req.body;

  if (req.user.candidateId) throw new Error("Candidate is registed");

  const data = await pdf(req.file.buffer);
  const cvText = data.text.toLowerCase();

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

  let newCandidate;

  try {
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);
    if (CVJSON) {
      newCandidate = new Candidate({
        userId: req.user._id,
        jobPosition,
        CVName: req.file.originalname,
        CVpdf: downloadURL,
        experience: CVJSON?.experience || 0,
        workLocation,
        desiredSalary: Number(desiredSalary),
        skills: CVJSON?.skills?.map((skill) => skill.toLowerCase()),
        yourWishes,
        introduceYourself,
      });

      await newCandidate.save();

      if (!newCandidate) throw new Error("Register candiate is fail");

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { candidateId: newCandidate._id } },
        { new: true }
      );
    }
  } catch (error) {}

  return res.status(200).json({
    success: true,
    message: "Register candidate is successfully",
    data: newCandidate,
  });
});

const editCandidate = asyncHandler(async (req, res) => {
  try {
    const {
      jobPosition,
      workLocation,
      desiredSalary,
      yourWishes,
      introduceYourself,
    } = req.body;

    console.log(req.body);

    let CVName;
    let CVpdf;
    let experience;
    let skills;
    let CVJSON = {};

    if (req.file && req.file.originalname) {
      const storage = getStorage();
      const storageRef = ref(storage, `pdf-files/${req.file.originalname}`);

      const data = await pdf(req.file.buffer);
      const cvText = data.text.toLowerCase();

      const prompt = `${cvText}. Generate a json format number of year work experience and skills in CV, skills is Array contains String. Example format: "{ "experience": 2, skills: ['reactjs', 'nodejs', 'mongodb,]}", no json before {`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let jsonString = JSON.parse(JSON.stringify(response.text()));

      jsonString = jsonString.replace(/^[^{]*([\s\S]*?)[^}]*$/, "$1");

      try {
        const parsedResult = JSON.parse(jsonString);
        if (parsedResult && typeof parsedResult === "object") {
          CVJSON = parsedResult;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }

      try {
        const snapshot = await uploadBytesResumable(
          storageRef,
          req.file.buffer,
          {
            contentType: req.file.mimetype,
          }
        );

        CVpdf = await getDownloadURL(snapshot.ref);
        CVName = req.file.originalname;
        skills = CVJSON?.skills?.map((skill) => skill.toLowerCase());
        experience = CVJSON?.experience || 0;
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
      }
    } else {
      CVName = req.body.CVName;
      CVpdf = req.body.CVpdf;
      experience = Number(req.body.experience);
      skills = JSON.parse(req.body.skills);
    }

    let updateCandidate;

    try {
      if (CVpdf) {
        updateCandidate = await Candidate.findOneAndUpdate(
          { _id: req.candidate._id },
          {
            $set: {
              jobPosition,
              CVName,
              CVpdf,
              experience,
              workLocation,
              desiredSalary: Number(desiredSalary),
              skills,
              yourWishes,
              introduceYourself,
            },
          },
          { new: true }
        );

        if (!updateCandidate) {
          throw new Error("Update candidate is fail");
        }
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
      throw new Error("Update candidate failed");
    }

    return res.status(200).json({
      success: true,
      message: "Update candidate is successful",
      data: updateCandidate,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

const deleteCandidate = asyncHandler(async (req, res) => {
  const deleteCandidate = await Candidate.findOneAndDelete({
    _id: req.candidate.candidateId,
  });

  if (!deleteCandidate) throw new Error("Delete candidate is fail");

  return res.status(200).json({
    success: true,
    message: "Delete candidate is successfully",
  });
});

const suggestedCandidates = asyncHandler(async (req, res) => {
  const workPositions = await WorkPositionRequired.find({
    employerId: req.employer._id,
  });

  if (!workPositions || workPositions.length === 0) {
    throw new Error("No work positions found for the employer");
  }

  const suggestedCandidatesByPosition = [];

  for (const workPosition of workPositions) {
    const result = await getSuggestedCandidates(workPosition);
    suggestedCandidatesByPosition.push(result);
  }

  return res.status(200).json({
    success: true,
    message: "Get list canddiates for job position is successfully",
    data: suggestedCandidatesByPosition,
  });
});

const toggleApplyAuto = asyncHandler(async (req, res) => {
  const findCandidate = await Candidate.findOne({ _id: req.candidate._id });

  if (!findCandidate) throw new Error("Candidate is not find");

  findCandidate.isApplyAuto = !findCandidate.isApplyAuto;

  await findCandidate.save();

  return res.status(200).json({
    success: true,
    messsage: "Toggle apply auto is successfully",
    data: findCandidate.isApplyAuto,
  });
});

module.exports = {
  candidateById,
  getCandidateDetail,
  registerCandidate,
  editCandidate,
  deleteCandidate,
  suggestedCandidates,
  toggleApplyAuto,
};
