import type { LugarResumenDto } from "../api/types";
import { barrioLabel, formatearPuntuacion, precioLabel } from "../lib/format";
import SmartImage from "./SmartImage";
import "./PlaceCard.css";

interface PlaceCardProps {
  lugar: LugarResumenDto;
  onClick: () => void;
}

function PinIcon() {
  return (
    <svg
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

export default function PlaceCard({ lugar, onClick }: PlaceCardProps) {
  const puntuacion = formatearPuntuacion(lugar.Puntuacion);
  const ubicacion = lugar.Subzona ? `${barrioLabel(lugar.Barrio)} • ${lugar.Subzona}` : barrioLabel(lugar.Barrio);
  const categoria = lugar.Categorias[0];

  return (
    <button type="button" className="place-card" onClick={onClick}>
      <div className="place-card__media">
        <SmartImage src={lugar.FotoPortadaUrl} alt={lugar.Nombre} />
        <span className="place-card__badge place-card__badge--barrio">{ubicacion}</span>
        {puntuacion && (
          <span className="place-card__badge place-card__badge--rating">★ {puntuacion}</span>
        )}
      </div>

      <div className="place-card__body">
        <div className="place-card__meta">
          <span className="place-card__categoria">{categoria}</span>
          <span className="place-card__precio">{precioLabel(lugar.NivelPrecio)}</span>
        </div>

        <h3 className="place-card__nombre">{lugar.Nombre}</h3>

        <p className="place-card__direccion">
          <PinIcon />
          {lugar.Direccion}
        </p>

        <div className="place-card__chips">
          {lugar.AptoNinos && <span className="attr-chip attr-chip--ninos">Niños</span>}
          {lugar.AccesibleMovilidadReducida && (
            <span className="attr-chip attr-chip--accesible">Accesible</span>
          )}
          {lugar.EsBajoTecho && <span className="attr-chip attr-chip--bajotecho">Bajo techo</span>}
        </div>

        <span className="place-card__link">Ver detalle →</span>
      </div>
    </button>
  );
}
