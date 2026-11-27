import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-context";

export function EncuestaRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si no está logueado, no puede hacer la encuesta
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Si ya completó la encuesta, no debe volver a entrar
  if (user.completoEncuesta) {
    return <Navigate to="/" replace />;
  }

  // Usuario logueado pendiente de encuesta
  return <Outlet />;
}