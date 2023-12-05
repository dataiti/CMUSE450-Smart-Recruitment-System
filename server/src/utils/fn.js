const Category = require("../models/category");

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

  return overallPercentage.toFixed(2);
};

module.exports = {
  parseArrayQueryParam,
  calculateSimilarity,
  sortObject,
  evaluateSuitableJob,
};
