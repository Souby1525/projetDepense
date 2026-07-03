import express from "express";
import {
  createExpense,
  deleteExpense,
  getExpenseSummary,
  getExpenses,
  updateExpense
} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", getExpenses);
router.get("/summary", getExpenseSummary);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
