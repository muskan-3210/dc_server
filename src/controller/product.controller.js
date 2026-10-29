const prisma = require("../config/prisma");

const withCategory = { category: { select: { id: true, name: true } } };

// POST /api/products
exports.createProduct = async (req, res) => {
  const product = await prisma.product.create({ data: req.body, include: withCategory });
  res.status(201).json({ success: true, data: product });
};

// GET /api/products
exports.listProducts = async (req, res) => {
  const { search, is_active, category_id, sort, order, page, limit } = req.validatedQuery;

  const where = {
    ...(is_active !== undefined && { is_active }),
    ...(category_id !== undefined && { category_id }),
    ...(search && {
      OR: [{ name: { contains: search } }, { sku: { contains: search } }],
    }),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: withCategory,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ success: true, data: rows, meta: { page, limit, total } });
};

// GET /api/products/:id
exports.getProduct = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: withCategory,
  });
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, data: product });
};

// PATCH /api/products/:id
exports.updateProduct = async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
    include: withCategory,
  });
  res.json({ success: true, data: product });
};

// DELETE /api/products/:id  (hard delete)
exports.deleteProduct = async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
