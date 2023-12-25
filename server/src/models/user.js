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
    sex: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/doo78f14s/image/upload/v1703301504/Capstone1-project/x4kejhvw4cx4huqybc7s.png",
    },
    password: {
      type: String,
    },
    publicId: {
      type: String,
      default: "Capstone1-project/x4kejhvw4cx4huqybc7s",
    },
    permission: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    viewedJobs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
    },
    appliedJobs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
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
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
    ownerEmployerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
    },
    followingIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employer",
        },
      ],
      default: [],
    },
    wishlistIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "locked"],
    },
    socketId: {
      type: String,
    },
    isLocked: {
      type: Boolean,
      default: false,
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
