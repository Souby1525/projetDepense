import { FiFilter, FiSearch, FiX } from "react-icons/fi";

const categories = [
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

const fieldClass =
  "w-full rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-100";

const Filters = ({ filters, onChange, onReset }) => {
  const handleChange = (event) => {
    onChange({ ...filters, [event.target.name]: event.target.value });
  };

  return (
    <section className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
            <FiFilter className="h-5 w-5 text-violet-600" />
            Filtres
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">Recherche, catégorie et période</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          title="Réinitialiser"
          aria-label="Réinitialiser"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="relative sm:col-span-2">
          <FiSearch className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Rechercher une dépense..."
            className={`${fieldClass} pl-11`}
          />
        </label>
        <select name="category" value={filters.category} onChange={handleChange} className={fieldClass}>
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className={fieldClass} />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className={`${fieldClass} sm:col-span-2`} />
      </div>
    </section>
  );
};

export { categories, fieldClass };
export default Filters;
