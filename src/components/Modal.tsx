import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import "./Modal.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  className?: string;
  ariaLabel?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className = "",
  ariaLabel,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Bloquear scroll del body y guardar elemento activo
  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Enfocar el modal o botón de cerrar
    const timer = setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else {
        dialogRef.current?.focus();
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [isOpen]);

  // Manejo de teclado (Escape y Focus Trap)
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="generic-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title ?? "Ventana modal"}
        tabIndex={-1}
        className={`generic-modal generic-modal--${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="generic-modal__header">
            {title ? (
              <h2 className="generic-modal__title">{title}</h2>
            ) : (
              <span />
            )}
            {showCloseButton && (
              <button
                ref={closeButtonRef}
                type="button"
                className="generic-modal__close-btn"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="generic-modal__body">{children}</div>
      </div>
    </div>
  );
}
