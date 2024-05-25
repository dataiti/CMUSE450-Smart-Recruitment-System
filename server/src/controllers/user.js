const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const userById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: false,
      message: "User Id is invalid",
    });
  }

  const user = await User.findById(id);

  if (!user)
    return res.status(400).json({
      success: false,
      message: "User is not find",
    });

  req.user = user;
  next();
});

const getUserDetail = asyncHandler(async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "Get user detail is successfully",
    data: user,
  });
});

const editUser = asyncHandler(async (req, res) => {
  const { phoneNumber, firstName, lastName } = req.body;
  const avatar = req.file.path;

  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { phoneNumber, lastName, firstName, avatar },
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Update user is successfully",
    data: updateUser,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Delete user is successfully",
  });
});

const replacePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword)
    throw new Error("All fields are required");

  if (newPassword !== confirmPassword)
    throw new Error("New password and confirm password are not match");

  const user = await User.findOne({ _id: req.user._id });

  if (!user.isCorrectPassword) throw new Error("Password is incorrect");

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Replace password is successfully",
  });
});

const toggleWishListItem = asyncHandler(async (req, res) => {
  const isJobInWishlist = req.user.wishlistIds.some((wishlistId) =>
    wishlistId.equals(req.job._id)
  );

  if (isJobInWishlist) {
    req.user.wishlistIds = req.user.wishlistIds.filter(
      (wishlistId) => !wishlistId.equals(req.job._id)
    );
  } else {
    req.user.wishlistIds.push(req.job._id);
  }

  await req.user.save();

  const findWishlist = await User.findOne({ _id: req.user._id }).populate({
    path: "wishlistIds",
    model: "Job",
    populate: {
      path: "workRegion",
      model: "Address",
    },
    populate: {
      path: "employerId",
      model: "Employer",
    },
  });

  return res.status(200).json({
    success: true,
    message: "Toggle wishlist successfully",
    data: findWishlist.wishlistIds,
  });
});

const toggleLockUser = asyncHandler(async (req, res) => {
  const findUser = await User.findOne({ _id: req.user._id });

  if (!findUser) throw new Error("User is not find");

  findUser.isLocked = !findUser.isLocked;

  await findUser.save();

  return res.status(200).json({
    success: true,
    messsage: "Toggle lock user is successfully",
    data: findUser,
  });
});

const userViewedJobs = asyncHandler(async (req, res) => {
  if (
    req.user.viewedJobs.some(
      (item) => item.toString() === req.job._id.toString()
    )
  ) {
    return res.status(200).json({
      success: true,
      message: "This job is viewed",
      data: req.user.viewedJobs,
    });
  } else {
    req.user.viewedJobs = [...req.user.viewedJobs, req.job._id];
    await req.user.save();
  }

  return res.status(200).json({
    success: true,
    message: "User viewed job successfully",
    data: req.user.viewedJobs,
  });
});

const getListUserForAdmin = asyncHandler(async (req, res) => {
  const { query } = req;
  const status = query.status ? query.status : "";
  const search = query.search || "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const sortBy = query.sortBy || "-_id";
  const orderBy = ["asc", "desc"].includes(query.orderBy)
    ? query.orderBy
    : "asc";
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const filterArgs = {
    $or: [
      { firstName: { $regex: regex, $options: "i" } },
      { lastName: { $regex: regex, $options: "i" } },
      { email: { $regex: regex, $options: "i" } },
      { phoneNumber: { $regex: regex, $options: "i" } },
    ],
    permission: { $ne: "admin" },
  };

  if (status) filterArgs.status = status;

  const countUser = await User.countDocuments(filterArgs);

  if (!countUser) throw new Error("List user is not find");

  const totalPage = Math.ceil(countUser / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const listUsers = await User.find(filterArgs)
    .select("-password")
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate("ownerEmployerId");

  return res.status(200).json({
    success: true,
    message: "Get list of users are successfully",
    currentPage: page,
    totalPage,
    countUser,
    data: listUsers,
  });
});

const getListFollowings = asyncHandler(async (req, res) => {
  const listFollowings = await User.findOne({ _id: req.user._id }).populate(
    "followingIds",
    "companyLogo companyName websiteUrl"
  );

  return res.status(200).json({
    data: listFollowings.followingIds,
  });
});

module.exports = {
  userById,
  getUserDetail,
  editUser,
  deleteUser,
  replacePassword,
  toggleWishListItem,
  toggleLockUser,
  userViewedJobs,
  getListUserForAdmin,
  getListFollowings,
};
