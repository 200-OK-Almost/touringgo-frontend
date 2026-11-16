import { useState } from "react";
import { Link } from "react-router-dom";
import { IoBriefcaseOutline } from "react-icons/io5";
import { useAuth } from "../../features/auth/auth-context";
import { UserMenu } from "../../features/auth/components/UserMenu";
import { ProfileModal } from "../../features/profile/components/ProfileModal";
import Logo from "../Logo";
import "./Navbar.css";
import MisViajesModal from "../../features/profile/components/MisViajesModal";
import { NuevoViajeButton } from "../../features/itinerarios/components/NuevoViajeButton";

export interface NavbarProps {
  showNuevoViaje?: boolean;
}

export default function Navbar({ showNuevoViaje = false }: NavbarProps) {
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
              type="button"
              className="mis-viajes-btn"
              onClick={() => setIsMisViajesOpen(true)}
              aria-label="Mis viajes"
            >
              <IoBriefcaseOutline aria-hidden="true" />
              <span className="mis-viajes-btn__label">Mis viajes</span>
            </button>
            {showNuevoViaje && <NuevoViajeButton variant="nav" />}
            <div className="nav-divider"/>
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
