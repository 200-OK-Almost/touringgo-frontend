import { useState } from "react";
import { Link } from "react-router-dom";
import { IoBriefcaseOutline, IoPersonAddOutline } from "react-icons/io5";
import { useAuth } from "../../features/auth/auth-context";
import { UserMenu } from "../../features/auth/components/UserMenu";
import { ProfileModal } from "../../features/profile/components/ProfileModal";
import Logo from "../Logo";
import "./Navbar.css";
import MisViajesModal from "../../features/profile/components/MisViajesModal";
import { NuevoViajeButton } from "../../features/itinerarios/components/NuevoViajeButton";
import UnirseViajeModal from "../UnirseViajeModal";
import GoogleLoginButton from "../GoogleLoginButton";

export interface NavbarProps {
  showNuevoViaje?: boolean;
}

export default function Navbar({ showNuevoViaje = false }: NavbarProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMisViajesOpen, setIsMisViajesOpen] = useState(false);
  const [isUnirseViajeOpen, setIsUnirseViajeOpen] = useState(false);

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
            {user?.completoEncuesta && 
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
            <button
              type="button"
              className="mis-viajes-btn"
              onClick={() => setIsUnirseViajeOpen(true)}
              aria-label="Unire a un viaje"
            >
              <IoPersonAddOutline aria-hidden="true" />
              <span className="mis-viajes-btn__label">Unirse a un viaje</span>
            </button>
            </>
            }
            {showNuevoViaje && <NuevoViajeButton variant="nav" />}
            <div className="nav-divider"/>
            <UserMenu onOpenProfile={() => setIsProfileOpen(true)} />
            </>
          ) : (
            <div className="nav-profile-container">
              <GoogleLoginButton />
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
        <UnirseViajeModal 
          isOpen={isUnirseViajeOpen}
          onClose={() => setIsUnirseViajeOpen(false)}
        />
        </>
      )}
    </>
  );
}
