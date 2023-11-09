const Feedback = require("../models/feedback");
const Job = require("../models/job");
const Employer = require("../models/employer");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const User = require("../models/user");

const feedbackById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(200).json({
      success: true,
      message: "Feedback Id is invalid",
    });
  }

  const feedback = await Feedback.findById(id);

  if (!feedback) throw new Error("Feedback is not find");

  req.feedback = feedback;
  next();
});

const getFeedbackDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get feedback detail is successfully",
    data: req.feedback,
  });
});

const createFeedback = asyncHandler(async (req, res, next) => {
  const { candidateId, jobId, employerId, feedbackText, rating } = req.body;
  const images =
    req.files &&
    req.files.map((file) => {
      return file.path;
    });
  const publicIds =
    req.files &&
    req.files.map((file) => {
      return file.filename;
    });

  if (!candidateId || !jobId || !employerId || !feedbackText || !rating) {
    publicIds &&
      publicIds.forEach(async (item) => {
        await cloudinary.uploader.destroy(item);
      });
    throw new Error("All fields are required");
  }

  const newFeedback = new Feedback({
    candidateId,
    jobId,
    employerId,
    images,
    publicIds,
    feedbackText,
    rating: Number(rating),
  });

  const saveFeedback = await newFeedback.save();

  if (!saveFeedback) {
    publicIds &&
      publicIds.forEach(async (item) => {
        await cloudinary.uploader.destroy(item);
      });
    throw new Error("Create feedvback is fail");
  }

  req.feedback = saveFeedback;
  next();
  return res.status(200).json({
    success: true,
    message: "Create feedback is successfully",
    data: saveFeedback,
  });
});

const updateFeedback = asyncHandler(async (req, res) => {
  //:feedbackId
  const feedbackId = req.params.feedbackId;
  //:userId
  const userId = req.params.userId;
  const { candidateId, jobId, employerId, feedbackText, rating } = req.body;
  const images =
    req.files &&
    req.files.map((file) => {
      return file.path;
    });
  const publicIds =
    req.files &&
    req.files.map((file) => {
      return file.filename;
    });
  const existingUser = await User.findById(userId);
  const existingFeedback = await Feedback.findById(feedbackId);
  if (!existingUser) {
    publicIds &&
      publicIds.forEach(async (item) => {
        await cloudinary.uploader.destroy(item);
      });
    throw new Error("User Not Found!");
  } else if (!existingFeedback) {
    publicIds &&
      publicIds.forEach(async (item) => {
        await cloudinary.uploader.destroy(item);
      });
    throw new Error("Feedback Not Found!");
  } else if (existingFeedback && existingUser) {
    // nếu có giá trị trong body thì cập nhật nếu không thì giữ giá trị cũ
    existingFeedback.candidateId = candidateId || existingFeedback.candidateId;
    existingFeedback.jobId = jobId || existingFeedback.jobId;
    existingFeedback.employerId = employerId || existingFeedback.employerId;
    existingFeedback.feedbackText =
      feedbackText || existingFeedback.feedbackText;
    existingFeedback.rating = rating || existingFeedback.rating;
    existingFeedback.images = images || existingFeedback.images;
    existingFeedback.publicIds = publicIds || existingFeedback.publicIds;
    const updatedFeedback = await existingFeedback.save();
    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      data: updatedFeedback,
    });
  }
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const existingFeedback = await Feedback.findById(req.feedback._id);
  if (!existingFeedback) {
    publicIds &&
      publicIds.forEach(async (item) => {
        await cloudinary.uploader.destroy(item);
      });
    throw new Error("Feedback Not Found!");
  } else if (existingFeedback) {
    const deleteFeedback = await Feedback.findByIdAndDelete(
      existingFeedback._id
    );
    res.status(200).json({
      success: true,
      message: "Feedback delete successfully",
      data: deleteFeedback,
    });
  }
});

const updateRatingForJob = asyncHandler(async (req, res) => {
  const { jobId, employerId } = req.body;

  if (!jobId || !employerId)
    throw new Error("JobId and EmployerId are required");

  const feedbackJobs = await Feedback.aggregate([
    {
      $group: {
        _id: "$jobId",
        rating: {
          $sum: "$rating",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!feedbackJobs) {
    throw new Error("Update Rating is failed");
  } else {
    const findJob = feedbackJobs.find((r) => r._id.equals(jobId));
    const rating =
      findJob &&
      parseFloat(findJob.rating) / parseFloat(findJob.count).toFixed(1);
    await Job.findOneAndUpdate(
      { _id: jobId },
      { $set: { rating } },
      { new: true }
    );
  }

  const feedbackEmployers = await Feedback.aggregate([
    {
      $group: {
        _id: "$employerId",
        rating: {
          $sum: "$rating",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!feedbackEmployers) {
    throw new Error("Update Rating is failed");
  } else {
    const findEmployer = feedbackEmployers.find((r) =>
      r._id.equals(employerId)
    );
    const rating =
      findEmployer &&
      parseFloat(findEmployer.rating) /
        parseFloat(findEmployer.count).toFixed(1);
    await Employer.findOneAndUpdate(
      { _id: employerId },
      { $set: { rating } },
      { new: true }
    );
  }
});

const getListOfFeedbackByJob = asyncHandler(async (req, res) => {
  const findEmployers = await Employer.findOne({ _id: req.params.employerId });
  const finJobs = await Job.findOne({ _id: req.params.jobId });

  // test
  return res.json({
    data: {
      findEmployers,
      finJobs,
    },
  });
});

module.exports = {
  feedbackById,
  getFeedbackDetail,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  updateRatingForJob,
  getListOfFeedbackByJob,
};
