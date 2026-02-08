const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class TicketsService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const config: RequestInit = {
      headers: {
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

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Erreur de connexion vers ${url}`);
    }
  }

  async downloadTicket(reservationId: string): Promise<void> {
    try {
      const response = await this.request(`tickets/${reservationId}`);
      
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ticket_${reservationId}.pdf`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du ticket:', error);
      throw error;
    }
  }

  async previewTicket(reservationId: string): Promise<void> {
    try {
      const response = await this.request(`tickets/${reservationId}`);
      
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      
      window.open(url, '_blank');
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la prévisualisation du ticket:', error);
      throw error;
    }
  }
}

export const ticketsService = new TicketsService();