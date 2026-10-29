const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

function requireOnboarded(req, res, next) {
  if (!req.user.onboarding_completed) {
    return res.status(403).json({ success: false, message: "Complete onboarding first" });
  }
  next();
}

module.exports = { requireAuth, requireOnboarded };
