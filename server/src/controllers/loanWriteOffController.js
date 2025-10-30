import db from "../config/db.js";

// Get all write-offs
export async function getLoanWriteoffs(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM loan_writeoff ORDER BY writeoff_id DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loan write-offs" });
  }
}

// Get one write-off by id
export async function getLoanWriteoffById(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM loan_writeoff WHERE writeoff_id=?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Loan write-off not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loan write-off" });
  }
}

// Create new write-off
export async function createLoanWriteoff(req, res) {
  try {
    const { loan_id, reason, amount_written_off } = req.body;

    const [result] = await db.query(
      "INSERT INTO loan_writeoff (loan_id, reason, amount_written_off) VALUES (?,?,?)",
      [loan_id, reason, amount_written_off]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating loan write-off" });
  }
}

// Update write-off
export async function updateLoanWriteoff(req, res) {
  try {
    const { loan_id, reason, amount_written_off } = req.body;

    await db.query(
      "UPDATE loan_writeoff SET loan_id=?, reason=?, amount_written_off=? WHERE writeoff_id=?",
      [loan_id, reason, amount_written_off, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating loan write-off" });
  }
}

// Delete write-off
export async function deleteLoanWriteoff(req, res) {
  try {
    await db.query("DELETE FROM loan_writeoff WHERE writeoff_id=?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting loan write-off" });
  }
}
