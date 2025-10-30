import express from "express";
import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
} from "../controllers/loan-products-controllers.js";

const router = express.Router();

router.get("/", getAllLoans);
router.get("/:id", getLoanById);
router.post("/", createLoan);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);

export default router;
