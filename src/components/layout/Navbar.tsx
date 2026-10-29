import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { UserMenu } from "../../features/auth/components/UserMenu";
import Logo from "../Logo";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();

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
            <span className="nav-loading-text">Cargando...</span>
          </div>
        ) : isAuthenticated ? (
          <UserMenu />
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
