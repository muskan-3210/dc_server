const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const signToken = (user) =>
  jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  onboarding_completed: u.onboarding_completed,
});

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({ data: { name, email, password_hash } });
    res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }
    throw err;
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password_hash));

  // Same message for unknown email and wrong password, so accounts can't be enumerated.
  if (!valid) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  res.json({ success: true, token: signToken(user), user: publicUser(user) });
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.json({ success: true, data: publicUser(req.user) });
};
