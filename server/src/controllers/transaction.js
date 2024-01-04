const asyncHandler = require("express-async-handler");
const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const { sortObject } = require("../utils/fn");
const Transaction = require("../models/transaction");
const Employer = require("../models/employer");

const transactionById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: false,
      message: "Transaction Id is invalid",
    });
  }

  const transaction = await Transaction.findById(id);

  if (!transaction)
    return res.status(400).json({
      success: false,
      message: "Transaction is not find",
    });

  req.transaction = transaction;
  next();
});

const createPayment = asyncHandler(async (req, res, next) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var tmnCode = process.env.TMNCODE;
  var secretKey = process.env.SETCRETKEY;
  var vnpUrl = process.env.VNPURL;
  var returnUrl = `${process.env.RETURNURL}/${req.user._id}/${req.employer._id}`;
  var date = new Date();
  var createDate = moment(date).format("YYYYMMDDHHmmss");
  var orderId = moment(date).format("HHmmss");

  var amount = req.body.amount;
  var bankCode = req.body.bankCode;
  var orderInfo = req.body.orderInfo;
  var orderType = req.body.orderType;
  var locale = req.body.locale;
  if (locale === null || locale === "") {
    locale = "vn";
  }

  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  res.status(200).json({ redirectUrl: vnpUrl });
});

const vnpayipn = asyncHandler(async (req, res) => {});

const VNPayReturn = asyncHandler(async (req, res) => {
  var vnp_Params = req.query;

  var tmnCode = process.env.TMNCODE;
  var secretKey = process.env.SETCRETKEY;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    const newTransaction = new Transaction({
      employerId: req.employer._id,
      transactionNo: vnp_Params.vnp_TransactionNo,
      amount: Number(vnp_Params.vnp_Amount),
      bankCode: vnp_Params.vnp_BankCode,
      bankTranNo: vnp_Params.vnp_BankTranNo,
      orderInfo: vnp_Params.vnp_OrderInfo,
      cardType: vnp_Params.vnp_CardType,
      status: vnp_Params.vnp_TransactionStatus === "00" ? "success" : "failure",
    });

    await newTransaction.save();

    req.employer.isBuyedPremium = true;

    await req.employer.save();

    res.redirect(
      `http://localhost:3001/dashboard?vnp_Amount=${vnp_Params.vnp_Amount}&vnp_BankCode=${vnp_Params.vnp_BankCode}&vnp_BankTranNo=${vnp_Params.vnp_BankTranNo}&vnp_CardType=${vnp_Params.vnp_CardType}&vnp_OrderInfo=${vnp_Params.vnp_OrderInfo}&vnp_PayDate=${vnp_Params.vnp_PayDate}&vnp_ResponseCode=${vnp_Params.vnp_ResponseCode}&vnp_TmnCode=${vnp_Params.vnp_TmnCode}&vnp_TransactionNo=${vnp_Params.vnp_TransactionNo}&${vnp_Params.vnp_TransactionStatus}=00&vnp_TxnRef=${vnp_Params.vnp_TxnRef}&vnp_SecureHash=${vnp_Params.vnp_SecureHash}`
    );

    return res.status(200).json({
      success: vnp_Params["vnp_ResponseCode"] === "00" ? true : false,
      data: "",
    });
  } else {
    return res.status(200).json({ success: false });
  }
});

const getListTransactionsForEmployer = asyncHandler(async (req, res) => {
  const { query } = req;
  const status = query.status ? query.status : "";
  const search = query.search || "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const sortBy = query.sortBy || "-_id";
  const orderBy = ["asc", "desc"].includes(query.orderBy)
    ? query.orderBy
    : "asc";
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const filterArgs = {
    $or: [
      { orderId: { $regex: regex, $options: "i" } },
      { orderInfo: { $regex: regex, $options: "i" } },
    ],
    employerId: req.employer._id,
  };

  if (status) filterArgs.status = status;

  const countTransaction = await Transaction.countDocuments(filterArgs);

  if (!countTransaction) throw new Error("List transactions is not find");

  const totalPage = Math.ceil(countTransaction / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const listTransactions = await Transaction.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate("employerId");

  return res.status(200).json({
    success: true,
    message: "Get list of transactions are successfully",
    currentPage: page,
    totalPage,
    countTransaction,
    data: listTransactions,
  });
});

const getListTransactionsForAdmin = asyncHandler(async (req, res) => {
  const { query } = req;
  const status = query.status ? query.status : "";
  const search = query.search || "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const sortBy = query.sortBy || "-_id";
  const orderBy = ["asc", "desc"].includes(query.orderBy)
    ? query.orderBy
    : "asc";
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const filterArgs = {
    $or: [
      { orderId: { $regex: regex, $options: "i" } },
      { orderInfo: { $regex: regex, $options: "i" } },
    ],
  };

  if (status) filterArgs.status = status;

  const countTransaction = await Transaction.countDocuments(filterArgs);

  if (!countTransaction)
    throw new Error("List transactions for admin is not find");

  const totalPage = Math.ceil(countTransaction / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const listTransactions = await Transaction.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate("employerId");

  return res.status(200).json({
    success: true,
    message: "Get list of transactions for admin are successfully",
    currentPage: page,
    totalPage,
    countUser,
    data: listTransactions,
  });
});

module.exports = {
  transactionById,
  createPayment,
  getListTransactionsForEmployer,
  getListTransactionsForAdmin,
  vnpayipn,
  VNPayReturn,
};
