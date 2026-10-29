const prisma = require("../config/prisma");

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// POST /api/categories
exports.createCategory = async (req, res) => {
  const data = { ...req.body, slug: slugify(req.body.name) };
  const category = await prisma.category.create({ data });
  res.status(201).json({ success: true, data: category });
};

// GET /api/categories
exports.listCategories = async (req, res) => {
  const { search, is_active, parent_id, sort, order, page, limit } = req.validatedQuery;

  const where = {
    ...(is_active !== undefined && { is_active }),
    ...(parent_id !== undefined && { parent_id }),
    ...(search && {
      OR: [{ name: { contains: search } }, { description: { contains: search } }],
    }),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.count({ where }),
  ]);

  res.json({ success: true, data: rows, meta: { page, limit, total } });
};

// GET /api/categories/:id
exports.getCategory = async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
    include: { parent: true, children: { where: { is_active: true } } },
  });
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }
  res.json({ success: true, data: category });
};

// PATCH /api/categories/:id
exports.updateCategory = async (req, res) => {
  if (req.body.parent_id === req.params.id) {
    return res.status(400).json({ success: false, message: "A category cannot be its own parent" });
  }

  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);

  const category = await prisma.category.update({
    where: { id: req.params.id },
    data,
  });
  res.json({ success: true, data: category });
};

// DELETE /api/categories/:id  (soft delete)
exports.deleteCategory = async (req, res) => {
  const activeChildren = await prisma.category.count({
    where: { parent_id: req.params.id, is_active: true },
  });
  if (activeChildren > 0) {
    return res.status(409).json({
      success: false,
      message: "Cannot delete a category that has active sub-categories",
    });
  }

  await prisma.category.update({
    where: { id: req.params.id },
    data: { is_active: false },
  });
  res.status(204).send();
};

