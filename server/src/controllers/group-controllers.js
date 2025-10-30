import db from "../config/db.js"; 

// GET /api/group
export async function getAllGroups(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM `groups` ORDER BY group_id ASC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching groups" });
  }
}

// GET /api/group/:id
export async function getGroupById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM `groups` WHERE group_id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching group" });
  }
}

// POST /api/group
export async function createGroup(req, res) {
  const { group_name, group_type, phone_no, address, branch_id } = req.body;

  if (!group_name || !group_type || !phone_no || !address || !branch_id) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO `groups` (group_name, group_type, phone_no, address, branch_id) VALUES (?, ?, ?, ?, ?)",
      [group_name, group_type, phone_no, address, branch_id]
    );
    const [rows] = await db.query("SELECT * FROM `groups` WHERE group_id = ?", [
      result.insertId,
    ]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating group" });
  }
}

// PUT /api/group/:id
export async function updateGroup(req, res) {
  const { group_name, group_type, phone_no, address, branch_id } = req.body;
  const { id } = req.params;

  try {
    const [existing] = await db.query("SELECT * FROM `groups` WHERE group_id = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    await db.query(
      "UPDATE `groups` SET group_name=?, group_type=?, phone_no=?, address=?, branch_id=? WHERE group_id=?",
      [group_name, group_type, phone_no, address, branch_id, id]
    );

    const [rows] = await db.query("SELECT * FROM `groups` WHERE group_id = ?", [
      id,
    ]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating group" });
  }
}

// DELETE /api/group/:id
export async function deleteGroup(req, res) {
  try {
    const [existing] = await db.query("SELECT * FROM `groups` WHERE group_id = ?", [
      req.params.id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    await db.query("DELETE FROM `groups` WHERE group_id = ?", [req.params.id]);
    res.json({ success: true, message: "Group deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting group" });
  }
}
