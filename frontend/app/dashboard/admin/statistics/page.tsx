"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface StatisticsData {
  events: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
  users: {
    total: number;
    admins: number;
    participants: number;
    newThisMonth: number;
  };
  reservations: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

export default function AdminStatisticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Protection admin
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      if (user.role !== 'admin') {
        router.push('/dashboard/participant');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Simulation des données statistiques
  useEffect(() => {
    if (user && user.role === "admin") {
      setTimeout(() => {
        setStatistics({
          events: {
            total: 24,
            upcoming: 8,
            ongoing: 3,
            completed: 11,
            cancelled: 2
          },
          users: {
            total: 156,
            admins: 5,
            participants: 151,
            newThisMonth: 23
          },
          reservations: {
            total: 342,
            confirmed: 298,
            pending: 31,
            cancelled: 13
          },
          revenue: {
            total: 45670,
            thisMonth: 12430,
            lastMonth: 10890,
            growth: 14.1
          }
        });
        setLoading(false);
      }, 1200);
    }
  }, [user]);

  // Afficher le loader pendant la vérification
  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-800">📊</span>
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary-800">Statistiques</h2>
            <p className="text-primary-600">
              {isLoading ? "Calcul des données analytiques..." : 
               !user ? "Connexion requise" : "Redirection vers votre espace..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-800">📊</span>
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-4 h-4 bg-primary-400 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-primary-800">Préparation des statistiques</h2>
            <p className="text-primary-600">Analyse des données en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-primary-200 to-primary-300 p-3 rounded-xl">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-primary-900">Tableau de Bord Analytique</h1>
                  <p className="text-primary-700 mt-1">
                    Indicateurs de performance et statistiques de la plateforme
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 bg-white/60 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Revenus Total</p>
                <p className="text-3xl font-bold text-primary-900">{statistics.revenue.total.toLocaleString()}€</p>
                <p className={`text-sm flex items-center gap-1 ${
                  statistics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>{statistics.revenue.growth >= 0 ? '📈' : '📉'}</span>
                  {Math.abs(statistics.revenue.growth)}% ce mois
                </p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Total Événements</p>
                <p className="text-3xl font-bold text-primary-900">{statistics.events.total}</p>
                <p className="text-sm text-primary-600">
                  {statistics.events.upcoming} à venir
                </p>
              </div>
              <span className="text-4xl">🎪</span>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Utilisateurs</p>
                <p className="text-3xl font-bold text-primary-900">{statistics.users.total}</p>
                <p className="text-sm text-green-600">
                  +{statistics.users.newThisMonth} ce mois
                </p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Réservations</p>
                <p className="text-3xl font-bold text-primary-900">{statistics.reservations.total}</p>
                <p className="text-sm text-primary-600">
                  {((statistics.reservations.confirmed / statistics.reservations.total) * 100).toFixed(1)}% confirmées
                </p>
              </div>
              <span className="text-4xl">🎫</span>
            </div>
          </div>
        </div>

        {/* Graphiques et détails */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Répartition des événements */}
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-primary-900 mb-6 flex items-center gap-2">
              <span>🎪</span> État des Événements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-primary-700">À venir</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary-900">{statistics.events.upcoming}</span>
                  <div className="w-24 h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(statistics.events.upcoming / statistics.events.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-primary-700">En cours</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary-900">{statistics.events.ongoing}</span>
                  <div className="w-24 h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${(statistics.events.ongoing / statistics.events.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  <span className="text-primary-700">Terminés</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary-900">{statistics.events.completed}</span>
                  <div className="w-24 h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-500 rounded-full transition-all duration-500"
                      style={{ width: `${(statistics.events.completed / statistics.events.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-primary-700">Annulés</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary-900">{statistics.events.cancelled}</span>
                  <div className="w-24 h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${(statistics.events.cancelled / statistics.events.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Répartition des réservations */}
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-primary-900 mb-6 flex items-center gap-2">
              <span>🎫</span> Statut des Réservations
            </h3>
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-900">{statistics.reservations.total}</div>
                      <div className="text-xs text-primary-700">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-green-800 font-medium">Confirmées</span>
                  </div>
                  <span className="text-green-900 font-bold">{statistics.reservations.confirmed}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">⏳</span>
                    <span className="text-yellow-800 font-medium">En attente</span>
                  </div>
                  <span className="text-yellow-900 font-bold">{statistics.reservations.pending}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">❌</span>
                    <span className="text-red-800 font-medium">Annulées</span>
                  </div>
                  <span className="text-red-900 font-bold">{statistics.reservations.cancelled}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tendances mensuelles */}
        <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-primary-900 mb-6 flex items-center gap-2">
            <span>📈</span> Évolution des Revenus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-50/50 rounded-xl">
              <div className="text-sm text-primary-600 mb-1">Ce mois</div>
              <div className="text-2xl font-bold text-primary-900">{statistics.revenue.thisMonth.toLocaleString()}€</div>
              <div className="text-xs text-green-600 mt-1">↗ +{statistics.revenue.growth}%</div>
            </div>
            <div className="text-center p-4 bg-primary-50/30 rounded-xl">
              <div className="text-sm text-primary-600 mb-1">Mois dernier</div>
              <div className="text-2xl font-bold text-primary-700">{statistics.revenue.lastMonth.toLocaleString()}€</div>
            </div>
            <div className="text-center p-4 bg-primary-50/20 rounded-xl">
              <div className="text-sm text-primary-600 mb-1">Croissance</div>
              <div className={`text-2xl font-bold ${statistics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {statistics.revenue.growth >= 0 ? '+' : ''}{statistics.revenue.growth}%
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
            📊 Exporter le rapport
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
            📧 Envoyer par email
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
            📅 Programmer un rapport automatique
          </button>
        </div>
      </div>
    </div>
  );
}