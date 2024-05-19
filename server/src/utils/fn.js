const Category = require("../models/category");
const Job = require("../models/job");
const Candidate = require("../models/candidate");
const { model } = require("../configs/googleAIConfig");

const parseArrayQueryParam = (paramName, query) =>
  query[paramName] && query[paramName] !== "[]"
    ? JSON.parse(query[paramName])
    : -1;

const calculateSimilarity = (userA, userB) => {
  const viewedJobsA = userA.viewedJobs?.map((job) => job.toString());
  const appliedJobsA = userA.appliedJobs?.map((job) => job.toString());
  const wishlistJobsA = userA.wishlistIds?.map((job) => job.toString());
  const viewedJobsB = userB.viewedJobs?.map((job) => job.toString());
  const appliedJobsB = userB.appliedJobs?.map((job) => job.toString());
  const wishlistJobsB = userB.wishlistIds?.map((job) => job.toString());

  const intersectionViewed = viewedJobsA.filter((job) =>
    viewedJobsB.includes(job)
  );
  const intersectionApplied = appliedJobsA.filter((job) =>
    appliedJobsB.includes(job)
  );
  const intersectionWishlist = wishlistJobsA.filter((job) =>
    wishlistJobsB.includes(job)
  );

  const magnitudeA = Math.sqrt(
    viewedJobsA.length + appliedJobsA.length + wishlistJobsA.length
  );
  const magnitudeB = Math.sqrt(
    viewedJobsB.length + appliedJobsB.length + wishlistJobsB.length
  );

  const cosineSimilarityViewed =
    magnitudeA !== 0 && magnitudeB !== 0
      ? intersectionViewed.length / (magnitudeA * magnitudeB)
      : 0;

  const cosineSimilarityApplied =
    magnitudeA !== 0 && magnitudeB !== 0
      ? intersectionApplied.length / (magnitudeA * magnitudeB)
      : 0;

  const cosineSimilarityWishlist =
    magnitudeA !== 0 && magnitudeB !== 0
      ? intersectionWishlist.length / (magnitudeA * magnitudeB)
      : 0;

  const weightedAverage =
    0.5 * cosineSimilarityViewed +
    0.3 * cosineSimilarityWishlist +
    0.2 * cosineSimilarityApplied;

  return weightedAverage;
};

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

function calculateSkillMatchPercentage({
  cvSkills,
  jobSkills,
  jobExperience,
  cvExperience,
}) {
  const commonSkills =
    cvSkills?.filter((skill) => jobSkills?.includes(skill)) || [];
  const skillPercentage = (commonSkills.length / jobSkills?.length) * 100 || 0;

  const experiencePercentage =
    cvExperience >= jobExperience || jobExperience === 0
      ? 100
      : (cvExperience / jobExperience) * 100;

  return ((skillPercentage + experiencePercentage) / 2).toFixed(2);
}

function processStringArray(inputArray) {
  const processElement = (element) => {
    const matches = element.match(/\w+\s?\(\w+\)/g);
    const resultArray = [];

    if (matches) {
      matches.forEach((match) => {
        const innerArray = match.match(/\w+/g);
        resultArray.push(...innerArray);
      });
    } else {
      resultArray.push(element);
    }

    return resultArray;
  };

  return inputArray.flatMap(processElement);
}

