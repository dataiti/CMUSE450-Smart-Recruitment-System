const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    transactionNo: {
      type: String,
    },
    bankCode: {
      type: String,
    },
    amount: {
      type: Number,
    },
    orderInfo: {
      type: String,
    },
    bankTranNo: {
      type: String,
    },
    bankCode: {
      type: String,
    },
    cardType: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "failure"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const transaction = mongoose.model("Transaction", transactionSchema);

module.exports = transaction;
