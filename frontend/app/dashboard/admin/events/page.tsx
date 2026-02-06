"use client";

import { useState } from "react";
import Link from "next/link";

export default function ManageEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const events = [
    {
      id: 1,
      title: "Conférence Tech 2026",
      organizer: "TechCorp",
      date: "2026-03-15",
      time: "09:00",
      location: "Paris Convention Center",
      status: "published",
      category: "Technologie",
      participants: 250,
      maxParticipants: 300,
      price: "€125",
      created: "2026-02-01"
    },
    {
      id: 2,
      title: "Workshop Marketing Digital",
      organizer: "MarketPro",
      date: "2026-03-20",
      time: "14:00",
      location: "Centre Formation Marseille",
      status: "draft",
      category: "Marketing",
      participants: 45,
      maxParticipants: 100,
      price: "€89",
      created: "2026-02-03"
    },
    {
      id: 3,
      title: "Meetup Entrepreneurs",
      organizer: "StartupHub",
      date: "2026-03-25",
      time: "18:30",
      location: "Business Center Nice",
      status: "published",
      category: "Business",
      participants: 150,
      maxParticipants: 200,
      price: "€75",
      created: "2026-02-02"
    },
    {
      id: 4,
      title: "Formation Design UX",
      organizer: "DesignStudio",
      date: "2026-04-01",
      time: "10:00",
      location: "Studio Créatif Lyon",
      status: "pending",
      category: "Design",
      participants: 30,
      maxParticipants: 50,
      price: "€150",
      created: "2026-02-04"
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec titre et bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">Gestion des Événements</h1>
          <p className="text-primary-600 mt-1">Créez, modifiez et gérez tous vos événements</p>
        </div>
        <Link href="/dashboard/admin/events/create" className="btn-primary">
          ➕ Nouvel Événement
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Rechercher un événement
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom de l'événement ou organisateur..."
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
              <option value="pending">En attente</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Catégorie
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Toutes catégories</option>
              <option value="Technologie">Technologie</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect p-6 rounded-2xl text-center">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-2xl font-bold text-primary-800">{events.length}</div>
          <p className="text-primary-600">Total Événements</p>
        </div>
        <div className="glass-effect p-6 rounded-2xl text-center">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">                {events.filter(e => e.status === 'published').length}
          </div>
          <p className="text-primary-600">Publiés</p>
        </div>
        <div className="glass-effect p-6 rounded-2xl text-center">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-2xl font-bold text-blue-600">
            {events.reduce((sum, e) => sum + e.participants, 0)}
          </div>
          <p className="text-primary-600">Participants Total</p>
        </div>
        <div className="glass-effect p-6 rounded-2xl text-center">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-2xl font-bold text-yellow-600">€15,890</div>
          <p className="text-primary-600">Revenus du mois</p>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary-800 mb-2">Événements ({filteredEvents.length})</h2>
          <p className="text-primary-600">Gérez vos événements ci-dessous</p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Aucun événement trouvé</h3>
            <p className="text-primary-600 mb-6">Essayez de modifier vos filtres ou créez un nouvel événement</p>
            <Link href="/dashboard/admin/events/create" className="btn-primary">
              Créer un événement
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-xl border border-primary-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-bold text-primary-800">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                        {event.status === 'published' ? 'Publié' :
                         event.status === 'draft' ? 'Brouillon' :
                         event.status === 'pending' ? 'En attente' : 'Annulé'}
                      </span>
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                        {event.category}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-primary-600">
                      <div className="flex items-center">
                        <span className="w-4 mr-2">👤</span>
                        <span>{event.organizer}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">📅</span>
                        <span>{event.date} à {event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">📍</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">👥</span>
                        <span>{event.participants}/{event.maxParticipants} participants</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">💰</span>
                        <span>{event.price}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">📝</span>
                        <span>Créé le {event.created}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link 
                      href={`/dashboard/admin/events/${event.id}`}
                      className="btn-secondary text-sm text-center"
                    >
                      📊 Voir détails
                    </Link>
                    <Link 
                      href={`/dashboard/admin/events/${event.id}/edit`}
                      className="btn-primary text-sm text-center"
                    >
                      ✏️ Modifier
                    </Link>
                    <button className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50">
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
                
                {/* Barre de progression des inscriptions */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-primary-600 mb-1">
                    <span>Taux de remplissage</span>
                    <span>{Math.round((event.participants / event.maxParticipants) * 100)}%</span>
                  </div>
                  <div className="w-full bg-primary-100 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}