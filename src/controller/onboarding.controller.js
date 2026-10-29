const prisma = require("../config/prisma");

// POST /api/onboarding  (creates the logged-in user's record and marks onboarding complete)
exports.createOnboarding = async (req, res) => {
  const [record] = await prisma.$transaction([
    prisma.onboarding.create({ data: { ...req.body, user_id: req.user.id } }),
    prisma.user.update({
      where: { id: req.user.id },
      data: { onboarding_completed: true },
    }),
  ]);
  res.status(201).json({ success: true, data: record });
};

// GET /api/onboarding/me
exports.getMyOnboarding = async (req, res) => {
  const record = await prisma.onboarding.findUnique({ where: { user_id: req.user.id } });
  if (!record) {
    return res.status(404).json({ success: false, message: "Onboarding not completed" });
  }
  res.json({ success: true, data: record });
};

// PATCH /api/onboarding/me
exports.updateMyOnboarding = async (req, res) => {
  const record = await prisma.onboarding.update({
    where: { user_id: req.user.id },
    data: req.body,
  });
  res.json({ success: true, data: record });
};
