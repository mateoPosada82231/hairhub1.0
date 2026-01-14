"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { api, AuthResponse, ApiError } from "@/lib/api";
import { UserRole } from "@/types";

interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  isWorker: boolean;
  isClient: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tiempo antes de expiración para refrescar (5 minutos antes)
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar timeout de refresh
  const clearRefreshTimeout = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  // Programar refresh automático del token
  const scheduleTokenRefresh = useCallback((expiresInMs: number) => {
    clearRefreshTimeout();
    
    // Programar refresh 5 minutos antes de que expire
    const refreshIn = Math.max(expiresInMs - REFRESH_THRESHOLD_MS, 0);
    
    if (refreshIn > 0) {
      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const response = await api.refreshToken(refreshToken);
            saveAuthData(response);
          }
        } catch {
          // Si falla el refresh, cerrar sesión
          clearAuthData();
        }
      }, refreshIn);
    }
  }, [clearRefreshTimeout]);

  // Guardar datos de autenticación
  const saveAuthData = useCallback((response: AuthResponse) => {
    localStorage.setItem("accessToken", response.access_token);
    localStorage.setItem("refreshToken", response.refresh_token);
    
    const userData: User = {
      id: response.user_id,
      email: response.email,
      fullName: response.full_name,
      role: response.role,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    // Programar refresh (asumimos 1 hora de vida del token si no viene en response)
    scheduleTokenRefresh(60 * 60 * 1000);
  }, [scheduleTokenRefresh]);

  // Limpiar datos de autenticación
  const clearAuthData = useCallback(() => {
    clearRefreshTimeout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  }, [clearRefreshTimeout]);

  // Refrescar sesión manualmente
  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;
    
    try {
      const response = await api.refreshToken(refreshToken);
      saveAuthData(response);
      return true;
    } catch {
      clearAuthData();
      return false;
    }
  }, [saveAuthData, clearAuthData]);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Programar refresh del token
          scheduleTokenRefresh(30 * 60 * 1000); // Refrescar en 30 min
        } catch {
          // Datos inválidos, intentar refresh
          if (refreshToken) {
            const success = await refreshSession();
            if (!success) {
              clearAuthData();
            }
          } else {
            clearAuthData();
          }
        }
      } else if (refreshToken) {
        // Intentar recuperar sesión con refresh token
        const success = await refreshSession();
        if (!success) {
          clearAuthData();
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };

    checkAuth();
    
    return () => {
      clearRefreshTimeout();
    };
  }, [refreshSession, clearAuthData, scheduleTokenRefresh, clearRefreshTimeout]);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    const response = await api.login({ email, password });
    saveAuthData(response);
  }, [saveAuthData]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignorar errores de API, siempre limpiar localmente
    } finally {
      clearAuthData();
    }
  }, [clearAuthData]);

  // Computed values para roles
  const isOwner = user?.role === "OWNER";
  const isWorker = user?.role === "WORKER";
  const isClient = user?.role === "CLIENT";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isOwner,
        isWorker,
        isClient,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
