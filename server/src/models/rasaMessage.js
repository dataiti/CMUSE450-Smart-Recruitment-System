const mongoose = require("mongoose");

const rasaMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RasaConversation",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const rasaMessage = mongoose.model("RasaMessage", rasaMessageSchema);

module.exports = rasaMessage;
