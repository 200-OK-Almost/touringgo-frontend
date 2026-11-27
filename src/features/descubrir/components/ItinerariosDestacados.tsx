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
import { construirViajeRecomendadoDto } from "../lib/recorridoRecomendado";
import type { ItinerarioDestacado } from "../types";
import "./ItinerariosDestacados.css";

interface RecorridoCardProps {
  itinerario: ItinerarioDestacado;
  creando: boolean;
  disabled: boolean;
  ariaHidden?: boolean;
  onSelect: (itinerario: ItinerarioDestacado) => void;
}

function RecorridoCard({
  itinerario,
  creando,
  disabled,
  ariaHidden = false,
  onSelect,
}: RecorridoCardProps) {
  const puntuacion = formatearPuntuacion(itinerario.promedioPuntuacion);
  const categoria = itinerario.tema.categoriaCodigo
    ? categoriaLabel(itinerario.tema.categoriaCodigo)
    : "Lugares tendencia";

  return (
    <button
      type="button"
      className={`recorrido-card${creando ? " recorrido-card--creando" : ""}`}
      onClick={() => onSelect(itinerario)}
      disabled={disabled}
      aria-busy={creando}
      aria-hidden={ariaHidden || undefined}
      tabIndex={ariaHidden ? -1 : undefined}
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
}

export default function ItinerariosDestacados() {
  const { itinerarios, loading } = useItinerariosDestacados();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const creandoRef = useRef(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [creandoId, setCreandoId] = useState<string | null>(null);
  const [errorCreacion, setErrorCreacion] = useState<string | null>(null);
  const [documentoOculto, setDocumentoOculto] = useState(
    () => typeof document !== "undefined" && document.hidden
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setDocumentoOculto(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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

  const debeAnimar = itinerarios.length > 1;
  const pausado = documentoOculto || loginOpen || creandoId !== null;
  const trackClassName = [
    "recorridos__track",
    loading || !debeAnimar ? "recorridos__track--estatico" : "",
    pausado ? "recorridos__track--pausado" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="recorridos" aria-labelledby="recorridos-titulo">
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
      </div>

      {errorCreacion && (
        <p className="recorridos__error" role="alert">
          {errorCreacion}
        </p>
      )}

      <div className="recorridos__viewport">
        <div className={trackClassName} aria-busy={loading}>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div className="recorrido-skeleton" key={index} aria-hidden="true">
                <PlaceCardSkeleton />
              </div>
            ))
          ) : (
            <>
              {itinerarios.map((itinerario) => (
                <RecorridoCard
                  key={itinerario.tema.id}
                  itinerario={itinerario}
                  creando={creandoId === itinerario.tema.id}
                  disabled={creandoId !== null}
                  onSelect={handleSelect}
                />
              ))}
              {debeAnimar &&
                itinerarios.map((itinerario) => (
                  <RecorridoCard
                    key={`duplicado-${itinerario.tema.id}`}
                    itinerario={itinerario}
                    creando={creandoId === itinerario.tema.id}
                    disabled={creandoId !== null}
                    ariaHidden
                    onSelect={handleSelect}
                  />
                ))}
            </>
          )}
        </div>
      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </section>
  );
}
