import { useAuth } from "../AuthContext";
import { Avatar } from "../../../components/Avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownHeader,
} from "../../../components/Dropdown";
import "./UserMenu.css";

export interface UserMenuProps {
  onOpenProfile?: () => void;
  className?: string;
}

export function UserMenu({ onOpenProfile, className = "" }: UserMenuProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Dropdown align="right" className={`user-menu ${className}`}>
      <DropdownTrigger ariaLabel={`Menú de ${user.nombre}`}>
        <div className="user-menu-trigger">
          <Avatar
            src={user.fotoUrl}
            alt={user.nombre}
            name={user.nombre}
            size="sm"
          />
          <span className="user-menu-name">{user.nombre}</span>
          <svg
            className="user-menu-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </DropdownTrigger>

      <DropdownMenu className="user-menu-dropdown">
        <DropdownHeader>
          <div className="user-menu-header">
            <span className="user-menu-header-name">{user.nombre}</span>
            {user.email && (
              <span className="user-menu-header-email">{user.email}</span>
            )}
          </div>
        </DropdownHeader>

        <DropdownDivider />

        <DropdownItem
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          onClick={onOpenProfile}
        >
          Perfil
        </DropdownItem>

        <DropdownDivider />

        <DropdownItem
          variant="danger"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          }
          onClick={() => void logout()}
        >
          Salir / Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

