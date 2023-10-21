const Employer = require("../models/employer");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const employerById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "Employer Id is invalid",
    });
  }

  const employer = await Employer.findById(id);

  if (!employer) throw new Error("Employer is not find");

  req.employer = employer;
  next();
});

const getEmployerDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get employer detail is successfully",
    data: req.employer,
  });
});

const registerEmployer = asyncHandler(async (req, res) => {
  console.log(req.file);

  const companyLogo = req.file.path;
  const publicId = req.file.filename;

  const {
    fullName,
    phoneNumber,
    sex,
    workLocation,
    companyName,
    companyEmail,
    companyPhoneNumber,
    websiteUrl,
    companyIndustry,
    companySize,
    companyLocation,
    companyDescription,
  } = req.body;

  const newEmployer = new Employer({
    ownerId: req.user._id,
    fullName,
    phoneNumber,
    sex,
    workLocation,
    companyLogo,
    publicId,
    companyName,
    companyEmail,
    companyPhoneNumber,
    websiteUrl,
    companyIndustry,
    companySize,
    companyLocation,
    companyDescription,
  });

  await newEmployer.save();

  if (!newEmployer) throw new Error("Register employer is fail");

  return res.status(200).json({
    success: true,
    message: "Register employer is successfully",
    data: newEmployer,
  });
});

const editEmployer = asyncHandler(async (req, res) => {
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

  const updateCandiate = await Employer.findOneAndUpdate(
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

const deleteEmployer = asyncHandler(async (req, res) => {
  const deleteCandidate = await Candidate.findOneAndDelete({
    _id: req.candidate.candidateId,
  });

  if (!deleteCandidate) throw new Error("Delete candidate is fail");

  return res.status(200).json({
    success: true,
    message: "Delete candidate is successfully",
  });
});

const getListOfEmployerForAdmin = asyncHandler(async (req, res) => {});

module.exports = {
  employerById,
  getEmployerDetail,
  registerEmployer,
  editEmployer,
  deleteEmployer,
  getListOfEmployerForAdmin,
};
