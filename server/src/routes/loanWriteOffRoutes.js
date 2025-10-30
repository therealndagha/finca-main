
import express from "express";
import {
  getLoanWriteoffs,
  getLoanWriteoffById,
  createLoanWriteoff,
  updateLoanWriteoff,
  deleteLoanWriteoff,
} from "../controllers/loanWriteOffController.js";

const router = express.Router();

router.get("/", getLoanWriteoffs);
router.get("/:id", getLoanWriteoffById);
router.post("/", createLoanWriteoff);
router.put("/:id", updateLoanWriteoff);
router.delete("/:id", deleteLoanWriteoff);

export default router;
