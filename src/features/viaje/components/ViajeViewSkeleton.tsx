import "./ViajeView.css";
import "./DiaSelector.css";
import { LugarRecorridoCardSkeleton } from "./LugarRecorridoCardSkeleton";
import { SidebarCollapseIcon } from "./AsistentePanel";
import { IoSparkles } from "react-icons/io5";

interface ViajeViewSkeletonProps {
  isGenerating?: boolean; // When state is 'Borrador' or 'EnPlanificacion'
}

export function ViajeViewSkeleton({ isGenerating = false }: ViajeViewSkeletonProps) {
  return (
    <div className="viaje-layout">
      {/* Left Column */}
      <main className="viaje-content">
        <header className="viaje-header">
          <div className="viaje-header-info" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="skeleton" style={{ width: "240px", height: "28px", borderRadius: "6px" }} />
            <div className="skeleton" style={{ width: "150px", height: "16px", borderRadius: "4px" }} />
          </div>

          {/* DiaSelector Skeleton */}
          <div className="dia-selector-container">
            <div className="skeleton" style={{ width: "32px", height: "18px", borderRadius: "3px", marginBottom: "4px", alignSelf: "center"}} />
            <div className="dia-selector" style={{ gap: "0.35rem" }}>
              <div className="skeleton" style={{ width: "34px", height: "34px", borderRadius: "8px" }} />
              <div className="skeleton" style={{ width: "34px", height: "34px", borderRadius: "8px" }} />
              <div className="skeleton" style={{ width: "34px", height: "34px", borderRadius: "8px" }} />
            </div>
          </div>
        </header>

        <div className="recorrido-header">
          <div className="skeleton" style={{ width: "110px", height: "22px", borderRadius: "4px" }} />
        </div>

        {/* Map Skeleton */}
        <section className="viaje-mapa">
          <div
            className="skeleton"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "350px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {isGenerating ? "Diseñando ruta inteligente en el mapa..." : "Cargando mapa..."}
          </div>
        </section>

        {/* Itinerary Cards Skeleton */}
        <section className="viaje-recorrido">
          <div className="recorrido-dia">
            <LugarRecorridoCardSkeleton />
            <LugarRecorridoCardSkeleton />
          </div>
        </section>
      </main>

      {/* Right Sidebar Skeleton */}
      <aside className="viaje-sidebar">
        <div className="asistente-header">
          <div className="asistente-header-left">
            <IoSparkles className="asistente-header-icon" />
            <h3>Asistente</h3>
          </div>
          <div className="asistente-header-right">{SidebarCollapseIcon()}</div>
        </div>

        <div className="asistente-body" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="skeleton" style={{ width: "85%", height: "45px", borderRadius: "8px" }} />
          <div className="skeleton" style={{ width: "65%", height: "35px", borderRadius: "8px" }} />
        </div>

        <div className="asistente-footer">
          <div className="asistente-message-box">
            <input className="asistente-input" type="text" placeholder="Preparando asistente..." disabled />
          </div>
        </div>
      </aside>
    </div>
  );
}