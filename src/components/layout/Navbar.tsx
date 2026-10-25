import { useAuth } from "../../features/auth/AuthContext";
import "./Navbar.css"

export default function Navbar() {
  const { auth, isAuthenticated, logout } = useAuth();

  return (
    <nav className="nav-container">
        <div className="nav-left-container">
            <a>Turist<span>IA</span></a>
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
