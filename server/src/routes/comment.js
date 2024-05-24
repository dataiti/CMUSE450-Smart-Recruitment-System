const express = require("express");
const {
  commentById,
  getCommentsByPost,
  createComment,
  replyToComment,
  deleteComment,
} = require("../controllers/comment");
const { userById } = require("../controllers/user");
const { postById } = require("../controllers/post");

const router = express.Router();

router.get("/get-comments-by-post/:postId", getCommentsByPost);
router.post("/create-comment/:postId", createComment);
router.post("/reply-comment/:postId/:commentId", replyToComment);
// router.put("/update-comment/:postId/:commentId", createComment);
router.delete("/delete-comment/:postId/:commentId", deleteComment);

router.param("commentId", commentById);
router.param("postId", postById);
router.param("userId", userById);

module.exports = router;
