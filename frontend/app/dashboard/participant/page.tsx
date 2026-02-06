"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!user) {
    return null;
  }

  const myReservations = [
    { 
      id: 1, 
      eventTitle: "Conférence Tech 2026", 
      date: "2026-03-15", 
      time: "09:00", 
      location: "Paris Convention Center",
      status: "confirmed", 
      ticketNumber: "TK-001234",
      organizer: "TechCorp"
    },
    { 
      id: 2, 
      eventTitle: "Workshop Design UX", 
      date: "2026-03-22", 
      time: "14:00", 
      location: "Studio Design Lyon",
      status: "pending", 
      ticketNumber: "TK-001235",
      organizer: "DesignHub"
    },
    { 
      id: 3, 
      eventTitle: "Meetup Entrepreneurs", 
      date: "2026-03-30", 
      time: "18:30", 
      location: "Business Center Nice",
      status: "confirmed", 
      ticketNumber: "TK-001236",
      organizer: "StartupNetwork"
    }
  ];

  const availableEvents = [
    {
      id: 4,
      title: "Formation Marketing Digital",
      date: "2026-04-10",
      time: "10:00", 
      location: "Centre Formation Marseille",
      price: "€89",
      organizer: "MarketPro",
      category: "Formation",
      spots: 15
    },
    {
      id: 5,
      title: "Networking Business",
      date: "2026-04-15",
      time: "19:00",
      location: "Hôtel Carlton Cannes", 
      price: "€45",
      organizer: "BizNetwork",
      category: "Networking",
      spots: 8
    },
    {
      id: 6,
      title: "Conférence Innovation",
      date: "2026-04-20",
      time: "09:30",
      location: "Palais des Congrès Toulouse",
      price: "€125",
      organizer: "InnovTech",
      category: "Conférence",
      spots: 25
    }
  ];

  const favoriteCategories = [
    { name: "Technologie", count: 5, icon: "💻" },
    { name: "Business", count: 3, icon: "📊" },
    { name: "Design", count: 2, icon: "🎨" },
    { name: "Marketing", count: 4, icon: "📈" }
  ];

  return (
    <div className="space-y-6">
      {/* Header de bienvenue personnalisé */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-800 mb-2">
              Salut {user.fullName?.split(' ')[0]} ! 👋
            </h1>
            <p className="text-primary-600">
              Découvrez des événements passionnants et gérez vos réservations
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="btn-primary text-sm">
              🔍 Découvrir
            </button>
            <button className="btn-secondary text-sm">
              ⭐ Favoris
            </button>
          </div>
        </div>
        
        {/* Navigation par onglets */}
        <div className="flex space-x-1 p-1 bg-primary-100 rounded-lg">
          {[
            { id: "dashboard", label: "Tableau de bord", icon: "🏠" },
            { id: "events", label: "Événements", icon: "🎯" },
            { id: "reservations", label: "Mes Réservations", icon: "🎫" },
            { id: "profile", label: "Profil", icon: "👤" }
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
      {activeTab === "dashboard" && (
        <>
          {/* Statistiques personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Mes Réservations", value: myReservations.length.toString(), icon: "🎫", color: "bg-green-50 text-green-600" },
              { title: "Événements Suivis", value: "8", icon: "⭐", color: "bg-yellow-50 text-yellow-600" },
              { title: "Points Fidélité", value: "1,245", icon: "🏆", color: "bg-purple-50 text-purple-600" }
            ].map((stat, index) => (
              <div key={index} className="glass-effect p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-primary-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prochains événements et recommandations */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mes prochains événements */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-primary-800 mb-4">Mes prochains événements</h2>
              <div className="space-y-4">
                {myReservations.filter(r => r.status === 'confirmed').slice(0, 2).map((reservation) => (
                  <div key={reservation.id} className="bg-white p-4 rounded-lg border border-primary-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-800">{reservation.eventTitle}</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-primary-600">
                          <span>📅 {new Date(reservation.date).toLocaleDateString('fr-FR')}</span>
                          <span>🕐 {reservation.time}</span>
                          <span>📍 {reservation.location}</span>
                          <span>🎫 {reservation.ticketNumber}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Confirmé
                        </span>
                        <p className="text-xs text-primary-500 mt-2">par {reservation.organizer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full btn-secondary text-center">
                <Link href="/dashboard/participant/reservations">
                  Voir toutes mes réservations
                </Link>
              </button>
            </div>

            {/* Recommandations personnalisées */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-primary-800 mb-4">Recommandations pour vous</h2>
              <div className="space-y-4">
                {availableEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="bg-white p-4 rounded-lg border border-primary-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-primary-800">{event.title}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {event.category}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-primary-600">
                          <span>📅 {new Date(event.date).toLocaleDateString('fr-FR')}</span>
                          <span>💰 {event.price}</span>
                          <span>📍 {event.location}</span>
                          <span>👥 {event.spots} places restantes</span>
                        </div>
                      </div>
                      <button className="btn-primary text-sm">
                        Réserver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full btn-secondary text-center">
                <Link href="/dashboard/participant/events">
                  Explorer tous les événements
                </Link>
              </button>
            </div>
          </div>

          {/* Catégories favorites */}
          <div className="glass-effect p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-primary-800 mb-4">Vos catégories préférées</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favoriteCategories.map((category) => (
                <div key={category.name} className="bg-white p-4 rounded-lg border border-primary-200 text-center hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-primary-800">{category.name}</h3>
                  <p className="text-sm text-primary-600">{category.count} événements</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-800">Événements disponibles</h2>
              <div className="flex space-x-2">
                <select className="px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                  <option>Toutes catégories</option>
                  <option>Technologie</option>
                  <option>Business</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>
                <button className="btn-secondary text-sm">Filtrer</button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableEvents.map((event) => (
                <div key={event.id} className="bg-white p-6 rounded-lg border border-primary-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                    <span className="text-lg font-bold text-primary-800">{event.price}</span>
                  </div>
                  
                  <h3 className="font-bold text-primary-800 mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 text-sm text-primary-600 mb-4">
                    <div className="flex items-center">
                      <span className="w-4 mr-2">📅</span>
                      <span>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 mr-2">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 mr-2">👤</span>
                      <span>par {event.organizer}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 mr-2">👥</span>
                      <span>{event.spots} places restantes</span>
                    </div>
                  </div>
                  Link href={`/dashboard/participant/events/${event.id}`} className="flex-1 btn-primary text-sm text-center">
                      Réserver
                    </Link
                  <div className="flex space-x-2">
                    <button className="flex-1 btn-primary text-sm">Réserver</button>
                    <button className="px-3 py-2 border border-primary-200 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-primary-50 text-sm">
                      ⭐
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "reservations" && (
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-800">Mes réservations</h2>
            <div className="flex space-x-2">
              <select className="px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                <option>Toutes</option>
                <option>Confirmées</option>
                <option>En attente</option>
                <option>Passées</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {myReservations.map((reservation) => (
              <div key={reservation.id} className="bg-white p-6 rounded-lg border border-primary-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-primary-800 text-lg">{reservation.eventTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status === 'confirmed' ? 'Confirmé' :
                         reservation.status === 'pending' ? 'En attente' : 'Annulé'}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-primary-600">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="w-4 mr-2">📅</span>
                          <span>{new Date(reservation.date).toLocaleDateString('fr-FR')} à {reservation.time}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 mr-2">📍</span>
                          <span>{reservation.location}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="w-4 mr-2">🎫</span>
                          <span>{reservation.ticketNumber}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 mr-2">👤</span>
                          <span>Organisé par {reservation.organizer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  Link href={`/dashboard/participant/reservations/${reservation.id}`} className="btn-primary text-sm text-center">
                      Voir détails
                    </Link>
                    <Link href={`/dashboard/participant/reservations/${reservation.id}/ticket`} className="btn-secondary text-sm text-center">
                      Télécharger ticket
                    </Link
                    <button className="btn-primary text-sm">Voir détails</button>
                    <button className="btn-secondary text-sm">Télécharger ticket</button>
                    {reservation.status === 'confirmed' && (
                      <button className="text-red-600 hover:text-red-800 text-sm">Annuler</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="glass-effect p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-primary-800 mb-6">Mon profil</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Informations personnelles */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary-800 mb-4">Informations personnelles</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">Nom complet</label>
                      <input
                        type="text"
                        defaultValue={user.fullName}
                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary-800 mb-4">Préférences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-primary-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-primary-700">Recevoir des notifications par email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-primary-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-primary-700">Recevoir des recommandations personnalisées</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-primary-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-primary-700">Newsletter hebdomadaire</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Statistiques du profil */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary-800 mb-4">Mes statistiques</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Événements assistés", value: "12", icon: "✅" },
                      { label: "Points fidélité", value: "1,245", icon: "🏆" },
                      { label: "Organisateurs suivis", value: "8", icon: "👥" },
                      { label: "Avis laissés", value: "6", icon: "⭐" }
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white p-4 rounded-lg border border-primary-200 text-center">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold text-primary-800">{stat.value}</div>
                        <div className="text-sm text-primary-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary-800 mb-4">Badges obtenus</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: "Premier événement", icon: "🎯" },
                      { name: "Fidèle participant", icon: "💎" },
                      { name: "Explorateur", icon: "🌟" },
                      { name: "Critique", icon: "📝" },
                      { name: "Networker", icon: "🤝" },
                      { name: "Early Bird", icon: "🐦" }
                    ].map((badge) => (
                      <div key={badge.name} className="bg-white p-3 rounded-lg border border-primary-200 text-center">
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <div className="text-xs text-primary-600">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-8">
              <button className="btn-primary">Sauvegarder les modifications</button>
              <button className="btn-secondary">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
