const express = require("express");
const {
  createWorkPositionRequired,
  workPositionRequiredById,
  deleteWorkPositionRequired,
  editWorkPositionRequired,
} = require("../controllers/workPositionRequired");
const { employerById } = require("../controllers/employer");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post(
  "/create-work-position-required/:userId/:employerId",
  createWorkPositionRequired
);

router.put(
  "/edit-work-position-required/:userId/:employerId/:workPositionRequiredId",
  editWorkPositionRequired
);

router.delete(
  "/delete-work-position-required/:userId/:employerId/:workPositionRequiredId",
  deleteWorkPositionRequired
);

router.param("workPositionRequiredId", workPositionRequiredById);
router.param("employerId", employerById);
router.param("userId", userById);

module.exports = router;
