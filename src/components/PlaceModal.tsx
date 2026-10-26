import { useEffect, useRef, useState } from "react";
import { getLugar } from "../api/lugares";
import type { LugarDetalleDto } from "../api/types";
import { barrioLabel, formatearPuntuacion, origenLabel, precioLabel } from "../lib/format";
import SmartImage from "./SmartImage";
import "./PlaceModal.css";

interface PlaceModalProps {
  lugarId: string | null;
  onClose: () => void;
}

type ModalState =
  | { status: "loading" }
  | { status: "ok"; data: LugarDetalleDto }
  | { status: "error"; message: string };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ModalSkeleton() {
  return (
    <div className="modal-skeleton" aria-hidden="true">
      <div className="skeleton modal-skeleton__hero" />
      <div className="modal-skeleton__body">
        <div className="skeleton modal-skeleton__line" />
        <div className="skeleton modal-skeleton__line modal-skeleton__line--short" />
        <div className="skeleton modal-skeleton__line" />
        <div className="skeleton modal-skeleton__line modal-skeleton__line--mid" />
      </div>
    </div>
  );
}

interface ModalContentProps {
  data: LugarDetalleDto;
}

function ModalContent({ data }: ModalContentProps) {
  const puntuacion = formatearPuntuacion(data.puntuacion);
  const ubicacion = data.subzona ? `${barrioLabel(data.barrio)} • ${data.subzona}` : barrioLabel(data.barrio);
  const portada = data.fotos.find((f) => f.esPortada) ?? data.fotos[0];
  const resenas = `${data.cantidadResenas} ${data.cantidadResenas === 1 ? "reseña" : "reseñas"}`;

  return (
    <>
      <div className="modal__hero">
        <SmartImage src={portada?.url} alt={data.nombre} />
        <div className="modal__hero-overlay" />
        <div className="modal__hero-content">
          <div className="modal__hero-badges">
            <span className="modal__badge modal__badge--barrio">{ubicacion.toUpperCase()}</span>
            <span className="modal__badge modal__badge--precio">{precioLabel(data.nivelPrecio)}</span>
          </div>
          <h2 className="modal__title">{data.nombre}</h2>
        </div>
      </div>

      <div className="modal__body">
        <div className="modal__infobar">
          <span className="modal__rating">
            ★ {puntuacion ?? "—"} ({resenas})
          </span>
          <span className="modal__duration">
            <ClockIcon />
            Duración estimada: {data.duracionEstimadaMinutos} min
          </span>
        </div>

        <section className="modal__section">
          <h3 className="modal__section-title">ACERCA DEL LUGAR</h3>
          <p className="modal__text">{data.descripcion ?? "Sin descripción disponible."}</p>
        </section>

        <section className="modal__section">
          <h3 className="modal__section-title">UBICACIÓN</h3>
          <p className="modal__direccion">
            <PinIcon />
            {data.direccion}
          </p>
          <p className="modal__coords">
            Coordenadas: {data.latitud}, {data.longitud}
          </p>
        </section>

        <section className="modal__section">
          <h3 className="modal__section-title">CARACTERÍSTICAS</h3>
          <div className="modal__chips">
            {data.aptoNinos && <span className="feat-chip">Apto niños</span>}
            {data.accesibleMovilidadReducida && <span className="feat-chip">Movilidad reducida</span>}
            {data.esBajoTecho && <span className="feat-chip">Bajo techo (Modo lluvia)</span>}
            {data.esAlAireLibre && <span className="feat-chip">Al aire libre</span>}
            {data.categorias.map((c) => (
              <span key={c.id} className="feat-chip feat-chip--cat">
                {c.nombre}
              </span>
            ))}
          </div>
        </section>
      </div>

      <footer className="modal__footer">
        <span>ID: {data.id}</span>
        <span>Origen: {origenLabel(data.origen)}</span>
      </footer>
    </>
  );
}

interface PlaceDetailProps {
  lugarId: string;
  onRetry: () => void;
  onClose: () => void;
}

function PlaceDetail({ lugarId, onRetry, onClose }: PlaceDetailProps) {
  const [state, setState] = useState<ModalState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    getLugar(lugarId)
      .then((data) => {
        if (active) setState({ status: "ok", data });
      })
      .catch((err: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Error desconocido",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [lugarId]);

  if (state.status === "loading") return <ModalSkeleton />;

  if (state.status === "error") {
    return (
      <div className="modal__error" role="alert">
        <h3 className="modal__error-title">No pudimos cargar el detalle</h3>
        <p>{state.message}</p>
        <div className="modal__error-actions">
          <button type="button" className="modal__error-btn" onClick={onRetry}>
            Reintentar
          </button>
          <button type="button" className="modal__error-btn modal__error-btn--ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return <ModalContent data={state.data} />;
}

export default function PlaceModal({ lugarId, onClose }: PlaceModalProps) {
  const [attempt, setAttempt] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const open = lugarId !== null;

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Detalle del lugar"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={closeRef}
          className="modal__close"
          onClick={onClose}
          aria-label="Cerrar detalle"
        >
          <CloseIcon />
        </button>

        <div className="modal__scroll">
          <PlaceDetail
            key={`${lugarId}:${attempt}`}
            lugarId={lugarId}
            onRetry={() => setAttempt((a) => a + 1)}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
