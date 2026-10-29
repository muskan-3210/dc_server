function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Prisma: unique constraint failed (duplicate email)
  if (err.code === "P2002") {
    return res.status(409).json({ success: false, message: "A record with this value already exists" });
  }

  if (err.code === "P2003") {
    return res.status(400).json({ success: false, message: "Referenced record does not exist" });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "Record not found" });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "Image must be 2 MB or smaller" });
  }
  
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
}

module.exports = { notFound, errorHandler };