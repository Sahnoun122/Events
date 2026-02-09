"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { reservationsService } from "@/services/reservationsService";
import { eventsService } from "@/services/eventsService";

interface ParticipantStats {
  totalReservations: number;
  confirmed: number;
  pending: number;
  canceled: number;
  refused: number;
  upcomingEvents: Array<{
    reservationId: string;
    eventId: string;
    eventTitle: string;
    date: string;
    location: string;
    status: string;
  }>;
  recentActivity: Array<{
    reservationId: string;
    eventTitle: string;
    status: string;
    createdAt: string;
    eventDate: string;
  }>;
}

export default function ParticipantDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ParticipantStats | null>(null);
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (user?.role === 'participant') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [participantStats, events] = await Promise.all([
        reservationsService.getMyStats(),
        eventsService.getAllEvents().catch(() => [])
      ]);
      
      setStats(participantStats);
      const upcomingPublishedEvents = events.filter((event: any) => 
        event.status === 'PUBLISHED' && new Date(event.date) > new Date()
      ).slice(0, 4);
      setAvailableEvents(upcomingPublishedEvents);
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'CANCELED':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'REFUSED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmée';
      case 'PENDING':
        return 'En attente';
      case 'CANCELED':
        return 'Annulée';
      case 'REFUSED':
        return 'Refusée';
      default:
        return status;
    }
  };

  if (isLoading || !user || user.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-800">🎟️</span>
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-blue-800">Espace Participant</h2>
            <p className="text-blue-600">
              {isLoading ? "Chargement de votre espace..." : 
               !user ? "Connexion requise" : "Redirection vers votre espace..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bonjour, {user.fullName} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenue dans votre espace participant
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/dashboard/participant/events"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Événements disponibles
              </Link>
              <Link
                href="/dashboard/participant/reservations"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Mes réservations
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement de vos données...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalReservations || 0}</p>
                    <p className="text-gray-600">Total réservations</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats?.confirmed || 0}</p>
                    <p className="text-gray-600">Confirmées</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats?.pending || 0}</p>
                    <p className="text-gray-600">En attente</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats?.upcomingEvents?.length || 0}</p>
                    <p className="text-gray-600">Événements à venir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Événements à venir */}
            {stats?.upcomingEvents && stats.upcomingEvents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Mes prochains événements</h2>
                    <Link 
                      href="/dashboard/participant/reservations"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Voir tout →
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {stats.upcomingEvents.map((event) => (
                      <div key={event.reservationId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.eventTitle}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span>📅 {formatDate(event.date)}</span>
                            <span>📍 {event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                            {getStatusText(event.status)}
                          </span>
                          <Link
                            href={`/dashboard/participant/reservations/${event.reservationId}`}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Voir
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activité récente */}
              {stats?.recentActivity && stats.recentActivity.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Activité récente</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Réservation pour "{activity.eventTitle}"
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(activity.status)}`}>
                                {getStatusText(activity.status)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(activity.createdAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Événements disponibles */}
              {availableEvents && availableEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Événements disponibles</h2>
                      <Link 
                        href="/dashboard/participant/events"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Voir tout →
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {availableEvents.slice(0, 3).map((event) => (
                        <div key={event._id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span>📅 {formatDate(event.date)}</span>
                            <span>📍 {event.location}</span>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {event.capacity} places disponibles
                            </span>
                            <Link
                              href={`/dashboard/participant/events/${event._id}`}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Réserver
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/participant/events"
                  className="flex items-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded text-blue-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Explorer les événements</p>
                    <p className="text-sm text-gray-600">Découvrir de nouveaux événements</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/participant/reservations"
                  className="flex items-center p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <div className="p-2 bg-green-100 rounded text-green-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Gérer mes réservations</p>
                    <p className="text-sm text-gray-600">Voir et modifier mes réservations</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/participant/tickets"
                  className="flex items-center p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded text-purple-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Mes billets</p>
                    <p className="text-sm text-gray-600">Télécharger mes billets</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
