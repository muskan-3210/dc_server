const { z } = require("zod");

const email = z.email().max(150).transform((v) => v.toLowerCase());

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email,
  password: z.string().min(8).max(72), // bcrypt only uses the first 72 bytes
});

const loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
});

module.exports = { registerSchema, loginSchema };
