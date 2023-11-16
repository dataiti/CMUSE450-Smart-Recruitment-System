const express = require("express");
const {
  transactionById,
  createPayment,
  createTransaction,
  getListTransactionsForEmployer,
  getListTransactionsForAdmin,
} = require("../controllers/transaction");
const { userById } = require("../controllers/user");
const { employerById } = require("../controllers/employer");
const { verifyToken, isAdminSystem } = require("../middlewares/verifyToken");

const router = express.Router();

router.get(
  "/get-list-transactions/admin/:employerById",
  verifyToken,
  isAdminSystem,
  getListTransactionsForAdmin
);
router.get(
  "/get-list-transactions/:userId/:employerId",
  getListTransactionsForEmployer
);
router.post("/create-payment/:userId/:employerId", createPayment);
router.post("/create-transaction/:userId/:employerId", createTransaction);

router.param("userId", userById);
router.param("transactionId", transactionById);
router.param("employerId", employerById);

module.exports = router;
