const express = require("express");
const {
  getOveviewStatistics,
  generateTimeBasedLineChart,
  generateTimeBasedPieChart,
  getTechnicalTrendingChart,
  getWorkPositionTrendingChart,
  evaluateSuitableJob,
} = require("../controllers/analytic");
const { userById } = require("../controllers/user");
const { employerById } = require("../controllers/employer");
const { candidateById } = require("../controllers/candidate");
const { jobById } = require("../controllers/job");

const router = express.Router();

router.get("/get-oveview-statistics/:userId/:employerId", getOveviewStatistics);
router.get(
  "/generate-time-based-line-chart/:userId/:employerId",
  generateTimeBasedLineChart
);
router.get(
  "/generate-time-based-pie-chart/:userId/:employerId",
  generateTimeBasedPieChart
);

router.get(
  "/evaluate-suitable-job/:userId/:candidateId/:jobId",
  evaluateSuitableJob
);
router.get("/get-technical-trending", getTechnicalTrendingChart);
router.get("/get-work-position-trending", getWorkPositionTrendingChart);

router.param("userId", userById);
router.param("employerId", employerById);
router.param("candidateId", candidateById);
router.param("jobId", jobById);

module.exports = router;
