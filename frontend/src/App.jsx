import { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCcw } from "react-icons/fi";
import api from "./api/axios.js";
import ExpenseForm, { emptyForm } from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Filters from "./components/Filters.jsx";
import Loader from "./components/Loader.jsx";
import StatsCards from "./components/StatsCards.jsx";
import Toast from "./components/Toast.jsx";

const initialSummary = {
  totalExpense: 0,
  averageExpense: 0,
  highestExpense: 0,
  count: 0,
  topCategory: "Aucune"
};

const initialFilters = {
  search: "",
  category: "",
  startDate: "",
  endDate: ""
};

const toDateInputValue = (date) => new Date(date).toISOString().slice(0, 10);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [filters, setFilters] = useState(initialFilters);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const queryParams = useMemo(() => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    return params;
  }, [filters]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [expensesResponse, summaryResponse] = await Promise.all([
        api.get("/expenses", { params: queryParams }),
        api.get("/expenses/summary", { params: queryParams })
      ]);

      setExpenses(expensesResponse.data.data || []);
      setSummary(summaryResponse.data.data || initialSummary);
    } catch (error) {
      showToast(error.response?.data?.message || "Impossible de charger les dépenses", "error");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = { ...form, amount: Number(form.amount) };

      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
        showToast("Dépense modifiée avec succès");
      } else {
        await api.post("/expenses", payload);
        showToast("Dépense ajoutée avec succès");
      }

      resetForm();
      await fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Enregistrement impossible", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      date: toDateInputValue(expense.date),
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod,
      note: expense.note || ""
    });
    window.scrollTo({ top: 360, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette dépense ?");

    if (!confirmed) return;

    try {
      await api.delete(`/expenses/${id}`);
      showToast("Dépense supprimée avec succès");
      await fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Suppression impossible", "error");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7fb] text-slate-950">
      <Toast toast={toast} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4 rounded-full bg-white/85 px-3 py-2 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white">
              D
            </div>
            <span className="text-lg font-black tracking-tight">Dépenses</span>
          </div>
          <div className="hidden items-center rounded-full bg-slate-100 p-1 text-xs font-bold text-slate-500 sm:flex">
            <span className="rounded-full bg-slate-950 px-4 py-2 text-white shadow-sm">Gestion des dépenses</span>
          </div>
        </nav>

        <header className="flex flex-col gap-4 pt-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Gestion des dépenses
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Ajoutez, modifiez, supprimez et suivez vos dépenses depuis une seule interface.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <FiRefreshCcw className="h-4 w-4" />
              Actualiser
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 420, behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
            >
              <FiPlus className="h-4 w-4" />
              Ajouter une dépense
            </button>
          </div>
        </header>

        <StatsCards summary={summary} expenses={expenses} />

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <Filters filters={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
            <ExpenseForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              editingId={editingId}
              onCancel={resetForm}
              saving={saving}
            />
          </div>
          {loading ? <Loader /> : <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />}
        </div>
      </div>
    </main>
  );
}

export default App;
