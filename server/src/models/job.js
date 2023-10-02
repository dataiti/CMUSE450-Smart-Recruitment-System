const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    // categoryId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
    workRegion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    recruitmentCampaignName: {
      type: String,
      required: true,
    },
    jobPosition: {
      type: String,
      required: true,
    },
    recruitmentTitle: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    vacancyCount: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    currencyType: {
      type: String,
      required: true,
    },
    salaryType: {
      type: String,
      required: true,
    },
    salaryFrom: {
      type: Number,
      min: 0,
    },
    salaryTo: {
      type: Number,
      min: 10000,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    candidateRequirements: {
      type: String,
      required: true,
    },
    candidateBenefits: {
      type: String,
      required: true,
    },
    applicationDeadline: Date,
    receiverFullName: {
      type: String,
      required: true,
    },
    receiverEmail: {
      type: String,
      required: true,
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "expired", "reject"],
    },
    isHiring: {
      type: Boolean,
      default: true,
    },
    appliedIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candiate",
        },
      ],
      default: [],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const job = mongoose.model("Job", jobSchema);

module.exports = job;
