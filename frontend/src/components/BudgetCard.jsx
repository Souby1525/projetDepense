import { useEffect, useState } from "react";
import { FiDollarSign, FiSave } from "react-icons/fi";
import { formatCurrency } from "./StatsCards.jsx";

const statusStyles = {
  normal: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700"
};

const BudgetCard = ({ budgetProgress, onSaveBudget, saving }) => {
  const [month, setMonth] = useState(budgetProgress.month || "");
  const [amount, setAmount] = useState(budgetProgress.budgetAmount || "");

  useEffect(() => {
    setMonth(budgetProgress.month || month);
    setAmount(budgetProgress.budgetAmount || "");
  }, [budgetProgress]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSaveBudget({ month, amount: Number(amount) });
  };

  const statusLabel =
    budgetProgress.warningLevel === "danger"
      ? "Dépassement"
      : budgetProgress.warningLevel === "warning"
      ? "Alerte"
      : "Sous seuil";

  return (
    <section className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-950">Budget mensuel</h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">Fixez votre plafond et suivez l’avancement.</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <FiDollarSign className="h-5 w-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1.1fr_1fr_auto]">
        <label className="space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Mois</span>
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="w-full rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-4 focus:ring-violet-100"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Montant</span>
          <input
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-4 focus:ring-violet-100"
            placeholder="0"
            required
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiSave className="h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      <div className="mt-6 rounded-3xl bg-slate-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Budget pour</p>
            <p className="mt-2 text-lg font-black text-slate-950">{budgetProgress.month}</p>
          </div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusStyles[budgetProgress.warningLevel] || statusStyles.normal}`}>
            {statusLabel}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Budget défini</p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {budgetProgress.budgetAmount > 0 ? formatCurrency(budgetProgress.budgetAmount) : "Aucun budget"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dépensé</p>
            <p className="mt-2 text-lg font-black text-emerald-600">{formatCurrency(budgetProgress.totalExpense)}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-violet-600 transition-[width] duration-500"
              style={{ width: `${budgetProgress.budgetAmount > 0 ? budgetProgress.progress : 0}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{budgetProgress.budgetAmount > 0 ? `${budgetProgress.progress}% utilisé` : "Définis un budget"}</span>
            <span>{budgetProgress.budgetAmount > 0 ? formatCurrency(budgetProgress.budgetAmount - budgetProgress.totalExpense) : ""}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetCard;
