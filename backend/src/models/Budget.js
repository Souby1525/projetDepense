import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [true, "Le mois est obligatoire"],
      trim: true,
      match: [/^\d{4}-\d{2}$/, "Le mois doit être au format YYYY-MM"],
      unique: true
    },
    amount: {
      type: Number,
      required: [true, "Le montant du budget est obligatoire"],
      min: [0, "Le montant du budget doit être positif"]
    }
  },
  {
    timestamps: true
  }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
