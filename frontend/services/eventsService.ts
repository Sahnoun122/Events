import { Event, CreateEventDto, UpdateEventDto } from '@/types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class EventsService {
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

  async getAllEvents(): Promise<Event[]> {
    return this.request('events');
  }

  async getEvents(): Promise<Event[]> {
    return this.getPublicEvents();
  }

  async getPublicEvents(): Promise<Event[]> {
    return this.request('events/public');
  }

  async getEvent(id: string): Promise<Event> {
    return this.getEventById(id);
  }

  async getEventById(id: string): Promise<Event> {
    return this.request(`events/${id}`);
  }

  async createEvent(eventData: CreateEventDto): Promise<Event> {
    return this.request('events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: UpdateEventDto): Promise<Event> {
    return this.request(`events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  }

  async publishEvent(id: string): Promise<Event> {
    return this.request(`events/${id}/publish`, {
      method: 'PATCH',
    });
  }

  async cancelEvent(id: string): Promise<Event> {
    return this.request(`events/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async deleteEvent(id: string): Promise<void> {
    await this.request(`events/${id}`, {
      method: 'DELETE',
    });
  }

  async getEventStats(): Promise<any> {
    return this.request('events/admin/stats');
  }
}

export const eventsService = new EventsService();