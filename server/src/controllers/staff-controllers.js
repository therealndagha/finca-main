import db from "../config/db.js";

// GET all staff with role name and branch_id
export async function getAllStaff(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT s.staff_id, s.branch_id, s.role_id, r.role_name, s.f_name, s.l_name, s.email, s.phone_no, s.address
      FROM staff s
      JOIN role r ON s.role_id = r.role_id
      ORDER BY s.staff_id ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching staff" });
  }
}

// GET staff by ID
export async function getStaffById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT s.staff_id, s.branch_id, s.role_id, r.role_name, s.f_name, s.l_name, s.email, s.phone_no, s.address
      FROM staff s
      JOIN role r ON s.role_id = r.role_id
      WHERE s.staff_id = ?
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching staff" });
  }
}

// CREATE staff
export async function createStaff(req, res) {
  const { branch_id, role_id, f_name, l_name, email, phone_no, address } = req.body;
  if (!branch_id || !role_id || !f_name || !l_name || !phone_no || !address) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO staff (branch_id, role_id, f_name, l_name, email, phone_no, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [branch_id, role_id, f_name, l_name, email, phone_no, address]);

    const [rows] = await db.query("SELECT * FROM staff WHERE staff_id = ?", [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating staff" });
  }
}

// UPDATE staff
export async function updateStaff(req, res) {
  const { id } = req.params;
  const { branch_id, role_id, f_name, l_name, email, phone_no, address } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM staff WHERE staff_id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Staff not found" });

    await db.query(`
      UPDATE staff SET branch_id=?, role_id=?, f_name=?, l_name=?, email=?, phone_no=?, address=? WHERE staff_id=?
    `, [branch_id, role_id, f_name, l_name, email, phone_no, address, id]);

    const [rows] = await db.query("SELECT * FROM staff WHERE staff_id = ?", [id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating staff" });
  }
}

// DELETE staff
export async function deleteStaff(req, res) {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM staff WHERE staff_id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Staff not found" });

    await db.query("DELETE FROM staff WHERE staff_id = ?", [id]);
    res.json({ success: true, message: "Staff deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting staff" });
  }
}
