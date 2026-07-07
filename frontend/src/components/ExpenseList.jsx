import { FiCalendar, FiCreditCard, FiEdit3, FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "./StatsCards.jsx";

const formatDate = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));

const categoryTone = {
  Alimentation: "bg-violet-50 text-violet-700",
  Transport: "bg-indigo-50 text-indigo-700",
  Santé: "bg-blue-50 text-blue-700",
  Internet: "bg-cyan-50 text-cyan-700",
  Loyer: "bg-emerald-50 text-emerald-700",
  Éducation: "bg-amber-50 text-amber-700",
  Loisirs: "bg-pink-50 text-pink-700",
  Shopping: "bg-fuchsia-50 text-fuchsia-700",
  Autres: "bg-slate-100 text-slate-700"
};

const ExpenseList = ({ expenses, onEdit, onDelete }) => (
  <section className="rounded-lg bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:p-5">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-black text-slate-950">Transactions récentes</h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">Dernières dépenses enregistrées</p>
      </div>
      <span className="shrink-0 text-xs font-black text-violet-600">Voir tout</span>
    </div>

    {expenses.length === 0 ? (
      <div className="rounded-lg bg-slate-50 p-8 text-center ring-1 ring-slate-100">
        <p className="text-lg font-black text-slate-950">Aucune dépense trouvée</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">Ajoutez une dépense ou ajustez les filtres.</p>
      </div>
    ) : (
      <div className="overflow-hidden">
        <div className="hidden rounded-lg bg-slate-50 px-4 py-3 text-[11px] font-black uppercase text-slate-400 md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_auto]">
          <span>Description</span>
          <span>Catégorie</span>
          <span>Date</span>
          <span>Montant</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="mt-2 space-y-2">
          {expenses.map((expense) => (
            <article
              key={expense._id}
              className="animate-fadeUp rounded-lg border border-slate-100 bg-white p-4 transition duration-200 hover:bg-slate-50 md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_auto] md:items-center md:gap-3"
            >
              <div className="min-w-0">
                <h3 className="break-words text-sm font-black text-slate-950">{expense.description}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <FiCreditCard className="h-3.5 w-3.5 text-violet-500" />
                  {expense.paymentMethod}
                </p>
                {expense.note && <p className="mt-2 break-words text-xs text-slate-400 md:hidden">{expense.note}</p>}
              </div>

              <div className="mt-4 md:mt-0">
                <span className={`inline-flex max-w-full break-words rounded-lg px-3 py-1 text-[11px] font-black ${categoryTone[expense.category] || categoryTone.Autres}`}>
                  {expense.category}
                </span>
              </div>

              <p className="mt-3 flex items-center gap-1 text-xs font-bold text-slate-500 md:mt-0">
                <FiCalendar className="h-3.5 w-3.5 text-violet-500" />
                {formatDate(expense.date)}
              </p>

              <p className="mt-3 text-lg font-black text-emerald-600 md:mt-0 md:text-sm">{formatCurrency(expense.amount)}</p>

              <div className="mt-4 flex gap-2 md:mt-0 md:justify-end">
                <button
                  type="button"
                  onClick={() => onEdit(expense)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
                  title="Modifier"
                  aria-label="Modifier"
                >
                  <FiEdit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(expense._id)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                  title="Supprimer"
                  aria-label="Supprimer"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    )}
  </section>
);

export default ExpenseList;
