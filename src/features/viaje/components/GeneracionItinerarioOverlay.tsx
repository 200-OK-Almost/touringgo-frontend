import { useEffect, useRef, useState } from "react";
import { IoCheckmark, IoMapOutline } from "react-icons/io5";
import "./GeneracionItinerarioOverlay.css";

export type EstadoGeneracion = "Borrador" | "EnPlanificacion";

const PASOS = [
  "Leyendo tus preferencias",
  "Buscando lugares para cada día",
  "Armando el recorrido",
  "Optimizando tiempos y distancias",
];

const INTERVALO_PASO_MS = 2200;

export interface GeneracionItinerarioOverlayProps {
  estado: EstadoGeneracion;
}

export function GeneracionItinerarioOverlay({
  estado,
}: GeneracionItinerarioOverlayProps) {
  const [pasoActivo, setPasoActivo] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPasoActivo((prev) => Math.min(prev + 1, PASOS.length - 1));
    }, INTERVALO_PASO_MS);

    return () => window.clearInterval(id);
  }, []);

  const detalle =
    estado === "Borrador"
      ? "Estamos preparando tu viaje con las preferencias que elegiste."
      : "Estamos generando las paradas y optimizando el recorrido de cada día.";

  return (
    <div
      className="generacion-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="generacion-overlay__card">
        <span className="generacion-overlay__icon" aria-hidden="true">
          <IoMapOutline />
          <span className="generacion-overlay__pulse" />
        </span>

        <h1 ref={titleRef} className="generacion-overlay__title" tabIndex={-1}>
          Estamos armando tu itinerario
        </h1>
        <p className="generacion-overlay__subtitle">
          {detalle} Turi está combinando tus fechas, zonas e intereses.
        </p>

        <ol className="generacion-overlay__steps">
          {PASOS.map((paso, index) => {
            const completado = index < pasoActivo;
            const activo = index === pasoActivo;

            return (
              <li
                key={paso}
                className={`generacion-overlay__step ${
                  activo ? "generacion-overlay__step--active" : ""
                } ${completado ? "generacion-overlay__step--done" : ""}`}
                aria-current={activo ? "step" : undefined}
              >
                <span
                  className="generacion-overlay__marker"
                  aria-hidden="true"
                >
                  {completado ? (
                    <IoCheckmark />
                  ) : activo ? (
                    <span className="generacion-overlay__spinner" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="generacion-overlay__step-label">{paso}</span>
              </li>
            );
          })}
        </ol>

        <div className="generacion-overlay__bar" aria-hidden="true">
          <span className="generacion-overlay__bar-fill" />
        </div>

        <p className="generacion-overlay__hint">
          Puede tardar unos segundos. No cierres esta pestaña.
        </p>
      </div>
    </div>
  );
}

export default GeneracionItinerarioOverlay;
