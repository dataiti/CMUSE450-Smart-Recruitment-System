const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["message", "invitation", "system"],
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const notification = mongoose.model("Notification", notificationSchema);

module.exports = notification;
