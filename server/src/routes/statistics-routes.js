// backend: src/routes/statistics.ts
import { Router} from "express";
import pool from "../config/db.js"; // your MySQL pool connection

const router = Router();

router.get("/statistics", async (req, res) => {
  try {
    // Total loans
    const [totalLoansResult] = await pool.query("SELECT COUNT(*) as total FROM loans");
    const totalLoans = totalLoansResult[0]?.total || 0;

    // Total active loans
    const [totalActiveLoansResult] = await pool.query(
      "SELECT COUNT(*) as total FROM loans WHERE status = 'Active'"
    );
    const totalActiveLoans = totalActiveLoansResult[0]?.total || 0;

    // Total loan amount
    const [totalLoanAmountResult] = await pool.query("SELECT SUM(amount) as total FROM loans");
    const totalLoanAmount = totalLoanAmountResult[0]?.total || 0;

    // Total repayments
    const [totalRepaymentsResult] = await pool.query("SELECT COUNT(*) as total FROM loan_repayments");
    const totalRepayments = totalRepaymentsResult[0]?.total || 0;

    // Total repaid amount
    const [totalRepaymentAmountResult] = await pool.query(
      "SELECT SUM(amount_paid) as total FROM loan_repayments"
    );
    const totalRepaymentAmount = totalRepaymentAmountResult[0]?.total || 0;

    // Total customers
    const [totalCustomersResult] = await pool.query("SELECT COUNT(*) as total FROM customers");
    const totalCustomers = totalCustomersResult[0]?.total || 0;

    // Total collaterals
    const [totalCollateralsResult] = await pool.query("SELECT COUNT(*) as total FROM collateral");
    const totalCollaterals = totalCollateralsResult[0]?.total || 0;

    // Total estimated collateral value
    const [totalEstimatedCollateralValueResult] = await pool.query(
      "SELECT SUM(estimated_value) as total FROM collateral"
    );
    const totalEstimatedCollateralValue = totalEstimatedCollateralValueResult[0]?.total || 0;

    // Total staff
    const [totalStaffResult] = await pool.query("SELECT COUNT(*) as total FROM staff");
    const totalStaff = totalStaffResult[0]?.total || 0;

    // Total complaints
    const [totalComplaintsResult] = await pool.query("SELECT COUNT(*) as total FROM complaints");
    const totalComplaints = totalComplaintsResult[0]?.total || 0;

    res.json({
      success: true,
      totalLoans,
      totalActiveLoans,
      totalLoanAmount,
      totalRepayments,
      totalRepaymentAmount,
      totalCustomers,
      totalCollaterals,
      totalEstimatedCollateralValue,
      totalStaff,
      totalComplaints,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
