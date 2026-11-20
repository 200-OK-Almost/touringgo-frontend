import "./ViajeView.css";
import "./DiaSelector.css";
import "./panel/ViajePanel.css"
import "./panel/PanelSidebarNav.css"
import "./panel/tabs/ChatTab.css"

import { IoChatbubblesOutline, IoMapOutline, IoPaperPlane, IoPeopleOutline, IoSettingsOutline } from "react-icons/io5";
import { LugarRecorridoCardSkeleton } from "./LugarRecorridoCardSkeleton";
interface ViajeViewSkeletonProps {
  isGenerating?: boolean; // When state is 'Borrador' or 'EnPlanificacion'
}

export function ViajeViewSkeleton({ isGenerating = false }: ViajeViewSkeletonProps) {
  return (
    <div className="viaje-layout">
      
        {/* map skeleton */}
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
        
        <aside
          className={`viaje-panel viaje-panel--desktop with-recorrido`}
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

            <div className="viaje-panel__primary-body">
              <div className="chat-tab">
                <div className="chat-tab__header">
                  <div 
                    className="skeleton"
                    style={{
                      height: 23,
                      width: "80%",
                      borderRadius: 10
                    }}
                  />
                </div>
          
                <div className="chat-tab__body">
                  <div className="chat-message user-message">
                    <div className="chat-message__body">
                      <div 
                        className="skeleton"
                        style={{
                          width: "18rem",
                          maxWidth: "100%",
                          height: 50,
                          backgroundColor: "transparent",
                          margin: "-16px -12px"
                        }}
                      />
                    </div>
                  </div>
          
                  <div className="chat-message ai-message">
                    <div className="chat-message__body">
                      <div 
                        className="skeleton"
                        style={{
                          width: "18rem",
                          maxWidth: "100%",
                          height: 100,
                          margin: "-16px -16px",
                          borderRadius: 16,
                          borderBottomLeftRadius: 4
                        }}
                      />
                    </div>
                  </div>
                </div>
          
                <div className="chat-tab__input-box">
                  <textarea
                    className="chat-tab__input"
                    placeholder="Escribe una consulta a tu asistente de viaje..."
                    disabled={true}
                  />
                  <div className="chat-tab__input-bottom">
                    <button
                      type="button"
                      className="chat-tab__send-btn"
                      aria-label="Enviar mensaje"
                      disabled={true}
                    >
                      <IoPaperPlane />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <div className="viaje-panel__secondary-wrapper">
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
          </div>
          
        </aside>

    </div>
  );
}