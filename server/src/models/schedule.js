const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
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
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    type: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    interviewerName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "",
      enum: [],
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = schedule;
