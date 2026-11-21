import { useEffect, useRef, useState } from "react";
import type {
  AplicarAccionAsistenteDto,
  ItinerarioViewModel,
  RecomendacionLugarDto,
  ViajeDto,
} from "../../../types";
import {
  aplicarAccionAsistente,
  enviarMensajeAsistente,
} from "../../../api/asistente";
import SmartImage from "../../../../../components/SmartImage";
import { formatearPuntuacion } from "../../../../../lib/format";
import {
  IoLocationOutline,
  IoPaperPlane,
  IoStar,
} from "react-icons/io5";
import "./ChatTab.css";
import { TITULO_VIAJE_POR_DEFECTO } from "../../../lib/viajeTitulo";

interface ChatTabProps {
  viaje: ViajeDto;
  numeroDia: number;
  itinerarioActual: ItinerarioViewModel | null;
  onItinerarioActualizado: () => Promise<void>;
}

type ChatMessage = {
  id: string;
  rol: "user" | "assistant";
  contenido: string;
  recomendaciones?: RecomendacionLugarDto[];
  advertencia?: string | null;
  puedeAplicar?: boolean;
};

type TipoAccion = AplicarAccionAsistenteDto["tipo"];

const MENSAJE_BIENVENIDA: ChatMessage = {
  id: "bienvenida",
  rol: "assistant",
  contenido:
    "¡Hola! Soy Turi. Contame qué tipo de lugar buscás para este día y te recomiendo opciones del catálogo.",
};

