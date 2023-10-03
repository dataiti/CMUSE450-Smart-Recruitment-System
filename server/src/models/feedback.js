const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
    },
    images: {
      type: Array,
      default: [],
    },
    publicIds: {
      type: Array,
      default: [],
    },
    feedbackText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

const feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = feedback;
