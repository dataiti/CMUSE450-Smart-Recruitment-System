const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({}, { timestamps: true });

const notification = mongoose.model("Notification", notificationSchema);

module.exports = notification;
