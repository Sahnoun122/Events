'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Reservation, ReservationStatus, ReservationStats } from '@/types/reservation';
import { reservationsService } from '@/services/reservationsService';
import { eventsService } from '@/services/eventsService';
import { Event } from '@/types/event';

export default function ReservationsManagementPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Filtres
  const [statusFilter, setStatusFilter] = useState<'all' | ReservationStatus>('all');
  const [eventFilter, setEventFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'byEvent' | 'byParticipant'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'event' | 'user'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les données en parallèle
      const [reservationsData, eventsData, statsData] = await Promise.all([
        reservationsService.getAllReservations(),
        eventsService.getAllEvents(),
        reservationsService.getReservationStats()
      ]);
      
      setReservations(reservationsData);
      setEvents(eventsData);
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

    // Filtrage par événement
    if (eventFilter) {
      filtered = filtered.filter(reservation => reservation.event._id === eventFilter);
    }

    // Filtrage par recherche (participant)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(reservation =>
        reservation.event.title.toLowerCase().includes(searchLower) ||
        (reservation.user?.fullName || reservation.participant?.fullName || '').toLowerCase().includes(searchLower) ||
        (reservation.user?.email || reservation.participant?.email || '').toLowerCase().includes(searchLower) ||
        reservation.event.location.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt || a.reservationDate);
          bValue = new Date(b.createdAt || b.reservationDate);
          break;
        case 'event':
          aValue = a.event.title;
          bValue = b.event.title;
          break;
        case 'user':
          aValue = a.user?.fullName || a.participant?.fullName || '';
          bValue = b.user?.fullName || b.participant?.fullName || '';
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
  }, [reservations, statusFilter, eventFilter, searchTerm, sortBy, sortOrder]);

  const handleConfirmReservation = async (reservationId: string) => {
    try {
      setProcessingId(reservationId);
      await reservationsService.confirmReservation(reservationId);
      await loadReservations(); // Recharger les données
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la confirmation');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectReservation = async (reservationId: string) => {
    try {
      setProcessingId(reservationId);
      await reservationsService.rejectReservation(reservationId);
      await loadReservations(); // Recharger les données
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors du refus');
    } finally {
      setProcessingId(null);
    }
  };

  const handleAdminCancelReservation = async (reservationId: string) => {
    try {
      setProcessingId(reservationId);
      await reservationsService.adminCancelReservation(reservationId);
      await loadReservations(); // Recharger les données
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'annulation');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case ReservationStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border border-green-200';
      case ReservationStatus.CANCELED:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case ReservationStatus.REFUSED:
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusLabel = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'En attente';
      case ReservationStatus.CONFIRMED:
        return 'Confirmée';
      case ReservationStatus.CANCELED:
        return 'Annulée';
      case ReservationStatus.REFUSED:
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
      <div className="min-h-screen bg-[#F5F3F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355]"></div>
              <span className="text-[#8B7355] font-medium">Chargement des réservations...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getReservationStats = () => {
    const filtered = filteredReservations;
    return {
      total: filtered.length,
      pending: filtered.filter(r => r.status === ReservationStatus.PENDING).length,
      confirmed: filtered.filter(r => r.status === ReservationStatus.CONFIRMED).length,
      canceled: filtered.filter(r => r.status === ReservationStatus.CANCELED).length,
      refused: filtered.filter(r => r.status === ReservationStatus.REFUSED).length,
    };
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F5F3F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/70 backdrop-blur-sm border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600">
              Vous devez être administrateur pour accéder à cette page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentStats = getReservationStats();

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-[#8B7355]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#8B7355] mb-2">
                🎫 Gestion des Réservations
              </h1>
              <p className="text-gray-600">
                Visualisez, confirmez, refusez ou annulez les réservations des participants
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={loadReservations}
                disabled={loading}
                className="bg-[#8B7355] text-white px-4 py-2 rounded-lg hover:bg-[#6B5B47] transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={loadReservations}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{currentStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-md border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{currentStats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-md border border-green-200">
            <div className="text-2xl font-bold text-green-600">{currentStats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmées</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-md border border-red-200">
            <div className="text-2xl font-bold text-red-600">{currentStats.refused}</div>
            <div className="text-sm text-gray-600">Refusées</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center shadow-md border border-gray-300">
            <div className="text-2xl font-bold text-gray-600">{currentStats.canceled}</div>
            <div className="text-sm text-gray-600">Annulées</div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-[#8B7355]/20">
          <h2 className="text-xl font-semibold text-[#8B7355] mb-4">Filtres et recherche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtre par statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Par statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value={ReservationStatus.PENDING}>En attente</option>
                <option value={ReservationStatus.CONFIRMED}>Confirmées</option>
                <option value={ReservationStatus.REFUSED}>Refusées</option>
                <option value={ReservationStatus.CANCELED}>Annulées</option>
              </select>
            </div>

            {/* Filtre par événement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Par événement
              </label>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent bg-white"
              >
                <option value="">Tous les événements</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Recherche par participant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Par participant
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent bg-white"
              />
            </div>

            {/* Actions rapides */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actions
              </label>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setEventFilter('');
                  setSearchTerm('');
                }}
                className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Réinitialiser filtres
              </button>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        {filteredReservations.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || eventFilter
                ? 'Aucune réservation ne correspond aux filtres sélectionnés.'
                : 'Aucune réservation n\'a encore été créée.'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Événement
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date événement
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date réservation
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => {
                    const participantName = reservation.user?.fullName || reservation.participant?.fullName || 'Utilisateur inconnu';
                    const participantEmail = reservation.user?.email || reservation.participant?.email || 'Email non disponible';
                    
                    return (
                      <tr key={reservation._id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#8B7355] to-[#6B5B47] rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {participantName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-900">
                                {participantName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {participantEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {reservation.event.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {reservation.event.location}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {new Date(reservation.event.date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                          <div className="text-xs text-gray-500">
                            {new Date(reservation.event.date).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reservation.status)}`}>
                            {getStatusLabel(reservation.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {new Date(reservation.createdAt || reservation.reservationDate).toLocaleDateString('fr-FR')}
                          {reservation.comment && (
                            <div className="text-xs text-gray-500 italic mt-1">
                              "{reservation.comment}"
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {/* Bouton confirmer - uniquement pour PENDING */}
                            {reservation.status === ReservationStatus.PENDING && (
                              <button
                                onClick={() => handleConfirmReservation(reservation._id)}
                                disabled={processingId === reservation._id}
                                className="bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                {processingId === reservation._id ? '...' : '✓ Confirmer'}
                              </button>
                            )}

                            {/* Bouton refuser - uniquement pour PENDING */}
                            {reservation.status === ReservationStatus.PENDING && (
                              <button
                                onClick={() => handleRejectReservation(reservation._id)}
                                disabled={processingId === reservation._id}
                                className="bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                {processingId === reservation._id ? '...' : '✗ Refuser'}
                              </button>
                            )}

                            {/* Bouton annuler admin - pour toutes sauf CANCELED */}
                            {reservation.status !== ReservationStatus.CANCELED && (
                              <button
                                onClick={() => handleAdminCancelReservation(reservation._id)}
                                disabled={processingId === reservation._id}
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                {processingId === reservation._id ? '...' : '🚫 Annuler'}
                              </button>
                            )}

                            {/* Statut si pas d'actions possibles */}
                            {reservation.status === ReservationStatus.CANCELED && (
                              <span className="text-gray-400 text-xs px-2 py-1">
                                Annulée définitivement
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Guide des actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mt-8 shadow-lg">
          <h2 className="text-xl font-semibold text-[#8B7355] mb-4">
            📋 Guide des actions administrateur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800 flex items-center space-x-2">
                <span>✅</span>
                <span>Confirmer</span>
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Valide une réservation en attente</li>
                <li>• Permet au participant de télécharger son ticket</li>
                <li>• Ne peut plus être refusée après confirmation</li>
                <li>• Déclenche l'envoi d'un email de confirmation</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800 flex items-center space-x-2">
                <span>❌</span>
                <span>Refuser</span>
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Rejette définitivement une réservation en attente</li>
                <li>• Libère immédiatement une place dans l'événement</li>
                <li>• Envoie une notification au participant</li>
                <li>• Action réversible uniquement par admin</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-800 flex items-center space-x-2">
                <span>🚫</span>
                <span>Annuler (Admin)</span>
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Annule n'importe quelle réservation (même confirmée)</li>
                <li>• Utilisé en cas de force majeure ou problème technique</li>
                <li>• Libère la place et invalide le ticket</li>
                <li>• Action définitive et irréversible</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 text-lg">💡</span>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Conseil</h4>
                <p className="text-sm text-blue-700">
                  Utilisez les filtres pour consulter les réservations par événement ou rechercher un participant spécifique. 
                  Les actions de confirmation/refus ne sont disponibles que pour les réservations en attente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}