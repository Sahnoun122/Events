"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "participant";
  createdAt: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Protection admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard/participant");
      return;
    }
  }, [user, isLoading, router]);

  // Simulation données utilisateurs
  useEffect(() => {
    if (user && user.role === "admin") {
      setTimeout(() => {
        setUsers([
          {
            id: "1",
            name: "Admin Principal",
            email: "admin@admin.com",
            role: "admin",
            createdAt: "2024-01-15",
            isActive: true
          },
          {
            id: "2",
            name: "Jean Dupont",
            email: "jean.dupont@email.com",
            role: "participant",
            createdAt: "2024-02-10",
            isActive: true
          },
          {
            id: "3",
            name: "Marie Martin",
            email: "marie.martin@email.com", 
            role: "participant",
            createdAt: "2024-02-15",
            isActive: true
          },
          {
            id: "4",
            name: "Pierre Durand",
            email: "pierre.durand@email.com",
            role: "participant",
            createdAt: "2024-02-20",
            isActive: false
          },
          {
            id: "5",
            name: "Sophie Leroy",
            email: "sophie.leroy@email.com",
            role: "participant", 
            createdAt: "2024-03-01",
            isActive: true
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
            <span className="text-2xl font-bold text-primary-800">👤</span>
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary-800">Gestion des Utilisateurs</h2>
            <p className="text-primary-600">
              {isLoading ? "Vérification de vos permissions..." : "Accès administrateur requis"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && user.isActive) ||
                         (selectedStatus === "inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusToggle = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary-200 to-primary-300 p-3 rounded-xl">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-900">Gestion des Utilisateurs</h1>
                <p className="text-primary-700 mt-1">
                  Administrez et gérez les comptes utilisateurs de la plateforme
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
                <p className="text-primary-600 text-sm font-medium">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-primary-900">{users.length}</p>
              </div>
              <span className="text-3xl">👤</span>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Administrateurs</p>
                <p className="text-2xl font-bold text-primary-900">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <span className="text-3xl">👑</span>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Participants</p>
                <p className="text-2xl font-bold text-primary-900">{users.filter(u => u.role === 'participant').length}</p>
              </div>
              <span className="text-3xl">🎫</span>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-primary-900">{users.filter(u => u.isActive).length}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Rechercher un utilisateur
              </label>
              <input
                type="text"
                placeholder="Nom ou email..."
                className="w-full px-4 py-3 bg-white/60 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Rôle
              </label>
              <select
                className="px-4 py-3 bg-white/60 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="participant">Participant</option>
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
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white/40 backdrop-blur-sm border border-primary-100 rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex space-x-2 justify-center mb-4">
                <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="text-primary-600">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-100/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Rôle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Date d'inscription</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-primary-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-800">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-primary-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-primary-700">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {user.role === 'admin' ? '👑 Administrateur' : '🎫 Participant'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-primary-700">{user.createdAt}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(user.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                          }`}
                        >
                          {user.isActive ? '✅ Actif' : '❌ Inactif'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all text-sm font-medium">
                            Modifier
                          </button>
                          <button className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-primary-400 mb-2">
                          <span className="text-4xl">🔍</span>
                        </div>
                        <p className="text-primary-600">Aucun utilisateur trouvé avec ces critères</p>
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
            Affichage de {filteredUsers.length} utilisateur(s) sur {users.length} total
          </div>
          
          <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
            ➕ Ajouter un utilisateur
          </button>
        </div>
      </div>
    </div>
  );
}