import mongoose from "mongoose";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getOwnerId = (req) => new mongoose.Types.ObjectId(req.user.id);

export const getBudget = async (req, res, next) => {
  try {
    const month = req.query.month || getCurrentMonthKey();
    const owner = getOwnerId(req);
    const budget = await Budget.findOne({ month, owner });

    res.json({
      success: true,
      data: budget || { month, amount: 0 }
    });
  } catch (error) {
    next(error);
  }
};

export const upsertBudget = async (req, res, next) => {
  try {
    const { month, amount } = req.body;
    const owner = getOwnerId(req);

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      res.status(400);
      throw new Error("Le mois doit être au format YYYY-MM");
    }

    if (amount === undefined || Number(amount) < 0) {
      res.status(400);
      throw new Error("Le montant du budget doit être un nombre positif");
    }

    const budget = await Budget.findOneAndUpdate(
      { month, owner },
      { amount: Number(amount), owner },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: "Budget enregistré avec succès",
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgetProgress = async (req, res, next) => {
  try {
    const month = req.query.month || getCurrentMonthKey();
    const owner = getOwnerId(req);
    const budget = await Budget.findOne({ month, owner });
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setMilliseconds(end.getMilliseconds() - 1);

    const [summary] = await Expense.aggregate([
      {
        $match: {
          owner,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalExpense = summary?.totalExpense || 0;
    const budgetAmount = budget?.amount || 0;
    const progress = budgetAmount > 0 ? Math.min((totalExpense / budgetAmount) * 100, 100) : 0;
    const warningLevel = budgetAmount > 0 ? (progress >= 100 ? "danger" : progress >= 80 ? "warning" : "normal") : "normal";

    res.json({
      success: true,
      data: {
        month,
        budgetAmount,
        totalExpense,
        progress: Math.round(progress),
        warningLevel,
        count: summary?.count || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
