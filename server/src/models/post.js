const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
    },
    content: {
      type: String,
      required: true,
    },
    imagesId: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const post = mongoose.model("Post", postSchema);

module.exports = post;
