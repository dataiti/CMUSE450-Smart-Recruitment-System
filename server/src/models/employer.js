const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyLogo: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
    },
    companyPhoneNumber: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    companyIndustry: {
      type: String,
      required: true,
    },
    companySize: {
      type: String,
      required: true,
    },
    companyLocation: {
      type: String,
      required: true,
    },
    companyDescription: {
      type: String,
      required: true,
    },
    followerIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    status: {
      type: String,
      default: "active",
      enum: ["pendding", "active", "locked"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    socketId: {
      type: String,
    },
  },
  { timestamps: true }
);

const employer = mongoose.model("Employer", employerSchema);

module.exports = employer;
