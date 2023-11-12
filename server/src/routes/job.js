const express = require("express");
const {
  jobById,
  getJobDetail,
  createJob,
  editJob,
  deleteJob,
  toggleHiringStatusJob,
  getListSearchJobs,
  getListJobs,
  getListJobForEmployer,
  getListJobForAdmin,
  getListJobsForHomePage,
} = require("../controllers/job");
const { userById } = require("../controllers/user");
const { addressById } = require("../controllers/address");
const { employerById } = require("../controllers/employer");
const { verifyToken, isAdminSystem } = require("../middlewares/verifyToken");

const router = express.Router();

router.get(
  "/list-jobs/admin/:userId",
  verifyToken,
  isAdminSystem,
  getListJobForAdmin
);
router.get("/get-list-search-jobs", getListSearchJobs);
router.get("/get-list-jobs/homepage/:userId", getListJobsForHomePage);
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
