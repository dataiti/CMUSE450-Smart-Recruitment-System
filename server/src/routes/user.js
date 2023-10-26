const express = require("express");
const {
  userById,
  getUserDetail,
  editUser,
  deleteUser,
  replacePassword,
  followCompany,
  getListUserForAdmin,
} = require("../controllers/user");
const { isAdminSystem, verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.get(
  "/list-users/admin/:userId",
  verifyToken,
  isAdminSystem,
  getListUserForAdmin
);
router.get("/get-user-detail/:userId", getUserDetail);
router.put("/edit-user/:userId", editUser);
router.delete("/delete-user/:userId", deleteUser);
router.put("/replace-password/:userId", replacePassword);
router.put("/follow-company/:userId", followCompany);

router.param("userId", userById);

module.exports = router;
