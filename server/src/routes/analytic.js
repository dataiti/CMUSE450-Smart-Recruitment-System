const express = require("express");
const {
  getOveviewStatistics,
  generateTimeBasedLineChart,
  generatePreviousYearTimeBasedLineChart,
  generateTimeBasedPieChart,
  getTechnicalAndWorkPositionTrendingChart,
  evaluateSuitableJob,
  evaluateSuitableCandidate,
  getOveviewStatisticsForAdmin,
  generateTimeBasedPieChartForAdmin,
  generateTimeBasedLineChartForAdmin,
} = require("../controllers/analytic");
const { userById } = require("../controllers/user");
const { employerById } = require("../controllers/employer");
const { candidateById } = require("../controllers/candidate");
const { jobById } = require("../controllers/job");
const { verifyToken, isAdminSystem } = require("../middlewares/verifyToken");
const {
  workPositionRequiredById,
} = require("../controllers/workPositionRequired");

const router = express.Router();

router.get(
  "/get-oveview-statistics/admin/:userId",
  verifyToken,
  isAdminSystem,
  getOveviewStatisticsForAdmin
);
router.get(
  "/generate-time-based-pie-chart/admin/:userId",
  verifyToken,
  isAdminSystem,
  generateTimeBasedPieChartForAdmin
);
router.get(
  "/generate-time-based-line-chart/admin/:userId",
  verifyToken,
  isAdminSystem,
  generateTimeBasedLineChartForAdmin
);

router.get("/get-oveview-statistics/:userId/:employerId", getOveviewStatistics);
router.get(
  "/generate-time-based-line-chart/:userId/:employerId",
  generateTimeBasedLineChart
);
router.get(
  "/generate-time-based-line-chart/previous-year/:userId/:employerId",
  generatePreviousYearTimeBasedLineChart
);
router.get(
  "/generate-time-based-pie-chart/:userId/:employerId",
  generateTimeBasedPieChart
);
router.get(
  "/evaluate-suitable-job/:userId/:candidateId/:jobId",
  evaluateSuitableJob
);
router.get(
  "/evaluate-suitable-candidate/:userId/:employerId/:candidateId/:workPositionRequiredId",
  evaluateSuitableCandidate
);

router.get("/get-technical-trending", getTechnicalAndWorkPositionTrendingChart);

router.param("userId", userById);
router.param("employerId", employerById);
router.param("candidateId", candidateById);
router.param("jobId", jobById);
router.param("workPositionRequiredId", workPositionRequiredById);

module.exports = router;
