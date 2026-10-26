import type { ControlCuotaGoogleDto } from "../api/types";
import { useCuota } from "../hooks/useCuota";
import "./Header.css";

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </svg>
  );
}

type CuotaLevel = "ok" | "alta" | "critica";

function getCuotaLevel(data: ControlCuotaGoogleDto): { label: string; tone: CuotaLevel } {
  const porcentaje = (data.llamadasRealizadas / Math.max(1, data.limiteDiario)) * 100;
  if (porcentaje > 90) return { label: "CRÍTICA", tone: "critica" };
  if (porcentaje > 70) return { label: "ALTA", tone: "alta" };
  return { label: "OK", tone: "ok" };
}

export default function Header() {
  const cuota = useCuota();

  const connected = cuota.status === "ok";
  const statusTone = cuota.status === "loading" ? "loading" : connected ? "ok" : "error";
  const statusLabel =
    cuota.status === "loading" ? "Conectando…" : connected ? "Gateway Conectado" : "Gateway Desconectado";

  const cuotaLevel = cuota.status === "ok" ? getCuotaLevel(cuota.data) : null;

  return (
    <header className="explorer-header">
      <div className="explorer-header__brand">
        <span className="explorer-header__logo">
          <PinIcon />
        </span>
        <div className="explorer-header__titles">
          <div className="explorer-header__title-row">
            <h1 className="explorer-header__title">TouringGO</h1>
            <span className="explorer-header__api-badge">Lugares API</span>
          </div>
          <p className="explorer-header__subtitle">Catálogo curado &amp; Puntos de Interés de CABA</p>
        </div>
      </div>

      <div className="explorer-header__pills">
        <span className={`pill pill--${statusTone}`}>
          <span className="pill__dot" aria-hidden="true" />
          {statusLabel}
        </span>

        <span className="pill pill--cuota">
          <span className="pill__bolt">
            <BoltIcon />
          </span>
          <span className="pill__cuota-text">
            Cuota Google:{" "}
            {cuota.status === "ok" ? `${cuota.data.llamadasRealizadas} / ${cuota.data.limiteDiario}` : "— / —"}
          </span>
          <span className={`pill__badge ${cuotaLevel ? `pill__badge--${cuotaLevel.tone}` : "pill__badge--off"}`}>
            {cuotaLevel ? cuotaLevel.label : "—"}
          </span>
        </span>
      </div>
    </header>
  );
}
