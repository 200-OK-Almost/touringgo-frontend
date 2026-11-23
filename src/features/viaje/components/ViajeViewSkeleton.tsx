import "./ViajeView.css";
import "./DiaSelector.css";
import "./panel/ViajePanel.css"
import "./panel/PanelSidebarNav.css"

import { IoChatbubblesOutline, IoMapOutline, IoPeopleOutline, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { LugarRecorridoCardSkeleton } from "./LugarRecorridoCardSkeleton";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

interface ViajeViewSkeletonProps {
  isGenerating?: boolean; // When state is 'Borrador' or 'EnPlanificacion'
}

function MapSkeleton({ isGenerating }: { isGenerating: boolean }) {
  return (
    <section className="viaje-mapa">
      <div
        className="skeleton"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "350px",
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
  );
}

function RecorridoSkeleton() {
  return (
    <section className="viaje-recorrido">
      <div className="viaje-recorrido__header">
        <div className="viaje-recorrido__header-row">
          <div className="dia-selector-container">
            <div className="dia-selector-label">
              <div
                className="skeleton"
                style={{
                  width: "40px", height: "18px", borderRadius: "3px", marginBottom: "4px", alignSelf: "center"
                }}/>
              </div>
              <div className="dia-selector">
                <div className="dia-selector__item">
                  <div
                    className="skeleton"
                    style={{
                      width: 47 + 12.8,
                      height: 34 + 7.2,
                      borderRadius: "8px",
                      margin: "-0.45rem -0.8rem"
                    }}
                  />
                </div>
                <div className="dia-selector__item">
                  <div
                    className="skeleton"
                    style={{
                      width: 47 + 12.8,
                      height: 34 + 7.2,
                      borderRadius: "8px",
                      margin: "-0.45rem -0.8rem"
                    }}
                  />
                </div>
                <div className="dia-selector__item">
                  <div
                    className="skeleton"
                    style={{
                      width: 47 + 12.8,
                      height: 34 + 7.2,
                      borderRadius: "8px",
                      margin: "-0.45rem -0.8rem"
                    }}
                  />
                </div>
              </div>
          </div>

        </div>
      </div>
      <div className="viaje-recorrido__body">
        <div className="viaje-recorrido__group">
          <div
            className="viaje-recorrido__day-title skeleton"
            style={{ width: "55%", height: "18px", borderRadius: 4 }}
          />

          <div className="viaje-recorrido__paradas">
            <LugarRecorridoCardSkeleton />
            <LugarRecorridoCardSkeleton />
            <LugarRecorridoCardSkeleton />
          </div>
        </div>

        <div className="viaje-recorrido__footer">
          <div
            className="skeleton"
            style={{
              width: "100%",
              height: 16,
              borderRadius: 6
            }}
          />
        </div>
      </div>
    </section>
  );
}

export function ViajeViewSkeleton({ isGenerating = false }: ViajeViewSkeletonProps) {
  const isMobile = useMediaQuery("(max-width: 900px)");

  if (isMobile) {
    return (
      <div className="viaje-layout">
        <MapSkeleton isGenerating={isGenerating} />

        <aside
          className="viaje-panel viaje-panel--mobile viaje-panel--collapsed"
          aria-label="Panel de viaje móvil"
        >
          <div className="viaje-panel__handle-btn">
            <div className="viaje-panel__handle-bar" />
          </div>

          <div className="viaje-panel__mobile-nav">
            <nav className="panel-sidebar-nav panel-sidebar-nav--mobile" aria-label="Navegación de secciones">
              <div className="panel-sidebar-nav__btn">
                <IoChatbubblesOutline className="panel-sidebar-nav__icon" />
                <span>Chat</span>
              </div>
              <div className="panel-sidebar-nav__btn">
                <IoMapOutline className="panel-sidebar-nav__icon" />
                <span>Recorrido</span>
              </div>
              <div className="panel-sidebar-nav__btn">
                <IoPeopleOutline className="panel-sidebar-nav__icon" />
                <span>Miembros</span>
              </div>
              <div className="panel-sidebar-nav__btn">
                <IoSettingsOutline className="panel-sidebar-nav__icon" />
                <span>Ajustes</span>
              </div>
            </nav>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="viaje-layout">
      <MapSkeleton isGenerating={isGenerating} />

      <aside
        className="viaje-panel viaje-panel--desktop with-recorrido chat-collapsed"
        aria-label="Panel de control del viaje"
      >
        <div className="viaje-panel__primary-card">
          <nav className="panel-sidebar-nav panel-sidebar-nav--desktop" aria-label="Navegación de secciones">
            <div className="panel-sidebar-nav__top">
              <div className="panel-sidebar-nav__btn">
                <IoChatbubblesOutline className="panel-sidebar-nav__icon" />
              </div>
              <div className="panel-sidebar-nav__btn">
                <IoPeopleOutline className="panel-sidebar-nav__icon" />
              </div>
              <div className="panel-sidebar-nav__btn">
                <IoWalletOutline className="panel-sidebar-nav__icon" />
              </div>
            </div>
            <div className="panel-sidebar-nav__bottom">
              <div className="panel-sidebar-nav__btn">
                <IoMapOutline className="panel-sidebar-nav__icon" />
              </div>
              <div className="panel-sidebar-nav__btn">
                <IoSettingsOutline className="panel-sidebar-nav__icon" />
              </div>
            </div>
          </nav>
        </div>

        <div className="viaje-panel__secondary-wrapper">
          <RecorridoSkeleton />
        </div>
      </aside>
    </div>
  );
}
