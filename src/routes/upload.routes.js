const { Router } = require("express");
const upload = require("../middleware/upload.middleware");

const router = Router();

router.post("/product-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }
  res.status(201).json({ success: true, data: { url: `/api/uploads/products/${req.file.filename}` } });
});

module.exports = router;