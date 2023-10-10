const express = require("express");
const {
  getOveviewStatistics,
  generateTimeBasedLineChart,
  generateTimeBasedPieChart,
} = require("../controllers/analytic");
const { userById } = require("../controllers/user");
const { employerById } = require("../controllers/employer");

const router = express.Router();

router.get("/get-oveview-statistics/admin/:userId", getOveviewStatistics);
router.get(
  "/generate-time-based-line-chart/:userId/:employerId",
  generateTimeBasedLineChart
);
router.get(
  "/generate-time-based-pie-chart/:userId/:employerId",
  generateTimeBasedPieChart
);

router.param("userId", userById);
router.param("employerId", employerById);

module.exports = router;