function crearIdMensaje(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

interface RecomendacionCardProps {
  recomendacion: RecomendacionLugarDto;
  numeroDia: number;
  puedeAplicar: boolean;
  paradasActuales: ItinerarioViewModel["paradas"];
  aplicando: boolean;
  onAplicar: (
    recomendacion: RecomendacionLugarDto,
    tipo: TipoAccion,
    paradaId?: string
  ) => void;
}

function RecomendacionCard({
  recomendacion,
  numeroDia,
  puedeAplicar,
  paradasActuales,
  aplicando,
  onAplicar,
}: RecomendacionCardProps) {
  const puntuacion = formatearPuntuacion(recomendacion.puntuacion);
  const categoria = recomendacion.categorias[0]?.replaceAll("_", " ");

  return (
    <article className="chat-recomendacion">
      <div className="chat-recomendacion__thumb">
        <SmartImage
          src={recomendacion.fotoPortadaUrl}
          alt={recomendacion.nombre}
        />
      </div>

      <div className="chat-recomendacion__content">
        <h4 className="chat-recomendacion__nombre">{recomendacion.nombre}</h4>

        {(puntuacion || categoria) && (
          <div className="chat-recomendacion__meta">
            {puntuacion && (
              <span className="chat-recomendacion__rating">
                <IoStar />
                {puntuacion}
                {recomendacion.cantidadResenas > 0 && (
                  <span className="chat-recomendacion__resenas">
                    ({recomendacion.cantidadResenas})
                  </span>
                )}
              </span>
            )}
            {categoria && (
              <span className="chat-recomendacion__categoria">{categoria}</span>
            )}
          </div>
        )}

        {recomendacion.direccion && (
          <p className="chat-recomendacion__direccion">
            <IoLocationOutline />
            <span>{recomendacion.direccion}</span>
          </p>
        )}

        <p className="chat-recomendacion__motivo">{recomendacion.motivo}</p>

        {puedeAplicar && (
          <div className="chat-recomendacion__acciones">
            <button
              type="button"
              className="chat-recomendacion__btn"
              disabled={aplicando}
              onClick={() => onAplicar(recomendacion, "AgregarParada")}
            >
              Agregar al día {numeroDia}
            </button>

            {paradasActuales.length > 0 && (
              <select
                className="chat-recomendacion__select"
                value=""
                disabled={aplicando}
                aria-label="Reemplazar una parada"
                onChange={(event) => {
                  const paradaId = event.target.value;
                  if (paradaId) {
                    onAplicar(recomendacion, "ReemplazarParada", paradaId);
                  }
                }}
              >
                <option value="">Reemplazar parada...</option>
                {paradasActuales.map((parada) => (
                  <option key={parada.parada.id} value={parada.parada.id}>
                    {parada.parada.turno} · {parada.lugar.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function ChatTab({
  viaje,
  numeroDia,
  itinerarioActual,
  onItinerarioActualizado,
}: ChatTabProps) {
  const [inputText, setInputText] = useState("");
  const [mensajes, setMensajes] = useState<ChatMessage[]>([MENSAJE_BIENVENIDA]);
  const [enviando, setEnviando] = useState(false);
  const [aplicando, setAplicando] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [mensajes, enviando]);

  const handleSendMessage = async () => {
    const texto = inputText.trim();

    if (!texto || enviando) {
      return;
    }

    const usuarioMensaje: ChatMessage = {
      id: crearIdMensaje(),
      rol: "user",
      contenido: texto,
    };

    const historial = mensajes.slice(-6).map((mensaje) => ({
      rol: mensaje.rol,
      contenido: mensaje.contenido,
    }));

    setMensajes((prev) => [...prev, usuarioMensaje]);
    setInputText("");
    setEnviando(true);

    try {
      const respuesta = await enviarMensajeAsistente(viaje.id, {
        mensaje: texto,
        numeroDia,
        historial,
      });

      setMensajes((prev) => [
        ...prev,
        {
          id: crearIdMensaje(),
          rol: "assistant",
          contenido: respuesta.mensaje,
          recomendaciones: respuesta.recomendaciones,
          advertencia: respuesta.advertencia,
          puedeAplicar: respuesta.puedeAplicar,
        },
      ]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          id: crearIdMensaje(),
          rol: "assistant",
          contenido:
            "No pude consultar al asistente en este momento. Intentá de nuevo en unos segundos.",
          advertencia: null,
        },
      ]);
    } finally {
      setEnviando(false);
    }
  };

  const handleAplicar = async (
    recomendacion: RecomendacionLugarDto,
    tipo: TipoAccion,
    paradaId?: string
  ) => {
    const version = itinerarioActual?.itinerario.version;

    if (!version || aplicando) {
      return;
    }

    setAplicando(true);

    try {
      await aplicarAccionAsistente(viaje.id, {
        tipo,
        numeroDia,
        lugarId: recomendacion.lugarId,
        paradaId: paradaId ?? null,
        turno: null,
        version,
      });

      await onItinerarioActualizado();

      setMensajes((prev) => [
        ...prev,
        {
          id: crearIdMensaje(),
          rol: "assistant",
          contenido:
            tipo === "AgregarParada"
              ? `Listo, agregué “${recomendacion.nombre}” al día ${numeroDia}.`
              : `Listo, reemplacé una parada por “${recomendacion.nombre}”.`,
        },
      ]);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "No pude aplicar el cambio en el itinerario.";

      setMensajes((prev) => [
        ...prev,
        {
          id: crearIdMensaje(),
          rol: "assistant",
          contenido: mensaje,
          advertencia: "No se modificó el itinerario.",
        },
      ]);
    } finally {
      setAplicando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const paradasActuales = itinerarioActual?.paradas ?? [];
  const puedeAplicar = Boolean(itinerarioActual?.itinerario.version);

  return (
    <div className="chat-tab">
      <div className="chat-tab__header">
        <h2>{viaje.titulo || TITULO_VIAJE_POR_DEFECTO}</h2>
      </div>

      <div className="chat-tab__body" ref={bodyRef}>
        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`chat-message ${
              mensaje.rol === "user" ? "user-message" : "ai-message"
            }`}
          >
            <div className="chat-message__body">
              <p>{mensaje.contenido}</p>

              {mensaje.advertencia && (
                <p className="chat-message__advertencia">
                  {mensaje.advertencia}
                </p>
              )}

              {mensaje.recomendaciones && mensaje.recomendaciones.length > 0 && (
                <div className="chat-recomendaciones">
                  {mensaje.recomendaciones.map((recomendacion) => (
                    <RecomendacionCard
                      key={recomendacion.lugarId}
                      recomendacion={recomendacion}
                      numeroDia={numeroDia}
                      puedeAplicar={
                        Boolean(mensaje.puedeAplicar) && puedeAplicar
                      }
                      paradasActuales={paradasActuales}
                      aplicando={aplicando}
                      onAplicar={handleAplicar}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {enviando && (
          <div className="chat-message ai-message chat-message--loading">
            <div className="chat-message__body">
              <p>Turi está buscando lugares...</p>
            </div>
          </div>
        )}
      </div>

      <div className="chat-tab__input-box">
        <textarea
          className="chat-tab__input"
          placeholder="Escribe una consulta a tu asistente de viaje..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={enviando}
        />
        <div className="chat-tab__input-bottom">
          <button
            type="button"
            className="chat-tab__send-btn"
            onClick={handleSendMessage}
            disabled={enviando || !inputText.trim()}
            aria-label="Enviar mensaje"
          >
            <IoPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatTab;
