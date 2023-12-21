const express = require("express");
const {
  employerById,
  getEmployerDetail,
  registerEmployer,
  deleteEmployer,
  editEmployer,
  toggleLockEmployer,
  getListOfEmployerForAdmin,
  registerEmployerForAdmin,
} = require("../controllers/employer");
const { userById } = require("../controllers/user");
const { addressById } = require("../controllers/address");
const { uploadCloud } = require("../configs/cloudinaryConfig");
const { verifyToken, isAdminSystem } = require("../middlewares/verifyToken");

const router = express.Router();

router.get(
  "/list-employers/admin/:userId",
  verifyToken,
  isAdminSystem,
  getListOfEmployerForAdmin
);
router.post(
  "/register-employer/admin/:userId",
  uploadCloud.single("companyLogo"),
  verifyToken,
  isAdminSystem,
  registerEmployerForAdmin
);
router.put(
  "/toggle-lock-employer/admin/:userId/:employerId",
  uploadCloud.single("companyLogo"),
  verifyToken,
  isAdminSystem,
  toggleLockEmployer
);

router.get("/get-employer-detail/:employerId", getEmployerDetail);
router.post(
  "/register-employer/:userId",
  uploadCloud.single("companyLogo"),
  registerEmployer
);
router.put("/edit-employer/:userId/:employerId", editEmployer);
router.delete(
  "/delete-employer/:userId/:employerId/:addressId",
  deleteEmployer
);

router.param("employerId", employerById);
router.param("addressId", addressById);
router.param("userId", userById);

module.exports = router;
