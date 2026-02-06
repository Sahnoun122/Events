"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ticketsService } from "@/services/ticketsService";

export default function ParticipantDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const router = useRouter();

  // Protection de la page participant
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
        return;
      }
    }
  }, [user, isLoading, router]);

  const handleDownloadTicket = async (reservationId: string) => {
    try {
      setDownloadingId(reservationId);
      await ticketsService.downloadTicket(reservationId);
    } catch (error: any) {
      alert(`Erreur lors du téléchargement : ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Afficher le loader pendant la vérification
  if (isLoading || !user || user.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-800">🎟️</span>
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary-800">Espace Participant</h2>
            <p className="text-primary-600">
              {isLoading ? "Chargement de votre espace..." : 
               !user ? "Connexion requise" : "Redirection vers votre espace..."}
            </p>
          </div>
        </div>
      </div>
    );
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
              Découvrez vos prochains événements et gérez vos réservations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard/participant/reservations"
              className="bg-[#8B7355] text-white px-6 py-3 rounded-xl hover:bg-[#6B5B47] transition-colors flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">Mes Réservations</span>
            </Link>
            <div className="text-4xl">🎟️</div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="flex space-x-1 bg-primary-100 p-1 rounded-xl mb-6">
          {[
            { key: "dashboard", label: "🏠 Accueil", icon: "🏠", href: "" },
            { key: "events", label: "🎪 Événements", icon: "🎪", href: "/dashboard/participant/events" },
            { key: "reservations", label: "🎫 Réservations", icon: "🎫", href: "/dashboard/participant/reservations" },
            { key: "profile", label: "👤 Profil", icon: "👤", href: "" }
          ].map((tab) => {
            if (tab.href) {
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 text-center text-primary-600 hover:text-primary-800 hover:bg-white"
                >
                  {tab.icon} {tab.label.split(' ')[1]}
                </Link>
              );
            }
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-800 shadow-sm'
                    : 'text-primary-600 hover:text-primary-800'
                }`}
              >
                {tab.icon} {tab.label.split(' ')[1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Statistiques personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-effect p-6 rounded-2xl text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-primary-800">{myReservations.length}</div>
              <p className="text-primary-600">Événements réservés</p>
            </div>
            <div className="glass-effect p-6 rounded-2xl text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {myReservations.filter(r => r.status === 'confirmed').length}
              </div>
              <p className="text-primary-600">Confirmées</p>
            </div>
            <div className="glass-effect p-6 rounded-2xl text-center">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-orange-600">
                {myReservations.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-primary-600">En attente</p>
            </div>
          </div>

          {/* Événements recommandés */}
          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-800">Événements recommandés pour vous</h2>
              <Link href="/dashboard/participant/events" className="btn-secondary text-sm">
                Voir tous
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-xl border border-primary-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                    <span className="text-sm font-semibold text-primary-800">{event.price}</span>
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">{event.title}</h3>
                  <p className="text-xs text-primary-600 mb-1">📅 {event.date} à {event.time}</p>
                  <p className="text-xs text-primary-600 mb-1">📍 {event.location}</p>
                  <p className="text-xs text-primary-600 mb-3">👥 {event.spots} places restantes</p>
                  <Link href={`/dashboard/participant/events/${event.id}`} className="btn-primary text-xs w-full">
                    Voir détails
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Catégories favorites */}
          <div className="glass-effect p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-primary-800 mb-6">Vos catégories préférées</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favoriteCategories.map((category, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-primary-200 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-primary-800">{category.name}</h3>
                  <p className="text-sm text-primary-600">{category.count} événements</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-800">Parcourir les événements</h2>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">Filtrer</button>
              <Link href="/dashboard/participant/events" className="btn-primary text-sm">
                Voir tous les événements
              </Link>
              <Link href="/dashboard/participant/reservations" className="btn-secondary text-sm">
                📋 Mes réservations
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableEvents.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-xl border border-primary-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                  <span className="text-lg font-bold text-primary-800">{event.price}</span>
                </div>
                <h3 className="text-lg font-bold text-primary-800 mb-3">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-primary-600 flex items-center">
                    📅 {event.date} à {event.time}
                  </p>
                  <p className="text-sm text-primary-600 flex items-center">
                    📍 {event.location}
                  </p>
                  <p className="text-sm text-primary-600 flex items-center">
                    🏢 {event.organizer}
                  </p>
                  <p className="text-sm text-primary-600 flex items-center">
                    👥 {event.spots} places restantes
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/participant/events/${event.id}`} className="btn-secondary text-sm flex-1">
                    Détails
                  </Link>
                  <button className="btn-primary text-sm flex-1">Réserver</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reservations" && (
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-800">Mes réservations</h2>
            <Link href="/dashboard/participant/reservations" className="btn-secondary text-sm">
              Vue détaillée
            </Link>
          </div>
          
          <div className="space-y-4">
            {myReservations.map((reservation) => (
              <div key={reservation.id} className="bg-white p-6 rounded-xl border border-primary-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-primary-800">{reservation.eventTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    reservation.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {reservation.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-primary-600">📅 Date</p>
                    <p className="font-semibold text-primary-800">{reservation.date} à {reservation.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-600">📍 Lieu</p>
                    <p className="font-semibold text-primary-800">{reservation.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-600">🎫 Numéro de ticket</p>
                    <p className="font-semibold text-primary-800">{reservation.ticketNumber}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    href={`/dashboard/participant/reservations/${reservation.id}`}
                    className="btn-secondary text-sm"
                  >
                    Voir détails
                  </Link>
                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => handleDownloadTicket(reservation.id)}
                      disabled={downloadingId === reservation.id}
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === reservation.id ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Téléchargement...</span>
                        </div>
                      ) : (
                        '📱 Télécharger ticket PDF'
                      )}
                    </button>
                  )}
                  <button className="text-red-600 hover:text-red-800 text-sm px-3 py-1">
                    Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-800">Mon profil</h2>
            <button className="btn-secondary text-sm">Modifier</button>
          </div>
          
          <div className="max-w-2xl">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-800">
                  {user.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary-800">{user.fullName}</h3>
                <p className="text-primary-600">{user.email}</p>
                <p className="text-sm text-primary-500">Membre depuis mars 2026</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary-800 mb-2">
                  Nom complet
                </label>
                <input 
                  type="text" 
                  value={user.fullName || ''} 
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-primary-800 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  value={user.email || ''} 
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-primary-800 mb-2">
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-primary-800 mb-2">
                  Ville
                </label>
                <input 
                  type="text" 
                  placeholder="Paris"
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-primary-800 mb-2">
                  Préférences d'événements
                </label>
                <div className="flex flex-wrap gap-2">
                  {favoriteCategories.map((cat, index) => (
                    <span 
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                    >
                      {cat.icon} {cat.name}
                    </span>
                  ))}
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
