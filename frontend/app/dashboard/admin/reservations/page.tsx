"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Reservation {
  id: string;
  event: {
    id: string;
    title: string;
    date: string;
  };
  participant: {
    id: string;
    name: string;
    email: string;
  };
  status: "confirmed" | "pending" | "cancelled" | "refunded";
  ticketType: string;
  quantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReservationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("all");

  // Protection admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard/participant");
      return;
    }
  }, [user, isLoading, router]);

  // Simulation données réservations
  useEffect(() => {
    if (user && user.role === "admin") {
      setTimeout(() => {
        setReservations([
          {
            id: "R001",
            event: {
              id: "E001",
              title: "Concert Jazz Festival 2024",
              date: "2024-07-15"
            },
            participant: {
              id: "P001",
              name: "Jean Dupont",
              email: "jean.dupont@email.com"
            },
            status: "confirmed",
            ticketType: "VIP",
            quantity: 2,
            totalAmount: 180,
            createdAt: "2024-03-10T14:30:00Z",
            updatedAt: "2024-03-10T14:30:00Z"
          },
          {
            id: "R002",
            event: {
              id: "E002",
              title: "Atelier Cuisine Française",
              date: "2024-06-20"
            },
            participant: {
              id: "P002",
              name: "Marie Martin",
              email: "marie.martin@email.com"
            },
            status: "pending",
            ticketType: "Standard",
            quantity: 1,
            totalAmount: 75,
            createdAt: "2024-03-12T09:15:00Z",
            updatedAt: "2024-03-12T09:15:00Z"
          },
          {
            id: "R003",
            event: {
              id: "E003",
              title: "Conférence Tech Innovation",
              date: "2024-08-05"
            },
            participant: {
              id: "P003",
              name: "Pierre Durand",
              email: "pierre.durand@email.com"
            },
            status: "cancelled",
            ticketType: "Premium",
            quantity: 1,
            totalAmount: 120,
            createdAt: "2024-03-08T16:45:00Z",
            updatedAt: "2024-03-11T10:20:00Z"
          },
          {
            id: "R004",
            event: {
              id: "E001",
              title: "Concert Jazz Festival 2024", 
              date: "2024-07-15"
            },
            participant: {
              id: "P004",
              name: "Sophie Leroy",
              email: "sophie.leroy@email.com"
            },
            status: "confirmed",
            ticketType: "Standard", 
            quantity: 3,
            totalAmount: 210,
            createdAt: "2024-03-14T11:00:00Z",
            updatedAt: "2024-03-14T11:00:00Z"
          },
          {
            id: "R005",
            event: {
              id: "E004",
              title: "Exposition Art Moderne",
              date: "2024-09-12"
            },
            participant: {
              id: "P005",
              name: "Lucas Bernard",
              email: "lucas.bernard@email.com"
            },
            status: "refunded",
            ticketType: "VIP",
            quantity: 2,
            totalAmount: 160,
            createdAt: "2024-03-05T13:30:00Z",
            updatedAt: "2024-03-13T15:45:00Z"
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  // Afficher le loader pendant la vérification
  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-800">🎫</span>
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary-800">Gestion des Réservations</h2>
            <p className="text-primary-600">
              {isLoading ? "Vérification de vos permissions..." : "Accès administrateur requis"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filtrer les réservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || reservation.status === selectedStatus;
    const matchesEvent = selectedEvent === "all" || reservation.event.id === selectedEvent;
    
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const handleStatusChange = (reservationId: string, newStatus: Reservation["status"]) => {
    setReservations(prev => 
      prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: newStatus, updatedAt: new Date().toISOString() }
          : res
      )
    );
  };

  const getStatusStyle = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed": return "✅";
      case "pending": return "⏳";
      case "cancelled": return "❌";
      case "refunded": return "💰";
      default: return "❓";
    }
  };

  const uniqueEvents = [...new Set(reservations.map(r => r.event.title))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary-200 to-primary-300 p-3 rounded-xl">
                <span className="text-2xl">🎫</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-900">Gestion des Réservations</h1>
                <p className="text-primary-700 mt-1">
                  Administrez les réservations et gérez les demandes des participants
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Total Réservations</p>
                <p className="text-2xl font-bold text-primary-900">{reservations.length}</p>
              </div>
              <span className="text-3xl">🎫</span>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Confirmées</p>
                <p className="text-2xl font-bold text-green-600">{reservations.filter(r => r.status === 'confirmed').length}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{reservations.filter(r => r.status === 'pending').length}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-primary-900">
                  {reservations
                    .filter(r => r.status === 'confirmed')
                    .reduce((sum, r) => sum + r.totalAmount, 0)
                    .toLocaleString()}€
                </p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Rechercher une réservation
              </label>
              <input
                type="text"
                placeholder="ID, participant, événement..."
                className="w-full px-4 py-3 bg-white/60 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Événement
              </label>
              <select
                className="px-4 py-3 bg-white/60 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="all">Tous les événements</option>
                {uniqueEvents.map((eventTitle) => (
                  <option key={eventTitle} value={reservations.find(r => r.event.title === eventTitle)?.event.id}>
                    {eventTitle}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Statut
              </label>
              <select
                className="px-4 py-3 bg-white/60 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
                <option value="refunded">Remboursé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex space-x-2 justify-center mb-4">
                <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="text-primary-600">Chargement des réservations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-100/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">ID Réservation</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Participant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Événement</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Type/Quantité</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Montant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-primary-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-primary-800 font-medium">
                          {reservation.id}
                        </div>
                        <div className="text-xs text-primary-600">
                          {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-primary-900">{reservation.participant.name}</div>
                          <div className="text-sm text-primary-600">{reservation.participant.email}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-primary-900">{reservation.event.title}</div>
                          <div className="text-sm text-primary-600">
                            {new Date(reservation.event.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-primary-900">{reservation.ticketType}</div>
                          <div className="text-primary-600">Qté: {reservation.quantity}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary-900">
                          {reservation.totalAmount}€
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit ${getStatusStyle(reservation.status)}`}>
                          <span>{getStatusIcon(reservation.status)}</span>
                          {reservation.status === 'confirmed' && 'Confirmé'}
                          {reservation.status === 'pending' && 'En attente'}
                          {reservation.status === 'cancelled' && 'Annulé'}
                          {reservation.status === 'refunded' && 'Remboursé'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-xs font-medium"
                              >
                                ✅ Confirmer
                              </button>
                              <button
                                onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-medium"
                              >
                                ❌ Annuler
                              </button>
                            </>
                          )}
                          
                          {reservation.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'refunded')}
                              className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all text-xs font-medium"
                            >
                              💰 Rembourser
                            </button>
                          )}
                          
                          <button className="px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all text-xs font-medium">
                            📧 Contact
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredReservations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="text-primary-400 mb-2">
                          <span className="text-4xl">🔍</span>
                        </div>
                        <p className="text-primary-600">Aucune réservation trouvée avec ces critères</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions rapides */}  
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-primary-600">
            Affichage de {filteredReservations.length} réservation(s) sur {reservations.length} total
          </div>
          
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
              📧 Envoyer rappels
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
              📊 Exporter données
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}