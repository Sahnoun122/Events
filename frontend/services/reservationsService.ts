import { Reservation, CreateReservationDto, UpdateReservationDto, ReservationStats, ReservationStatus } from '@/types/reservation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ReservationsService {
  private async request(endpoint: string, options: RequestInit = {}) {
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

  async getAllReservations(filters?: {
    eventId?: string;
    participantId?: string;
    status?: ReservationStatus;
  }): Promise<Reservation[]> {
    let endpoint = 'reservations';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.eventId) params.append('eventId', filters.eventId);
      if (filters.participantId) params.append('participantId', filters.participantId);
      if (filters.status) params.append('status', filters.status);
      
      if (params.toString()) {
        endpoint += '?' + params.toString();
      }
    }
    
    return this.request(endpoint);
  }

  async getReservationsByEvent(eventId: string): Promise<Reservation[]> {
    return this.request(`reservations/event/${eventId}`);
  }

  async getReservationsByUser(userId: string): Promise<Reservation[]> {
    return this.request(`reservations/user/${userId}`);
  }

  async getMyReservations(): Promise<Reservation[]> {
    return this.request('reservations/me');
  }

  async getMyStats(): Promise<any> {
    return this.request('reservations/me/stats');
  }

  async getReservationById(id: string): Promise<Reservation> {
    return this.request(`reservations/${id}`);
  }

  async createReservation(eventId: string, reservationData?: CreateReservationDto): Promise<Reservation> {
    return this.request(`reservations/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(reservationData || {}),
    });
  }

  async updateReservationStatus(id: string, status: ReservationStatus, notes?: string): Promise<Reservation> {
    return this.request(`reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async confirmReservation(id: string, notes?: string): Promise<Reservation> {
    return this.request(`reservations/${id}/confirm`, {
      method: 'PATCH',
    });
  }

  async rejectReservation(id: string, notes?: string): Promise<Reservation> {
    return this.request(`reservations/${id}/refuse`, {
      method: 'PATCH',
    });
  }

  async cancelReservation(id: string): Promise<Reservation> {
    return this.request(`reservations/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async deleteReservation(id: string): Promise<void> {
    await this.request(`reservations/${id}`, {
      method: 'DELETE',
    });
  }

  async adminCancelReservation(id: string): Promise<Reservation> {
    return this.request(`reservations/${id}/admin-cancel`, {
      method: 'PATCH',
    });
  }

  async getReservationStats(): Promise<ReservationStats> {
    return this.request('reservations/stats');
  }

  async getDashboardStats(): Promise<any> {
    return this.request('reservations/admin/dashboard');
  }
}

export const reservationsService = new ReservationsService();