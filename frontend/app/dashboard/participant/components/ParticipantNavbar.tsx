"use client";

import { useState } from "react";
import { 
  CalendarIcon, 
  ClipboardDocumentListIcon, 
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  TicketIcon,
  UserIcon
} from "@heroicons/react/24/outline";

interface ParticipantNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

export default function ParticipantNavbar({ activeSection, setActiveSection, onLogout }: ParticipantNavbarProps) {
  const navItems = [
    { 
      id: "dashboard", 
      label: "Accueil", 
      icon: HomeIcon,
      description: "Vue d'ensemble de mes activités"
    },
    { 
      id: "events", 
      label: "Événements", 
      icon: CalendarIcon,
      description: "Consulter et réserver des événements"
    },
    { 
      id: "my-reservations", 
      label: "Mes Réservations", 
      icon: ClipboardDocumentListIcon,
      description: "Gérer mes réservations"
    },
    { 
      id: "tickets", 
      label: "Mes Tickets", 
      icon: TicketIcon,
      description: "Télécharger mes confirmations PDF"
    },
    { 
      id: "profile", 
      label: "Mon Profil", 
      icon: UserIcon,
      description: "Informations personnelles"
    },
  ];

  return (
    <nav className="bg-white shadow-lg border-r border-gray-200 w-72 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Mon Espace
          </h2>
          <p className="text-sm text-gray-500">
            Événements et réservations
          </p>
        </div>
        
        {/* Navigation Items */}
        <ul className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-start px-4 py-4 text-left rounded-xl transition-all duration-200 group ${
                    activeSection === item.id
                      ? "bg-green-50 text-green-700 shadow-sm border border-green-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  <Icon className={`h-6 w-6 mr-4 mt-0.5 flex-shrink-0 ${
                    activeSection === item.id ? "text-green-600" : "text-gray-400"
                  }`} />
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        
        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions Rapides</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveSection("events")}
              className="w-full flex items-center px-3 py-2 text-xs text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Voir les événements
            </button>
            <button 
              onClick={() => setActiveSection("tickets")}
              className="w-full flex items-center px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <TicketIcon className="h-4 w-4 mr-2" />
              Mes tickets PDF
            </button>
          </div>
        </div>
        
        {/* Info Panel */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Astuce</h3>
          <p className="text-xs text-blue-600">
            Vous pouvez annuler vos réservations selon les règles définies par l'organisateur.
          </p>
        </div>
        
        {/* Logout */}
        <div className="mt-auto pt-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
}