import { useEffect, useRef, useState } from "react";
import type {
  AclaracionDto,
  AplicarAccionAsistenteDto,
  AsistenteCapacidadesDto,
  ItinerarioViewModel,
  RecomendacionLugarDto,
  ReferenciaParada,
  ViajeDto,
} from "../../../types";
import {
  aplicarAccionAsistente,
  enviarMensajeAsistente,
  getCapacidadesAsistente,
} from "../../../api/asistente";
import { ApiError } from "../../../../../api/client";
import SmartImage from "../../../../../components/SmartImage";
import { formatearPuntuacion } from "../../../../../lib/format";
import {
  IoClose,
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
  referenciaParada?: ReferenciaParada | null;
  onReferenciaUsada?: () => void;
  onItinerarioActualizado: () => Promise<void>;
}

type ChatMessage = {
  id: string;
  rol: "user" | "assistant";
  contenido: string;
  recomendaciones?: RecomendacionLugarDto[];
  advertencia?: string | null;
  puedeAplicar?: boolean;
  accion?: "recargar";
  aclaracion?: AclaracionDto | null;
  mensajeOriginal?: string;
};

type TipoAccion = AplicarAccionAsistenteDto["tipo"];

type ErrorChat = {
  contenido: string;
  advertencia?: string | null;
  accion?: "recargar";
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

function crearMensajeError(
  error: unknown,
  contexto: "consulta" | "aplicar"
): ErrorChat {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 429:
        return {
          contenido:
            "Demasiadas consultas al asistente. Esperá un momento antes de volver a intentar.",
          advertencia: error.retryAfterSeconds
            ? `Podés reintentar en ${error.retryAfterSeconds} segundos.`
            : "Podés reintentar en unos segundos.",
        };
      case 409:
        return {
          contenido:
            "El itinerario cambió desde que se generó esta recomendación.",
          advertencia:
            "Recargá el itinerario y volvé a pedir la sugerencia antes de aplicar.",
          accion: "recargar",
        };
      case 404:
        return {
          contenido:
            "No se encontró el viaje, el lugar o la parada solicitada.",
          advertencia: "Recargá la página para actualizar los datos del viaje.",
          accion: "recargar",
        };
      case 403:
        return {
          contenido:
            "Solo el administrador del viaje puede aplicar cambios al itinerario.",
        };
      case 400:
        return {
          contenido: error.message || "La acción solicitada no es válida.",
        };
      default:
        return {
          contenido:
            error.message ||
            "No se pudo completar la operación con el asistente.",
        };
    }
  }

  return {
    contenido:
      contexto === "consulta"
        ? "No pude consultar al asistente en este momento. Intentá de nuevo en unos segundos."
        : "No pude aplicar el cambio en el itinerario. Intentá de nuevo.",
  };
}

