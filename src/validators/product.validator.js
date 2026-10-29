const { z } = require("zod");

// No .default() here: with .partial() a default would silently reset fields on PATCH.
const productBody = z.object({
  image_url: z.string().max(255).nullable().optional(),
  name: z.string().trim().min(2).max(150),
  sku: z.string().trim().min(2).max(50),
  description: z.string().trim().max(500).optional(),
  price: z.number().nonnegative().max(99999999.99),
  stock: z.number().int().min(0).optional(),
  category_id: z.number().int().positive(),
  is_active: z.boolean().optional(),
});

const createProductSchema = productBody;

const updateProductSchema = productBody
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: "At least one field is required" });

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  is_active: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  category_id: z.coerce.number().int().positive().optional(),
  sort: z.enum(["name", "price", "created_at"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

module.exports = { createProductSchema, updateProductSchema, idParamSchema, listQuerySchema };