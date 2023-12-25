const Category = require("../models/category");
const Employer = require("../models/employer");
const User = require("../models/user");
const Notification = require("../models/notification");
const ApplyJob = require("../models/applyJob");
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
  const jobPositionPercentage = 0;
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

  return overallPercentage.toFixed(2);
};

function calculateSkillMatchPercentage({
  cvSkills,
  jobSkills,
  jobExperience,
  cvExperience,
}) {
  const commonSkills =
    cvSkills?.filter((skill) => jobSkills.includes(skill)) || [];
  const matchPercentage = (commonSkills.length / jobSkills.length) * 100;

  const experiencePercentage =
    cvExperience >= jobExperience || jobExperience === 0
      ? 100
      : (cvExperience / jobExperience) * 100;

  return ((matchPercentage + experiencePercentage) / 2).toFixed(2);
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
    console.log(parsedResult);
    if (parsedResult && typeof parsedResult === "object") {
      CVJSON = parsedResult;
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  return CVJSON;
};

function calculateExperienceScore(candidateExperience, requiredExperience) {
  // Tính toán phần trăm tương đồng về kinh nghiệm
  const experienceSimilarity = Math.min(
    1,
    candidateExperience / requiredExperience
  );

  // Chuyển đổi thành điểm (đặt ví dụ là 100 điểm là trải qua đúng yêu cầu)
  const experienceScore = experienceSimilarity * 100;

  return experienceScore;
}

function calculateSkillsScore(candidateSkills, requiredSkills) {
  // Đếm số lượng kỹ năng chung giữa ứng viên và yêu cầu
  const commonSkillsCount = candidateSkills.filter((skill) =>
    requiredSkills.includes(skill)
  ).length;

  // Tính toán phần trăm tương đồng về kỹ năng (đặt ví dụ là 100 điểm là trải qua đúng yêu cầu)
  const skillsSimilarity = Math.min(
    1,
    commonSkillsCount / requiredSkills.length
  );

  // Chuyển đổi thành điểm
  const skillsScore = skillsSimilarity * 100;

  return skillsScore;
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
};
