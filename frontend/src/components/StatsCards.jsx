import { FiActivity, FiBarChart2, FiGrid, FiPieChart, FiTrendingUp } from "react-icons/fi";

const formatCurrency = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "GNF",
    maximumFractionDigits: 0
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

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg bg-white p-4 shadow-soft ring-1 ring-slate-100">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-xs font-bold text-slate-500">{label}</p>
    <p className="mt-1 break-words text-xl font-black text-slate-950">{value}</p>
  </div>
);

const StatsCards = ({ summary, expenses = [] }) => {
  const categoryCounts = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxCategory = Math.max(...categories.map(([, count]) => count), 1);

  return (
    <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-lg bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total des dépenses</p>
            <h2 className="mt-4 break-words text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {formatCurrency(summary.totalExpense)}
            </h2>
            <p className="mt-3 text-xs font-black text-emerald-600">Données synchronisées avec MongoDB</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
            <FiTrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatItem icon={FiGrid} label="Nombre de dépenses" value={summary.count || 0} />
          <StatItem icon={FiBarChart2} label="Dépense moyenne" value={formatCurrency(summary.averageExpense)} />
          <StatItem icon={FiTrendingUp} label="Plus grosse dépense" value={formatCurrency(summary.highestExpense)} />
          <StatItem icon={FiActivity} label="Catégorie la plus utilisée" value={summary.topCategory || "Aucune"} />
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-950">Dépenses par catégorie</h2>
            <p className="text-xs font-semibold text-slate-500">Répartition de la liste actuelle</p>
          </div>
          <FiPieChart className="h-5 w-5 text-violet-600" />
        </div>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">Aucune dépense</p>
          ) : (
            categories.map(([category, count]) => (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>{category}</span>
                  <span>{count}</span>
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
    </section>
  );
};

export { formatCurrency };
export default StatsCards;
