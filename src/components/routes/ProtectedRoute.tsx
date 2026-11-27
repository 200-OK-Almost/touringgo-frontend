import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-context";

export function ProtectedRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si no está logueado, redirigir a home o login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está logueado pero no completó la encuesta, forzar encuesta
  if (!user.completoEncuesta) {
    return <Navigate to="/encuesta-inicial" replace />;
  }

  // Si cumple todo, renderizar las rutas hijas
  return <Outlet />;
}