'use client';

import { useState } from 'react';
import { CreateEventDto } from '@/types/event';
import { eventsService } from '@/services/eventsService';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

export default function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
  const [formData, setFormData] = useState<CreateEventDto>({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await eventsService.createEvent(formData);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: 1,
      });
      onEventCreated();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-t-2xl p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Créer un nouvel événement</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'événement *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Entrez le titre de l'événement"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Décrivez votre événement..."
                disabled={loading}
              />
            </div>

            {/* Date et heure */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure *
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            {/* Capacité */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacité *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Nombre de places"
                disabled={loading}
              />
            </div>

            {/* Lieu */}
            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Lieu *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Adresse ou lieu de l'événement"
                disabled={loading}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Création...</span>
                </>
              ) : (
                <span>Créer l'événement</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}