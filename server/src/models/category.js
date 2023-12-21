const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      // required: true,
    },
    publicId: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
    },
    subcategories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubCategory",
        },
      ],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const category = mongoose.model("Category", categorySchema);

module.exports = category;
