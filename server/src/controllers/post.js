const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const Post = require("../models/post");
const Job = require("../models/job");

const postById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "postId is invalid",
    });
  }

  const post = await Post.findById(id)
    .populate("userId", "avatar firstName lastName email")
    .populate("employerId", "companyLogo companyName companyIndustry email");

  if (!post)
    return res.status(400).json({
      success: true,
      message: "Post is not find",
    });

  req.post = post;
  next();
});

const getPost = asyncHandler(async (req, res) => {
  return res.status(200).json({
    sucess: true,
    message: "Get post detail is successfully",
    data: req.post,
  });
});

const getPosts = asyncHandler(async (req, res) => {
  const { query } = req;
  const search = query.search ? query.search : "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");

  const limit = query.limit > 0 ? Number(query.limit) : 10;

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const filterArgs = {
    $or: [
      { title: { $regex: regex, $options: "i" } },
      { content: { $regex: regex, $options: "i" } },
    ],
    createdAt: { $gte: twoDaysAgo },
  };

  const posts = await Post.find(filterArgs)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("userId", "avatar firstName lastName email")
    .populate("employerId", "companyLogo companyName companyIndustry email")
    .populate("likes", "avatar firstName lastName")
    .populate("comments");

  return res.status(200).json({
    success: true,
    message: "Get posts is successfully",
    data: posts,
  });
});

const createPost = asyncHandler(async (req, res) => {
  const { userId, employerId, content } = req.body;

  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).json({ error: "No files were uploaded." });
  }

  const images = req.files.map((item) => item.path);
  const imagesId = req.files.map((item) => item.filename);

  if (!content) throw new Error("All field are required");

  const newPost = new Post({
    userId,
    employerId,
    content,
    images,
    imagesId,
  });

  await newPost.save();

  if (!newPost) {
    images.forEach(async (image) => {
      await cloudinary.uploader.destroy(image);
    });

    throw new Error("Create post is fail");
  }

  return res.status(200).json({
    success: true,
    message: "Create post is successfully",
    data: newPost,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const deletePost = await Post.findByIdAndDelete(req.post._id);

  if (!deletePost) throw new Error("Delete post is fail");

  if (req.post.images) {
    req.post.images.forEach(async (image) => {
      await cloudinary.uploader.destroy(image);
    });
  }

  return res.status(200).json({
    success: true,
    message: "Delete post is successfully",
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content, hashtag } = req.body;

  if (req.files && req.files.length > 0) {
    const images = req.files.map((item) => item.path);
    const imagesId = req.files.map((item) => item.filename);

    req.post.images.forEach(async (image) => {
      await cloudinary.uploader.destroy(image);
    });

    req.post.images = images;
    req.post.imagesId = imagesId;
  }

  req.post.title = title;
  req.post.content = content;
  req.post.hashtag = hashtag;

  const updatePost = await Post.findByIdAndUpdate(
    req.post._id,
    {
      $set: {
        title: req.post.title,
        content: req.post.content,
        hashtag: req.post.hashtag,
        images: req.post.images,
        imagesId: req.post.imagesId,
      },
    },
    { new: true }
  )
    .populate("userId", "avatar firstName lastName email")
    .populate("employerId", "companyLogo companyName companyIndustry email");

  return res.status(200).json({
    success: true,
    message: "Update post is successfully",
    data: updatePost,
  });
});

const getListPostForEmployer = asyncHandler(async (req, res) => {
  const posts = await Post.find({ employerId: req.employer._id }).populate(
    "employerId",
    "companyLogo comanyName companyEmail"
  );

  if (!posts) throw new Error("list post is not found");

  return res.status(200).json({
    success: true,
    message: "Get list post for employer sucessfully",
    data: posts,
  });
});

const toggleLikePost = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const alreadyLikedIndex = req.post.likes.findIndex((like) =>
    like.equals(userId)
  );

  if (alreadyLikedIndex !== -1) {
    req.post.likes.splice(alreadyLikedIndex, 1);
  } else {
    req.post.likes.push(userId);
  }

  await req.post.save();

  return res.status(200).json({
    success: true,
    message: "Toggle like post is successfully",
    data: req.post,
  });
});

module.exports = {
  postById,
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  toggleLikePost,
  getListPostForEmployer,
};
