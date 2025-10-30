import express from "express";
import {
  getLoanInsurances,
  getLoanInsuranceById,
  createLoanInsurance,
  updateLoanInsurance,
  deleteLoanInsurance,
} from "../controllers/loanInsuranceControllers.js";

const router = express.Router();

router.get("/", getLoanInsurances);
router.get("/:id", getLoanInsuranceById);
router.post("/", createLoanInsurance);
router.put("/:id", updateLoanInsurance);
router.delete("/:id", deleteLoanInsurance);

export default router;
