const Job = require("../models/job");
const ApplyJob = require("../models/applyJob");
const Category = require("../models/category");
const Employer = require("../models/employer");
const asyncHandler = require("express-async-handler");
const moment = require("moment");
const User = require("../models/user");
const {
  calculateSkillsScore,
  calculateExperienceScore,
  calculateSkillMatch,
  calculateExperiencePercentage,
  calculateJobPositionPercentage,
  calculateSalaryPercentage,
  calculateTrendPercentage,
  calculateStatistics,
} = require("../utils/fn");

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
    status: "pending",
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

const generatePreviousYearTimeBasedLineChart = asyncHandler(
  async (req, res) => {
    const { startDay, endDay, type, typeTime } = req.query;
    let chartData, startTime, endTime;
    const typeChart = type ? type : "applicated";
    const typeTimeChart = typeTime ? typeTime : "year";

    const currentYear = moment().year() - 1;

    if (typeTimeChart === "day") {
      startTime = moment().startOf("day").toDate();
      endTime = moment().endOf("day").toDate();
    } else if (typeTimeChart === "week") {
      startTime = moment()
        .startOf("week")
        .startOf("day")
        .year(currentYear)
        .toDate();
      endTime = moment().endOf("week").endOf("day").year(currentYear).toDate();
    } else if (typeTimeChart === "month") {
      startTime = moment()
        .startOf("month")
        .startOf("day")
        .year(currentYear)
        .toDate();
      endTime = moment().endOf("month").endOf("day").year(currentYear).toDate();
    } else if (typeTimeChart === "year") {
      startTime = moment()
        .startOf("year")
        .startOf("day")
        .year(currentYear)
        .toDate();
      endTime = moment().endOf("year").endOf("day").year(currentYear).toDate();
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
  }
);

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

const generateTimeBasedPieChartForAdmin = asyncHandler(async (req, res) => {
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

  const { skillMatch, skillNotMatch, skillPercentage } = calculateSkillMatch(
    candidateSkills,
    requiredSkills
  );
  const experiencePercentage = calculateExperiencePercentage(
    candidateExperience,
    requiredExperience
  );
  const jobPositionPercentage = await calculateJobPositionPercentage(
    candidateJobPosition,
    requiredJobPosition
  );
  const salaryPercentage = calculateSalaryPercentage(
    salaryType,
    salaryFrom,
    salaryTo,
    candidateDesiredSalary
  );

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
      $sort: { value: -1, _id: 1 },
    },
  ]);

  const trendPercentage = calculateTrendPercentage(trends, candidateSkills);

  const overallPercentage =
    (skillPercentage +
      experiencePercentage +
      jobPositionPercentage +
      salaryPercentage +
      trendPercentage) /
    5;

  const standardDeviation = calculateStatistics({
    arrs: [
      skillPercentage,
      experiencePercentage,
      jobPositionPercentage,
      salaryPercentage,
      trendPercentage,
    ],
  });

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
        { title: "Xu hướng", value: trendPercentage.toFixed(2) },
      ],
      skillMatch,
      skillNotMatch,
      standardDeviation,
    },
  });
});

const evaluateSuitableCandidate = asyncHandler(async (req, res) => {
  const { skills: candidateSkills, experience: candidateExperience } =
    req.candidate;

  const { skillsRequire, experienceRequire } = req.workPositionRequired;

  const skillsScore = calculateSkillsScore(candidateSkills, skillsRequire);

  const experienceScore = calculateExperienceScore(
    candidateExperience,
    experienceRequire
  );

  const overallPercentage = (skillsScore.skillsScore + experienceScore) / 2;

  const standardDeviation = calculateStatistics({
    arrs: [skillsScore.skillsScore, experienceScore],
  });

  return res.status(200).json({
    success: true,
    message: "Delete candidate is successfully",
    data: {
      overallPercentage: overallPercentage.toFixed(2),
      percentages: [
        { title: "Kỹ năng", value: skillsScore.skillsScore.toFixed(2) },
        { title: "Kinh nghiệm", value: experienceScore.toFixed(2) },
      ],
      skillMatch: skillsScore.commonSkills,
      skillNotMatch: skillsScore.skillNotMatch,
      candidateSkills: skillsScore.candidateSkills,
      standardDeviation,
    },
  });
});

const getTechnicalAndWorkPositionTrendingChart = asyncHandler(
  async (req, res) => {
    const type = req.query.type ? req.query.type : "skills";

    const q = type === "skills" ? "$skills" : "$workPosition";

    const trends = await Job.aggregate([
      {
        $unwind: q,
      },
      {
        $group: {
          _id: q,
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
  }
);

const getOveviewStatisticsForAdmin = asyncHandler(async (req, res) => {
  const numberOfTotalJobs = await Job.countDocuments({
    isLocked: false,
  });

  const numberOfTotalEmployers = await Employer.countDocuments({
    isLocked: false,
  });

  const numberOfTotalUsers = await User.countDocuments({
    isLocked: false,
  });

  const numberOfTotalApplyJobs = await ApplyJob.countDocuments({});

  const numberOfTotalCategories = await Category.countDocuments({});

  return res.status(200).json({
    success: true,
    message: "Get overview satatistics is successfully",
    data: {
      numberOfTotalJobs,
      numberOfTotalEmployers,
      numberOfTotalUsers,
      numberOfTotalApplyJobs,
      numberOfTotalCategories,
    },
  });
});

const generateTimeBasedLineChartForAdmin = asyncHandler(async (req, res) => {
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

module.exports = {
  getOveviewStatistics,
  generateTimeBasedLineChart,
  generatePreviousYearTimeBasedLineChart,
  generateTimeBasedPieChart,
  evaluateSuitableJob,
  evaluateSuitableCandidate,
  getTechnicalAndWorkPositionTrendingChart,
  getOveviewStatisticsForAdmin,
  generateTimeBasedPieChartForAdmin,
  generateTimeBasedLineChartForAdmin,
};
