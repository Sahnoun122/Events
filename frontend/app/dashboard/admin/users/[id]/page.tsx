// Page de profil utilisateur pour admin
"use client";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Profil Utilisateur #{params.id}</h1>
      {/* Informations détaillées et historique de l'utilisateur */}
    </div>
  );
}