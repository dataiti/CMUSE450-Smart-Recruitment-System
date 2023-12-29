const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { sendMail } = require("../utils/sendMail");
const User = require("../models/user");

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password)
    throw new Error("All fields are required");

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new Error("User is existing");

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
  });

  await newUser.save();

  const accessToken = generateAccessToken({
    _id: newUser._id,
    permission: newUser.permission,
  });
  const refreshToken = generateRefreshToken({
    _id: newUser._id,
    permission: newUser.permission,
  });

  return res.status(200).json({
    success: true,
    message: "Register user is successfully",
    accessToken,
    refreshToken,
    data: newUser,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("Email or password is required");

  const findUser = await User.findOne({
    email,
  })
    .populate("ownerEmployerId")
    .populate({
      path: "wishlistIds",
      model: "Job",
      populate: {
        path: "workRegion",
        model: "Address",
      },
      populate: {
        path: "employerId",
        model: "Employer",
      },
    })
    .populate("candidateId");

  if (!findUser) throw new Error("Email is incorrect");

  if (!(await findUser.isCorrectPassword(password)))
    throw new Error("Password is incorrect");

  const accessToken = generateAccessToken({
    _id: findUser._id,
    permission: findUser.permission,
  });
  const refreshToken = generateRefreshToken({
    _id: findUser._id,
    permission: findUser.permission,
  });

  findUser.refreshToken = refreshToken;

  await findUser.save();

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "http://localhost:3000",
    })
    .status(200)
    .json({
      success: true,
      message: "Login user is successfully",
      accessToken,
      refreshToken,
      data: findUser,
    });
});

const socialLogin = asyncHandler(async (req, res, next) => {
  const { facebookId, googleId } = req.body;

  const user = await User.findOne({
    $or: [
      {
        googleId: {
          $exists: true,
          $ne: null,
          $eq: googleId,
        },
        facebookId: {
          $exists: true,
          $ne: null,
          $eq: facebookId,
        },
      },
    ],
  }).populate("candidateId");

  if (!user) {
    next();
  } else {
    req.auth = user;
    next();
  }
});

const socialLoginUpdateInfo = asyncHandler(async (req, res, next) => {
  if (req.auth) {
    next();
  } else {
    const { firstName, lastName, email, avatar, googleId, facebookId } =
      req.body;

    if (googleId) {
      const user = await User.findOneAndUpdate(
        {
          email,
        },
        { $set: { googleId } },
        { new: true }
      ).populate("candidateId");

      if (!user) {
        const newUser = new User({
          firstName,
          lastName,
          email,
          avatar,
          googleId,
          facebookId,
        });

        await newUser.save();
        req.auth = newUser;
        next();
      } else {
        req.auth = user;
        next();
      }
    }

    if (facebookId) {
      const user = await User.findOneAndUpdate(
        {
          email,
        },
        { $set: { facebookId } },
        { new: true }
      );

      if (!user) {
        const newUser = new User({
          firstName,
          lastName,
          email,
          avatar,
          googleId,
          facebookId,
        }).populate("candidateId");

        await newUser.save();
        req.auth = newUser;
        next();
      } else {
        req.auth = user;
        next();
      }
    }
  }
});

const createToken = asyncHandler(async (req, res) => {
  const user = req.auth;

  const accessToken = generateAccessToken({
    _id: user._id,
    permission: user.permission,
  });
  const newRefreshToken = generateRefreshToken({
    _id: user._id,
    permission: user.permission,
  });

  await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    { $set: { refreshToken: newRefreshToken } },
    { new: true }
  );

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Login with social account is successfully",
      accessToken,
      refreshToken: newRefreshToken,
      data: user,
    });
});

const logout = asyncHandler(async (req, res) => {
  // const refreshToken = req.cookies.refreshToken;
  const { refreshToken } = req.body;

  if (!refreshToken) throw new Error("Not find refreshToken on cookies");

  await User.findOneAndUpdate(
    { refreshToken },
    { $set: { refreshToken: "" } },
    { new: true }
  );

  return res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Logout user is successfully",
    });
});

const refreshToken = asyncHandler(async (req, res) => {
  // const refreshToken = req.cookies.refreshToken;
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) throw new Error("Not find refreshToken on cookies");

  const verifyRefreshToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY
  );

  if (!verifyRefreshToken) throw new Error("RefreshToken is invalid");

  const findUser = await User.findOne({
    _id: verifyRefreshToken._id,
    refreshToken: refreshToken,
  });

  const newRefreshToken = generateRefreshToken({
    _id: findUser,
    permission: findUser.permission,
  });

  return res.status(200).json({
    success: true,
    message: "RefreshToken is successfully",
    refreshToken: newRefreshToken,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new Error("Email is required");

  const findUser = await User.findOne({ email });

  if (!findUser) throw new Error("User is not find");

  const resetToken = findUser.createPasswordChangedToken();

  await findUser.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=http://localhost:${process.env.PORT}/api/v1/auth/reset-password/${resetToken}>Click here</a>`;

  const responeseMail = await sendMail({ email, html });

  return res.status(200).json({
    success: true,
    message: "Forgot password is successfully",
    data: responeseMail,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  if (!password || !token)
    throw new Error("newPassword or token field is required");

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid reset token");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;

  await user.save();

  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});

module.exports = {
  register,
  login,
  logout,
  socialLogin,
  socialLoginUpdateInfo,
  createToken,
  refreshToken,
  resetPassword,
  forgotPassword,
};
