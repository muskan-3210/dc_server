const { z } = require("zod");

const categoryBody = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(255).optional(),
  parent_id: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().optional(),
});

const createCategorySchema = categoryBody;
const updateCategorySchema = categoryBody.partial()
  .refine((d) => Object.keys(d).length > 0, { message: "At least one field is required" });
const idParamSchema = z.object({ id: z.coerce.number().int().positive() });
const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  is_active: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  parent_id: z.coerce.number().int().positive().optional(),
  sort: z.enum(["name", "created_at"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

module.exports = { createCategorySchema, updateCategorySchema, idParamSchema, listQuerySchema };