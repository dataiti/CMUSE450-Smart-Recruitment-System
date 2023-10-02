const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      trim: true,
      required: true,
      default: "Việt Nam",
    },
    province: {
      type: String,
      trim: true,
      required: true,
    },
    district: {
      type: String,
      trim: true,
      required: true,
    },
    ward: {
      type: String,
      trim: true,
      required: true,
    },
    exactAddress: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
