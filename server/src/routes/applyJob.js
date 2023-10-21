const express = require("express");
const {
  applyJobById,
  applyJob,
  getApplyJobDetail,
  getListApplyJobForEmployer,
} = require("../controllers/applyJob");
const { userById } = require("../controllers/user");
const { jobById } = require("../controllers/job");
const { employerById } = require("../controllers/employer");
const { uploadMemo } = require("../configs/cloudinaryConfig");

const router = express.Router();

router.get(
  "/get-list-apply-jobs/:userId/:employerId",
  getListApplyJobForEmployer
);
router.get(
  "/get-apply-job-detail/:userId/:applyId/:employerId",
  getApplyJobDetail
);
router.post(
  "/apply-job/:userId/:jobId/:employerId",
  uploadMemo.single("CVpdf"),
  applyJob
);

router.param("jobId", jobById);
router.param("employerId", employerById);
router.param("applyId", applyJobById);
router.param("userId", userById);

module.exports = router;
