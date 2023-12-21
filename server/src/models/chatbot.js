const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const chatbot = mongoose.model("Chatbot", chatbotSchema);

module.exports = chatbot;
