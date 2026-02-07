'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reservationsService } from '@/services/reservationsService';
import { ticketsService } from '@/services/ticketsService';
import { Reservation, ReservationStatus } from '@/types/reservation';

export default function ParticipantReservations() {
  const { user, isLoading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadReservations();
    }
  }, [user, authLoading]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationsService.getMyReservations();
      setReservations(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      setCancelingId(reservationId);
      await reservationsService.cancelReservation(reservationId);
      
      // Mettre à jour la liste locale
      setReservations(reservations.map(res => 
        res._id === reservationId 
          ? { ...res, status: ReservationStatus.CANCELED }
          : res
      ));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setCancelingId(null);
    }
  };

  const handleDownloadTicket = async (reservationId: string) => {
    try {
      setDownloadingId(reservationId);
      await ticketsService.downloadTicket(reservationId);
    } catch (error: any) {
      setError(`Erreur lors du téléchargement : ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const styles = {
      [ReservationStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      [ReservationStatus.CONFIRMED]: 'bg-green-100 text-green-800 border border-green-200',
      [ReservationStatus.CANCELED]: 'bg-gray-100 text-gray-800 border border-gray-200',
      [ReservationStatus.REFUSED]: 'bg-red-100 text-red-800 border border-red-200',
    };

    const texts = {
      [ReservationStatus.PENDING]: 'En attente',
      [ReservationStatus.CONFIRMED]: 'Confirmée',
      [ReservationStatus.CANCELED]: 'Annulée',
      [ReservationStatus.REFUSED]: 'Refusée',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {texts[status]}
      </span>
    );
  };

  const canCancelReservation = (reservation: Reservation) => {
    if (reservation.status === ReservationStatus.CANCELED || 
        reservation.status === ReservationStatus.REFUSED) {
      return false;
    }

    // Vérifier si l'événement n'est pas passé
    const eventDate = new Date(reservation.event.date);
    const now = new Date();
    
    // Permettre l'annulation jusqu'à 24h avant l'événement
    const cancelDeadline = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
    
    return now < cancelDeadline;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold text-[#8B7355] mb-2">
            Mes Réservations
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations d'événements
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button 
              onClick={loadReservations}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Réservations */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          {reservations.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Aucune réservation
              </h3>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore effectué de réservations.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard/participant/events'}
                className="bg-[#8B7355] text-white px-6 py-2 rounded-lg hover:bg-[#6B5B47] transition-colors"
              >
                Découvrir les événements
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Événement
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Lieu
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date de réservation
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation._id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#8B7355] to-[#6B5B47] rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {reservation.event.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {reservation.event.category}
                            </p>
                          </div>
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
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {reservation.event.location}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(reservation.status)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Bouton de téléchargement PDF - uniquement pour les réservations confirmées */}
                          {reservation.status === ReservationStatus.CONFIRMED && (
                            <button
                              onClick={() => handleDownloadTicket(reservation._id)}
                              disabled={downloadingId === reservation._id}
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                            >
                              {downloadingId === reservation._id ? (
                                <>
                                  <div className="w-3 h-3 border border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                                  <span>Téléchargement...</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span>PDF</span>
                                </>
                              )}
                            </button>
                          )}

                          {/* Bouton d'annulation */}
                          {canCancelReservation(reservation) ? (
                            <button
                              onClick={() => handleCancelReservation(reservation._id)}
                              disabled={cancelingId === reservation._id}
                              className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {cancelingId === reservation._id ? (
                                <div className="flex items-center space-x-1">
                                  <div className="w-3 h-3 border border-red-700 border-t-transparent rounded-full animate-spin"></div>
                                  <span>Annulation...</span>
                                </div>
                              ) : (
                                'Annuler'
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              {reservation.status === ReservationStatus.CANCELED ? 'Annulée' :
                               reservation.status === ReservationStatus.REFUSED ? 'Refusée' :
                               'Non modifiable'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Règles d'annulation et tickets */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mt-8 shadow-lg">
          <h2 className="text-xl font-semibold text-[#8B7355] mb-4">
            Règles et informations importantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Règles d'annulation */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Règles d'annulation</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Vous pouvez annuler votre réservation jusqu'à 24h avant l'événement</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Les réservations confirmées et en attente peuvent être annulées</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Les réservations refusées ou déjà annulées ne peuvent pas être modifiées</span>
                </div>
              </div>
            </div>

            {/* Informations tickets PDF */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Tickets PDF</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Les tickets PDF sont disponibles uniquement pour les réservations confirmées</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Le ticket contient toutes les informations nécessaires pour l'événement</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Présentez votre ticket PDF à l'entrée de l'événement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}