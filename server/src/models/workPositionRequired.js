const mongoose = require("mongoose");

const workPositionRequiredSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerId",
      required: true,
    },
    titlePosition: {
      type: String,
      required: true,
    },
    jobPosition: {
      type: String,
      required: true,
    },
    experienceWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    skillsWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    skillsRequire: {
      type: Array,
      default: [],
    },
    experienceRequire: {
      type: Number,
      default: 0,
    },
    milestonePercent: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

const workPositionRequired = mongoose.model(
  "WorkPositionRequired",
  workPositionRequiredSchema
);

module.exports = workPositionRequired;
