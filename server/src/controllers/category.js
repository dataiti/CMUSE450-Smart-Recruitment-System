const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const categoryById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "Category Id is invalid",
    });
  }

  const category = await Category.findById(id);

  if (!category)
    return res.status(400).json({
      success: true,
      message: "Category is not find",
    });

  req.category = category;
  next();
});

const getCategoryDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get category detail is successfully",
    data: req.category,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const image = req.file.path;
  const publicId = req.file.filename;

  const subcategories = req.body.subcategories
    ? JSON.parse(req.body.subcategories)
    : [];

  if (!name) {
    await cloudinary.uploader.destroy(publicId);
    throw new Error("Field name is required");
  }

  const newCategory = new Category({
    name,
    description,
    image,
    publicId,
    subcategories,
  });

  const savedCategory = await newCategory.save();

  if (!savedCategory) {
    await cloudinary.uploader.destroy(publicId);
    throw new Error("Catgory is not exist");
  }

  return res.status(200).json({
    success: true,
    message: "Create category detail is successfully",
    data: savedCategory,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const image = req?.file?.path;
  const publicId = req?.file?.filename;

  const subcategories = req.body.subcategories
    ? JSON.parse(req.body.subcategories)
    : [];

  const updatedCategory = await Category.findByIdAndUpdate(
    req.category._id,
    {
      name,
      description,
      image,
      publicId,
      subcategories,
    },
    { new: true }
  );

  if (!updatedCategory) {
    await cloudinary.uploader.destroy(publicId);
    throw new Error("Catgory is not exist");
  }

  res.status(200).json({
    success: true,
    message: "Update category detail is successfully",
    data: updatedCategory,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const publicId = req.category.publicId;

  const deletedCategory = await Category.findByIdAndRemove(req.category._id);

  if (!deletedCategory) throw new Error("Catgory is not exist");

  await cloudinary.uploader.destroy(publicId);

  res.status(200).json({
    success: true,
    message: "Delete category detail is successfully",
  });
});

const getListOfCategories = asyncHandler(async (req, res) => {
  const listCategories = await Category.find({ isActive: true });

  return res.status(200).json({
    success: true,
    message: "Get list categories are successfully",
    data: listCategories,
  });
});

const toggleActiveCategory = asyncHandler(async (req, res) => {
  const findCategory = await Category.findOne({ _id: req.category._id });

  if (!findCategory) throw new Error("Category is not find");

  findCategory.isActive = !findCategory.isActive;

  await findCategory.save();

  return res.status(200).json({
    success: true,
    messsage: "Toggle active category is successfully",
    data: findCategory,
  });
});

const getListOfCategoriesForAdmin = asyncHandler(async (req, res) => {
  const search = req.query.search ? req.query.search : "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const sortBy = req.query.sortBy ? req.query.sortBy : "-_id";
  const orderBy =
    req.query.orderBy &&
    (req.query.orderBy == "asc" || req.query.orderBy == "desc")
      ? req.query.orderBy
      : "asc";
  const limit =
    req.query.limit && req.query.limit > 0 ? Number(req.query.limit) : 6;
  const page =
    req.query.page && req.query.page > 0 ? Number(req.query.page) : 1;
  let skip = (page - 1) * limit;

  const filterArgs = {
    $or: [
      {
        name: { $regex: regex, $options: "i" },
      },
      {
        description: { $regex: regex, $options: "i" },
      },
    ],
  };

  const countCategories = await Category.countDocuments(filterArgs);

  const totalPage = Math.ceil(countCategories / limit);

  const listCategories = await Category.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    message: "Get list categories are successfully",
    totalPage,
    currentPage: page,
    count: countCategories,
    data: listCategories,
  });
});

module.exports = {
  categoryById,
  getCategoryDetail,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleActiveCategory,
  getListOfCategories,
  getListOfCategoriesForAdmin,
};
