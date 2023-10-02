const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    yearOfBirth: {
      type: String,
      required: true,
    },
    sex: {
      type: Boolean,
      required: true,
    },
    careers: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    workLocation: {
      type: String,
      required: true,
    },
    desiredSalary: {
      type: String,
      required: true,
    },
    yourCV: {
      type: String,
      // required: true,
    },
    skills: [String],
    yourWishes: {
      type: String,
    },
    introduceYourself: {
      type: String,
    },
  },
  { timestamps: true }
);

const candidate = mongoose.model("Candidate", candidateSchema);

module.exports = candidate;
