const mongoose = require("mongoose");

const applyJobSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
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
    information: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "invited",
        "responsed",
        "rejected",
        "progressing",
        "interviewed",
      ],
    },
  },
  { timestamps: true }
);

const applyJob = mongoose.model("ApplyJob", applyJobSchema);

module.exports = applyJob;
