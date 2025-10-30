
// controllers/repaymentController.js
import db from "../config/db.js";

/**
 * Get all repayments
 */
export async function getRepayments(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM loan_repayments");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching repayments" });
  }
}

/**
 * Get repayments by loan_id (optional)
 */
export async function getRepaymentsByLoan(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM loan_repayments WHERE loan_id=?", [
    req.params.loan_id,
  ]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching repayments" });
  }
}

/**
 * Create a repayment, update the balance automatically
 */
export async function createRepayment(req, res) {
  const { loan_id, repayment_date, amount_paid, payment_method_id } = req.body;

  try {
    // Get the last known balance for this loan
    const [lastRepayment] = await db.query(
      `SELECT balance FROM loan_repayments 
       WHERE loan_id=? ORDER BY repayment_id DESC LIMIT 1`,
      [loan_id]
    );

    // If no repayments yet, balance is the original loan_amount
    let currentBalance;
    if (lastRepayment.length > 0) {
      currentBalance = parseFloat(lastRepayment[0].balance);
    } else {
      const [loanRow] = await db.query(
        "SELECT loan_amount FROM loan WHERE loan_id=?",
        [loan_id]
      );
      if (loanRow.length === 0)
        return res.status(404).json({ success: false, message: "Loan not found" });
      currentBalance = parseFloat(loanRow[0].loan_amount);
    }

    if (currentBalance <= 0) {
      return res.status(400).json({
        success: false,
        message: "This loan has already been fully repaid",
      });
    }

    // Compute new balance
    const newBalance = currentBalance - parseFloat(amount_paid);
    if (newBalance < 0) {
      return res.status(400).json({
        success: false,
        message: `Payment exceeds remaining balance (${currentBalance})`,
      });
    }

    // Insert repayment
    const [result] = await db.query(
      `INSERT INTO loan_repayments 
        (loan_id, repayment_date, amount_paid, balance, payment_method_id) 
       VALUES (?,?,?,?,?)`,
      [loan_id, repayment_date, amount_paid, newBalance, payment_method_id]
    );

    // Optionally, mark loan as “Paid” if newBalance hits 0
    if (newBalance === 0) {
      await db.query("UPDATE loan SET status='Paid' WHERE loan_id=?", [loan_id]);
    }

    res.json({
      success: true,
      repayment_id: result.insertId,
      new_balance: newBalance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating repayment" });
  }
}

/**
 * Delete repayment (optional)
 */
export async function deleteRepayment(req, res) {
  try {
    await db.query("DELETE FROM loan_repayments WHERE repayment_id=?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting repayment" });
  }
}
