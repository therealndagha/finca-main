
import db from "../config/db.js";

// ✅ Get all complaints
export async function getComplaints(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT c.*, l.loan_amount 
      FROM complaints c
      LEFT JOIN loan l ON c.loan_id = l.loan_id
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching complaints" });
  }
}

// ✅ Get one complaint by ID
export async function getComplaintById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM complaints WHERE complaint_id=?", [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Complaint not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching complaint" });
  }
}

// ✅ Create new complaint
export async function createComplaint(req, res) {
  try {
    const { loan_id, complaint_date, complaint_text, status } = req.body;

    const [result] = await db.query(
      "INSERT INTO complaints (loan_id, complaint_date, complaint_text, status) VALUES (?,?,?,?)",
      [loan_id, complaint_date, complaint_text, status || "Open"]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating complaint" });
  }
}

// ✅ Update complaint
export async function updateComplaint(req, res) {
  try {
    const { loan_id, complaint_date, complaint_text, status } = req.body;

    await db.query(
      "UPDATE complaints SET loan_id=?, complaint_date=?, complaint_text=?, status=? WHERE complaint_id=?",
      [loan_id, complaint_date, complaint_text, status, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating complaint" });
  }
}

// ✅ Delete complaint
export async function deleteComplaint(req, res) {
  try {
    await db.query("DELETE FROM complaints WHERE complaint_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting complaint" });
  }
}
