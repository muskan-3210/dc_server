const fs = require("fs");
const path = require("path");
const multer = require("multer");

const dir = path.join(__dirname, "..", "..", "uploads", "products");
fs.mkdirSync(dir, { recursive: true });

const ALLOWED = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

module.exports = multer({
  storage: multer.diskStorage({
    destination: dir,
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ALLOWED[file.mimetype]}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) =>
    ALLOWED[file.mimetype]
      ? cb(null, true)
      : cb(Object.assign(new Error("Only JPG, PNG or WEBP images are allowed"), { status: 400 })),
});