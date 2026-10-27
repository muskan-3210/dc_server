const pool = require("../config/database");

const COLUMNS =
  "id, full_name, email, phone, company_name, role, address, status, created_at, updated_at";

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT ${COLUMNS} FROM onboarding WHERE id = ?`,
    [id]
  );
  return rows[0];
}

// POST /api/onboarding
exports.createOnboarding = async (req, res) => {
  const { full_name, email, phone, company_name, role, address } = req.body;

  const [result] = await pool.execute(
    `INSERT INTO onboarding (full_name, email, phone, company_name, role, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone, company_name ?? null, role, address ?? null]
  );

  const record = await findById(result.insertId);
  res.status(201).json({ success: true, data: record });
};

// GET /api/onboarding
exports.listOnboarding = async (req, res) => {
  const { status, page, limit } = req.validatedQuery;
  const offset = (page - 1) * limit;

  const where = status ? "WHERE status = ?" : "";
  const params = status ? [status] : [];

  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM onboarding ${where}
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM onboarding ${where}`,
    params
  );

  res.json({ success: true, data: rows, meta: { page, limit, total } });
};

// GET /api/onboarding/:id
exports.getOnboarding = async (req, res) => {
  const record = await findById(req.params.id);
  if (!record) {
    return res.status(404).json({ success: false, message: "Onboarding record not found" });
  }
  res.json({ success: true, data: record });
};

// PATCH /api/onboarding/:id
exports.updateOnboarding = async (req, res) => {
  const fields = Object.keys(req.body);
  const setClause = fields.map((f) => `${f} = ?`).join(", ");

  const [result] = await pool.execute(
    `UPDATE onboarding SET ${setClause} WHERE id = ?`,
    [...Object.values(req.body), req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Onboarding record not found" });
  }
  res.json({ success: true, data: await findById(req.params.id) });
};

// PATCH /api/onboarding/:id/status
exports.updateStatus = async (req, res) => {
  const [result] = await pool.execute(
    "UPDATE onboarding SET status = ? WHERE id = ?",
    [req.body.status, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Onboarding record not found" });
  }
  res.json({ success: true, data: await findById(req.params.id) });
};