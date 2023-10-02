const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(
        token,
        process.env.JWT_SECRET_ACCESS_KEY
      );
      req.user = decoded;
      next();
    } else {
      throw new Error("Access token is required");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Access token is invalid",
    });
  }
};

const isEmployer = async (req, res, next) => {
  try {
    if (
      req.user.permissions === "employer" ||
      req.user._id !== req.store.ownerId
    ) {
      throw new Error("You are not the owner of this store");
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};

const isAdminSystem = async (req, res, next) => {
  try {
    if (req.user.permissions !== "administrator") {
      throw new Error("You are not the admin of this system");
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};

module.exports = {
  verifyToken,
  isEmployer,
  isAdminSystem,
};
