"use client";

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Modifier l'Événement #{params.id}</h1>
    </div>
  );
}