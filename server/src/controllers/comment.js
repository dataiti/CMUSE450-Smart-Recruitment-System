const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Comment = require("../models/comment");
const Post = require("../models/post");

const commentById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "commentId is invalid",
    });
  }

  const comment = await Comment.findById(id);

  if (!comment)
    return res.status(400).json({
      success: true,
      message: "Comment is not find",
    });

  req.comment = comment;
  next();
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).populate(
    "userId",
    "firstName lastName avatar"
  );

  for (let comment of comments) {
    await populateReplies(comment);
  }

  return res.status(200).json({
    success: true,
    message: "Comments retrieved successfully",
    data: comments,
  });
});

const createComment = asyncHandler(async (req, res) => {
  const { userId, content } = req.body;
  const postId = req.post._id;

  if (!userId || !content) throw new Error("All field are required");

  const newComment = new Comment({
    userId,
    postId,
    content,
  });

  await newComment.save();

  const findPost = await Post.findById(postId);

  findPost.comments.push(newComment);

  await findPost.save();

  return res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: newComment,
  });
});

const replyToComment = asyncHandler(async (req, res) => {
  const { userId, content } = req.body;
  const postId = req.post._id;
  const parentId = req.comment._id;

  if (!userId || !content) throw new Error("All field are required");

  const newReplyComment = new Comment({ userId, postId, content });

  await newReplyComment.save();

  const findParentComment = await Comment.findById(parentId);

  findParentComment.replies.push(newReplyComment);

  await findParentComment.save();

  return res.status(201).json({
    success: true,
    message: "Reply created successfully",
    data: newReplyComment,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.comment._id;

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) throw new Error("Delete comment failed");

  await Post.updateMany(
    { replies: commentId },
    { $pull: { replies: commentId } }
  );

  await Comment.updateMany(
    { _id: { $in: deletedComment.replies } },
    { $pull: { replies: commentId } }
  );

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

module.exports = {
  commentById,
  getCommentsByPost,
  createComment,
  replyToComment,
  deleteComment,
};
