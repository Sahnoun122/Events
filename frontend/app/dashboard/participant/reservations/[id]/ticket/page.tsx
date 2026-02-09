"use client";

export default function TicketDownloadPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Télécharger mon Ticket</h1>
      {/* Génération et téléchargement du PDF de confirmation 
          uniquement si réservation confirmée */}
    </div>
  );
}