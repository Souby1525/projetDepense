import Expense from "../models/Expense.js";
import { isValidObjectId, normalizePaymentMethod, validateExpensePayload } from "../utils/validators.js";

const buildExpenseFilter = (query) => {
  const { search, category, startDate, endDate } = query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [{ description: searchRegex }, { note: searchRegex }, { category: searchRegex }];
  }

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  return filter;
};

export const getExpenses = async (req, res, next) => {
  try {
    const filter = buildExpenseFilter(req.query);
    if (req.user && req.user.id) {
      filter.owner = req.user.id;
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });

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
    const filter = buildExpenseFilter(req.query);
    if (req.user && req.user.id) {
      filter.owner = req.user.id;
    }
    const matchStage = Object.keys(filter).length ? [{ $match: filter }] : [];

    const [summary] = await Expense.aggregate([
      ...matchStage,
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
      ...matchStage,
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

    const expenseData = {
      date: req.body.date,
      category: req.body.category,
      description: req.body.description,
      amount: Number(req.body.amount),
      paymentMethod: normalizePaymentMethod(req.body.paymentMethod),
      note: req.body.note || ""
    };

    if (req.user && req.user.id) {
      expenseData.owner = req.user.id;
    }

    const expense = await Expense.create(expenseData);

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

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      res.status(404);
      throw new Error("Dépense introuvable");
    }

    if (!expense.owner || !req.user || String(expense.owner) !== String(req.user.id)) {
      res.status(403);
      throw new Error("Action non autorisée");
    }

    expense.date = req.body.date;
    expense.category = req.body.category;
    expense.description = req.body.description;
    expense.amount = Number(req.body.amount);
    expense.paymentMethod = normalizePaymentMethod(req.body.paymentMethod);
    expense.note = req.body.note || "";

    await expense.save();

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

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      res.status(404);
      throw new Error("Dépense introuvable");
    }

    if (!expense.owner || !req.user || String(expense.owner) !== String(req.user.id)) {
      res.status(403);
      throw new Error("Action non autorisée");
    }

    await expense.deleteOne();

    res.json({
      success: true,
      message: "Dépense supprimée avec succès"
    });
  } catch (error) {
    next(error);
  }
};
