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
  const {
    employerId,
    applyJobId,
    title,
    interviewerName,
    interviewerEmail,
    interviewerPhoneNumber,
    scheduleDate,
    location,
    endTime,
    startTime,
    typeMeeting,
  } = req.body;

  const startDateTime = new Date(`${scheduleDate}T${startTime}`);
  const endDateTime = new Date(`${scheduleDate}T${endTime}`);

  const newSchedule = new Schedule({
    userId: req.user._id,
    employerId: req.employer._id,
    applyJobId: applyJobId,
    title,
    interviewerName,
    interviewerEmail,
    interviewerPhoneNumber,
    status: typeMeeting === "online" ? "online" : "offline",
    start: startDateTime,
    end: endDateTime,
    location,
  });

  await newSchedule.save();

  return res.status(200).json({
    success: true,
    message: "Create schedule is successfully",
    data: newSchedule,
  });
});

const getScheduleDetail = asyncHandler(async (req, res, next) => {});

const deleteSchedule = asyncHandler(async (req, res, next) => {});

const editSchedule = asyncHandler(async (req, res, next) => {});

const getListSchedulesForUser = asyncHandler(async (req, res, next) => {
  const listSchedules = await Schedule.find({
    userId: req.user._id,
  });

  return res.status(200).json({
    success: true,
    message: "Get list schedules is successfully",
    data: listSchedules,
  });
});

const getListSchedulesForEmployer = asyncHandler(async (req, res, next) => {
  const currentDatetime = new Date();

  const listSchedules = await Schedule.find({
    employerId: req.employer._id,
    end: { $gt: currentDatetime },
  });

  return res.status(200).json({
    success: true,
    message: "Get list schedules is successfully",
    data: listSchedules,
  });
});

module.exports = {
  scheduleById,
  createSchedule,
  getScheduleDetail,
  deleteSchedule,
  editSchedule,
  getListSchedulesForUser,
  getListSchedulesForEmployer,
};
