// routes/repayments.js
import express from "express";
import {
  getRepayments,
  getRepaymentsByLoan,
  createRepayment,
  deleteRepayment,
} from "../controllers/repayment-controllers.js";

const router = express.Router();

router.get("/", getRepayments);
router.get("/loan/:loan_id", getRepaymentsByLoan);
router.post("/", createRepayment);
router.delete("/:id", deleteRepayment);

export default router;
