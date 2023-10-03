const express = require("express");
const { getOveviewStatistics } = require("../controllers/analytic");
const { userById } = require("../controllers/user");

const router = express.Router();

router.get("/get-oveview-statistics/admin/:userId", getOveviewStatistics);

router.param("userId", userById);

module.exports = router;
