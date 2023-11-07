const express = require("express");
const {
  evaluateSuitableJob,
  recommentCVForEmployer,
  recommentJobForCandidate,
} = require("../controllers/smart");
const { userById } = require("../controllers/user");
const { candidateById } = require("../controllers/candidate");
const { jobById } = require("../controllers/job");

const router = express.Router();

router.get(
  "/evaluate-suitable-job/:userId/:candidateId/:jobId",
  evaluateSuitableJob
);
router.get("/create-address", recommentCVForEmployer);
router.get("/edit-address/:userId", recommentJobForCandidate);

router.param("userId", userById);
router.param("candidateId", candidateById);
router.param("jobId", jobById);

module.exports = router;
