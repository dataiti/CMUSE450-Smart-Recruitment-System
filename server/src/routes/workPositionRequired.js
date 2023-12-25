const express = require("express");
const {
  createWorkPositionRequired,
  workPositionRequiredById,
} = require("../controllers/workPositionRequired");
const { employerById } = require("../controllers/employer");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post(
  "/create-work-position-required/:userId/:employerId",
  createWorkPositionRequired
);

router.param("workPositionRequiredId", workPositionRequiredById);
router.param("employerId", employerById);
router.param("userId", userById);

module.exports = router;
