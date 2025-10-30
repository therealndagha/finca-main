
import db from "../config/db.js"; 

// GET all roles
export async function getAllRoles(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM role ORDER BY role_id ASC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching roles" });
  }
}

// GET single role by ID
export async function getRoleById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM role WHERE role_id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Role not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching role" });
  }
}

// CREATE role
export async function createRole(req, res) {
  const { role_name, role_description } = req.body;
  if (!role_name || !role_description) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO role (role_name, role_description) VALUES (?, ?)",
      [role_name, role_description]
    );
    const [rows] = await db.query("SELECT * FROM role WHERE role_id = ?", [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating role" });
  }
}

// UPDATE role
export async function updateRole(req, res) {
  const { id } = req.params;
  const { role_name, role_description } = req.body;
  try {
    const [existing] = await db.query("SELECT * FROM role WHERE role_id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Role not found" });

    await db.query(
      "UPDATE role SET role_name = ?, role_description = ? WHERE role_id = ?",
      [role_name, role_description, id]
    );

    const [rows] = await db.query("SELECT * FROM role WHERE role_id = ?", [id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating role" });
  }
}

// DELETE role
export async function deleteRole(req, res) {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM role WHERE role_id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Role not found" });

    await db.query("DELETE FROM role WHERE role_id = ?", [id]);
    res.json({ success: true, message: "Role deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting role" });
  }
}
