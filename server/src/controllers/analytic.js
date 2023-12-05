const Job = require("../models/job");
const ApplyJob = require("../models/applyJob");
const Category = require("../models/category");
const Employer = require("../models/employer");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

const getOveviewStatistics = asyncHandler(async (req, res) => {
  const numberOfOpenJobs = await Job.countDocuments({
    employerId: req.employer._id,
    isHiring: true,
    status: "active",
  });

  const numberOfTotalJobs = await Job.countDocuments({
    employerId: req.employer._id,
    status: "active",
  });

  const numberOfTotalApplyJobs = await ApplyJob.countDocuments({
    employerId: req.employer._id,
  });

  const numberOfFollower = await Employer.findOne({
    _id: req.employer._id,
  });

  const numberOfApplyJobsNotViewed = await ApplyJob.countDocuments({
    employerId: req.employer._id,
    status: "notviewed",
  });

  return res.status(200).json({
    success: true,
    message: "Get overview satatistics is successfully",
    data: {
      numberOfTotalJobs,
      numberOfOpenJobs,
      numberOfTotalApplyJobs,
      numberOfFollower: numberOfFollower.followerIds.length,
      numberOfApplyJobsNotViewed,
    },
  });
});

const generateTimeBasedLineChart = asyncHandler(async (req, res) => {
  const { startDay, endDay, type, typeTime } = req.query;
  let chartData, startTime, endTime;
  const typeChart = type ? type : "applicated";
  const typeTimeChart = typeTime ? typeTime : "year";

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

  if (typeChart === "applicated") {
    chartData = await ApplyJob.aggregate([
      {
        $match: {
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
          value: {
            $sum: 1,
          },
        },
      },
    ]);
  } else {
    chartData = await Job.aggregate([
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
          value: {
            $sum: 1,
          },
        },
      },
    ]);
  }

  const dateRange = [];
  let currentDate = moment(startTime);

  while (currentDate <= moment(endTime)) {
    const date =
      typeTimeChart !== "year"
        ? currentDate.format("DD-MM")
        : currentDate.format("MM");
    dateRange.push({ _id: date, value: 0 });
    currentDate =
      typeTimeChart !== "year"
        ? currentDate.add(1, "day")
        : currentDate.add(1, "month").startOf("month");
  }

  chartData = dateRange.map((date) => {
    const matching = chartData.find((item) => item._id === date._id);
    if (matching) {
      return { ...date, value: matching.value };
    }
    return date;
  });

  return res.status(200).json({
    success: true,
    message: "Get data line chart is successfully",
    data: chartData,
  });
});

const generateTimeBasedPieChart = asyncHandler(async (req, res) => {
  const typeChart = req.query.type ? req.query.type : "category";
  let chartData;

  const groupField =
    typeChart === "category"
      ? "$categoryId"
      : typeChart === "industry"
      ? "$industry"
      : "$jobType";

  if (typeChart === "workRegion") {
    chartData = await Job.aggregate([
      {
        $match: {
          status: "active",
          employerId: req.employer._id,
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "workRegion",
          foreignField: "_id",
          as: "addressData",
        },
      },
      {
        $unwind: "$addressData",
      },
      {
        $project: {
          "addressData.province": 1,
        },
      },
      {
        $group: {
          _id: "$addressData.province",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: { value: -1 },
      },
    ]);
  } else {
    chartData = await Job.aggregate([
      {
        $match: {
          status: "active",
          employerId: req.employer._id,
        },
      },
      {
        $group: {
          _id: groupField,
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: { value: -1 },
      },
    ]);
  }

  return res.status(200).json({
    success: true,
    message: "Get data pie chart is successfully",
    data: chartData,
  });
});

const evaluateSuitableJob = asyncHandler(async (req, res) => {
  const {
    skills: candidateSkills,
    experience: candidateExperience,
    jobPosition: candidateJobPosition,
    desiredSalary: candidateDesiredSalary,
  } = req.candidate;

  const {
    skills: requiredSkills,
    experience: requiredExperience,
    jobPosition: requiredJobPosition,
    salaryType,
    salaryFrom,
    salaryTo,
  } = req.job;

  const skillMatch = candidateSkills.filter((skill) =>
    requiredSkills.includes(skill)
  );

  const skillNotMatch = requiredSkills.filter(
    (skill) => !candidateSkills.includes(skill)
  );

  const skillPercentage =
    (skillMatch.length / requiredSkills.length) * 100 || 0;

  const experiencePercentage =
    candidateExperience >= requiredExperience || requiredExperience === 0
      ? 100
      : (candidateExperience / requiredExperience) * 100;

  const findCategories = await Category.find();
  const jobPositionPercentage =
    candidateJobPosition === requiredJobPosition
      ? 100
      : findCategories.some((category) =>
          category.subcategories.some((item) =>
            [candidateJobPosition, requiredJobPosition].includes(item.name)
          )
        )
      ? 20
      : 0;

  let salaryPercentage = 0;

  if (salaryType === "Thỏa thuận") {
    salaryPercentage = 0;
  } else if (salaryFrom !== undefined && salaryTo !== undefined) {
    const medianSalary = (salaryFrom + salaryTo) / 2;
    const absoluteDifference = Math.abs(candidateDesiredSalary - medianSalary);
    salaryPercentage = (1 - absoluteDifference / medianSalary) * 100;
  } else if (salaryFrom === undefined && salaryTo !== undefined) {
    const absoluteDifference = Math.abs(candidateDesiredSalary - salaryTo);
    salaryPercentage = (1 - absoluteDifference / candidateDesiredSalary) * 100;
  } else if (salaryFrom !== undefined && salaryTo === undefined) {
    const absoluteDifference = Math.abs(candidateDesiredSalary - salaryFrom);
    salaryPercentage = (1 - absoluteDifference / candidateDesiredSalary) * 100;
  }

  const overallPercentage =
    (skillPercentage + experiencePercentage + jobPositionPercentage) / 3;

  return res.status(200).json({
    success: true,
    message: "Get job detail is successfully",
    data: {
      overallPercentage: overallPercentage.toFixed(2),
      percentages: [
        { title: "Kỹ năng", value: skillPercentage.toFixed(2) },
        { title: "Kinh nghiệm", value: experiencePercentage.toFixed(2) },
        { title: "Vị trí công việc", value: jobPositionPercentage.toFixed(2) },
        { title: "Lương", value: salaryPercentage.toFixed(2) },
        { title: "Yếu tố khác", value: skillPercentage.toFixed(2) },
      ],
      skillMatch,
      skillNotMatch,
    },
  });
});

const getTechnicalTrendingChart = asyncHandler(async (req, res) => {
  const trends = await Job.aggregate([
    {
      $unwind: "$skills",
    },
    {
      $group: {
        _id: "$skills",
        value: { $sum: 1 },
      },
    },
    {
      $sort: { value: -1 },
    },
  ]).limit(5);

  return res.status(200).json({
    success: true,
    message: "Get recruitment trending is successfully",
    data: trends,
  });
});

const getWorkPositionTrendingChart = asyncHandler(async (req, res) => {
  const trends = await Job.aggregate([
    {
      $group: {
        _id: "$workPosition",
        value: { $sum: 1 },
      },
    },
    {
      $sort: { value: -1 },
    },
  ]).limit(6);

  return res.status(200).json({
    success: true,
    message: "Get recruitment trending is successfully",
    data: trends,
  });
});

module.exports = {
  getOveviewStatistics,
  generateTimeBasedLineChart,
  generateTimeBasedPieChart,
  evaluateSuitableJob,
  getWorkPositionTrendingChart,
  getTechnicalTrendingChart,
};
