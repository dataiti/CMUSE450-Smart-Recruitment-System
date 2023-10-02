const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    categoryParentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    value: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const subCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = subCategory;
