'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Reservation, ReservationStatus, ReservationStats } from '@/types/reservation';
import { reservationsService } from '@/services/reservationsService';

export default function ReservationsManagementPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtres
  const [statusFilter, setStatusFilter] = useState<'all' | ReservationStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'event' | 'user'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reservationsData, statsData] = await Promise.all([
        reservationsService.getAllReservations(),
        reservationsService.getReservationStats()
      ]);
      setReservations(reservationsData);
      setStats(statsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadReservations();
    }
  }, [user]);

  // Filtrer et trier les réservations
  useEffect(() => {
    let filtered = reservations;

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    // Filtrage par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(reservation =>
        reservation.event.title.toLowerCase().includes(searchLower) ||
        reservation.user.fullName.toLowerCase().includes(searchLower) ||
        reservation.user.email.toLowerCase().includes(searchLower) ||
        reservation.event.location.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.reservationDate);
          bValue = new Date(b.reservationDate);
          break;
        case 'event':
          aValue = a.event.title;
          bValue = b.event.title;
          break;
        case 'user':
          aValue = a.user.fullName;
          bValue = b.user.fullName;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReservations(filtered);
  }, [reservations, statusFilter, searchTerm, sortBy, sortOrder]);

  const handleStatusChange = async (reservationId: string, newStatus: ReservationStatus, notes?: string) => {
    try {
      await reservationsService.updateReservationStatus(reservationId, newStatus, notes);
      await loadReservations();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ReservationStatus.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case ReservationStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case ReservationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'En attente';
      case ReservationStatus.CONFIRMED:
        return 'Confirmée';
      case ReservationStatus.CANCELLED:
        return 'Annulée';
      case ReservationStatus.REJECTED:
        return 'Refusée';
      default:
        return status;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-4">
              <svg className="animate-spin w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-lg text-gray-600">Chargement des réservations...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎫 Gestion des Réservations
          </h1>
          <p className="text-gray-600">
            Consultez, confirmez, refusez et gérez toutes les réservations
          </p>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmées</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Annulées</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Événements</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.upcomingEvents}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux moyen</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(stats.averageFillRate)}%</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres et contrôles */}
        <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-6 rounded-xl shadow-sm mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Barre de recherche */}
            <div className="lg:col-span-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher événements, participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | ReservationStatus)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Tous les statuts</option>
                <option value={ReservationStatus.PENDING}>En attente</option>
                <option value={ReservationStatus.CONFIRMED}>Confirmées</option>
                <option value={ReservationStatus.CANCELLED}>Annulées</option>
                <option value={ReservationStatus.REJECTED}>Refusées</option>
              </select>
            </div>

            {/* Tri par */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'event' | 'user')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="date">Trier par date</option>
                <option value="event">Trier par événement</option>
                <option value="user">Trier par participant</option>
              </select>
            </div>

            {/* Ordre de tri */}
            <div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="desc">Plus récent en premier</option>
                <option value="asc">Plus ancien en premier</option>
              </select>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button 
              onClick={loadReservations}
              className="ml-auto text-red-800 hover:text-red-900 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Liste des réservations */}
        {filteredReservations.length === 0 && !loading ? (
          <div className="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche ou de filtres.'
                : 'Aucune réservation n\'a encore été créée.'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Événement</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Participant</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date réservation</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{reservation.event.title}</h4>
                          <p className="text-sm text-gray-500">
                            📅 {formatDate(reservation.event.date)} • 📍 {reservation.event.location}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{reservation.user.fullName}</p>
                          <p className="text-sm text-gray-500">{reservation.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(reservation.reservationDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(reservation.status)}`}>
                          {getStatusLabel(reservation.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {reservation.status === ReservationStatus.PENDING && (
                            <>
                              <button
                                onClick={() => handleStatusChange(reservation._id, ReservationStatus.CONFIRMED)}
                                className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                                title="Confirmer la réservation"
                              >
                                ✓ Confirmer
                              </button>
                              <button
                                onClick={() => handleStatusChange(reservation._id, ReservationStatus.REJECTED)}
                                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                                title="Refuser la réservation"
                              >
                                ✗ Refuser
                              </button>
                            </>
                          )}
                          
                          {(reservation.status === ReservationStatus.CONFIRMED || reservation.status === ReservationStatus.PENDING) && (
                            <button
                              onClick={() => handleStatusChange(reservation._id, ReservationStatus.CANCELLED)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                              title="Annuler la réservation"
                            >
                              🚫 Annuler
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}