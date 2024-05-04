const fs = require("fs");
const Candidate = require("../models/candidate");
const User = require("../models/user");
const Job = require("../models/job");
const asyncHandler = require("express-async-handler");
const { calculateSimilarity } = require("../utils/fn");
const pdf = require("pdf-parse");

const recommentJobForCandidate = asyncHandler(async (req, res) => {
  const { query } = req;
  const search = query.search || "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const sortBy = query.sortBy || "-_id";
  const orderBy = ["asc", "desc"].includes(query.orderBy)
    ? query.orderBy
    : "asc";
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  // Collaborative Filtering
  const currentUser = await User.findById(req.user._id).populate(
    "viewedJobs appliedJobs"
  );

  const otherUsers = await User.find({ _id: { $ne: req.user._id } }).populate(
    "viewedJobs appliedJobs"
  );

  const usersSimilarity = otherUsers.map((otherUser) => {
    const viewedSimilarity = calculateSimilarity(currentUser, otherUser);
    const appliedSimilarity = calculateSimilarity(currentUser, otherUser);
    const wishlistSimilarity = calculateSimilarity(currentUser, otherUser);
    const totalSimilarity =
      (viewedSimilarity + appliedSimilarity + wishlistSimilarity) / 3;
    return {
      user: otherUser,
      similarity: totalSimilarity,
    };
  });

  usersSimilarity.sort((a, b) => b.similarity - a.similarity);

  const recommendedJobs = usersSimilarity[0].user.viewedJobs.concat(
    usersSimilarity[0].user.appliedJobs
  );

  const findCandidate = await Candidate.findOne({ userId: req.user._id });

  // Content-Based Filtering
  const filterArgs = {
    _id: { $in: recommendedJobs.map((item) => item._id) },
    skills: { $in: findCandidate.skills },
    candidateRequirements: {
      $regex: new RegExp(findCandidate.skills.join("|"), "i"),
    },
    experience: { $lte: findCandidate.experience },
  };

  const countJobs = await Job.countDocuments(filterArgs);

  const totalPage = Math.ceil(countJobs / limit);

  const findJobs = await Job.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate("workRegion")
    .populate("employerId");

  return res.json({
    success: true,
    message: "Get recommentdation jobs for candidate is successfully",
    totalPage,
    currentPage: page,
    count: countJobs,
    data: findJobs,
  });
});

const recommentCVForEmployer = asyncHandler(async (req, res) => {});

module.exports = {
  recommentJobForCandidate,
  recommentCVForEmployer,
};
