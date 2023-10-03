const express = require("express");
const {
  employerById,
  getEmployerDetail,
  registerEmployer,
  deleteEmployer,
  getListOfEmployerForEmployer,
  getListOfEmployerForAdmin,
} = require("../controllers/employer");
const { userById } = require("../controllers/user");
const uploadCloud = require("../configs/cloudinaryConfig");

const router = express.Router();

// router.get("/list-users/admin/:userId", getListUserForAdmin);
router.get("/get-employer-detail/:userId/:employerId", getEmployerDetail);
router.post(
  "/register-employer/:userId",
  uploadCloud.single("companyLogo"),
  registerEmployer
);
// router.put("/edit-user/:userId", editUser);
// router.delete("/delete-user/:userId", deleteUser);
// router.put("/replace-password/:userId", replacePassword);
// router.put("/follow-company/:userId", followCompany);

router.param("employerId", employerById);
router.param("userId", userById);

module.exports = router;
