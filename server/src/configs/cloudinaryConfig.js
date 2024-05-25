const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "webp", "pdf", "jfif"],
  params: {
    folder: "Capstone1-project",
  },
});

const storageMemo = multer.memoryStorage();

const uploadMemo = multer({ storage: storageMemo });

const uploadCloud = multer({ storage });

module.exports = { uploadMemo, uploadCloud };
