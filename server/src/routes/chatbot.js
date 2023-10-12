const express = require("express");
const { chatbot } = require("../controllers/chatbot");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/generate-text-answer", chatbot);

router.param("userId", userById);

module.exports = router;
