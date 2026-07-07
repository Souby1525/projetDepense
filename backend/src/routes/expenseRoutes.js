import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createExpense,
  deleteExpense,
  getExpenseSummary,
  getExpenses,
  updateExpense
} from "../controllers/expenseController.js";

const router = express.Router();

// Toutes les routes expenses nécessitent une authentification
router.use(protect);

router.get("/", getExpenses);
router.get("/summary", getExpenseSummary);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
