import { useEffect, useRef, useState } from "react";
import type { RecomendacionLugarDto, ViajeDto } from "../../../types";
import { enviarMensajeAsistente } from "../../../api/asistente";
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
}

type ChatMessage = {
  id: string;
  rol: "user" | "assistant";
  contenido: string;
  recomendaciones?: RecomendacionLugarDto[];
  advertencia?: string | null;
};

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

function RecomendacionCard({ recomendacion }: { recomendacion: RecomendacionLugarDto }) {
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
      </div>
    </article>
  );
}

export function ChatTab({ viaje, numeroDia }: ChatTabProps) {
  const [inputText, setInputText] = useState("");
  const [mensajes, setMensajes] = useState<ChatMessage[]>([MENSAJE_BIENVENIDA]);
  const [enviando, setEnviando] = useState(false);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
