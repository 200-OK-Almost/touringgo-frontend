import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import Logo from "../Logo";
import "./Navbar.css"

export default function Navbar() {
  const { auth, isAuthenticated, logout } = useAuth();

  return (
    <nav className="nav-container">
        <div className="nav-left-container">
            <Link to="/" className="nav-logo-link" aria-label="TouringGO">
                <Logo variant="color" className="nav-logo" />
            </Link>
        </div>
        <div className="nav-right-container">
            {isAuthenticated ? (
                <div className="nav-profile-container">
                    <p>{auth!.usuario.nombre}</p>
                    <div>
                        <button 
                            className="logout-btn"
                            onClick={logout}
                        >
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
