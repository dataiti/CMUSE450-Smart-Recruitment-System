const express = require("express");
const {
  feedbackById,
  getFeedbackDetail,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  updateRatingForJob,
  getListOfFeedbackByJob,
} = require("../controllers/feedback");
const { jobById } = require("../controllers/job");
const { userById } = require("../controllers/user");
const { employerById } = require("../controllers/employer");
const { uploadCloud } = require("../configs/cloudinaryConfig");

const router = express.Router();

router.get("/get-list-feedbacks/:employerId/:jobId", getListOfFeedbackByJob);
router.post(
  "/create-feedback/:userId",
  uploadCloud.array("images"),
  createFeedback,
  updateRatingForJob
);

router.param("feedbackId", feedbackById);
router.param("userId", userById);
router.param("employerId", employerById);
router.param("jobId", jobById);

module.exports = router;
