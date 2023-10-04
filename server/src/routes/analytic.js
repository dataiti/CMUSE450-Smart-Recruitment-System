const express = require("express");
const {
  getOveviewStatistics,
  generateTimeBasedLineChart,
} = require("../controllers/analytic");
const { userById } = require("../controllers/user");
const { employerById } = require("../controllers/employer");

const router = express.Router();

router.get("/get-oveview-statistics/admin/:userId", getOveviewStatistics);
router.get(
  "/generate-time-based-line-chart/:employerId",
  generateTimeBasedLineChart
);

router.param("userId", userById);
router.param("employerId", employerById);

module.exports = router;
