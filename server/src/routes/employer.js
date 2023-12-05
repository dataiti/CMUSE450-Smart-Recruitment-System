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
const { verifyToken, isAdminSystem } = require("../middlewares/verifyToken");

const router = express.Router();

router.get(
  "/list-employers/admin/:userId",
  verifyToken,
  isAdminSystem,
  getListOfEmployerForAdmin
);
router.get("/get-employer-detail/:employerId", getEmployerDetail);
router.post(
  "/register-employer/:userId",
  uploadCloud.single("companyLogo"),
  registerEmployer
);
router.put("/edit-employer/:userId/:employerId", editEmployer);
router.delete("/delete-employer/:userId", deleteEmployer);

router.param("employerId", employerById);
router.param("userId", userById);

module.exports = router;
