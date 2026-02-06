const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class TicketsService {
  private async request(endpoint: string, options: RequestInit = {}) {
    // Nettoyer l'URL pour éviter les doubles slashes
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const config: RequestInit = {
      headers: {
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

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Erreur de connexion vers ${url}`);
    }
  }

  // Télécharger un ticket PDF pour une réservation confirmée
  async downloadTicket(reservationId: string): Promise<void> {
    try {
      const response = await this.request(`tickets/${reservationId}`);
      
      // Créer un blob à partir de la réponse
      const blob = await response.blob();
      
      // Créer un URL temporaire pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un élément <a> pour déclencher le téléchargement
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ticket_${reservationId}.pdf`;
      
      // Ajouter l'élément au DOM, cliquer dessus, puis le supprimer
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Libérer l'URL temporaire
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du ticket:', error);
      throw error;
    }
  }

  // Prévisualiser un ticket PDF dans un nouvel onglet
  async previewTicket(reservationId: string): Promise<void> {
    try {
      const response = await this.request(`tickets/${reservationId}`);
      
      // Créer un blob à partir de la réponse
      const blob = await response.blob();
      
      // Créer un URL temporaire pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Ouvrir le PDF dans un nouvel onglet
      window.open(url, '_blank');
      
      // Libérer l'URL après un délai (pour laisser le temps au navigateur de charger)
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