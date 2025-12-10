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
    const [rows] = await db.query(
      "SELECT * FROM loan_repayments WHERE loan_id=?",
      [req.params.loan_id]
    );
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
  const { loan_id, repayment_date, amount_paid, payment_method } = req.body;

  try {
    // Get the last known balance
    const [lastRepayment] = await db.query(
      `SELECT balance FROM loan_repayments 
       WHERE loan_id=? ORDER BY repayment_id DESC LIMIT 1`,
      [loan_id]
    );

    let currentBalance;
    if (lastRepayment.length > 0) {
      currentBalance = parseFloat(lastRepayment[0].balance);
    } else {
      const [loanRow] = await db.query(
        "SELECT loan_amount FROM loans WHERE loan_id=?",
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

    const newBalance = currentBalance - parseFloat(amount_paid);
    if (newBalance < 0) {
      return res.status(400).json({
        success: false,
        message: `Payment exceeds remaining balance (${currentBalance})`,
      });
    }

    const [result] = await db.query(
      `INSERT INTO loan_repayments 
        (loan_id, repayment_date, amount_paid, balance, payment_method) 
       VALUES (?,?,?,?,?)`,
      [loan_id, repayment_date, amount_paid, newBalance, payment_method]
    );

    if (newBalance === 0) {
      await db.query("UPDATE loans SET status='Completed' WHERE loan_id=?", [loan_id]);
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
 * Delete repayment
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
