const multer = require("multer");
const imagekit = require("../../config/imageKit");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5, // Maksimal 5 file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Hanya file gambar yang diperbolehkan", 400), false);
    }
  },
});
const uploadToImageKit = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const uploadPromises = req.files.map((file) => {
      return imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "/reports",
      });
    });

    const results = await Promise.all(uploadPromises);
    req.uploadedImages = results.map((result) => ({
      url: result.url,
      fileId: result.fileId,
    }));

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  uploadToImageKit,
};
