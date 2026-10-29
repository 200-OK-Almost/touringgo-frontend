import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import "./Dropdown.css";

interface DropdownContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  align: "left" | "right";
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

export function useDropdown(): DropdownContextValue {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdown must be used within a Dropdown component");
  }
  return context;
}

export interface DropdownProps {
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  children,
  align = "right",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, close]);

  // Cierra con la tecla Escape
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      close();
    }
  };

  return (
    <DropdownContext.Provider value={{ isOpen, open, close, toggle, align }}>
      <div
        ref={dropdownRef}
        className={`dropdown-container ${className}`}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function DropdownTrigger({
  children,
  className = "",
  ariaLabel = "Abrir menú",
}: DropdownTriggerProps) {
  const { isOpen, toggle } = useDropdown();

  return (
    <button
      type="button"
      className={`dropdown-trigger ${className}`}
      onClick={toggle}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuProps {
  children: ReactNode;
  className?: string;
}

export function DropdownMenu({
  children,
  className = "",
}: DropdownMenuProps) {
  const { isOpen, align } = useDropdown();

  if (!isOpen) return null;

  return (
    <div
      className={`dropdown-menu dropdown-menu--${align} ${className}`}
      role="menu"
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

export interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
  className?: string;
  closeOnClick?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  icon,
  variant = "default",
  disabled = false,
  className = "",
  closeOnClick = true,
}: DropdownItemProps) {
  const { close } = useDropdown();

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    }
    if (closeOnClick) {
      close();
    }
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={`dropdown-item dropdown-item--${variant} ${className}`}
      onClick={handleClick}
    >
      {icon && <span className="dropdown-item-icon">{icon}</span>}
      <span className="dropdown-item-text">{children}</span>
    </button>
  );
}

export interface DropdownDividerProps {
  className?: string;
}

export function DropdownDivider({ className = "" }: DropdownDividerProps) {
  return <div className={`dropdown-divider ${className}`} role="separator" />;
}

export interface DropdownHeaderProps {
  children: ReactNode;
  className?: string;
}

export function DropdownHeader({
  children,
  className = "",
}: DropdownHeaderProps) {
  return <div className={`dropdown-header ${className}`}>{children}</div>;
}

