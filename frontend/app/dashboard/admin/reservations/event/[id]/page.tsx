// Page des réservations par événement spécifique
"use client";

export default function EventReservationsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Réservations pour l'Événement #{params.id}</h1>
      {/* Liste des participants et statuts des réservations */}
    </div>
  );
}