import db from "../config/db.js";

// GET all branches
export async function getAllBranches(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM branch ORDER BY branch_id ASC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching branches" });
  }
}

// GET single branch
export async function getBranchById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM branch WHERE branch_id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching branch" });
  }
}

// POST create branch
export async function createBranch(req, res) {
  const { branch_name, location, phone_no } = req.body;
  if (!branch_name || !location || !phone_no) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO branch (branch_name, location, phone_no) VALUES (?, ?, ?)",
      [branch_name, location, phone_no]
    );
    const [rows] = await db.query("SELECT * FROM branch WHERE branch_id = ?", [
      result.insertId,
    ]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating branch" });
  }
}

// PUT update branch
export async function updateBranch(req, res) {
  const { branch_name, location, phone_no } = req.body;
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM branch WHERE branch_id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    await db.query(
      "UPDATE branch SET branch_name=?, location=?, phone_no=? WHERE branch_id=?",
      [branch_name, location, phone_no, id]
    );
    const [rows] = await db.query("SELECT * FROM branch WHERE branch_id = ?", [id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating branch" });
  }
}

// DELETE branch
export async function deleteBranch(req, res) {
  try {
    const [existing] = await db.query("SELECT * FROM branch WHERE branch_id = ?", [
      req.params.id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    await db.query("DELETE FROM branch WHERE branch_id = ?", [req.params.id]);
    res.json({ success: true, message: "Branch deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting branch" });
  }
}
