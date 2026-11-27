import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../../api/client";
import LoginModal from "../../../components/LoginModal";
import PlaceCardSkeleton from "../../../components/PlaceCardSkeleton";
import SmartImage from "../../../components/SmartImage";
import { useAuth } from "../../auth/auth-context";
import { barrioLabel, categoriaLabel, formatearPuntuacion } from "../../../lib/format";
import { crearViajeRecomendado } from "../../viaje/api/viajes";
import { useItinerariosDestacados } from "../hooks/useItinerariosDestacados";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { construirViajeRecomendadoDto } from "../lib/recorridoRecomendado";
import type { ItinerarioDestacado } from "../types";
import "./ItinerariosDestacados.css";

const AUTOPLAY_MS = 6000;
const REANUDAR_TRAS_INTERACCION_MS = 8000;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

export default function ItinerariosDestacados() {
  const { itinerarios, loading } = useItinerariosDestacados();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const trackRef = useRef<HTMLDivElement | null>(null);
  const reanudarTimerRef = useRef<number | null>(null);
  const creandoRef = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [creandoId, setCreandoId] = useState<string | null>(null);
  const [errorCreacion, setErrorCreacion] = useState<string | null>(null);
  const [hoverActivo, setHoverActivo] = useState(false);
  const [focusActivo, setFocusActivo] = useState(false);
  const [pausaManual, setPausaManual] = useState(false);
  const [documentoOculto, setDocumentoOculto] = useState(
    () => typeof document !== "undefined" && document.hidden
  );
  const prefiereReducido = usePrefersReducedMotion();

  const actualizarFlechas = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const frame = requestAnimationFrame(actualizarFlechas);
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => actualizarFlechas())
        : null;
    resizeObserver?.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, [actualizarFlechas, itinerarios.length, loading]);

  const desplazar = useCallback(
    (direccion: -1 | 1) => {
      const track = trackRef.current;
      if (!track) return;

      const card = track.querySelector<HTMLElement>(".recorrido-card");
      const paso = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
      track.scrollBy({
        left: direccion * paso,
        behavior: prefiereReducido ? "auto" : "smooth",
      });
    },
    [prefiereReducido]
  );

  const pausarPorInteraccion = useCallback(() => {
    setPausaManual(true);

    if (reanudarTimerRef.current !== null) {
      window.clearTimeout(reanudarTimerRef.current);
    }

    reanudarTimerRef.current = window.setTimeout(() => {
      reanudarTimerRef.current = null;
      setPausaManual(false);
    }, REANUDAR_TRAS_INTERACCION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (reanudarTimerRef.current !== null) {
        window.clearTimeout(reanudarTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setDocumentoOculto(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (prefiereReducido) return;
    if (loading || itinerarios.length < 2) return;
    if (
      hoverActivo ||
      focusActivo ||
      pausaManual ||
      documentoOculto ||
      loginOpen ||
      creandoId
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const alFinal =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;

      if (alFinal) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        desplazar(1);
      }
    }, AUTOPLAY_MS);

    return () => window.clearInterval(interval);
  }, [
    prefiereReducido,
    loading,
    itinerarios.length,
    hoverActivo,
    focusActivo,
    pausaManual,
    documentoOculto,
    loginOpen,
    creandoId,
    desplazar,
  ]);

  const handleSelect = useCallback(
    async (itinerario: ItinerarioDestacado) => {
      if (creandoRef.current) {
        return;
      }

      if (!isAuthenticated) {
        setLoginOpen(true);
        return;
      }

      creandoRef.current = true;
      setCreandoId(itinerario.tema.id);
      setErrorCreacion(null);

      try {
        const dto = construirViajeRecomendadoDto(itinerario);
        const viaje = await crearViajeRecomendado(dto);
        navigate(`/viajes/${viaje.id}`);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setLoginOpen(true);
          return;
        }

        setErrorCreacion(
          error instanceof Error
            ? error.message
            : "No se pudo crear el recorrido."
        );
      } finally {
        creandoRef.current = false;
        setCreandoId(null);
      }
    },
    [isAuthenticated, navigate]
  );

  if (!loading && itinerarios.length === 0) {
    return null;
  }

  return (
    <section
      className="recorridos"
      aria-labelledby="recorridos-titulo"
      onMouseEnter={() => setHoverActivo(true)}
      onMouseLeave={() => setHoverActivo(false)}
      onFocusCapture={() => setFocusActivo(true)}
      onBlurCapture={() => setFocusActivo(false)}
      onPointerDown={pausarPorInteraccion}
      onTouchStart={pausarPorInteraccion}
    >
      <div className="recorridos__header">
        <div className="recorridos__heading">
          <span className="recorridos__badge">RECORRIDOS TENDENCIA</span>
          <h2 id="recorridos-titulo" className="recorridos__title">
            Inspirate con lo más elegido
          </h2>
          <p className="recorridos__subtitle">
            Cuatro recorridos armados con los lugares mejor puntuados de cada barrio.
            Elegí uno y planificá tu salida en segundos.
          </p>
        </div>

        <div className="recorridos__arrows">
          <button
            type="button"
            className="recorridos__arrow"
            onClick={() => desplazar(-1)}
            disabled={!canPrev}
            aria-label="Recorrido anterior"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            className="recorridos__arrow"
            onClick={() => desplazar(1)}
            disabled={!canNext}
            aria-label="Siguiente recorrido"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      {errorCreacion && (
        <p className="recorridos__error" role="alert">
          {errorCreacion}
        </p>
      )}

      <div
        className="recorridos__track"
        ref={trackRef}
        onScroll={actualizarFlechas}
        aria-busy={loading}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div className="recorrido-skeleton" key={index} aria-hidden="true">
                <PlaceCardSkeleton />
              </div>
            ))
          : itinerarios.map((itinerario) => {
              const puntuacion = formatearPuntuacion(itinerario.promedioPuntuacion);
              const categoria = itinerario.tema.categoriaCodigo
                ? categoriaLabel(itinerario.tema.categoriaCodigo)
                : "Lugares tendencia";
              const creando = creandoId === itinerario.tema.id;

              return (
                <button
                  type="button"
                  key={itinerario.tema.id}
                  className={`recorrido-card${creando ? " recorrido-card--creando" : ""}`}
                  onClick={() => void handleSelect(itinerario)}
                  disabled={creandoId !== null}
                  aria-busy={creando}
                  aria-label={`Planificar el recorrido ${itinerario.tema.titulo}`}
                >
                  <div className="recorrido-card__media">
                    <SmartImage src={itinerario.portadaUrl} alt={itinerario.tema.titulo} />
                    <span className="recorrido-card__scrim" aria-hidden="true" />
                    <span className="recorrido-card__badge recorrido-card__badge--paradas">
                      {itinerario.lugares.length} paradas
                    </span>
                    {puntuacion && (
                      <span className="recorrido-card__badge recorrido-card__badge--rating">
                        ★ {puntuacion}
                      </span>
                    )}
                    <span className="recorrido-card__icono" aria-hidden="true">
                      {itinerario.tema.icono}
                    </span>
                  </div>

                  <div className="recorrido-card__body">
                    <span className="recorrido-card__meta">
                      {barrioLabel(itinerario.tema.barrio)} · {categoria}
                    </span>
                    <h3 className="recorrido-card__titulo">{itinerario.tema.titulo}</h3>
                    <p className="recorrido-card__descripcion">{itinerario.tema.descripcion}</p>

                    <div className="recorrido-card__lugares">
                      {itinerario.lugares.map((lugar) => (
                        <span key={lugar.id} className="recorrido-card__lugar-chip">
                          {lugar.nombre}
                        </span>
                      ))}
                    </div>

                    <span className="recorrido-card__cta">
                      {creando ? "Creando recorrido…" : "Planificar este recorrido →"}
                    </span>
                  </div>
                </button>
              );
            })}
      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </section>
  );
}
