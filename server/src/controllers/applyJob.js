const ApplyJob = require("../models/applyJob");
const Job = require("../models/job");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const firebaseConfig = require("../configs/firebaseConfig");

const applyJobById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "Application Id is invalid",
    });
  }

  const applyJob = await ApplyJob.findById(id);

  if (!applyJob) throw new Error("ApplyJob  is not find");

  req.applyJob = applyJob;
  next();
});

const getApplyJobDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get apply job detail is successfully",
    data: req.applyJob,
  });
});

const applyJob = asyncHandler(async (req, res) => {
  const storage = getStorage();
  const storageRef = ref(storage, `pdf-files/${req.file.originalname}`);

  try {
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

    const newApplyJob = new ApplyJob({
      candidateId: req.user._id,
      jobId: req.job._id,
      employerId: req.employer._id,
      CVName: req.file.originalname,
      CVpdf: downloadURL,
      information: req.body.information,
    });

    const savedApplyJob = await newApplyJob.save();

    await Job.findOneAndUpdate(
      { _id: req.job._id },
      {
        $set: {
          appliedIds: [...req.job.appliedIds, savedApplyJob._id],
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "File uploaded to Firebase and ApplyJob added",
      data: savedApplyJob,
    });
  } catch (error) {
    await deleteObject(storageRef);

    return res.status(500).json({
      success: false,
      message: "Error uploading file and adding ApplyJob",
    });
  }
});

const updateApplyJob = asyncHandler(async (req, res) => {});

const deleteApplyJob = asyncHandler(async (req, res) => {});

const stopApplyJob = asyncHandler(async (req, res) => {});

const responseEmployerForApplyJob = asyncHandler(async (req, res) => {
  const { response } = req.body;

  if (!response) throw new Error("Response field is required");

  const updateApplyJob = await ApplyJob.findOneAndUpdate(
    { _id: req.applyJob._id },
    { $set: { response } },
    { new: true }
  );

  if (!updateApplyJob) throw new Error("Response employer is fail");

  return res.status(200).json({
    success: true,
    message: "Response employer is successfully",
    data: updateApplyJob,
  });
});

const getListApplyJobForEmployer = asyncHandler(async (req, res) => {});

module.exports = {
  applyJobById,
  getApplyJobDetail,
  applyJob,
  updateApplyJob,
  deleteApplyJob,
  stopApplyJob,
  responseEmployerForApplyJob,
  getListApplyJobForEmployer,
};
