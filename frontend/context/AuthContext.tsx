"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  fullName: string;
  email: string;
  role: 'admin' | 'participant';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const authData = localStorage.getItem("auth");
        if (authData) {
          const parsed = JSON.parse(authData);
          if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
            setUser(parsed.user);
          } else {
            localStorage.removeItem("auth");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Identifiants invalides');
      }

      const data = await response.json();
      
      const userData: User = {
        id: data.user._id,
        fullName: data.user.fullName,
        email: data.user.email,
        role: data.user.roles && data.user.roles.length > 0 && 
              (data.user.roles[0].toLowerCase() === 'admin') ? 'admin' : 'participant',
      };

      const authData = {
        user: userData,
        token: data.access_token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      localStorage.setItem('auth', JSON.stringify(authData));
      localStorage.setItem('token', data.access_token);
      setUser(userData);
      
      redirectByRole(userData.role);
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw new Error(error instanceof Error ? error.message : 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      router.push("/auth/login?message=Inscription réussie ! Veuillez vous connecter.");
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    setUser(null);
    router.push("/auth/login");
  };

  const redirectByRole = (role: string) => {
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/participant"); 
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