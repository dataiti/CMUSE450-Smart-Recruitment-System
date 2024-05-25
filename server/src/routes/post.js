const express = require("express");
const {
  postById,
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  toggleLikePost,
  getListPostForEmployer,
} = require("../controllers/post");
const { userById } = require("../controllers/user");
const { employerById } = require("../controllers/employer");
const { uploadCloud } = require("../configs/cloudinaryConfig");

const router = express.Router();

router.get("/get-posts-for-employer/:employerId", getListPostForEmployer);
router.get("/get-post-detail/:postId", getPost);
router.get("/get-posts", getPosts);
router.post("/create-post", uploadCloud.array("images"), createPost);
router.put("/update-post/:postId", uploadCloud.array("images"), updatePost);
router.put("/toggle-like-post/:postId", toggleLikePost);
router.delete("/delete-post/:postId", deletePost);

router.param("employerId", employerById);
router.param("postId", postById);
router.param("userId", userById);

module.exports = router;
