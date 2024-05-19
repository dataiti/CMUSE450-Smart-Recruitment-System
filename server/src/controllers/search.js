const Search = require("../models/search");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const searchById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "searchId is invalid",
    });
  }

  const search = await Search.findById(id);

  if (!search)
    return res.status(400).json({
      success: true,
      message: "Search is not find",
    });

  req.search = search;
  next();
});

const saveSearch = asyncHandler(async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) throw new Error("Keyword field is required");

  const existSearch = await Search.findOne({ userId: req.user._id, keyword });

  if (existSearch) throw new Error("Keyword is existing");

  const newSearch = new Search({
    userId: req.user._id,
    keyword,
  });

  await newSearch.save();

  return res.status(200).json({
    success: true,
    message: "Save search is successfully",
    data: newSearch,
  });
});

const deleteSearch = asyncHandler(async (req, res) => {
  const removeSearch = await Search.findByIdAndDelete(req.search._id);

  if (!removeSearch) throw new Error("Delete search is fail");

  return res.status(200).json({
    success: true,
    message: "Delete search is successfully",
  });
});

const getSearchHistoryForUser = asyncHandler(async (req, res) => {
  const limit = query.limit > 0 ? Number(query.limit) : 8;

  const listJobs = await Search.find({ userId: req.user._id }).limit(limit);

  return res.status(200).json({
    success: true,
    message: "Get search history is successfully",
    data: listJobs,
  });
});

const getListJobsByKeywordForUser = asyncHandler(async (req, res) => {
  const { query } = req;
  const keyword = query.keyword ? query.keyword : "";
  const regex = keyword
    .split(" ")
    .filter((q) => q)
    .join("|");
  const limit = query.limit > 0 ? Number(query.limit) : 6;

  let data = [];

  if (!keyword) {
    data = await Search.find({ userId: req.user._id }).limit(limit);
  } else {
    data = await Search.find({
      keyword: { $regex: regex, $options: "i" },
    }).limit(limit);
  }

  return res.status(200).json({
    success: true,
    message: "Get search history is successfully",
    data: data,
  });
});

module.exports = {
  searchById,
  saveSearch,
  deleteSearch,
  getSearchHistoryForUser,
  getListJobsByKeywordForUser,
};
