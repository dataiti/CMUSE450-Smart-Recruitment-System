const express = require("express");
const {
  userById,
  getUserDetail,
  editUser,
  deleteUser,
  replacePassword,
  toggleWishListItem,
  toggleLockUser,
  userViewedJobs,
  getListFollowings,
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
router.put(
  "/toggle-lock-user/admin/:userId",
  verifyToken,
  isAdminSystem,
  toggleLockUser
);

router.get("/get-followings/:userId", getListFollowings);
router.get("/get-user-detail/:userId", getUserDetail);
router.put("/edit-user/:userId", editUser);
router.delete("/delete-user/:userId", deleteUser);
router.put("/replace-password/:userId", replacePassword);
router.put("/toggle-wishlist-item/:userId/:jobId", toggleWishListItem);
router.put("/user-viewed-jobs/:userId/:jobId", userViewedJobs);

router.param("userId", userById);
router.param("jobId", jobById);

module.exports = router;
