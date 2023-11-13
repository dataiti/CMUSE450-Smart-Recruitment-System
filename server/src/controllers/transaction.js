const asyncHandler = require("express-async-handler");
const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const { sortObject } = require("../utils/fn");
// const transaction = require('')

const transactionById = asyncHandler(async (req, res, next, id) => {});

const createPayment = asyncHandler(async (req, res, next) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var tmnCode = process.env.TMNCODE;
  var secretKey = process.env.SETCRETKEY;
  var vnpUrl = process.env.VNPURL;
  var returnUrl = process.env.RETURNURL;

  var date = new Date();
  var createDate = moment(date).format("YYYYMMDDHHmmss");
  var orderId = moment(date).format("HHmmss");

  var amount = 10000 * 100;
  var bankCode = "NCB";

  var orderInfo = "Noi dung thanh toan";
  var orderType = "billpayment";
  var locale = "vn";
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

const createTransaction = asyncHandler(async (req, res) => {});

const getListTransactionsForEmployer = asyncHandler(async (req, res) => {});

const getListTransactionsForAdmin = asyncHandler(async (req, res) => {});

module.exports = {
  transactionById,
  createPayment,
  createTransaction,
  getListTransactionsForEmployer,
  getListTransactionsForAdmin,
};
