const express = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  socialLogin,
  socialLoginUpdateInfo,
  createToken,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/social-login", socialLogin, socialLoginUpdateInfo, createToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
