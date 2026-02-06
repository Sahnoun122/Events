"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  // Protection de la page admin
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

  // Afficher le loader pendant la vérification
  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-800">⚙️</span>
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary-800">Admin Panel</h2>
            <p className="text-primary-600">
              {isLoading ? "Vérification des permissions..." : 
               !user ? "Connexion requise" : "Redirection vers votre espace..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const adminStats = [
    { title: "Total Événements", value: "45", change: "+12%", icon: "📅", color: "bg-blue-50 text-blue-600" },
    { title: "Utilisateurs Actifs", value: "1,234", change: "+5%", icon: "👥", color: "bg-green-50 text-green-600" },
    { title: "Revenus ce mois", value: "€15,890", change: "+23%", icon: "💰", color: "bg-yellow-50 text-yellow-600" },
    { title: "Tickets Vendus", value: "789", change: "+8%", icon: "🎫", color: "bg-purple-50 text-purple-600" }
  ];

  const recentEvents = [
    { id: 1, title: "Conférence Tech 2026", organizer: "TechCorp", date: "2026-03-15", status: "confirmed", participants: 250 },
    { id: 2, title: "Workshop Marketing", organizer: "MarketPro", date: "2026-03-20", status: "pending", participants: 85 },
    { id: 3, title: "Meetup Startup", organizer: "StartupHub", date: "2026-03-25", status: "confirmed", participants: 150 },
    { id: 4, title: "Formation Design", organizer: "DesignStudio", date: "2026-03-30", status: "draft", participants: 45 }
  ];

  const recentUsers = [
    { id: 1, name: "Marie Dubois", email: "marie@example.com", role: "participant", joinDate: "2026-02-05" },
    { id: 2, name: "Pierre Martin", email: "pierre@example.com", role: "organizer", joinDate: "2026-02-04" },
    { id: 3, name: "Sophie Laurent", email: "sophie@example.com", role: "participant", joinDate: "2026-02-03" },
    { id: 4, name: "Thomas Bernard", email: "thomas@example.com", role: "organizer", joinDate: "2026-02-02" }
  ];

  return (
    <div className="space-y-6">
      {/* Header avec onglets */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-800 mb-2">
              Panel d'administration
            </h1>
            <p className="text-primary-600">
              Gérez votre plateforme d'événements
            </p>
          </div>
          <div className="text-4xl">⚙️</div>
        </div>

        {/* Navigation par onglets */}
        <div className="flex space-x-1 bg-primary-100 p-1 rounded-xl">
          {[
            { key: "overview", label: "Vue d'ensemble", icon: "📊" },
            { key: "events", label: "Événements", icon: "🎪" },
            { key: "users", label: "Utilisateurs", icon: "👥" },
            { key: "analytics", label: "Analytics", icon: "📈" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-primary-600 hover:text-primary-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, index) => (
              <div key={index} className="glass-effect p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl text-2xl ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-primary-800">{stat.value}</h3>
                <p className="text-primary-600">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Aperçu des événements récents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-effect p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-800">Événements récents</h2>
                <Link href="/dashboard/admin/events" className="btn-secondary text-sm">
                  Voir tous
                </Link>
              </div>
              <div className="space-y-3">
                {recentEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-white p-4 rounded-xl border border-primary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-primary-800">{event.title}</h3>
                        <p className="text-sm text-primary-600">{event.organizer} • {event.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        event.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-800">Nouveaux utilisateurs</h2>
                <Link href="/dashboard/admin/users" className="btn-secondary text-sm">
                  Gérer
                </Link>
              </div>
              <div className="space-y-3">
                {recentUsers.slice(0, 3).map((user) => (
                  <div key={user.id} className="bg-white p-4 rounded-xl border border-primary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-primary-800">{user.name}</h3>
                        <p className="text-sm text-primary-600">{user.email}</p>
                      </div>
                      <span className="text-xs text-primary-500">{user.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="glass-effect p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-primary-800 mb-6">Actions rapides</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <Link href="/dashboard/admin/statistics" className="btn-secondary text-sm">
                  📊 Rapport mensuel
                </Link>
                <button className="btn-secondary text-sm">
                  ⚙️ Paramètres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-800">Gestion des événements</h2>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">Filtrer</button>
              <Link href="/dashboard/admin/events/create" className="btn-primary text-sm">
                ➕ Nouvel événement
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50 text-primary-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Événement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Organisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-800">{event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-primary-600">{event.organizer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-primary-600">{event.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        event.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-primary-600">{event.participants}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/admin/events/${event.id}`} className="text-primary-600 hover:text-primary-800 text-sm">
                          Voir
                        </Link>
                        <Link href={`/dashboard/admin/events/${event.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">
                          Modifier
                        </Link>
                        <button className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-800">Gestion des utilisateurs</h2>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">Filtrer</button>
              <button className="btn-primary text-sm">➕ Inviter utilisateur</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentUsers.map((user) => (
              <div key={user.id} className="bg-white p-6 rounded-xl border border-primary-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary-800">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800">{user.name}</h3>
                    <p className="text-sm text-primary-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-primary-600">Rôle:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-primary-500 mb-4">Membre depuis: {user.joinDate}</p>
                <div className="flex space-x-2">
                  <Link href="/dashboard/admin/reservations" className="btn-secondary text-sm">
                    Profil
                  </Link>
                  <Link href={`/dashboard/admin/users/${user.id}`} className="text-primary-600 hover:text-primary-800 text-sm">
                    Modifier
                  </Link>
                  <button className="text-red-600 hover:text-red-800 text-sm">Désactiver</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-primary-800 mb-6">Événements par mois</h2>
              <div className="bg-white p-6 rounded-lg border border-primary-200">
                <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-blue-600">Graphique des événements</p>
                    <p className="text-sm text-blue-500">+15% vs mois dernier</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-primary-800 mb-6">Revenus mensuels</h2>
              <div className="bg-white p-6 rounded-lg border border-primary-200">
                <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <p className="text-green-600">€15,890</p>
                    <p className="text-sm text-green-500">+23% vs mois dernier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-primary-800 mb-6">Métriques détaillées</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-primary-200 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-primary-800">4.8</div>
                <p className="text-primary-600">Note moyenne</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-primary-200 text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-2xl font-bold text-primary-800">85%</div>
                <p className="text-primary-600">Taux de rétention</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-primary-200 text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-primary-800">+42%</div>
                <p className="text-primary-600">Croissance</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
