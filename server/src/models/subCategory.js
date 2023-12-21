const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const subCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = subCategory;
