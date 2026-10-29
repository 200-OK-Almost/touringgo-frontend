import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import Logo from "../Logo";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <nav className="nav-container">
      <div className="nav-left-container">
        <Link to="/" className="nav-logo-link" aria-label="TouringGO">
          <Logo variant="color" className="nav-logo" />
        </Link>
      </div>
      <div className="nav-right-container">
        {isLoading ? (
          <div className="nav-profile-container">
            <span style={{ fontSize: "0.875rem", opacity: 0.7 }}>Cargando...</span>
          </div>
        ) : isAuthenticated && user ? (
          <div className="nav-profile-container">
            <p>{user.nombre}</p>
            <div>
              <button className="logout-btn" onClick={() => void logout()}>
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-profile-container">
            <button
              className="login-btn"
              onClick={() => window.location.assign("/api/usuarios/auth/google")}
            >
              Iniciar sesión con Google
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
