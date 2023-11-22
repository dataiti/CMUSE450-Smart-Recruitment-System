const express = require("express");
const {
  categoryById,
  getCategoryDetail,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleActiveCategory,
  getListOfCategories,
  getListOfCategoriesForAdmin,
} = require("../controllers/category");
const { userById } = require("../controllers/user");
const { uploadCloud } = require("../configs/cloudinaryConfig");
const { verifyToken, isAdminSystem } = require("../middlewares/verifyToken");

const router = express.Router();

router.get(
  "/get-list-categories/admin/:userId",
  verifyToken,
  isAdminSystem,
  getListOfCategoriesForAdmin
);
router.put(
  "/toggle-active/admin/:userId/:categoryId",
  verifyToken,
  isAdminSystem,
  toggleActiveCategory
);
router.get("/get-list-categories", getListOfCategories);
router.get("/get-category-detail/:categoryId", getCategoryDetail);
router.post(
  "/create-category/admin",
  verifyToken,
  isAdminSystem,
  uploadCloud.single("image"),
  createCategory
);
router.put(
  "/update-category/admin/:userId/:categoryId",
  verifyToken,
  isAdminSystem,
  uploadCloud.single("image"),
  updateCategory
);
router.delete(
  "/delete-category/admin/:userId/:categoryId",
  verifyToken,
  isAdminSystem,
  deleteCategory
);

router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;
