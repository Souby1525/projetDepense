import { useState, useEffect } from "react";
import api from "../api/axios.js";

const Profile = ({ authUser, onUpdate, showToast }) => {
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(authUser?.name || "");
    setEmail(authUser?.email || "");
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name };
      if (email) payload.email = email;
      if (password) payload.password = password;
      const res = await api.put("/auth/me", payload);
      onUpdate(res.data.data);
      showToast(res.data.message || "Profil mis à jour", "success");
      setPassword("");
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <h2 className="text-xl font-black text-slate-950">Profil</h2>
      <p className="mt-1 text-xs text-slate-500">Modifie ton nom ou ton mot de passe.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-black uppercase text-slate-500">Nom</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border-0 bg-slate-100 px-4 py-3" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-black uppercase text-slate-500">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-2xl border-0 bg-slate-100 px-4 py-3" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-black uppercase text-slate-500">Nouveau mot de passe</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-2xl border-0 bg-slate-100 px-4 py-3" />
        </label>

        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" disabled={loading} className="flex-1 rounded-full bg-violet-600 px-4 py-2 text-white">{loading ? "Enregistrement..." : "Enregistrer"}</button>
        </div>
      </form>
    </section>
  );
};

export default Profile;
