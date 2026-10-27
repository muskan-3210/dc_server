const { z } = require("zod");

const STATUSES = ["pending", "in_review", "approved", "rejected"];

const onboardingBody = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.email().max(150).transform((v) => v.toLowerCase()),
  phone: z.string().trim().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  company_name: z.string().trim().max(150).optional(),
  role: z.string().trim().min(2).max(50),
  address: z.string().trim().max(255).optional(),
});

const createOnboardingSchema = onboardingBody;

// Partial update: at least one field must be sent.
const updateOnboardingSchema = onboardingBody
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

const updateStatusSchema = z.object({
  status: z.enum(STATUSES),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const listQuerySchema = z.object({
  status: z.enum(STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

module.exports = {
  createOnboardingSchema,
  updateOnboardingSchema,
  updateStatusSchema,
  idParamSchema,
  listQuerySchema,
};