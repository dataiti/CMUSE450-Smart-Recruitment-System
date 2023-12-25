const WorkPositionRequired = require("../models/workPositionRequired");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Employer = require("../models/employer");

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
    jobPosition,
    experienceWeight,
    skillsWeight,
    skillsRequire,
    experienceRequire,
    milestonePercent,
  } = req.body;

  const newWorkPositionRequired = new WorkPositionRequired({
    employerId: req.employer._id,
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

  console.log(newWorkPositionRequired);

  return res.status(200).json({
    success: true,
    message: "Create newWorkPositionRequired is successfully",
    data: newWorkPositionRequired,
  });
});

module.exports = { workPositionRequiredById, createWorkPositionRequired };
