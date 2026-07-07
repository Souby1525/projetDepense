import mongoose from "mongoose";

const paymentMethodAliases = {
  Especes: "Espèces",
  "Espèces": "Espèces",
  "EspÃ¨ces": "Espèces",
  "Orange Money": "Orange Money",
  Wave: "Wave",
  Virement: "Virement"
};

export const paymentMethods = ["Espèces", "Orange Money", "Wave", "Virement"];

export const normalizePaymentMethod = (paymentMethod) => {
  if (!paymentMethod) return "";
  return paymentMethodAliases[String(paymentMethod).trim()] || String(paymentMethod).trim();
};

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateExpensePayload = (payload) => {
  const errors = [];
  const { date, category, description, amount, note } = payload;
  const paymentMethod = normalizePaymentMethod(payload.paymentMethod);

  if (!date || Number.isNaN(Date.parse(date))) {
    errors.push("La date est obligatoire et doit être valide");
  }

  if (!category || category.trim().length < 2) {
    errors.push("La catégorie doit contenir au moins 2 caractères");
  }

  if (category && category.length > 80) {
    errors.push("La catégorie ne peut pas dépasser 80 caractères");
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

  if (!paymentMethods.includes(paymentMethod)) {
    errors.push("Le moyen de paiement est obligatoire et doit être valide");
  }

  if (note && note.length > 500) {
    errors.push("La note ne peut pas dépasser 500 caractères");
  }

  return errors;
};