const CVAnalysic = async (cvText) => {
  const prompt = `${cvText}. Generate a JSON format number of year work experience and skills in CV, skills is Array contains String . Example: { "experience": 2, skills: ['reactjs', 'nodejs', 'mongodb,]}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let jsonString = JSON.parse(JSON.stringify(response.text()));
  jsonString = jsonString.replace(/^```\s*([\s\S]*)\s*```$/, "$1");

  let CVJSON = {};

  try {
    const parsedResult = JSON.parse(jsonString);
    if (parsedResult && typeof parsedResult === "object") {
      CVJSON = parsedResult;
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  return CVJSON;
};

function calculateExperienceScore(candidateExperience, requiredExperience) {
  const experienceSimilarity = Math.min(
    1,
    candidateExperience / requiredExperience
  );

  const experienceScore = experienceSimilarity * 100;

  return experienceScore;
}

function calculateSkillsScore(candidateSkills, requiredSkills) {
  const commonSkills = candidateSkills.filter((skill) =>
    requiredSkills.includes(skill)
  );

  const skillNotMatch = requiredSkills.filter(
    (skill) => !candidateSkills.includes(skill)
  );

  const skillsSimilarity = Math.min(
    1,
    commonSkills.length / requiredSkills.length
  );

  const skillsScore = skillsSimilarity * 100;

  return { commonSkills, skillNotMatch, candidateSkills, skillsScore };
}

function calculateTotalScore(
  experienceWeight,
  skillsWeight,
  experienceScore,
  skillsScore
) {
  const adjustedExperienceWeight = experienceWeight || 1;
  const adjustedSkillsWeight = skillsWeight || 1;

  const totalScore =
    (experienceScore * adjustedExperienceWeight +
      skillsScore * adjustedSkillsWeight) /
    (adjustedExperienceWeight + adjustedSkillsWeight);

  return totalScore;
}

const getSuggestedCandidates = async (workPosition) => {
  const {
    jobPosition,
    experienceWeight,
    skillsWeight,
    experienceRequire,
    skillsRequire,
    milestonePercent,
  } = workPosition;

  const candidates = await Candidate.find({
    jobPosition,
    isApplyAuto: true,
  })
    .populate("userId", "lastName firstName email avatar")
    .lean();

  const suggestedCandidates = candidates.map((candidate) => {
    const experienceScore = calculateExperienceScore(
      candidate.experience,
      experienceRequire
    );
    const skillsScore = calculateSkillsScore(candidate.skills, skillsRequire);
    const totalScore = calculateTotalScore(
      experienceWeight,
      skillsWeight,
      experienceScore,
      skillsScore.skillsScore
    );

    return { candidate, totalScore };
  });

  suggestedCandidates.sort((a, b) => b.totalScore - a.totalScore);

  const suggestedCandidatesWithPercentage = suggestedCandidates.map(
    ({ candidate, totalScore }) => ({
      ...candidate,
      totalScore: totalScore.toFixed(2),
      isPassed: totalScore >= milestonePercent,
    })
  );

  return { workPosition, listCandidates: suggestedCandidatesWithPercentage };
};

const calculateSkillMatch = (candidateSkills, requiredSkills) => {
  const skillMatch = candidateSkills.filter((skill) =>
    requiredSkills.includes(skill)
  );

  const skillNotMatch = requiredSkills.filter(
    (skill) => !candidateSkills.includes(skill)
  );

  const skillPercentage =
    (skillMatch.length / requiredSkills.length) * 100 || 0;

  return { skillMatch, skillNotMatch, skillPercentage };
};

const calculateExperiencePercentage = (
  candidateExperience,
  requiredExperience
) => {
  return candidateExperience >= requiredExperience || requiredExperience === 0
    ? 100
    : candidateExperience > 0
    ? (candidateExperience / requiredExperience) * 100
    : 0;
};

const calculateJobPositionPercentage = async (
  candidateJobPosition,
  requiredJobPosition
) => {
  const findCategories = await Category.find();
  return candidateJobPosition === requiredJobPosition
    ? 100
    : findCategories.some((category) =>
        category.subcategories.some((item) =>
          [candidateJobPosition, requiredJobPosition].includes(item.name)
        )
      )
    ? 20
    : 0;
};

const calculateSalaryPercentage = (
  salaryType,
  salaryFrom,
  salaryTo,
  candidateDesiredSalary
) => {
  if (salaryType === "Thỏa thuận") {
    return 0;
  } else if (
    salaryFrom >= candidateDesiredSalary ||
    salaryTo >= candidateDesiredSalary
  ) {
    return 100;
  } else if (salaryFrom !== undefined && salaryTo === undefined) {
    return (salaryFrom / candidateDesiredSalary) * 100;
  } else if (salaryTo !== undefined && salaryFrom === undefined) {
    return (salaryTo / candidateDesiredSalary) * 100;
  } else if (salaryFrom !== undefined && salaryTo !== undefined) {
    return ((salaryFrom + salaryTo) / 2 / candidateDesiredSalary) * 100;
  }

  return 0;
};

function calculateTrendPercentage(rankTrends, candidateSkills) {
  const totalRankValue = rankTrends.reduce(
    (total, trend, index) => total + trend.value * (index + 1),
    0
  );

  const candidateTrendValue = candidateSkills.reduce((total, skill) => {
    const trend = rankTrends.find((trend) => trend._id === skill);
    if (trend) {
      const weight = rankTrends.findIndex((t) => t._id === skill) + 1;
      return total + trend.value * weight;
    }
    return total;
  }, 0);

  const percentage = (candidateTrendValue / totalRankValue) * 100;

  return percentage;
}

const calculateStatistics = ({ arrs = [] }) => {
  const n = arrs.length;
  // trung bình
  const average = arrs.reduce((sum, x) => sum + x, 0) / n;

  // phương sai
  const variance =
    arrs.reduce((sum, x) => sum + Math.pow(x - average, 2), 0) / (n - 1);

  // độ lệch chuẩn
  const standardDeviation = Math.sqrt(variance);

  console.log({ average, variance, standardDeviation });

  return standardDeviation.toFixed(1);
};

const evaluateSuitableJob = async ({ candidate, job }) => {
  const {
    skills: candidateSkills,
    experience: candidateExperience,
    jobPosition: candidateJobPosition,
    desiredSalary: candidateDesiredSalary,
  } = candidate;

  const {
    skills: requiredSkills,
    experience: requiredExperience,
    jobPosition: requiredJobPosition,
    salaryType,
    salaryFrom,
    salaryTo,
  } = job;

  const { skillPercentage } = calculateSkillMatch(
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

  return overallPercentage.toFixed(2);
};

module.exports = {
  parseArrayQueryParam,
  calculateSimilarity,
  sortObject,
  evaluateSuitableJob,
  calculateSkillMatchPercentage,
  processStringArray,
  CVAnalysic,
  calculateTotalScore,
  calculateExperienceScore,
  calculateSkillsScore,
  getSuggestedCandidates,
  calculateSkillMatch,
  calculateExperiencePercentage,
  calculateSalaryPercentage,
  calculateJobPositionPercentage,
  calculateTrendPercentage,
  calculateStatistics,
};
