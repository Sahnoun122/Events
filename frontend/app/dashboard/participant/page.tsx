"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ParticipantNavbar from "./components/ParticipantNavbar";

export default function ParticipantDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.push("/auth/login");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenue dans votre espace
              </h1>
              <p className="text-gray-600">
                Découvrez et réservez des événements passionnants
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mes Réservations</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600">🎫</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Événements Disponibles</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600">📅</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tickets Téléchargeables</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-600">📄</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveSection("events")}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                >
                  <h3 className="font-medium text-green-900">Voir les Événements</h3>
                  <p className="text-sm text-green-600 mt-1">Découvrir et réserver des événements</p>
                </button>
                
                <button 
                  onClick={() => setActiveSection("tickets")}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                >
                  <h3 className="font-medium text-blue-900">Mes Tickets</h3>
                  <p className="text-sm text-blue-600 mt-1">Télécharger mes confirmations PDF</p>
                </button>
              </div>
            </div>
          </div>
        );
      
      case "events":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Événements Disponibles</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interface en construction</h3>
              <p className="text-gray-600">Fonctionnalités : Consulter liste et détails, effectuer une réservation</p>
            </div>
          </div>
        );
      
      case "my-reservations":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Réservations</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interface en construction</h3>
              <p className="text-gray-600">Fonctionnalités : Voir mes réservations, annuler selon les règles</p>
            </div>
          </div>
        );
      
      case "tickets":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Tickets</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interface en construction</h3>
              <p className="text-gray-600">Fonctionnalités : Télécharger tickets PDF pour réservations confirmées</p>
            </div>
          </div>
        );
      
      case "profile":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon Profil</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interface en construction</h3>
              <p className="text-gray-600">Fonctionnalités : Informations personnelles et paramètres</p>
            </div>
          </div>
        );
      
      default:
        return <div className="p-8">Section non trouvée</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ParticipantNavbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
}
