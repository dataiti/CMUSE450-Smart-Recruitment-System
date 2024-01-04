const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobPosition: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    workLocation: {
      type: String,
      required: true,
    },
    CVName: {
      type: String,
      required: true,
    },
    CVpdf: {
      type: String,
      required: true,
    },
    desiredSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    skills: {
      type: Array,
      default: [],
    },
    yourWishes: {
      type: String,
    },
    introduceYourself: {
      type: String,
    },
    isApplyAuto: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const candidate = mongoose.model("Candidate", candidateSchema);

module.exports = candidate;
