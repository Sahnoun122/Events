'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { eventsService } from '@/services/eventsService';
import { reservationsService } from '@/services/reservationsService';
import { Event, EventStatus } from '@/types/event';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [existingReservation, setExistingReservation] = useState<any>(null);
  const [checkingReservation, setCheckingReservation] = useState(false);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventsService.getEvent(params.id);
      
      if (eventData.status !== EventStatus.PUBLISHED) {
        setError('Cet événement n\'est pas encore publié ou a été annulé');
        return;
      }
      
      setEvent(eventData);
      
      // Vérifier s'il y a une réservation existante
      await checkExistingReservation();
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingReservation = async () => {
    if (!user) return;
    
    try {
      setCheckingReservation(true);
      const myReservations = await reservationsService.getMyReservations();
      const existingRes = myReservations.find(res => res.event._id === params.id);
      setExistingReservation(existingRes);
    } catch (error) {
      console.warn('Impossible de vérifier les réservations existantes:', error);
    } finally {
      setCheckingReservation(false);
    }
  };

  useEffect(() => {
    if (user && params.id) {
      loadEvent();
    }
  }, [user, params.id]);

  const handleReservation = async () => {
    if (!event || !user) return;

    try {
      setReservationLoading(true);
      
      // Créer la réservation via l'API
      const reservation = await reservationsService.createReservation(event._id, {
        comment: '' // Vous pouvez ajouter un champ commentaire plus tard
      });
      
      setReservationSuccess(true);
      console.log('Réservation créée:', reservation);
      
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la réservation');
    } finally {
      setReservationLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDateStatus = (date: string) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Événement passé', color: 'text-gray-500', canBook: false };
    } else if (diffDays === 0) {
      return { label: "Aujourd'hui", color: 'text-red-600', canBook: true };
    } else if (diffDays === 1) {
      return { label: 'Demain', color: 'text-orange-600', canBook: true };
    } else if (diffDays <= 7) {
      return { label: 'Cette semaine', color: 'text-green-600', canBook: true };
    } else {
      return { label: 'À venir', color: 'text-blue-600', canBook: true };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-4">
              <svg className="animate-spin w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-lg text-gray-600">Chargement de l'événement...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Événement non trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {error || 'L\'événement demandé n\'existe pas ou n\'est plus disponible.'}
            </p>
            <Link 
              href="/dashboard/participant/events"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Retour aux événements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dateStatus = getDateStatus(event.date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/dashboard/participant" className="hover:text-primary-600">Dashboard</Link>
            <span>›</span>
            <Link href="/dashboard/participant/events" className="hover:text-primary-600">Événements</Link>
            <span>›</span>
            <span className="text-gray-900">{event.title}</span>
          </nav>
        </div>

        {/* Succès de réservation */}
        {reservationSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Votre réservation a été enregistrée avec succès !</p>
                <p className="text-sm">Vous recevrez une confirmation par email. Votre réservation est en attente de validation par l'organisateur.</p>
              </div>
            </div>
          </div>
        )}

        {/* Réservation existante */}
        {existingReservation && (
          <div className={`px-4 py-3 rounded-lg mb-6 ${
            existingReservation.status === 'CONFIRMED' ? 'bg-green-50 border border-green-200 text-green-700' :
            existingReservation.status === 'PENDING' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
            'bg-gray-50 border border-gray-200 text-gray-700'
          }`}>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {existingReservation.status === 'CONFIRMED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <div>
                <p className="font-medium">
                  {existingReservation.status === 'CONFIRMED' ? 'Votre réservation est confirmée' :
                   existingReservation.status === 'PENDING' ? 'Votre réservation est en attente' :
                   'Votre réservation a été traitée'}
                </p>
                <p className="text-sm">
                  Réservée le {new Date(existingReservation.reservationDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm overflow-hidden">
          {/* En-tête */}
          <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white p-8">
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                    {event.category || 'Aucune catégorie'}
                  </span>
                  <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                  <p className={`text-lg ${dateStatus.color === 'text-gray-500' ? 'text-white/60' : 'text-white/90'}`}>
                    {dateStatus.label}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm opacity-90">Places disponibles</p>
                    <p className="text-2xl font-bold">{event.maxParticipants || event.capacity}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Détails */}
          <div className="p-8 space-y-8">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Date et heure</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 font-medium">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Lieu</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 font-medium">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Participants</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 font-medium">Maximum {event.maxParticipants || event.capacity} personnes</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ Catégorie</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      {event.category || 'Aucune catégorie'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Description</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard/participant/events"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    ← Retour aux événements
                  </Link>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Affichage selon l'état de la réservation */}
                  {existingReservation ? (
                    <div className="flex items-center space-x-2">
                      <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                        existingReservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        existingReservation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {existingReservation.status === 'CONFIRMED' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                        <span className="font-medium">
                          {existingReservation.status === 'CONFIRMED' ? 'Réservation confirmée' :
                           existingReservation.status === 'PENDING' ? 'Réservation en attente' :
                           'Réservation traitée'}
                        </span>
                      </div>
                    </div>
                  ) : dateStatus.canBook && !reservationSuccess ? (
                    <button
                      onClick={handleReservation}
                      disabled={reservationLoading || checkingReservation}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {reservationLoading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Réservation en cours...</span>
                        </>
                      ) : checkingReservation ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Vérification...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Réserver ma place</span>
                        </>
                      )}
                    </button>
                  ) : reservationSuccess ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Réservation confirmée</span>
                    </div>
                  ) : (
                    <div className="px-8 py-3 bg-gray-200 text-gray-500 rounded-lg font-medium">
                      Réservations fermées
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-6 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Informations pratiques</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Arrivez 15 minutes avant le début</li>
              <li>• Présentez votre confirmation de réservation</li>
              <li>• Annulation possible jusqu'à 24h avant</li>
            </ul>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-primary-100 p-6 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">📞 Contact</h4>
            <div className="space-y-2 text-gray-600">
              <p>Pour toute question concernant cet événement :</p>
              <p>📧 events@eventspro.com</p>
              <p>📱 +33 1 23 45 67 89</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}