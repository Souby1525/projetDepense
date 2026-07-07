import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export const getBudget = async (req, res, next) => {
  try {
    const month = req.query.month || getCurrentMonthKey();
    const budget = await Budget.findOne({ month });

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

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      res.status(400);
      throw new Error("Le mois doit être au format YYYY-MM");
    }

    if (amount === undefined || Number(amount) < 0) {
      res.status(400);
      throw new Error("Le montant du budget doit être un nombre positif");
    }

    const budget = await Budget.findOneAndUpdate(
      { month },
      { amount: Number(amount) },
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
    const budget = await Budget.findOne({ month });
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setMilliseconds(end.getMilliseconds() - 1);

    const [summary] = await Expense.aggregate([
      {
        $match: {
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
