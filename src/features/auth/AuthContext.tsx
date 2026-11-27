import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { UsuarioDTO } from "../profile/types";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/usuarios/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = (await response.json()) as UsuarioDTO;
        setUser(data);
        return data;
      } else {
        setUser(null);
        return null;
      }
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de la sesión
    void checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/usuarios/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignorar errores de red al cerrar sesión
    } finally {
      setUser(null);
      window.location.assign("/");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
