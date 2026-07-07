import express from "express";
import { getBudget, getBudgetProgress, upsertBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.get("/", getBudget);
router.get("/progress", getBudgetProgress);
router.post("/", upsertBudget);

export default router;
