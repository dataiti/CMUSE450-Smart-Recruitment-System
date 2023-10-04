const Job = require("../models/job");
const Candidate = require("../models/candidate");
const Employer = require("../models/employer");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

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

const generateTimeBasedLineChart = asyncHandler(async (req, res) => {
  const { startDay, endDay, type, typeTime } = req.body;
  let chartData, startTime, endTime;
  const typeChart = type ? type : "applicated";
  const typeTimeChart = typeTime ? typeTime : "month";

  if (typeTimeChart === "day") {
    startTime = moment().startOf("day").toDate();
    endTime = moment().endOf("day").toDate();
  } else if (typeTimeChart === "week") {
    startTime = moment().startOf("week").startOf("day").toDate();
    endTime = moment().endOf("week").endOf("day").toDate();
  } else if (typeTimeChart === "month") {
    startTime = moment().startOf("month").startOf("day").toDate();
    endTime = moment().endOf("month").endOf("day").toDate();
  } else if (typeTimeChart === "year") {
    startTime = moment().startOf("year").startOf("day").toDate();
    endTime = moment().endOf("year").endOf("day").toDate();
  } else if (typeTimeChart === "custom") {
    startTime = new Date(startDay);
    endTime = new Date(endDay);
  }

  const dateToStringFormat = typeTimeChart === "year" ? "%m" : "%d-%m";

  const result = await Job.aggregate([
    {
      $match: {
        status: "active",
        createdAt: {
          $gte: startTime,
          $lte: endTime,
        },
        employerId: req.employer._id,
      },
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: [typeTimeChart, "day"] },
            then: {
              $dateToString: {
                format: dateToStringFormat,
                date: "$createdAt",
              },
            },
            else: {
              $dateToString: {
                format: dateToStringFormat,
                date: "$createdAt",
              },
            },
          },
        },
        total: {
          $sum: typeChart === "applicated" ? 1 : { $size: "$appliedIds" },
        },
      },
    },
  ]);

  chartData = result;

  const dateRange = [];
  let currentDate = moment(startTime);

  while (currentDate <= moment(endTime)) {
    const date =
      typeTimeChart !== "year"
        ? currentDate.format("DD-MM")
        : currentDate.format("MM");
    dateRange.push({ _id: date, total: 0 });
    currentDate =
      typeTimeChart !== "year"
        ? currentDate.add(1, "day")
        : currentDate.add(1, "month").startOf("month");
  }

  chartData = dateRange.map((date) => {
    const matching = chartData.find((item) => item._id === date._id);
    if (matching) {
      return { ...date, total: matching.total };
    }
    return date;
  });

  return res.status(200).json({
    success: true,
    message: "Get data line chart is successfully",
    data: chartData,
  });
});

const generateTimeBasedPieChartByCategory = asyncHandler(
  async (req, res) => {}
);

const generateTimeBasedPieChartByLocation = asyncHandler(
  async (req, res) => {}
);

const getSchedule = asyncHandler(async (req, res) => {});

module.exports = {
  getOveviewStatistics,
  generateTimeBasedLineChart,
  generateTimeBasedPieChartByCategory,
  generateTimeBasedPieChartByLocation,
};
