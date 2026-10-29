const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const controller = require("../controller/auth.controller");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });

router.post("/register", authLimiter, validate(registerSchema), controller.register);
router.post("/login", authLimiter, validate(loginSchema), controller.login);
router.get("/me", requireAuth, controller.me);

module.exports = router;
