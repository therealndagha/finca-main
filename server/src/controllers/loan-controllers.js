// controllers/loanController.js
import db from "../config/db.js";

export async function getLoans(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM loan");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loans" });
  }
}

export async function getLoanById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM loan WHERE loan_id=?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching loan" });
  }
}

export async function createLoan(req, res) {
  try {
    const {
      loan_application_id,
      loan_amount,
      staff_id,
      start_date,
      end_date,
      status,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO loan 
        (loan_application_id, loan_amount, staff_id, start_date, end_date, status) 
       VALUES (?,?,?,?,?,?)`,
      [loan_application_id, loan_amount, staff_id, start_date, end_date, status]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating loan" });
  }
}

export async function updateLoan(req, res) {
  try {
    const {
      loan_application_id,
      loan_amount,
      staff_id,
      start_date,
      end_date,
      status,
    } = req.body;

    await db.query(
      `UPDATE loan 
       SET loan_application_id=?, loan_amount=?, staff_id=?, start_date=?, end_date=?, status=? 
       WHERE loan_id=?`,
      [
        loan_application_id,
        loan_amount,
        staff_id,
        start_date,
        end_date,
        status,
        req.params.id,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating loan" });
  }
}

export async function deleteLoan(req, res) {
  try {
    await db.query("DELETE FROM loan WHERE loan_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting loan" });
  }
}
