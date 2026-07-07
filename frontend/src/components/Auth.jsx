import { useState } from "react";
import api, { setAuthToken } from "../api/axios.js";

const Auth = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const path = mode === "register" ? "/auth/register" : "/auth/login";
      const payload = mode === "register" ? { name, email, password } : { email, password };
      const res = await api.post(path, payload);
      const { token, user } = res.data.data;
      setAuthToken(token);
      onAuth({ token, user });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-md rounded-lg bg-white p-4 shadow-soft sm:mt-12 sm:p-6">
      <h2 className="text-lg font-black text-slate-950">{mode === "register" ? "Créer un compte" : "Se connecter"}</h2>
      <p className="mt-1 text-xs text-slate-500">Accédez à votre espace personnel.</p>

      <form onSubmit={submit} className="mt-4 grid gap-3">
        {mode === "register" && (
          <label className="space-y-1">
            <span className="text-xs font-black uppercase text-slate-500">Nom</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border-0 bg-slate-100 px-4 py-3" required />
          </label>
        )}
        <label className="space-y-1">
          <span className="text-xs font-black uppercase text-slate-500">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-lg border-0 bg-slate-100 px-4 py-3" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-black uppercase text-slate-500">Mot de passe</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-lg border-0 bg-slate-100 px-4 py-3" required />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="submit" disabled={loading} className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-white">{loading ? "Traitement..." : mode === "register" ? "S'inscrire" : "Se connecter"}</button>
          <button type="button" onClick={() => setMode(mode === "register" ? "login" : "register")} className="rounded-lg bg-slate-100 px-4 py-2">{mode === "register" ? "J'ai déjà un compte" : "Créer un compte"}</button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
