import db from "../config/db.js";

// Get all insurances
export async function getLoanInsurances(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM loan_insurance ORDER BY insurance_id DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loan insurance records" });
  }
}

// Get one insurance
export async function getLoanInsuranceById(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM loan_insurance WHERE insurance_id=?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Loan insurance not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loan insurance" });
  }
}

// Create new insurance
export async function createLoanInsurance(req, res) {
  try {
    const { loan_id, provider_name, policy_number, coverage_amount } = req.body;

    const [result] = await db.query(
      "INSERT INTO loan_insurance (loan_id, provider_name, policy_number, coverage_amount) VALUES (?,?,?,?)",
      [loan_id, provider_name, policy_number, coverage_amount]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating loan insurance" });
  }
}

// Update insurance
export async function updateLoanInsurance(req, res) {
  try {
    const { loan_id, provider_name, policy_number, coverage_amount } = req.body;

    await db.query(
      "UPDATE loan_insurance SET loan_id=?, provider_name=?, policy_number=?, coverage_amount=? WHERE insurance_id=?",
      [loan_id, provider_name, policy_number, coverage_amount, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating loan insurance" });
  }
}

// Delete insurance
export async function deleteLoanInsurance(req, res) {
  try {
    await db.query("DELETE FROM loan_insurance WHERE insurance_id=?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting loan insurance" });
  }
}
