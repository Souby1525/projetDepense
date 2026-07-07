import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "La date est obligatoire"]
    },
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
      trim: true,
      minlength: [2, "La catégorie doit contenir au moins 2 caractères"],
      maxlength: [80, "La catégorie ne peut pas dépasser 80 caractères"]
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
      required: [true, "Le moyen de paiement est obligatoire"],
      trim: true,
      enum: {
        values: ["Espèces", "Orange Money", "Wave", "Virement"],
        message: "Le moyen de paiement est invalide"
      },
      default: "Espèces"
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
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
