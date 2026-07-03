import { FiArrowUpRight, FiCreditCard, FiDollarSign, FiPieChart, FiTrendingUp } from "react-icons/fi";

const formatCurrency = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "GNF",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const compactCurrency = (value) =>
  new Intl.NumberFormat("fr-FR", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number(value || 0));

const categoryColors = {
  Alimentation: "bg-violet-600",
  Transport: "bg-indigo-500",
  Santé: "bg-blue-500",
  Internet: "bg-cyan-500",
  Loyer: "bg-emerald-500",
  Éducation: "bg-amber-500",
  Loisirs: "bg-pink-500",
  Shopping: "bg-fuchsia-500",
  Autres: "bg-slate-500"
};

const MiniMetric = ({ label, value, tone }) => (
  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
    <p className="text-[11px] font-semibold text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    <p className={`mt-2 text-[10px] font-bold ${tone || "text-emerald-600"}`}>Mis à jour automatiquement</p>
  </div>
);

const BudgetRow = ({ title, value, limit, color, badge }) => {
  const percent = Math.min(100, Math.round((Number(value || 0) / Number(limit || 1)) * 100));

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-lg font-black text-slate-950">
            {compactCurrency(value)} <span className="text-slate-400">/ {compactCurrency(limit)}</span>
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${badge.className}`}>{badge.label}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-[11px] font-semibold text-slate-500">{percent}% du budget utilisé</p>
    </div>
  );
};

const CashFlowTrend = ({ expenses }) => {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const monthly = Array.from({ length: 12 }, () => 0);

  expenses.forEach((expense) => {
    const month = new Date(expense.date).getMonth();
    if (!Number.isNaN(month)) monthly[month] += Number(expense.amount || 0);
  });

  const max = Math.max(...monthly, 1);

  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100 lg:col-span-2">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">Cash Flow Trend</h2>
          <p className="text-xs font-semibold text-slate-500">Dépenses mensuelles</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1 text-violet-700"><span className="h-2 w-2 rounded-full bg-violet-600" /> Dépense</span>
          <span className="rounded-full bg-slate-950 px-3 py-1.5 text-white">1Y</span>
        </div>
      </div>
      <div className="flex h-56 items-end gap-2 overflow-hidden rounded-3xl bg-gradient-to-t from-violet-50 to-white px-3 pt-4">
        {monthly.map((value, index) => {
          const height = Math.max(8, Math.round((value / max) * 100));
          return (
            <div key={months[index]} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-44 w-full items-end">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-violet-700 to-violet-300 transition-all duration-500"
                  style={{ height: `${height}%`, opacity: value ? 1 : 0.22 }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400">{months[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatsCards = ({ summary, expenses = [] }) => {
  const categoryCounts = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxCategory = Math.max(...categories.map(([, count]) => count), 1);
  const budgetLimit = Math.max(summary.totalExpense * 1.35, summary.totalExpense + summary.highestExpense, 1);

  return (
    <section className="grid gap-5 lg:grid-cols-[1.35fr_1fr_0.7fr]">
      <div className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-500">Total Balance</p>
            <h2 className="mt-4 break-words text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {formatCurrency(summary.totalExpense)}
            </h2>
            <p className="mt-3 flex items-center gap-1 text-xs font-black text-emerald-600">
              <FiArrowUpRight className="h-4 w-4" />
              Synthèse actualisée depuis MongoDB
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 ring-1 ring-slate-100">
            <FiCreditCard className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <MiniMetric label="Nombre de dépenses" value={summary.count || 0} />
          <MiniMetric label="Dépense moyenne" value={formatCurrency(summary.averageExpense)} tone="text-red-500" />
          <MiniMetric label="Plus grosse dépense" value={formatCurrency(summary.highestExpense)} />
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">Budget Overview</h2>
            <p className="text-xs font-semibold text-slate-500">Suivi rapide du budget</p>
          </div>
          <span className="text-xs font-black text-violet-600">See All</span>
        </div>
        <div className="space-y-3">
          <BudgetRow
            title="Budget mensuel"
            value={summary.totalExpense}
            limit={budgetLimit}
            color="bg-violet-600"
            badge={{ label: "À surveiller", className: "bg-amber-50 text-amber-600" }}
          />
          <BudgetRow
            title="Plus grosse opération"
            value={summary.highestExpense}
            limit={budgetLimit}
            color="bg-emerald-500"
            badge={{ label: "On track", className: "bg-emerald-50 text-emerald-600" }}
          />
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-950">Spending by Category</h2>
            <p className="text-xs font-semibold text-slate-500">Distribution mensuelle</p>
          </div>
          <FiPieChart className="h-5 w-5 text-violet-600" />
        </div>
        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">Aucune catégorie</p>
          ) : (
            categories.map(([category, count]) => (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>{category}</span>
                  <span>{Math.round((count / maxCategory) * 100)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${categoryColors[category] || "bg-violet-600"}`}
                    style={{ width: `${Math.max(12, (count / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CashFlowTrend expenses={expenses} />

      <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-soft">
        <div className="flex h-full min-h-56 flex-col justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <FiDollarSign className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-black">Catégorie favorite</h2>
            <p className="mt-2 text-sm text-slate-300">La catégorie la plus utilisée dans la sélection actuelle.</p>
          </div>
          <div className="mt-8">
            <p className="text-3xl font-semibold">{summary.topCategory || "Aucune"}</p>
            <p className="mt-2 flex items-center gap-1 text-xs font-bold text-violet-200">
              <FiTrendingUp className="h-4 w-4" />
              Analyse instantanée
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { formatCurrency };
export default StatsCards;
