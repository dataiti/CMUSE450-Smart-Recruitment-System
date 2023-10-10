const express = require("express");
const {
  jobById,
  getJobDetail,
  createJob,
  editJob,
  deleteJob,
  toggleHiringStatusJob,
  getListJobs,
  getListJobForEmployer,
  getListJobForAdmin,
} = require("../controllers/job");
const { userById } = require("../controllers/user");
const { addressById } = require("../controllers/address");
const { employerById } = require("../controllers/employer");

const router = express.Router();

router.get("/get-list-jobs", getListJobs);
router.get(
  "/get-list-jobs/employer/:userId/:employerId",
  getListJobForEmployer
);
router.get("/get-job-detail/:jobId", getJobDetail);
router.post("/create-job/:userId/:employerId", createJob);
// router.put("/edit-user/:userId", editUser);
router.delete("/delete-job/:userId/:employerId/:jobId/:addressId", deleteJob);
// router.put("/replace-password/:userId", replacePassword);
router.put(
  "/toggle-hiring-satus/:userId/:employerId/:jobId",
  toggleHiringStatusJob
);

router.param("jobId", jobById);
router.param("userId", userById);
router.param("employerId", employerById);
router.param("addressId", addressById);

module.exports = router;
