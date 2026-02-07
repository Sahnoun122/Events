'use client';

import { Event, EventStatus } from '@/types/event';
import { eventsService } from '@/services/eventsService';
import { useState } from 'react';

interface EventCardProps {
  event: Event;
  onEventUpdated: () => void;
  onEditEvent: (event: Event) => void;
}

export default function EventCard({ event, onEventUpdated, onEditEvent }: EventCardProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.PUBLISHED:
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Publié
          </span>
        );
      case EventStatus.CANCELED:
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Annulé
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Brouillon
          </span>
        );
    }
  };

  const handlePublish = async () => {
    setLoading('publish');
    try {
      await eventsService.publishEvent(event._id);
      onEventUpdated();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      alert('Erreur lors de la publication de l\'événement');
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cet événement ?')) return;
    
    setLoading('cancel');
    try {
      await eventsService.cancelEvent(event._id);
      onEventUpdated();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      alert('Erreur lors de l\'annulation de l\'événement');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cet événement ? Cette action est irréversible.')) return;
    
    setLoading('delete');
    try {
      await eventsService.deleteEvent(event._id);
      onEventUpdated();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'événement');
    } finally {
      setLoading(null);
    }
  };

  const isEventPast = new Date(event.date) < new Date();

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100 overflow-hidden">
      <div className="p-6">
        {/* En-tête avec titre et statut */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 pr-3">{event.title}</h3>
          {getStatusBadge(event.status)}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

        {/* Informations de l'événement */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={isEventPast ? 'text-red-600 font-medium' : ''}>{formatDate(event.date)}</span>
            {isEventPast && <span className="ml-2 text-red-500 text-sm">(Passé)</span>}
          </div>

          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{event.capacity} places</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {/* Bouton Modifier */}
          <button
            onClick={() => onEditEvent(event)}
            disabled={loading !== null}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Modifier</span>
          </button>

          {/* Bouton Publier (uniquement si brouillon) */}
          {event.status === EventStatus.DRAFT && (
            <button
              onClick={handlePublish}
              disabled={loading !== null}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading === 'publish' ? (
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{loading === 'publish' ? 'Publication...' : 'Publier'}</span>
            </button>
          )}

          {/* Bouton Annuler (uniquement si publié) */}
          {event.status === EventStatus.PUBLISHED && (
            <button
              onClick={handleCancel}
              disabled={loading !== null}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading === 'cancel' ? (
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{loading === 'cancel' ? 'Annulation...' : 'Annuler'}</span>
            </button>
          )}

          {/* Bouton Supprimer */}
          <button
            onClick={handleDelete}
            disabled={loading !== null}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          >
            {loading === 'delete' ? (
              <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            <span>{loading === 'delete' ? 'Suppression...' : 'Supprimer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}