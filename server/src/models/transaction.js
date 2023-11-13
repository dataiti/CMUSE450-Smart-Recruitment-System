const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    bank: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderInfo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failure"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const transaction = mongoose.model("Transaction", transactionSchema);

module.exports = transaction;
