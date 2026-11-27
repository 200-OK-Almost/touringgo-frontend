import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-context";

export function HomeRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Si está autenticado pero todavía no completó la encuesta -> forzar encuesta
  if (isAuthenticated && user && !user.completoEncuesta) {
    return <Navigate to="/encuesta-inicial" replace />;
  }

  // Si no está logueado, O si está logueado y ya completó la encuesta -> mostrar Home
  return <Outlet />;
}