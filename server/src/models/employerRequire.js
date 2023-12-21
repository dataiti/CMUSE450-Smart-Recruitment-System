const mongoose = require("mongoose");

const employerRequireSchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerId",
      required: true,
    },
    experienceWeight: {
      type: Number,
      default: 0,
    },
    skillsWeight: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const employerRequire = mongoose.model(
  "EmployerRequire",
  employerRequireSchema
);

module.exports = employerRequire;
