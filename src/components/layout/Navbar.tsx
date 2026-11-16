import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { UserMenu } from "../../features/auth/components/UserMenu";
import { ProfileModal } from "../../features/profile/components/ProfileModal";
import Logo from "../Logo";
import "./Navbar.css";
import MisViajesModal from "../../features/profile/components/MisViajesModal";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMisViajesOpen, setIsMisViajesOpen] = useState(false);

  return (
    <>
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
            <>
            <button
              onClick={() => setIsMisViajesOpen(true)}
            >
              <p>Mis viajes</p>
            </button>
            <UserMenu onOpenProfile={() => setIsProfileOpen(true)} />
            </>
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

      {isAuthenticated && (
        <>
        <MisViajesModal 
          isOpen={isMisViajesOpen}
          onClose={() => setIsMisViajesOpen(false)}
        />
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
        </>
      )}
    </>
  );
}
