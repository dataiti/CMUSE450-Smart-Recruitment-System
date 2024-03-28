const mongoose = require("mongoose");

const rasaConversationSchema = new mongoose.Schema(
  {
    participantsIds: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    messageIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RasaMessage",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const rasaConversation = mongoose.model(
  "RasaConversation",
  rasaConversationSchema
);

module.exports = rasaConversation;