function construirMensajeAclaracion(
  mensajeOriginal: string,
  etiqueta: string
): string {
  const por = mensajeOriginal.match(/\bpor\b/i);

  if (por?.index !== undefined) {
    const deseo = mensajeOriginal.slice(por.index + por[0].length).trim();

    if (deseo) {
      return `Reemplazá ${etiqueta} por ${deseo}`;
    }
  }

  const despuesComa = mensajeOriginal.match(
    /,\s*(?:pon[eé]|agreg[aá]|sum[aá])\s+(.+)$/i
  );

  if (despuesComa?.[1]) {
    return `Reemplazá ${etiqueta} por ${despuesComa[1].trim()}`;
  }

  return `Reemplazá ${etiqueta}`;
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
  referenciaParada = null,
  onReferenciaUsada,
  onItinerarioActualizado,
}: ChatTabProps) {
  const [inputText, setInputText] = useState("");
  const [mensajes, setMensajes] = useState<ChatMessage[]>([MENSAJE_BIENVENIDA]);
  const [enviando, setEnviando] = useState(false);
  const [aplicando, setAplicando] = useState(false);
  const [recargando, setRecargando] = useState(false);
  const [capacidades, setCapacidades] = useState<AsistenteCapacidadesDto | null>(
    null
  );
  const [cargandoCapacidades, setCargandoCapacidades] = useState(true);
  const [errorCapacidades, setErrorCapacidades] = useState<string | null>(null);
  const [intentoCapacidades, setIntentoCapacidades] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let activo = true;

    getCapacidadesAsistente()
      .then((respuesta) => {
        if (activo) {
          setCapacidades(respuesta);
        }
      })
      .catch(() => {
        if (activo) {
          setCapacidades(null);
          setErrorCapacidades(
            "No se pudo verificar el estado del asistente."
          );
        }
      })
      .finally(() => {
        if (activo) {
          setCargandoCapacidades(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [intentoCapacidades]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [mensajes, enviando]);

  const asistenteHabilitado = capacidades?.habilitado === true;
  const asistenteNoDisponible = !cargandoCapacidades && !asistenteHabilitado;
  const bloqueado = cargandoCapacidades || asistenteNoDisponible;
  const referenciaActiva =
    referenciaParada?.numeroDia === numeroDia ? referenciaParada : null;

  const handleRecargar = async () => {
    if (recargando) {
      return;
    }

    setRecargando(true);

    try {
      await onItinerarioActualizado();
    } finally {
      setRecargando(false);
    }
  };

  const enviarTexto = async (textoOriginal: string) => {
    const texto = textoOriginal.trim();

    if (!texto || enviando || bloqueado) {
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
        referenciaLugarId: referenciaActiva?.lugarId ?? null,
        historial,
      });

      if (referenciaActiva) {
        onReferenciaUsada?.();
      }

      setMensajes((prev) => [
        ...prev,
        {
          id: crearIdMensaje(),
          rol: "assistant",
          contenido: respuesta.mensaje,
          recomendaciones: respuesta.recomendaciones,
          advertencia: respuesta.advertencia,
          puedeAplicar: respuesta.puedeAplicar,
          aclaracion: respuesta.aclaracion,
          mensajeOriginal: texto,
        },
      ]);
    } catch (error) {
      const errorChat = crearMensajeError(error, "consulta");

      setInputText(texto);
      setMensajes((prev) => [
        ...prev,
        {
          id: crearIdMensaje(),
          rol: "assistant",
          ...errorChat,
        },
      ]);
    } finally {
      setEnviando(false);
    }
  };

  const handleSendMessage = async () => {
    await enviarTexto(inputText);
  };

  const handleSeleccionarAclaracion = async (
    mensajeId: string,
    mensajeOriginal: string,
    etiqueta: string
  ) => {
    if (enviando || bloqueado) {
      return;
    }

    setMensajes((prev) =>
      prev.map((mensaje) =>
        mensaje.id === mensajeId ? { ...mensaje, aclaracion: null } : mensaje
      )
    );

    await enviarTexto(construirMensajeAclaracion(mensajeOriginal, etiqueta));
  };

  const handleAplicar = async (
    recomendacion: RecomendacionLugarDto,
    tipo: TipoAccion,
    paradaId?: string
  ) => {
    const version = itinerarioActual?.itinerario.version;

    if (!version || aplicando || bloqueado) {
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
      const errorChat = crearMensajeError(error, "aplicar");

      setMensajes((prev) => [
        ...prev,
        {
          id: crearIdMensaje(),
          rol: "assistant",
          ...errorChat,
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
  const puedeAplicar =
    asistenteHabilitado && Boolean(itinerarioActual?.itinerario.version);

  return (
    <div className="chat-tab">
      <div className="chat-tab__header">
        <h2>{viaje.titulo || TITULO_VIAJE_POR_DEFECTO}</h2>
      </div>

      <div className="chat-tab__body" ref={bodyRef}>
        {cargandoCapacidades && (
          <div className="chat-tab__status">Verificando asistente...</div>
        )}

        {asistenteNoDisponible && (
          <div className="chat-tab__status chat-tab__status--error">
            <p>
              {errorCapacidades ??
                "El asistente no está habilitado en este entorno."}
            </p>
            <button
              type="button"
              className="chat-tab__status-btn"
              onClick={() => {
                setCargandoCapacidades(true);
                setErrorCapacidades(null);
                setIntentoCapacidades((prev) => prev + 1);
              }}
            >
              Reintentar
            </button>
          </div>
        )}

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

              {mensaje.accion === "recargar" && (
                <button
                  type="button"
                  className="chat-message__action"
                  onClick={handleRecargar}
                  disabled={recargando}
                >
                  {recargando ? "Recargando..." : "Recargar itinerario"}
                </button>
              )}

              {mensaje.aclaracion && mensaje.aclaracion.opciones.length > 0 && (
                <div className="chat-aclaracion">
                  {mensaje.aclaracion.opciones.map((opcion) => (
                    <button
                      key={opcion.id}
                      type="button"
                      className="chat-aclaracion__opcion"
                      disabled={enviando || bloqueado}
                      onClick={() =>
                        handleSeleccionarAclaracion(
                          mensaje.id,
                          mensaje.mensajeOriginal ?? "",
                          opcion.etiqueta
                        )
                      }
                    >
                      {opcion.etiqueta}
                    </button>
                  ))}
                </div>
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
        {referenciaActiva && (
          <div className="chat-tab__referencia">
            <span className="chat-tab__referencia-texto">
              <IoLocationOutline />
              Cerca de {referenciaActiva.nombre}
            </span>
            <button
              type="button"
              className="chat-tab__referencia-quitar"
              onClick={onReferenciaUsada}
              aria-label="Quitar referencia de cercanía"
            >
              <IoClose />
            </button>
          </div>
        )}
        <textarea
          className="chat-tab__input"
          placeholder={
            bloqueado
              ? "Asistente no disponible"
              : "Escribe una consulta a tu asistente de viaje..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={enviando || bloqueado}
        />
        <div className="chat-tab__input-bottom">
          <button
            type="button"
            className="chat-tab__send-btn"
            onClick={handleSendMessage}
            disabled={enviando || bloqueado || !inputText.trim()}
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
