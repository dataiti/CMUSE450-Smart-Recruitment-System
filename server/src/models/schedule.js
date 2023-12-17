const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applyJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApplyJob",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    interviewerName: {
      type: String,
      required: true,
    },
    interviewerEmail: {
      type: String,
      required: true,
    },
    interviewerPhoneNumber: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // content: {
    //   type: String,
    //   required: true,
    // },
    status: {
      type: String,
      defaut: "pending",
      enum: ["pending", "online", "offline", "rejected"],
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = schedule;
