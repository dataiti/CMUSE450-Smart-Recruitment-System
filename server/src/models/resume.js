const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    applyJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApplyJob",
    },
    experience: {
      type: Number,
      default: 0,
    },
    skills: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const resume = mongoose.model("Resume", resumeSchema);

module.exports = resume;
