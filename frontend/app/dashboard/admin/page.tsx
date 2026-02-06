'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventsService } from '@/services/eventsService';
import { reservationsService } from '@/services/reservationsService';
import Link from 'next/link';

interface DashboardStats {
  events: {
    totalEvents: number;
    publishedEvents: number;
    upcomingEvents: number;
    pastEvents: number;
    draftEvents: number;
    canceledEvents: number;
    upcomingEventsData: Array<{
      _id: string;
      title: string;
      date: string;
      location: string;
      capacity: number;
    }>;
  };
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    canceled: number;
    refused: number;
    byEvent: Record<string, {
      eventTitle: string;
      capacity: number;
      confirmed: number;
      pending: number;
      total: number;
    }>;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Rediriger si pas admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard/participant');
    }
    
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventsStats, reservationsStats] = await Promise.all([
        eventsService.getEventStats(),
        reservationsService.getDashboardStats()
      ]);
      
      setStats({
        events: eventsStats,
        reservations: reservationsStats
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageFillRate = () => {
    if (!stats?.reservations.byEvent) return 0;
    
    const events = Object.values(stats.reservations.byEvent);
    if (events.length === 0) return 0;
    
    const totalFillRate = events.reduce((sum, event) => {
      const fillRate = event.capacity > 0 ? (event.confirmed / event.capacity) * 100 : 0;
      return sum + fillRate;
    }, 0);
    
    return Math.round(totalFillRate / events.length);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return null; // L'effet useEffect redirigera
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
          <p className="mt-4 text-[#8B7355] font-medium">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  const averageFillRate = calculateAverageFillRate();

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#8B7355] mb-2">
            📊 Tableau de bord administrateur
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Bonjour {user.fullName}, voici un aperçu de votre plateforme</p>
            <button 
              onClick={loadDashboardData}
              disabled={loading}
              className="bg-[#8B7355] text-white px-4 py-2 rounded-lg hover:bg-[#6B5B47] transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-medium">Erreur de chargement</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={loadDashboardData}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Indicateurs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Événements à venir */}
          <div className="bg-white/70 backdrop-blur-sm border border-[#8B7355]/20 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">🎯 Événements à venir</p>
                <p className="text-3xl font-bold text-[#8B7355]">{stats?.events.upcomingEvents || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[#8B7355]/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-gray-500">
                  {stats?.events.totalEvents || 0} événements au total
                </span>
              </div>
            </div>
          </div>

          {/* Taux de remplissage moyen */}
          <div className="bg-white/70 backdrop-blur-sm border border-green-200 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">📈 Taux de remplissage</p>
                <p className="text-3xl font-bold text-green-600">{averageFillRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-gray-500">
                  Moyenne de tous les événements
                </span>
              </div>
            </div>
          </div>

          {/* Réservations confirmées */}
          <div className="bg-white/70 backdrop-blur-sm border border-blue-200 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">✅ Réservations confirmées</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.reservations.confirmed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-gray-500">
                  {stats?.reservations.total || 0} réservations au total
                </span>
              </div>
            </div>
          </div>

          {/* Réservations en attente */}
          <div className="bg-white/70 backdrop-blur-sm border border-yellow-200 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">⏳ En attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.reservations.pending || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-yellow-600 font-medium">
                  Nécessitent une action
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Répartition des réservations par statut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-[#8B7355]/20 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-[#8B7355] mb-6">🎯 Répartition des réservations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Confirmées</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{stats?.reservations.confirmed || 0}</span>
                  <div className="text-sm text-gray-500">
                    {stats?.reservations.total ? Math.round((stats.reservations.confirmed / stats.reservations.total) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">En attente</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-yellow-600">{stats?.reservations.pending || 0}</span>
                  <div className="text-sm text-gray-500">
                    {stats?.reservations.total ? Math.round((stats.reservations.pending / stats.reservations.total) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Refusées</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-600">{stats?.reservations.refused || 0}</span>
                  <div className="text-sm text-gray-500">
                    {stats?.reservations.total ? Math.round((stats.reservations.refused / stats.reservations.total) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="font-medium">Annulées</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-600">{stats?.reservations.canceled || 0}</span>
                  <div className="text-sm text-gray-500">
                    {stats?.reservations.total ? Math.round((stats.reservations.canceled / stats.reservations.total) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prochains événements */}
          <div className="bg-white/70 backdrop-blur-sm border border-[#8B7355]/20 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-[#8B7355] mb-6">📅 Prochains événements</h3>
            <div className="space-y-3">
              {stats?.events.upcomingEventsData?.slice(0, 5).map((event) => (
                <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      📍 {event.location} • 
                      📅 {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">
                      {stats.reservations.byEvent[event._id]?.confirmed || 0}/{event.capacity}
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.capacity > 0 ? Math.round(((stats.reservations.byEvent[event._id]?.confirmed || 0) / event.capacity) * 100) : 0}%
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Aucun événement à venir</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white/70 backdrop-blur-sm border border-[#8B7355]/20 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-[#8B7355] mb-6">⚡ Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/dashboard/admin/events"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-[#8B7355] to-[#6B5B47] text-white rounded-lg hover:from-[#6B5B47] hover:to-[#5A4A38] transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">📅 Gérer les événements</span>
              </div>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link 
              href="/dashboard/admin/reservations"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">🎫 Gérer les réservations</span>
              </div>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {stats?.reservations.pending > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-yellow-800 font-medium">
                  {stats.reservations.pending} réservation{stats.reservations.pending > 1 ? 's' : ''} en attente
                </span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Ces réservations nécessitent votre attention pour être confirmées ou refusées.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
