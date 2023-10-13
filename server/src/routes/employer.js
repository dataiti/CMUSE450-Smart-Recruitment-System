const express = require("express");
const {
  employerById,
  getEmployerDetail,
  registerEmployer,
  deleteEmployer,
  editEmployer,
  getListOfEmployerForAdmin,
} = require("../controllers/employer");
const { userById } = require("../controllers/user");
const { uploadCloud } = require("../configs/cloudinaryConfig");

const router = express.Router();

router.get("/list-employers/admin/:userId", getListOfEmployerForAdmin);
router.get("/get-employer-detail/:userId/:employerId", getEmployerDetail);
router.post(
  "/register-employer/:userId",
  uploadCloud.single("companyLogo"),
  registerEmployer
);
router.put("/edit-employer/:userId", editEmployer);
router.delete("/delete-employer/:userId", deleteEmployer);

router.param("employerId", employerById);
router.param("userId", userById);

module.exports = router;
