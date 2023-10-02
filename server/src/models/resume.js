const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({}, { timestamps: true });

const resume = mongoose.model("Resume", resumeSchema);

module.exports = resume;
