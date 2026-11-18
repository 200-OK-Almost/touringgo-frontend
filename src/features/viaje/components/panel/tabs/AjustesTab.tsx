import type { ViajeDto } from "../../../types";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPricetagOutline,
  IoWalkOutline,
  IoWalletOutline,
} from "react-icons/io5";
import "./AjustesTab.css";

interface AjustesTabProps {
  viaje: ViajeDto;
}

export function AjustesTab({ viaje }: AjustesTabProps) {
  const formatearFecha = (fechaStr: string | null) => {
    if (!fechaStr) return "Sin fecha";
    const fecha = new Date(fechaStr);
    return isNaN(fecha.getTime())
      ? fechaStr
      : fecha.toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <div className="ajustes-tab">
      <div className="ajustes-tab__header">
        <h2>Ajustes del viaje</h2>
        <p className="ajustes-tab__subtitle">
          Configuración y preferencias establecidas para este viaje
        </p>
      </div>

      <div className="ajustes-tab__body">
        <div className="ajustes-tab__section">
          <h3>Detalles generales</h3>
          <div className="ajustes-tab__grid">
            <div className="ajustes-tab__field">
              <span className="ajustes-tab__field-label">
                <IoCalendarOutline /> Fechas
              </span>
              <span className="ajustes-tab__field-value">
                {formatearFecha(viaje.fechaInicio)} - {formatearFecha(viaje.fechaFin)}
              </span>
            </div>

            {viaje.barrio && (
              <div className="ajustes-tab__field">
                <span className="ajustes-tab__field-label">
                  <IoLocationOutline /> Barrio / Zona
                </span>
                <span className="ajustes-tab__field-value">{viaje.barrio}</span>
              </div>
            )}

            <div className="ajustes-tab__field">
              <span className="ajustes-tab__field-label">
                <IoWalletOutline /> Presupuesto
              </span>
              <span className="ajustes-tab__field-value">
                {viaje.nivelPresupuesto || "Estándar"}
              </span>
            </div>

            <div className="ajustes-tab__field">
              <span className="ajustes-tab__field-label">
                <IoWalkOutline /> Ritmo de caminata
              </span>
              <span className="ajustes-tab__field-value">
                {viaje.ritmoCaminata || "Moderado"}
              </span>
            </div>
          </div>
        </div>

        {viaje.direccionPartida && (
          <div className="ajustes-tab__section">
            <h3>Punto de partida</h3>
            <p className="ajustes-tab__partida">
              {viaje.nombrePuntoPartida && (
                <strong>{viaje.nombrePuntoPartida} - </strong>
              )}
              {viaje.direccionPartida}
            </p>
          </div>
        )}

        {viaje.categoriaCodigos && viaje.categoriaCodigos.length > 0 && (
          <div className="ajustes-tab__section">
            <h3>
              <IoPricetagOutline /> Categorías de interés
            </h3>
            <div className="ajustes-tab__chips">
              {viaje.categoriaCodigos.map((cat) => (
                <span key={cat} className="ajustes-tab__chip">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AjustesTab;
