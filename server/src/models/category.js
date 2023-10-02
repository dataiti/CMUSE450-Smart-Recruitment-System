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
    description: {
      type: String,
    },
    // value: {
    //   type: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "SubCategory",
    //     },
    //   ],
    //   default: [],
    // },
  },
  { timestamps: true }
);

const category = mongoose.model("Category", categorySchema);

module.exports = category;
