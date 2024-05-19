const WorkPositionRequired = require("../models/workPositionRequired");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Employer = require("../models/employer");
const { getSuggestedCandidates } = require("../utils/fn");

const workPositionRequiredById = asyncHandler(async (req, res, next, id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    return res.status(400).json({
      success: true,
      message: "WorkPositionRequiredId is invalid",
    });
  }

  const workPositionRequired = await WorkPositionRequired.findById(id);

  if (!workPositionRequired)
    return res.status(400).json({
      success: true,
      message: "This WorkPositionRequired is not found",
    });

  req.workPositionRequired = workPositionRequired;
  next();
});

const createWorkPositionRequired = asyncHandler(async (req, res) => {
  const {
    titlePosition,
    jobPosition,
    experienceWeight,
    skillsWeight,
    skillsRequire,
    experienceRequire,
    milestonePercent,
  } = req.body;

  const newWorkPositionRequired = new WorkPositionRequired({
    employerId: req.employer._id,
    titlePosition,
    jobPosition,
    experienceWeight: Number(experienceWeight),
    skillsWeight: Number(skillsWeight),
    skillsRequire: JSON.parse(skillsRequire),
    experienceRequire: Number(experienceRequire),
    milestonePercent: Number(milestonePercent),
  });

  await newWorkPositionRequired.save();

  if (!newWorkPositionRequired)
    throw new Error("Create newWorkPositionRequired is failed");

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
    message: "Create newWorkPositionRequired is successfully",
    data: suggestedCandidatesByPosition,
  });
});

const editWorkPositionRequired = asyncHandler(async (req, res) => {
  const {
    titlePosition,
    jobPosition,
    experienceWeight,
    skillsWeight,
    skillsRequire,
    experienceRequire,
    milestonePercent,
  } = req.body;

  console.log(req.body);

  const updateWorkPositionRequired =
    await WorkPositionRequired.findOneAndUpdate(
      { _id: req.workPositionRequired._id },
      {
        $set: {
          titlePosition,
          jobPosition,
          experienceWeight: Number(experienceWeight),
          skillsWeight: Number(skillsWeight),
          skillsRequire: JSON.parse(skillsRequire),
          experienceRequire: Number(experienceRequire),
          milestonePercent: Number(milestonePercent),
        },
      },
      {
        new: true,
      }
    );

  if (!updateWorkPositionRequired)
    throw new Error("Edit WorkPositionRequired is failed");

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
    message: "Edit WorkPositionRequired is successfully",
    data: suggestedCandidatesByPosition,
  });
});

const deleteWorkPositionRequired = asyncHandler(async (req, res) => {
  const deleteWorkPosition = await WorkPositionRequired.findOneAndDelete({
    _id: req.workPositionRequired._id,
  });

  if (!deleteWorkPosition)
    throw new Error("Delete WorkPositionRequired is failed");

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
    message: "Delete newWorkPositionRequired is successfully",
    data: suggestedCandidatesByPosition,
  });
});

module.exports = {
  workPositionRequiredById,
  createWorkPositionRequired,
  editWorkPositionRequired,
  deleteWorkPositionRequired,
};
