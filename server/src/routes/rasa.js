const express = require("express");
const {
  readFileNLUData,
  getAllStoriesData,
  addStory,
  updateStory,
  getStory,
  deleteStory,
} = require("../controllers/rasas/stories");

const router = express.Router();

// nlu

// rules

// stories
router.get("/stories/get-stories", getAllStoriesData);
router.get("/stories/get-story", getStory);
router.post("/stories/add-story", addStory);
router.put("/stories/update-story", updateStory);
router.delete("/stories/delete-story", deleteStory);

module.exports = router;
