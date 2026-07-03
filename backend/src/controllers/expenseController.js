import Expense from "../models/Expense.js";
import {
  buildExpenseQuery,
  isValidObjectId,
  validateExpensePayload
} from "../utils/validators.js";

export const getExpenses = async (req, res, next) => {
  try {
    const filters = buildExpenseQuery(req.query);
    const expenses = await Expense.find(filters).sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseSummary = async (req, res, next) => {
  try {
    const filters = buildExpenseQuery(req.query);

    const [summary] = await Expense.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
          averageExpense: { $avg: "$amount" },
          highestExpense: { $max: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0 } }
    ]);

    const [topCategory] = await Expense.aggregate([
      { $match: filters },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 1 }
    ]);

    res.json({
      success: true,
      data: {
        totalExpense: summary?.totalExpense || 0,
        averageExpense: Math.round(summary?.averageExpense || 0),
        highestExpense: summary?.highestExpense || 0,
        count: summary?.count || 0,
        topCategory: topCategory?._id || "Aucune"
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const errors = validateExpensePayload(req.body);

    if (errors.length) {
      res.status(400);
      throw new Error(errors.join(", "));
    }

    const expense = await Expense.create({
      ...req.body,
      amount: Number(req.body.amount)
    });

    res.status(201).json({
      success: true,
      message: "Dépense ajoutée avec succès",
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Identifiant invalide");
    }

    const errors = validateExpensePayload(req.body);

    if (errors.length) {
      res.status(400);
      throw new Error(errors.join(", "));
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { ...req.body, amount: Number(req.body.amount) },
      { new: true, runValidators: true }
    );

    if (!expense) {
      res.status(404);
      throw new Error("Dépense introuvable");
    }

    res.json({
      success: true,
      message: "Dépense modifiée avec succès",
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Identifiant invalide");
    }

    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error("Dépense introuvable");
    }

    res.json({
      success: true,
      message: "Dépense supprimée avec succès"
    });
  } catch (error) {
    next(error);
  }
};
