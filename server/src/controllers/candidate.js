const Candidate = require("../models/candidate");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

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
  const {
    jobPosition,
    experience,
    workLocation,
    desiredSalary,
    yourWishes,
    introduceYourself,
  } = req.body;

  if (req.user.candidateId) throw new Error("Candidate is registed");

  const newCandidate = new Candidate({
    userId: req.user._id,
    jobPosition,
    experience,
    workLocation,
    desiredSalary: Number(desiredSalary),
    skills: JSON.parse(req.body.skills),
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

  return res.status(200).json({
    success: true,
    message: "Register candidate is successfully",
    data: newCandidate,
  });
});

const editCandidate = asyncHandler(async (req, res) => {
  const {
    jobPosition,
    experience,
    workLocation,
    desiredSalary,
    yourWishes,
    introduceYourself,
  } = req.body;

  const updateCandiate = await Candidate.findOneAndUpdate(
    { _id: req.candidate._id },
    {
      $set: {
        jobPosition,
        experience,
        workLocation,
        desiredSalary: Number(desiredSalary),
        skills: JSON.parse(req.body.skills),
        yourWishes,
        introduceYourself,
      },
    },
    { new: true }
  );

  if (!updateCandiate) throw new Error("Update candidate is Fail");

  return res.status(200).json({
    success: true,
    message: "Edit candidate is successfully",
    data: updateCandiate,
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

module.exports = {
  candidateById,
  getCandidateDetail,
  registerCandidate,
  editCandidate,
  deleteCandidate,
};
