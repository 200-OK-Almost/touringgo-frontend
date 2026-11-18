import { useState } from "react"
import type { ItinerarioViewModel, ViajeDto } from "../types"
import ViajeMap from "./ViajeMap"
import "./ViajeView.css"
import type { LugarDetalleDto } from "../../../api/types"
import { construirDiasViaje } from "../lib/diasViaje"
import { IoChatbubblesOutline, IoPaperPlane, IoPaperPlaneOutline, IoPeopleOutline, IoSettingsOutline, IoWalletOutline } from "react-icons/io5"
import DiaSelector from "./DiaSelector"
import DiaRecorrido from "./DiaRecorrido"
import { getDayAndMonth } from "../../../lib/format"
export interface ViajeViewProps {
  viaje: ViajeDto
  itinerariosViewModel: ItinerarioViewModel[] | null
  lugarPartida: LugarDetalleDto | null
}

export type PrimaryTab = "chat" | "miembros" | "ajustes";

function ViajeView({viaje, itinerariosViewModel, lugarPartida}: ViajeViewProps) {
  const [diaActual, setDiaActual] = useState(1);

  const panelWidth = 800;

  const { dias, warning } = construirDiasViaje(
    viaje.fechaInicio,
    viaje.fechaFin,
    viaje.itinerarios
  );

  const diaSeleccionado = dias.some((dia) => dia.numeroDia === diaActual)
    ? diaActual
    : dias[0]?.numeroDia ?? 1;

  const itinerarioActual = itinerariosViewModel?.find(
    i => i.itinerario.numeroDia === diaSeleccionado
  ) ?? null

  return (
    <div className="viaje-layout">
      <section className="viaje-mapa">
        <ViajeMap
          itinerarioViewModel={itinerarioActual}
          panelWidth={panelWidth}
        />
      </section>

      <section className="viaje-panel">
        <section className="viaje-chat">
          <div className="viaje-chat-left-column">
            <div className="viaje-chat-left-column-top">
              <button 
                className="viaje-chat-left-column-btn"
              >
                <IoChatbubblesOutline className="viaje-chat-left-column-icon"/>
              </button>
              <button 
                className="viaje-chat-left-column-btn"
              >
                <IoPeopleOutline className="viaje-chat-left-column-icon"/>
              </button>

            </div>
            <div className="viaje-chat-left-column-bottom">
              <button 
                className="viaje-chat-left-column-btn"
              >
                <IoSettingsOutline className="viaje-chat-left-column-icon"/>
              </button>
            </div>
          </div>
          <div className="viaje-chat-content">
            <div className="viaje-chat-header">
              <h2>{viaje.titulo}</h2>
            </div>
            <div className="viaje-chat-body">
              <div className="viaje-chat-message user-message">
                <div className="message-header">
                </div>
                <div className="message-body">
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam architecto nesciunt dolorum voluptates ut officiis nulla illo aut quisquam, perspiciatis iste ipsa vitae dolorem eum? Maiores autem suscipit non totam?
                  </p>
                </div>
              </div>
              <div className="viaje-chat-message ai-message">
                <div className="message-header">
                
                </div>
                <div className="message-body">
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam architecto nesciunt dolorum voluptates ut officiis nulla illo aut quisquam, perspiciatis iste ipsa vitae dolorem eum? Maiores autem suscipit non totam?
                  </p>
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam architecto nesciunt dolorum voluptates ut officiis nulla illo aut quisquam, perspiciatis iste ipsa vitae dolorem eum? Maiores autem suscipit non totam?
                  </p>
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam architecto nesciunt dolorum voluptates ut officiis nulla illo aut quisquam, perspiciatis iste ipsa vitae dolorem eum? Maiores autem suscipit non totam?
                  </p>
                </div>
              </div>
              <div className="viaje-chat-message user-message">
                <div className="message-header">
                
                </div>
                <div className="message-body">
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam architecto nesciunt dolorum voluptates ut officiis nulla illo aut quisquam, perspiciatis iste ipsa vitae dolorem eum? Maiores autem suscipit non totam?
                  </p>
                </div>
              </div>
              <div className="viaje-chat-message ai-message">
                <div className="message-header">
                </div>
                <div className="message-body">
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam architecto nesciunt dolorum voluptates ut officiis nulla illo aut quisquam, perspiciatis iste ipsa vitae dolorem eum? Maiores autem suscipit non totam?
                  </p>
                </div>
              </div>
            </div>
            <div className="viaje-chat-input-box">
              <textarea 
                className="viaje-chat-input"
                placeholder="Escribe una consulta a tu asistente de viaje"
                
              />
              <div
                className="viaje-chat-input-bottom"
              >
                <button
                  className="viaje-chat-send-btn"
                >
                  <IoPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="viaje-recorrido">
          <div className="viaje-recorrido-header">
            <DiaSelector 
              dias={dias}
              diaActual={diaSeleccionado}
              onDiaChange={setDiaActual}
            />
          </div>
          <div className="viaje-recorrido-body">
            <div className="viaje-recorrido-group">
              <h3>
                Día {itinerarioActual?.itinerario.numeroDia} - {getDayAndMonth(new Date(itinerarioActual?.itinerario.fecha!))}
              </h3>
              <div className="viaje-recorrido-paradas">
                <DiaRecorrido
                  paradasViewModel={itinerarioActual?.paradas ?? null}
                  lugarPartida={lugarPartida}
                />
              </div>
            </div>
            <div className="viaje-recorrido-footer">
              <p>Información sobre el recorrido...</p>
            </div>
          </div>
        </section>

      </section>

  </div>
  )
}
export default ViajeView