import { Reservation, CreateReservationDto, UpdateReservationDto, ReservationStats, ReservationStatus } from '@/types/reservation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ReservationsService {
  private async request(endpoint: string, options: RequestInit = {}) {
    // Nettoyer l'URL pour éviter les doubles slashes
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification s'il existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData: any = {};
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({}));
        }
        
        throw new Error(
          errorData.message || 
          `Erreur ${response.status}: ${response.statusText}. URL: ${url}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Erreur de connexion vers ${url}`);
    }
  }

  // Récupérer toutes les réservations (admin)
  async getAllReservations(): Promise<Reservation[]> {
    return this.request('reservations');
  }

  // Récupérer les réservations par événement
  async getReservationsByEvent(eventId: string): Promise<Reservation[]> {
    return this.request(`reservations/event/${eventId}`);
  }

  // Récupérer les réservations par utilisateur
  async getReservationsByUser(userId: string): Promise<Reservation[]> {
    return this.request(`reservations/user/${userId}`);
  }

  // Récupérer les réservations de l'utilisateur connecté
  async getMyReservations(): Promise<Reservation[]> {
    return this.request('reservations/me');
  }

  // Récupérer une réservation par ID
  async getReservationById(id: string): Promise<Reservation> {
    return this.request(`reservations/${id}`);
  }

  // Créer une nouvelle réservation
  async createReservation(eventId: string, reservationData?: CreateReservationDto): Promise<Reservation> {
    return this.request(`reservations/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(reservationData || {}),
    });
  }

  // Mettre à jour le statut d'une réservation (admin)
  async updateReservationStatus(id: string, status: ReservationStatus, notes?: string): Promise<Reservation> {
    return this.request(`reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Confirmer une réservation
  async confirmReservation(id: string, notes?: string): Promise<Reservation> {
    return this.updateReservationStatus(id, ReservationStatus.CONFIRMED, notes);
  }

  // Refuser une réservation
  async rejectReservation(id: string, notes?: string): Promise<Reservation> {
    return this.updateReservationStatus(id, ReservationStatus.REJECTED, notes);
  }

  // Annuler une réservation (participant)
  async cancelReservation(id: string): Promise<Reservation> {
    return this.request(`reservations/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  // Supprimer une réservation
  async deleteReservation(id: string): Promise<void> {
    await this.request(`reservations/${id}`, {
      method: 'DELETE',
    });
  }

  // Récupérer les statistiques des réservations
  async getReservationStats(): Promise<ReservationStats> {
    return this.request('reservations/stats');
  }
}

export const reservationsService = new ReservationsService();