import { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCcw, FiDownload } from "react-icons/fi";
import api, { setAuthToken } from "./api/axios.js";
import ExpenseForm, { emptyForm } from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Loader from "./components/Loader.jsx";
import StatsCards from "./components/StatsCards.jsx";
import BudgetCard from "./components/BudgetCard.jsx";
import Auth from "./components/Auth.jsx";
import Profile from "./components/Profile.jsx";
import Toast from "./components/Toast.jsx";

const initialSummary = {
  totalExpense: 0,
  averageExpense: 0,
  highestExpense: 0,
  count: 0,
  topCategory: "Aucune"
};

const initialBudgetProgress = {
  month: new Date().toISOString().slice(0, 7),
  budgetAmount: 0,
  totalExpense: 0,
  progress: 0,
  warningLevel: "normal",
  count: 0
};


const toDateInputValue = (date) => new Date(date).toISOString().slice(0, 10);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [budgetProgress, setBudgetProgress] = useState(initialBudgetProgress);
  const [showProfile, setShowProfile] = useState(false);
  const [auth, setAuth] = useState(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return { token, user: null };
  });

  // apply token to axios if present
  useEffect(() => {
    if (auth.token) setAuthToken(auth.token);
  }, [auth.token]);

  const queryParams = useMemo(() => ({}), []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [expensesResponse, summaryResponse, budgetProgressResponse] = await Promise.all([
        api.get("/expenses", { params: queryParams }),
        api.get("/expenses/summary", { params: queryParams }),
        api.get("/budget/progress")
      ]);

      setExpenses(expensesResponse.data.data || []);
      setSummary(summaryResponse.data.data || initialSummary);
      setBudgetProgress(budgetProgressResponse.data.data || initialBudgetProgress);
    } catch (error) {
      showToast(error.response?.data?.message || "Impossible de charger les données", "error");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  const exportToPDF = async () => {
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable")
    ]);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Export des dépenses", 14, 18);

    const columns = ["Date", "Catégorie", "Description", "Montant", "Paiement"];
    const rows = expenses.map((e) => [toDateInputValue(e.date) || e.date, e.category || "", e.description || "", Number(e.amount) || 0, e.paymentMethod || ""]);

    autoTable(doc, {
      startY: 24,
      head: [columns],
      body: rows,
      styles: { fontSize: 10 }
    });

    // Calculer la somme totale
    const total = rows.reduce((sum, r) => sum + (Number(r[3]) || 0), 0);

    // Ajouter une ligne de total sous le tableau
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY || 24 : 24;
    doc.setFontSize(12);
    doc.text(`Total dépensé: ${total.toLocaleString()} GNF`, 14, finalY + 10);

    // Vérifier les dépassements par jour (seuil = 1 000 000)
    const threshold = 1000000;
    const byDate = rows.reduce((acc, r) => {
      const date = r[0] || "Inconnu";
      acc[date] = (acc[date] || 0) + Number(r[3] || 0);
      return acc;
    }, {});

    const exceeded = Object.entries(byDate).filter(([, sum]) => sum > threshold);
    if (exceeded.length > 0) {
      const messages = exceeded.map(([d, s]) => `${d}: ${Number(s).toLocaleString()} GNF`).join("\n");
      const alertText = `Attention — journées dépassant ${threshold.toLocaleString()} GNF:\n${messages}`;

      // Notification système (Notification API) si disponible
      if (typeof Notification !== "undefined") {
        if (Notification.permission === "granted") {
          new Notification("Dépassement seuil", { body: messages });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification("Dépassement seuil", { body: messages });
            } else {
              window.alert(alertText);
            }
          }).catch(() => {
            window.alert(alertText);
          });
        } else {
          // permission denied
          window.alert(alertText);
        }
      } else {
        // fallback
        window.alert(alertText);
      }

      // Ajouter section dans le PDF indiquant les dépassements
      doc.setFontSize(11);
      doc.text("Jours dépassant le seuil:", 14, finalY + 20);
      let y = finalY + 26;
      exceeded.forEach(([d, s]) => {
        doc.text(`- ${d}: ${Number(s).toLocaleString()} GNF`, 14, y);
        y += 6;
      });
    }

    const filename = `depenses_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
  };

  useEffect(() => {
    // si non authentifié, ne pas fetcher les données privées
    if (!auth.token) return;
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!auth.token) return;
      try {
        const res = await api.get("/auth/me");
        setAuth((a) => ({ ...a, user: res.data.data }));
      } catch (e) {
        // token invalide
        setAuth({ token: null, user: null });
      }
    };
    initializeAuth();
  }, [auth.token]);

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

  const saveBudget = async (budget) => {
    setSaving(true);
    try {
      const response = await api.post("/budget", budget);
      setBudgetProgress((prev) => ({ ...prev, ...response.data.data }));
      showToast("Budget enregistré avec succès");
      await fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Impossible d'enregistrer le budget", "error");
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

  const logout = () => {
    setAuthToken(null);
    setAuth({ token: null, user: null });
    setExpenses([]);
    setSummary(initialSummary);
    setBudgetProgress(initialBudgetProgress);
    showToast("Déconnecté", "success");
  };

  return (
    <main className="min-h-screen bg-[#f7f7fb] text-slate-950">
      <Toast toast={toast} />
      {!auth.token ? (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <Auth
            onAuth={({ token, user }) => {
              setAuth({ token, user });
              setAuthToken(token);
              fetchData();
            }}
          />
        </div>
      ) : (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-3 sm:px-6 lg:px-8">
        <nav className="flex flex-col gap-3 rounded-lg bg-white/90 px-3 py-3 shadow-sm ring-1 ring-slate-200/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-black text-white">
              D
            </div>
            <span className="truncate text-lg font-black tracking-tight">Dépenses</span>
          </div>
          <div className="hidden items-center rounded-lg bg-slate-100 p-1 text-xs font-bold text-slate-500 lg:flex">
            <span className="rounded-md bg-slate-950 px-4 py-2 text-white shadow-sm">Gestion des dépenses</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setShowProfile((s) => !s)}
              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200"
            >
              Profil
            </button>
            <span className="max-w-[11rem] truncate text-sm font-bold text-slate-700 sm:max-w-[14rem]">{auth.user?.name || auth.user?.email}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100"
            >
              Déconnexion
            </button>
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
          <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
            <button
              type="button"
                onClick={fetchData}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <FiRefreshCcw className="h-4 w-4" />
              Actualiser
            </button>
              <button
                type="button"
                onClick={exportToPDF}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                <FiDownload className="h-4 w-4" />
                Exporter PDF
              </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 420, behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
            >
              <FiPlus className="h-4 w-4" />
              Ajouter une dépense
            </button>
          </div>
        </header>

        <StatsCards summary={summary} expenses={expenses} />

        <BudgetCard budgetProgress={budgetProgress} onSaveBudget={saveBudget} saving={saving} />

        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            {showProfile && (
              <Profile
                authUser={auth.user}
                onUpdate={(user) => setAuth((a) => ({ ...a, user }))}
                showToast={showToast}
              />
            )}
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
      )}
    </main>
  );
}

export default App;
