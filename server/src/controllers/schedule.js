const Schedule = require("../models/schedule");
const asyncHandler = require("express-async-handler");

const scheduleById = asyncHandler(async (req, res, next) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "Schedule Id is invalid",
    });
  }

  const schedule = await Schedule.findById(id);

  if (!category) throw new Error("Schedule is not find");

  req.schedule = schedule;
  next();
});

const createSchedule = asyncHandler(async (req, res, next) => {
  const { userId, jobId, employerId } = req.body;
});

const getScheduleDetail = asyncHandler(async (req, res, next) => {});

const deleteSchedule = asyncHandler(async (req, res, next) => {});

const editSchedule = asyncHandler(async (req, res, next) => {});

const getListSchedulesForUser = asyncHandler(async (req, res, next) => {});

const getListSchedulesForEmployer = asyncHandler(async (req, res, next) => {});

module.exports = {
  scheduleById,
  createSchedule,
  getScheduleDetail,
  deleteSchedule,
  editSchedule,
  getListSchedulesForUser,
  getListSchedulesForEmployer,
};
