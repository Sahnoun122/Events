'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reservationsService } from '@/services/reservationsService';
import { ticketsService } from '@/services/ticketsService';
import { Reservation, ReservationStatus } from '@/types/reservation';

export default function ParticipantTickets() {
  const { user, isLoading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadConfirmedReservations();
    }
  }, [user, authLoading]);

  const loadConfirmedReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const allReservations = await reservationsService.getMyReservations();
      
      // Filtrer pour ne garder que les réservations confirmées
      const confirmedReservations = allReservations.filter(
        reservation => reservation.status === ReservationStatus.CONFIRMED
      );
      setReservations(confirmedReservations);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (reservationId: string, eventTitle: string) => {
    try {
      setDownloadingId(reservationId);
      await ticketsService.downloadTicket(reservationId);
    } catch (error: any) {
      setError(`Erreur lors du téléchargement : ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreviewTicket = async (reservationId: string) => {
    try {
      setDownloadingId(reservationId);
      await ticketsService.previewTicket(reservationId);
    } catch (error: any) {
      setError(`Erreur lors de l'aperçu : ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
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
            Mes Tickets
          </h1>
          <p className="text-gray-600">
            Téléchargez vos tickets PDF pour les événements confirmés
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button 
              onClick={loadConfirmedReservations}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Tickets disponibles */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          {reservations.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Aucun ticket disponible
              </h3>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore de réservations confirmées. 
                <br />
                Les tickets sont disponibles uniquement pour les réservations confirmées par l'organisateur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/dashboard/participant/events'}
                  className="bg-[#8B7355] text-white px-6 py-2 rounded-lg hover:bg-[#6B5B47] transition-colors"
                >
                  Découvrir les événements
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard/participant/reservations'}
                  className="bg-white text-[#8B7355] border border-[#8B7355] px-6 py-2 rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors"
                >
                  Voir mes réservations
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {reservations.map((reservation) => (
                <div key={reservation._id} className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Header du ticket */}
                  <div className="bg-gradient-to-r from-[#8B7355] to-[#6B5B47] text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span className="font-medium">Ticket Confirmé</span>
                      </div>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Valide
                      </span>
                    </div>
                  </div>

                  {/* Contenu du ticket */}
                  <div className="p-6">
                    {reservation.event ? (
                      <>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {reservation.event.title}
                        </h3>
                        
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                            </svg>
                            <span>
                              {new Date(reservation.event.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {new Date(reservation.event.date).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-start text-gray-600">
                            <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-2">{reservation.event.location}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-lg font-bold text-gray-500 mb-2">
                          Événement introuvable
                        </div>
                        <div className="text-sm text-gray-400">
                          Les détails de cet événement ne sont plus disponibles
                        </div>
                      </div>
                    )}

                    {/* Informations réservation */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="text-xs text-gray-500 mb-1">Réservation</div>
                      <div className="text-sm text-gray-900">
                        Confirmée le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      {reservation.comment && (
                        <div className="text-xs text-gray-600 mt-1 italic">
                          "{reservation.comment}"
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadTicket(reservation._id, reservation.event?.title || 'Événement')}
                        disabled={downloadingId === reservation._id || !reservation.event}
                        className="flex-1 bg-[#8B7355] text-white hover:bg-[#6B5B47] px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {downloadingId === reservation._id ? (
                          <>
                            <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Téléchargement...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{!reservation.event ? 'Événement indisponible' : 'Télécharger PDF'}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handlePreviewTicket(reservation._id)}
                        disabled={downloadingId === reservation._id || !reservation.event}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations importantes */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mt-8 shadow-lg">
          <h2 className="text-xl font-semibold text-[#8B7355] mb-4">
            📱 Comment utiliser vos tickets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Avant l'événement :</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Téléchargez votre ticket PDF sur votre téléphone</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Imprimez une copie de sauvegarde</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Vérifiez les détails de l'événement</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Le jour J :</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Présentez votre ticket à l'accueil</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Ayez votre pièce d'identité avec vous</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Arrivez 15 minutes avant le début</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}