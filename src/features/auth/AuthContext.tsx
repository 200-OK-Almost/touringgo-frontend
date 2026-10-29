import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { UsuarioDTO } from "../profile/types";

interface AuthContextValue {
  user: UsuarioDTO | null;
  auth: { usuario: UsuarioDTO } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
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
        auth: user ? { usuario: user } : null,
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
