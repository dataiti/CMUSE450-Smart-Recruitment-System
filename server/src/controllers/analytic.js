const Job = require("../models/job");
const Candidate = require("../models/candidate");
const Employer = require("../models/employer");
const asyncHandler = require("express-async-handler");

const getOveviewStatistics = asyncHandler(async (req, res) => {
  const numberOfOpenJobs = await Job.countDocuments({ status: "active" });

  return res.status(200).json({
    success: true,
    message: "Get overview satatistics is successfully",
    data: {
      numberOfOpenJobs,
    },
  });
});

const generateTimeBasedChart = asyncHandler(async (req, res) => {
  const { startDay, endDay, type, typeTime } = req.body;

  const typeChart = type ? type : "applicated";

  let result;

  if (type === "applicated") {
  } else if (type === "job") {
  }
});

// const getOveviewStatistics = asyncHandler(async (req, res) => {});

// const getOveviewStatistics = asyncHandler(async (req, res) => {});

// const getOveviewStatistics = asyncHandler(async (req, res) => {});

// const getOveviewStatistics = asyncHandler(async (req, res) => {});

// const getOveviewStatistics = asyncHandler(async (req, res) => {});

module.exports = { getOveviewStatistics };
