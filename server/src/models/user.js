const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/doo78f14s/image/upload/v1677427616/CDIO2-project/dedault_jd3qnu.jpg",
    },

    password: {
      type: String,
    },
    filename: {
      type: String,
      default: "CDIO2-project/dedault_jd3qnu",
    },
    permission: {
      type: String,
      default: "user",
      enum: ["user", "candidate", "employer", "adminstractor"],
    },
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    ownerEmployerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Locked"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isCorrectPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.createPasswordChangedToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
