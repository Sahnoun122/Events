// Page des réservations par participant spécifique
"use client";

export default function ParticipantReservationsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Réservations du Participant #{params.id}</h1>
      {/* Historique complet des réservations du participant */}
    </div>
  );
}