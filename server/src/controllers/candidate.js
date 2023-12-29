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

  console.log(jsonString);

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

  console.log(CVJSON);

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
  const storage = getStorage();
  const storageRef = ref(storage, `pdf-files/${req.file.originalname}`);

  const {
    jobPosition,
    workLocation,
    desiredSalary,
    yourWishes,
    introduceYourself,
  } = req.body;

  const data = await pdf(req.file.buffer);
  const cvText = data.text.toLowerCase();

  const prompt = `${cvText}. Generate a json format number of year work experience and skills in CV, skills is Array contains String . Example format: "{ "experience": 2, skills: ['reactjs', 'nodejs', 'mongodb,]}", no json before {`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let jsonString = JSON.parse(JSON.stringify(response.text()));

  console.log(jsonString);

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

  console.log(CVJSON);

  let updateCandidate;

  try {
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);
    if (CVJSON) {
      updateCandidate = await Candidate.findOneAndUpdate(
        { _id: req.candidate._id },
        {
          $set: {
            jobPosition,
            CVName: req.file.originalname,
            CVpdf: downloadURL,
            experience: CVJSON?.experience || 0,
            workLocation,
            desiredSalary: Number(desiredSalary),
            skills: CVJSON?.skills?.map((skill) => skill.toLowerCase()),
            yourWishes,
            introduceYourself,
          },
        },
        { new: true }
      );

      if (!updateCandidate) throw new Error("Update candiate is fail");
    }
  } catch (error) {}

  return res.status(200).json({
    success: true,
    message: "Update candidate is successfully",
    data: updateCandidate,
  });
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

module.exports = {
  candidateById,
  getCandidateDetail,
  registerCandidate,
  editCandidate,
  deleteCandidate,
  suggestedCandidates,
};
