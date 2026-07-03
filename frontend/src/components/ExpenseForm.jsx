import { FiCheck, FiPlus, FiRotateCcw } from "react-icons/fi";
import { categories, fieldClass } from "./Filters.jsx";

const paymentMethods = ["Espèces", "Orange Money", "Wave", "Carte Bancaire", "Virement"];

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  category: "Alimentation",
  description: "",
  amount: "",
  paymentMethod: "Espèces",
  note: ""
};

const ExpenseForm = ({ form, setForm, onSubmit, editingId, onCancel, saving }) => {
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <section className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-950">{editingId ? "Modifier la dépense" : "Ajouter une dépense"}</h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">Formulaire rapide, prêt pour mobile.</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          {editingId ? <FiCheck className="h-5 w-5" /> : <FiPlus className="h-5 w-5" />}
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Date</span>
          <input type="date" name="date" value={form.date} onChange={handleChange} className={fieldClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Catégorie</span>
          <select name="category" value={form.category} onChange={handleChange} className={fieldClass} required>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-black uppercase text-slate-500">Description</span>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            className={fieldClass}
            placeholder="Ex: Courses du marché"
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Montant</span>
          <input
            type="number"
            min="1"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className={fieldClass}
            placeholder="1250000"
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Paiement</span>
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={fieldClass} required>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-black uppercase text-slate-500">Note</span>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className={`${fieldClass} min-h-24 resize-y`}
            placeholder="Détail facultatif..."
          />
        </label>
        <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {editingId ? <FiCheck className="h-5 w-5" /> : <FiPlus className="h-5 w-5" />}
            {saving ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
            >
              <FiRotateCcw className="h-5 w-5" />
              Annuler
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export { emptyForm, paymentMethods };
export default ExpenseForm;
