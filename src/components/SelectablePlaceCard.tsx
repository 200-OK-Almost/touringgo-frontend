import type { LugarResumenDto } from "../api/types";
import { barrioLabel, formatearPuntuacion } from "../lib/format";
import { FaWheelchair } from "react-icons/fa";
import SmartImage from "./SmartImage";
import "./SelectableCard.css";
import "./SelectablePlaceCard.css";

export interface SelectablePlaceCardProps {
  lugar: LugarResumenDto;
  selected: boolean;
  onClick: () => void;
  selectionIndicator?: "radio" | "checkbox" | "none";
  showImage?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PinIcon() {
  return (
    <svg
      className="selectable-place-card__pin-icon"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      className="selectable-place-card__star-icon"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function SelectablePlaceCard({
  lugar,
  selected,
  onClick,
  selectionIndicator = "radio",
  showImage = false,
  disabled = false,
  className = "",
}: SelectablePlaceCardProps) {
  const puntuacion = formatearPuntuacion(lugar.puntuacion);
  const ubicacion = lugar.subzona
    ? `${barrioLabel(lugar.barrio)} • ${lugar.subzona}`
    : barrioLabel(lugar.barrio);
  const resenasTexto = `${lugar.cantidadResenas} ${
    lugar.cantidadResenas === 1 ? "reseña" : "reseñas"
  }`;

  return (
    <button
      type="button"
      role={selectionIndicator === "radio" ? "radio" : undefined}
      aria-checked={selectionIndicator !== "none" ? selected : undefined}
      disabled={disabled}
      className={`selectable-card-option selectable-place-card ${
        selected ? "selectable-card-option--selected" : ""
      } ${className}`.trim()}
      onClick={onClick}
    >
      {/* Encabezado: Barrio y Radio / Selector */}
      <div className="selectable-place-card__header">
        <span className="selectable-place-card__barrio">{ubicacion}</span>

        {selectionIndicator === "radio" && (
          <span className="selectable-card-option__radio" aria-hidden="true">
            {selected && <span className="selectable-card-option__radio-dot" />}
          </span>
        )}

        {selectionIndicator === "checkbox" && (
          <span className="selectable-card-option__checkbox" aria-hidden="true">
            {selected && (
              <svg
                className="selectable-card-option__check-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
        )}
      </div>

      {/* Contenido principal: Nombre y Dirección */}
      <div className="selectable-place-card__body">
        {showImage && (
          <div className="selectable-place-card__thumb">
            <SmartImage src={lugar.fotoPortadaUrl} alt={lugar.nombre} />
          </div>
        )}

        <div className="selectable-place-card__info">
          <h4 className="selectable-place-card__nombre">{lugar.nombre}</h4>
          <p className="selectable-place-card__direccion">
            <PinIcon />
            <span>{lugar.direccion}</span>
          </p>
        </div>
      </div>

      {/* Pie: Puntuación/Reseñas y Accesibilidad */}
      <div className="selectable-place-card__footer">
        <div className="selectable-place-card__rating">
          <span className="selectable-place-card__rating-score">
            <StarIcon />
            <span>{puntuacion ?? "—"}</span>
          </span>
          <span className="selectable-place-card__rating-count">
            ({resenasTexto})
          </span>
        </div>

        <div className="selectable-place-card__accessibility-wrapper">
          {lugar.accesibleMovilidadReducida ? (
            <span
              className="selectable-place-card__accessibility selectable-place-card__accessibility--accessible"
              title="Accesible para personas con movilidad reducida"
            >
              <FaWheelchair aria-hidden="true" />
              <span>Accesible (movilidad reducida)</span>
            </span>
          ) : (
            <span
              className="selectable-place-card__accessibility selectable-place-card__accessibility--not-accessible"
              title="No adaptado para personas con movilidad reducida"
            >
              <FaWheelchair aria-hidden="true" />
              <span>No adaptado</span>
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default SelectablePlaceCard;
