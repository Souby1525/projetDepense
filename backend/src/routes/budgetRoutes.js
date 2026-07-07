import express from "express";
import { getBudget, getBudgetProgress, upsertBudget } from "../controllers/budgetController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getBudget);
router.get("/progress", getBudgetProgress);
router.post("/", upsertBudget);

export default router;
