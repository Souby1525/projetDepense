import mongoose from "mongoose";
import { CATEGORIES, PAYMENT_METHODS } from "../models/Expense.js";

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateExpensePayload = (payload) => {
  const errors = [];
  const { date, category, description, amount, paymentMethod, note } = payload;

  if (!date || Number.isNaN(Date.parse(date))) {
    errors.push("La date est obligatoire et doit être valide");
  }

  if (!CATEGORIES.includes(category)) {
    errors.push("La catégorie est invalide");
  }

  if (!description || description.trim().length < 2) {
    errors.push("La description doit contenir au moins 2 caractères");
  }

  if (description && description.length > 140) {
    errors.push("La description ne peut pas dépasser 140 caractères");
  }

  if (amount === undefined || Number(amount) <= 0) {
    errors.push("Le montant doit être supérieur à 0");
  }

  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    errors.push("Le mode de paiement est invalide");
  }

  if (note && note.length > 500) {
    errors.push("La note ne peut pas dépasser 500 caractères");
  }

  return errors;
};

export const buildExpenseQuery = (query) => {
  const filters = {};
  const { search, category, startDate, endDate } = query;

  if (category && CATEGORIES.includes(category)) {
    filters.category = category;
  }

  if (startDate || endDate) {
    filters.date = {};

    if (startDate && !Number.isNaN(Date.parse(startDate))) {
      filters.date.$gte = new Date(startDate);
    }

    if (endDate && !Number.isNaN(Date.parse(endDate))) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filters.date.$lte = end;
    }
  }

  if (search?.trim()) {
    filters.$or = [
      { description: { $regex: search.trim(), $options: "i" } },
      { note: { $regex: search.trim(), $options: "i" } },
      { paymentMethod: { $regex: search.trim(), $options: "i" } }
    ];
  }

  return filters;
};
