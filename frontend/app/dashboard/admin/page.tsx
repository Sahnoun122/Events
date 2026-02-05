"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AdminNavbar from "./components/AdminNavbar";

export default function AdminDashboard() {
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
                Tableau de bord Admin
              </h1>
              <p className="text-gray-600">
                Vue d'ensemble de la plateforme d'événements
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Événements à venir</p>
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
                    <p className="text-sm font-medium text-gray-500">Réservations en attente</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-600">⏳</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Taux de remplissage</p>
                    <p className="text-2xl font-bold text-gray-900">76%</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600">📊</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Utilisateurs actifs</p>
                    <p className="text-2xl font-bold text-gray-900">234</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-600">👥</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveSection("events")}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                >
                  <h3 className="font-medium text-blue-900">Créer un Événement</h3>
                  <p className="text-sm text-blue-600 mt-1">Organiser un nouvel événement</p>
                </button>
                
                <button 
                  onClick={() => setActiveSection("reservations")}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                >
                  <h3 className="font-medium text-green-900">Gérer Réservations</h3>
                  <p className="text-sm text-green-600 mt-1">Confirmer ou refuser des réservations</p>
                </button>
                
                <button 
                  onClick={() => setActiveSection("statistics")}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
                >
                  <h3 className="font-medium text-purple-900">Voir Statistiques</h3>
                  <p className="text-sm text-purple-600 mt-1">Analyser les performances</p>
                </button>
              </div>
            </div>
          </div>
        );
      
      case "events":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestion des Événements</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interface en construction</h3>
              <p className="text-gray-600">Fonctionnalités : Créer, modifier, publier, annuler des événements</p>
            </div>
          </div>
        );
      
      case "reservations":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestion des Réservations</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interface en construction</h3>
              <p className="text-gray-600">Fonctionnalités : Voir toutes, confirmer, refuser, annuler des réservations</p>
            </div>
          </div>
        );
      
      case "statistics":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Statistiques et Rapports</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interface en construction</h3>
              <p className="text-gray-600">Indicateurs : événements à venir, taux de remplissage, répartition par statut</p>
            </div>
          </div>
        );
      
      default:
        return <div className="p-8">Section non trouvée</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar 
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
