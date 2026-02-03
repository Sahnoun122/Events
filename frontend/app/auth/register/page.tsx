"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function RegisterPage() {
  const authContext = useAuth();
  
  if (!authContext) {
    return <div>Loading...</div>;
  }
  
  const { register } = authContext;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.fullName || !form.email || !form.password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    if (form.password.length < 6) {
      setError("Mot de passe minimum 6 caractères");
      return;
    }

    try {
      setLoading(true);
      await register(form.fullName, form.email, form.password);
    } catch (err) {
      setError("Erreur lors de l’inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="fullName">Nom complet</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Inscription..." : "Créer un compte"}
        </button>
      </form>
    </section>
  );
}
