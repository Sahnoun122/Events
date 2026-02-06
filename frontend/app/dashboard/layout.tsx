"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Redirection si non connecté - utiliser useEffect pour éviter l'avertissement React
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-beige flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Ne pas rendre le contenu si pas connecté
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-beige">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-primary-600 hover:text-primary-800 hover:bg-primary-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="flex items-center space-x-2 ml-2 lg:ml-0">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold text-primary-800">EventsPro</span>
              </Link>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-100 rounded-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.405-3.405A9.963 9.963 0 0118 12a6 6 0 10-12 0c0 5.523 4.477 10 10 10z" />
                </svg>
                <span className="absolute top-0 right-0 block h-3 w-3 bg-red-400 rounded-full"></span>
              </button>

              {/* Menu profil */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-primary-700 hover:text-primary-800 p-2 rounded-md hover:bg-primary-100"
                >
                  <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                    <span className="text-primary-800 font-medium text-sm">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block font-medium">{user.fullName}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menu déroulant profil */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg shadow-lg py-2 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-primary-700 hover:bg-primary-100">
                      Mon profil
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-primary-700 hover:bg-primary-100">
                      Paramètres
                    </Link>
                    <hr className="my-1 border-primary-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar mobile overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky lg:top-16 z-50 lg:z-auto w-64 h-screen lg:h-screen-minus-16 glass-effect border-r border-primary-200 transition-transform duration-200 ease-in-out overflow-y-auto`}
        >
          <nav className="p-6">
            <div className="space-y-2">
              <Link
                href={user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/participant'}
                className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                </svg>
                <span>Tableau de bord</span>
              </Link>

              {/* Navigation pour les participants */}
              {user.role === 'participant' && (
                <>
                  <Link
                    href="/dashboard/participant/events"
                    className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Événements</span>
                  </Link>

                  <Link
                    href="/dashboard/participant/reservations"
                    className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Mes Réservations</span>
                  </Link>

                  <Link
                    href="/dashboard/participant/tickets"
                    className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Mes Tickets</span>
                  </Link>
                </>
              )}

              {/* Navigation pour les admins */}
              {user.role === 'admin' && (
                <>
                  <hr className="my-4 border-primary-200" />
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
                      Administration
                    </h3>
                  </div>
                  
                  <Link
                    href="/dashboard/admin"
                    className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span>Vue d'ensemble</span>
                  </Link>

                  <Link
                    href="/dashboard/admin/events"
                    className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Gestion Événements</span>
                  </Link>

                  <Link
                    href="/dashboard/admin/reservations"
                    className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Gestion Réservations</span>
                  </Link>

                  <Link
                    href="/dashboard/admin/users"
                    className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span>Gestion Utilisateurs</span>
                  </Link>

                  <Link
                    href="/dashboard/admin/statistics"
                    className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Statistiques</span>
                  </Link>
                </>
              )}

              {/* Bouton de déconnexion en bas */}
              <hr className="my-6 border-primary-200" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-medium transition-colors border border-red-200 hover:border-red-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>

            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
