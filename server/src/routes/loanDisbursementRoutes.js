

import express from "express";
import {
  getLoanDisbursements,
  getLoanDisbursementById,
  createLoanDisbursement,
  updateLoanDisbursement,
  deleteLoanDisbursement,
} from "../controllers/loanDisbursement-controllers.js";

const router = express.Router();

router.get("/", getLoanDisbursements);
router.get("/:id", getLoanDisbursementById);
router.post("/", createLoanDisbursement);
router.put("/:id", updateLoanDisbursement);
router.delete("/:id", deleteLoanDisbursement);

export default router;
