import db from "../config/db.js";

// ✅ Get all loan disbursements
export async function getLoanDisbursements(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT ld.*, pm.method_name AS disbursement_method_name 
      FROM loan_disbursement ld
      LEFT JOIN payment_method pm ON ld.disbursement_method_id = pm.method_id
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loan disbursements" });
  }
}

// ✅ Get a single disbursement by ID
export async function getLoanDisbursementById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM loan_disbursement WHERE disbursement_id=?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Loan disbursement not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loan disbursement" });
  }
}

// ✅ Create a new loan disbursement
export async function createLoanDisbursement(req, res) {
  try {
    const { loan_id, disbursed_by, disbursement_date, amount, disbursement_method_id } = req.body;

    const [result] = await db.query(
      "INSERT INTO loan_disbursement (loan_id, disbursed_by, disbursement_date, amount, disbursement_method_id) VALUES (?,?,?,?,?)",
      [loan_id, disbursed_by, disbursement_date, amount, disbursement_method_id]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating loan disbursement" });
  }
}

// ✅ Update a loan disbursement
export async function updateLoanDisbursement(req, res) {
  try {
    const { loan_id, disbursed_by, disbursement_date, amount, disbursement_method_id } = req.body;

    await db.query(
      "UPDATE loan_disbursement SET loan_id=?, disbursed_by=?, disbursement_date=?, amount=?, disbursement_method_id=? WHERE disbursement_id=?",
      [loan_id, disbursed_by, disbursement_date, amount, disbursement_method_id, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating loan disbursement" });
  }
}

// ✅ Delete a loan disbursement
export async function deleteLoanDisbursement(req, res) {
  try {
    await db.query("DELETE FROM loan_disbursement WHERE disbursement_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting loan disbursement" });
  }
}
