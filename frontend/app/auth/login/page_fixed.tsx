"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/participant");
      }
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'participant') => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@admin.com',
        password: 'admin123',
        rememberMe: false
      });
    } else {
      setFormData({
        email: 'user@user.com',
        password: 'user123',
        rememberMe: false
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-beige flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-800">🎟️</span>
          </div>
          <p className="text-primary-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-beige flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold text-primary-800 group-hover:text-primary-700 transition-colors">EventsPro</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-primary-800 mb-2">
            Connexion à votre compte
          </h2>
          <p className="text-primary-600">
            Accédez à votre espace personnalisé
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✅</span>
              <span className="text-green-800">{successMessage}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">❌</span>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="glass-effect p-4 rounded-xl border border-primary-200">
          <p className="text-sm text-primary-700 mb-3 font-medium">🚀 Comptes de démonstration :</p>
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
            >
              👑 Admin
            </button>
            <button 
              type="button"
              onClick={() => fillDemoCredentials('participant')}
              className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              👤 Participant
            </button>
          </div>
        </div>

        <div className="glass-effect p-8 rounded-2xl shadow-lg border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary-800 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/90 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-primary-400"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary-800 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/90 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-primary-400"
                placeholder="Votre mot de passe"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-white border-primary-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-primary-700">Se souvenir de moi</span>
              </label>
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <span>🚀</span>
                </>
              )}
            </button>

            <div className="text-center">
              <span className="text-primary-600">Pas encore de compte ? </span>
              <Link 
                href="/auth/register" 
                className="text-primary-800 font-semibold hover:text-primary-700 transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-primary-500">
            En vous connectant, vous acceptez nos{" "}
            <Link href="/terms" className="text-primary-700 hover:text-primary-800 transition-colors">
              conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="text-primary-700 hover:text-primary-800 transition-colors">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
