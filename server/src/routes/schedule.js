const express = require("express");
const {
  scheduleById,
  createSchedule,
  getListSchedulesForEmployer,
} = require("../controllers/schedule");
const { employerById } = require("../controllers/employer");
const { userById } = require("../controllers/user");

const router = express.Router();

router.get("/list-schedules/:userId/:employerId", getListSchedulesForEmployer);
router.post("/create-schedule/:userId/:employerId", createSchedule);

router.param("employerId", employerById);
router.param("scheduleId", scheduleById);
router.param("userId", userById);

module.exports = router;
