"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  // Redirection si pas admin
  if (!user || user.role !== 'admin') {
    router.push('/dashboard');
    return null;
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
              Dashboard Administrateur 👑
            </h1>
            <p className="text-primary-600">
              Gérez votre plateforme EventsPro en toute simplicité
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="btn-primary text-sm">
              📊 Rapport mensuel
            </button>
            <button className="btn-secondary text-sm">
              ⚙️ Paramètres
            </button>
          </div>
        </div>
        
        {/* Navigation par onglets */}
        <div className="flex space-x-1 p-1 bg-primary-100 rounded-lg">
          {[
            { id: "overview", label: "Vue d'ensemble", icon: "📊" },
            { id: "events", label: "Événements", icon: "📅" },
            { id: "users", label: "Utilisateurs", icon: "👥" },
            { id: "analytics", label: "Analytics", icon: "📈" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-primary-600 hover:text-primary-800 hover:bg-primary-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === "overview" && (
        <>
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, index) => (
              <div key={index} className="glass-effect p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-primary-800 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} ce mois</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Événements récents et utilisateurs */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Événements récents */}
            <div className="glass-effect p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-800">Événements récents</h2>
              <Link href="/dashboard/admin/events" className="btn-secondary text-sm">
                Voir tous
              </Link>
              </div>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-primary-200 hover:shadow-sm transition-shadow">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-800">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-primary-600">
                        <span>👤 {event.organizer}</span>
                        <span>📅 {new Date(event.date).toLocaleDateString('fr-FR')}</span>
                        <span>👥 {event.participants}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status === 'confirmed' ? 'Confirmé' :
                       event.status === 'pending' ? 'En attente' : 'Brouillon'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nouveaux utilisateurs */}
            <div className="glass-effect p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-800">Nouveaux utilisateurs</h2>
              <Link href="/dashboard/admin/users" className="btn-secondary text-sm">
                Gérer
              </Link>
              </div>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-primary-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-primary-800 font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-primary-800">{user.name}</h3>
                        <p className="text-sm text-primary-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'organizer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'organizer' ? 'Organisateur' : 'Participant'}
                      </span>
                      <p className="text-xs text-primary-500 mt-1">
                        {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
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
            <table className="w-full">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Événement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Organisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-200">
                {recentEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-primary-25">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary-800">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 text-primary-600">{event.organizer}</td>
                    <td className="px-6 py-4 text-primary-600">
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-primary-600">{event.participants}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status === 'confirmed' ? 'Confirmé' :
                         event.status === 'pending' ? 'En attente' : 'Brouillon'}
                      </span>
                    </td>
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
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className="px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn-primary text-sm">➕ Inviter</button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="bg-white p-6 rounded-lg border border-primary-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-primary-800 font-semibold text-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800">{user.name}</h3>
                      <p className="text-primary-600">{user.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-primary-500 mt-1">
                        <span>Inscrit le {new Date(user.joinDate).toLocaleDateString('fr-FR')}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'organizer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'organizer' ? 'Organisateur' : 'Participant'}
                        </span>
                     Link href="/dashboard/admin/reservations" className="btn-secondary text-sm">
                      Profil
                    </Link>
                    <Link href={`/dashboard/admin/users/${user.id}`} className="text-primary-600 hover:text-primary-800 text-sm">
                      Modifier
                    </Link
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm">Profil</button>
                    <button className="text-primary-600 hover:text-primary-800 text-sm">Modifier</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Désactiver</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Graphiques et analytics */}
          <div className="glass-effect p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-primary-800 mb-4">Analytics de la plateforme</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">Croissance des utilisateurs</h3>
                <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-primary-600">Graphique de croissance</p>
                    <p className="text-sm text-primary-500">+25% ce mois</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">Revenus mensuels</h3>
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
            <h2 className="text-xl font-bold text-primary-800 mb-4">Événements populaires</h2>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={event.id} className="bg-white p-4 rounded-lg border border-primary-200 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary-800">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-800">{event.title}</h3>
                      <p className="text-sm text-primary-600">{event.participants} participants</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary-800">Taux de réservation</div>
                    <div className="text-sm text-green-600">85%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
