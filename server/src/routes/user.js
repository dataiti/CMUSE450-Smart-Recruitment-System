const express = require("express");
const {
  userById,
  getUserDetail,
  editUser,
  deleteUser,
  replacePassword,
  toggleWishListItem,
  getListUserForAdmin,
} = require("../controllers/user");
const { isAdminSystem, verifyToken } = require("../middlewares/verifyToken");
const { jobById } = require("../controllers/job");

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
router.put("/toggle-wishlist-item/:userId/:jobId", toggleWishListItem);

router.param("userId", userById);
router.param("jobId", jobById);

module.exports = router;
