const express = require("express");
const {
  categoryById,
  getCategoryDetail,
  createCategory,
  updateCategory,
  deleteCategory,
  getListOfCategories,
} = require("../controllers/category");
const { userById } = require("../controllers/user");
const uploadCloud = require("../configs/cloudinaryConfig");

const router = express.Router();

router.get("/get-list-categories", getListOfCategories);
router.get("/get-category-detail/:categoryId", getCategoryDetail);
router.post(
  "/create-category/admin/:userId",
  uploadCloud.single("image"),
  createCategory
);
router.put(
  "/udpate-category/admin/:userId/:categoryId",
  uploadCloud.single("image"),
  updateCategory
);
router.delete("/delete-category/admin/:userId/:categoryId", deleteCategory);

router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;
