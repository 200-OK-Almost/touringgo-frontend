// import type { ControlCuotaGoogleDto } from "../api/types";
import { useCuota } from "../hooks/useCuota";
import "./Header.css";

// function BoltIcon() {
//   return (
//     <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//       <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
//     </svg>
//   );
// }
//
// type CuotaLevel = "ok" | "alta" | "critica";
//
// function getCuotaLevel(data: ControlCuotaGoogleDto): { label: string; tone: CuotaLevel } {
//   const porcentaje = (data.llamadasRealizadas / Math.max(1, data.limiteDiario)) * 100;
//   if (porcentaje > 90) return { label: "CRÍTICA", tone: "critica" };
//   if (porcentaje > 70) return { label: "ALTA", tone: "alta" };
//   return { label: "OK", tone: "ok" };
// }

export default function Header() {
  const cuota = useCuota();

  const connected = cuota.status === "ok";
  const statusTone = cuota.status === "loading" ? "loading" : connected ? "ok" : "error";
  const statusLabel =
    cuota.status === "loading" ? "Conectando…" : connected ? "Servicio Online" : "Servicio Offline";

  // const cuotaLevel = cuota.status === "ok" ? getCuotaLevel(cuota.data) : null;

  return (
    <header className="explorer-header">
      <div className="explorer-header__hero">
        <span className="explorer-header__badge">CATÁLOGO OFICIAL DE CABA</span>
        <h2 className="explorer-header__title">Explorá Buenos Aires</h2>
        <p className="explorer-header__subtitle">
          Descubrí más de 1.600 cafés de especialidad, bodegones, parques, museos y hoteles curados y verificados.
        </p>

        <div className="explorer-header__stats">
          <span className="stat-chip">📍 +1.650 Lugares Reales</span>
          <span className="stat-chip">🏙️ 5 Barrios Porteños</span>
          <span className="stat-chip">✨ Fotos 100% Verificadas</span>
          <span className="stat-chip">⚡ Búsqueda Instantánea</span>
        </div>
      </div>

      <div className="explorer-header__status-row">
        <span className={`pill pill--${statusTone}`} title="Estado de conexión con el backend">
          <span className="pill__dot" aria-hidden="true" />
          {statusLabel}
        </span>

        {/* 
        {cuota.status === "ok" && (
          <span className="pill pill--cuota" title="Cuota diaria de Google Places API">
            <span className="pill__bolt">
              <BoltIcon />
            </span>
            <span className="pill__cuota-text">
              Cuota Google: {cuota.data.llamadasRealizadas} / {cuota.data.limiteDiario}
            </span>
            <span className={`pill__badge ${cuotaLevel ? `pill__badge--${cuotaLevel.tone}` : "pill__badge--off"}`}>
              {cuotaLevel ? cuotaLevel.label : "—"}
            </span>
          </span>
        )}
        */}
      </div>
    </header>
  );
}
