const Candidate = require("../models/candidate");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const candidateById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (isValidId) {
    return res.status(400).json({
      success: true,
      message: "Id is invalid",
    });
  }

  const candidate = await Candidate.findById(id);

  if (!candidate) throw new Error("Candidate is not find");

  req.candidate = candidate;
  next();
});

const getCandidateDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Register candidate is successfully",
    data: req.candidate,
  });
});

const registerCandidate = asyncHandler(async (req, res) => {
  const {
    userId,
    fullName,
    yearOfBirth,
    sex,
    careers,
    experience,
    workLocation,
    desiredSalary,
    yourCV,
    skills,
    introduceYourself,
  } = req.body;

  const newCandidate = new Candidate({
    userId,
    fullName,
    yearOfBirth,
    sex,
    careers,
    experience,
    workLocation,
    desiredSalary,
    yourCV,
    skills,
    introduceYourself,
  });

  await newCandidate.save();

  if (!newCandidate) throw new Error("Register candiate is fail");

  return res.status(200).json({
    success: true,
    message: "Register candidate is successfully",
    data: newCandidate,
  });
});

const editCandidate = asyncHandler(async (req, res) => {
  const {
    fullName,
    yearOfBirth,
    sex,
    careers,
    experience,
    workLocation,
    desiredSalary,
    yourCV,
    skills,
    introduceYourself,
  } = req.body;

  const updateCandiate = await Candidate.findOneAndUpdate(
    { _id: req.candidate.candidateId },
    {
      $set: {
        fullName,
        yearOfBirth,
        sex,
        careers,
        experience,
        workLocation,
        desiredSalary,
        yourCV,
        skills,
        introduceYourself,
      },
    },
    { new: true }
  );

  if (!updateCandiate) throw new Error("Edit candidate is fail");

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

const getListOfCandidateForEmployer = asyncHandler(async (req, res) => {});

const getListOfCandidateForAdmin = asyncHandler(async (req, res) => {});

module.exports = {
  candidateById,
  getCandidateDetail,
  registerCandidate,
  editCandidate,
  deleteCandidate,
  getListOfCandidateForEmployer,
  getListOfCandidateForAdmin,
};
