import mongoose from "mongoose";

export const CATEGORIES = [
  "Alimentation",
  "Transport",
  "Santé",
  "Internet",
  "Loyer",
  "Éducation",
  "Loisirs",
  "Shopping",
  "Autres"
];

export const PAYMENT_METHODS = [
  "Espèces",
  "Orange Money",
  "Wave",
  "Carte Bancaire",
  "Virement"
];

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "La date est obligatoire"]
    },
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
      enum: {
        values: CATEGORIES,
        message: "Catégorie invalide"
      }
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      trim: true,
      minlength: [2, "La description doit contenir au moins 2 caractères"],
      maxlength: [140, "La description ne peut pas dépasser 140 caractères"]
    },
    amount: {
      type: Number,
      required: [true, "Le montant est obligatoire"],
      min: [1, "Le montant doit être supérieur à 0"]
    },
    paymentMethod: {
      type: String,
      required: [true, "Le mode de paiement est obligatoire"],
      enum: {
        values: PAYMENT_METHODS,
        message: "Mode de paiement invalide"
      }
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "La note ne peut pas dépasser 500 caractères"],
      default: ""
    }
  },
  {
    timestamps: true
  }
);

expenseSchema.index({ description: "text", note: "text", category: "text" });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
