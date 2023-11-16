const express = require("express");
const {
  searchById,
  saveSearch,
  deleteSearch,
  getListJobsByKeywordForUser,
} = require("../controllers/search");
const { userById } = require("../controllers/user");

const router = express.Router();

router.get("/get-list-jobs/keyword/:userId", getListJobsByKeywordForUser);
router.post("/save-search/:userId", saveSearch);
router.delete("/delete-search/:userId/:searchId", deleteSearch);

router.param("searchId", searchById);
router.param("userId", userById);

module.exports = router;
