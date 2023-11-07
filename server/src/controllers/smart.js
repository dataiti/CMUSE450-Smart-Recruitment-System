const Candidate = require("../models/candidate");
const User = require("../models/user");
const Job = require("../models/job");
const asyncHandler = require("express-async-handler");

const evaluateSuitableJob = asyncHandler(async (req, res) => {
  const candidateSkills = req.candidate.skills;
  const candidateExperience = req.candidate.experience;

  const requiredSkills = req.job.skills;
  const requiredExperience = req.job.experience;

  const skillMatch = candidateSkills.filter((skill) =>
    requiredSkills.includes(skill)
  );

  const skillNotMatch = requiredSkills.filter(
    (skill) => !candidateSkills.includes(skill)
  );

  const skillPercentage = (skillMatch.length / requiredSkills.length) * 100;

  let experiencePercentage;
  if (candidateExperience > requiredExperience || requiredExperience === 0)
    experiencePercentage = 100;
  else experiencePercentage = (candidateExperience / requiredExperience) * 100;

  const overallPercentage = (skillPercentage + experiencePercentage) / 2;

  return res.status(200).json({
    success: true,
    message: "Get job detail is successfully",
    data: {
      overallPercentage,
      percentages: [
        {
          title: "Kỹ năng",
          value: skillPercentage,
        },
        {
          title: "Kinh nghiệm",
          value: experiencePercentage,
        },
        {
          title: "Vị trí",
          value: skillPercentage,
        },
        {
          title: "Định hướng",
          value: skillPercentage,
        },
        {
          title: "Yếu tố khác",
          value: skillPercentage,
        },
      ],
      skillMatch,
      skillNotMatch,
    },
  });
});

const recommentJobForCandidate = asyncHandler(async (req, res) => {
  const findCandidate = await Candidate.findOne({ _id: req.user });
});

const recommentCVForEmployer = asyncHandler(async (req, res) => {
  const findCandidate = await Candidate.findOne({ _id: req.user });
});

module.exports = {
  evaluateSuitableJob,
  recommentJobForCandidate,
  recommentCVForEmployer,
};
