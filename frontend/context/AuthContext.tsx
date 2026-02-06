"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  fullName: string;
  email: string;
  role: 'admin' | 'participant' | 'organizer';
  avatar?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const store = localStorage.getItem("auth");
        if (store) {
          const authData = JSON.parse(store);
          if (authData.user) {
            setUser(authData.user);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données d\'authentification:', error);
        localStorage.removeItem("auth");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulation d'une API - à remplacer par votre vraie API
      const mockUser: User = {
        id: '1',
        fullName: email === 'admin@admin.com' ? 'Administrateur' : 'Utilisateur Test',
        email: email,
        role: email === 'admin@admin.com' ? 'admin' : 'participant',
        avatar: undefined,
        createdAt: new Date().toISOString()
      };

      const authData = {
        user: mockUser,
        token: 'mock-jwt-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
      };

      localStorage.setItem("auth", JSON.stringify(authData));
      setUser(mockUser);
      
      // Redirection automatique selon le rôle
      redirectByRole(mockUser.role);
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw new Error('Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulation d'une API - à remplacer par votre vraie API
      console.log('Inscription:', { fullName, email, password });
      
      // Redirection vers la page de connexion après inscription
      router.push("/auth/login?message=Inscription réussie ! Veuillez vous connecter.");
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw new Error('Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    router.push("/auth/login");
  };

  const redirectByRole = (role: string) => {
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "participant") {
      router.push("/dashboard/participant");
    } else if (role === "organizer") {
      router.push("/dashboard/organizer");
    } else {
      router.push("/dashboard/participant"); // Par défaut
    }
  };

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};