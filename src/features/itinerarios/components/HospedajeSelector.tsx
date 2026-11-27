import React, { useCallback, useEffect, useRef, useState } from "react";
import type { BarrioCaba, LugarFiltro, LugarResumenDto } from "../../../api/types";
import { getLugar, getLugares } from "../../../api/lugares";
import { SelectablePlaceCard } from "../../../components/SelectablePlaceCard";
import ChipGroup from "../../../components/ChipGroup";
import { BARRIOS } from "../../../lib/filtros";
import { barrioLabel } from "../../../lib/format";
import { IoClose, IoInformationCircleOutline, IoSearchOutline } from "react-icons/io5";
import "./HospedajeSelector.css";

const DEBOUNCE_BUSQUEDA_MS = 300;
const TAMANO_PAGINA = 8;

type LugarElegido = Pick<
  LugarResumenDto,
  "id" | "nombre" | "barrio" | "subzona" | "direccion"
>;

export interface HospedajeSelectorProps {
  puntoInicio: "HospedajePropio" | "HospedajeSugerido";
  barrio: BarrioCaba | null;
  selectedLugarId: string | null;
  onSelectLugar: (id: string | null, lugar?: LugarResumenDto | null) => void;
  error?: string;
}

export function HospedajeSelector({
  puntoInicio,
  barrio,
  selectedLugarId,
  onSelectLugar,
  error,
}: HospedajeSelectorProps) {
  const esPropio = puntoInicio === "HospedajePropio";

  // Barrio activo para el filtro de la sección
  const [selectedBarrio, setSelectedBarrio] = useState<BarrioCaba | null>(() => {
    return puntoInicio === "HospedajeSugerido" ? barrio : null;
  });

  // Estado del input de búsqueda y búsqueda aplicada
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Estado de resultados
  const [lugares, setLugares] = useState<LugarResumenDto[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Selección local del modo "Ya tengo lugar"
  const [lugarPendiente, setLugarPendiente] = useState<LugarResumenDto | null>(null);
  const [confirmado, setConfirmado] = useState<LugarElegido | null>(null);

  const debounceRef = useRef<number | undefined>(undefined);
  const fetchSeqRef = useRef(0);
  const prevPuntoInicioRef = useRef(puntoInicio);
  const prevbarrioRef = useRef(barrio);

  // Sincronización cuando cambia el tipo de puntoInicio o el barrio seleccionado arriba
  useEffect(() => {
    const puntoInicioChanged = prevPuntoInicioRef.current !== puntoInicio;
    const barrioChanged = prevbarrioRef.current !== barrio;

    if (puntoInicio === "HospedajeSugerido") {
      // Si cambió a recomendar hospedaje o cambió el barrio de inicio, sincronizar
      if (puntoInicioChanged || barrioChanged) {
        setSelectedBarrio(barrio);
      }
    } else if (puntoInicio === "HospedajePropio" && puntoInicioChanged) {
      // Si cambió a "Ya tengo lugar", mostrar sin filtro de barrio pre-aplicado
      setSelectedBarrio(null);
    }

    prevPuntoInicioRef.current = puntoInicio;
    prevbarrioRef.current = barrio;
  }, [puntoInicio, barrio]);

  // En modo propio, restaura el alojamiento ya elegido (draft o cambio de día)
  useEffect(() => {
    if (!esPropio) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetea la selección local al cambiar de día
    setLugarPendiente(null);

    if (!selectedLugarId) {
      setConfirmado(null);
      return;
    }

    let cancelado = false;

    getLugar(selectedLugarId)
      .then((lugar) => {
        if (!cancelado) {
          setConfirmado(lugar);
        }
      })
      .catch(() => {
        if (!cancelado) {
          setConfirmado(null);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [esPropio, selectedLugarId]);

  useEffect(() => () => window.clearTimeout(debounceRef.current), []);

  // Consulta a la API con paginación incremental (Ver más)
  const fetchLugares = useCallback(
    async (paginaDestino: number, acumular: boolean) => {
      if (puntoInicio === "HospedajeSugerido" && !selectedBarrio) {
        setLugares([]);
        setTotal(0);
        setPagina(1);
        setIsLoading(false);
        return;
      }

      const secuencia = ++fetchSeqRef.current;
      setIsLoading(true);
      setApiError(null);

      try {
        const filtro: LugarFiltro = {
          barrio: selectedBarrio ?? undefined,
          tipoLugar: "Alojamiento",
          busqueda: appliedSearch || undefined,
          pagina: paginaDestino,
          tamano: TAMANO_PAGINA,
        };

        const res = await getLugares(filtro);

        if (secuencia !== fetchSeqRef.current) {
          return;
        }

        setLugares((prev) =>
          acumular ? [...prev, ...res.items] : res.items
        );
        setTotal(res.total);
        setPagina(paginaDestino);
      } catch {
        if (secuencia === fetchSeqRef.current) {
          setApiError("No se pudieron cargar los alojamientos. Verificá tu conexión o intentá nuevamente.");
        }
      } finally {
        if (secuencia === fetchSeqRef.current) {
          setIsLoading(false);
        }
      }
    },
    [puntoInicio, selectedBarrio, appliedSearch]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial y al cambiar filtros
    fetchLugares(1, false);
  }, [fetchLugares]);

  // En modo propio la búsqueda se aplica sola al tipear (debounce)
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const valor = event.target.value;
    setSearchTerm(valor);

    if (!esPropio) {
      return;
    }

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setAppliedSearch(valor.trim());
    }, DEBOUNCE_BUSQUEDA_MS);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.clearTimeout(debounceRef.current);
    setAppliedSearch(searchTerm.trim());
  }

  function handleClearSearch() {
    window.clearTimeout(debounceRef.current);
    setSearchTerm("");
    setAppliedSearch("");
  }

  function handleConfirmarPendiente() {
    if (!lugarPendiente) {
      return;
    }

    onSelectLugar(lugarPendiente.id, lugarPendiente);
    setConfirmado(lugarPendiente);
    setLugarPendiente(null);
  }

  // Si es recomendación y aún no seleccionó barrio arriba, pedir que seleccione uno
  if (puntoInicio === "HospedajeSugerido" && !barrio) {
    return (
      <section className="hospedaje-selector" aria-label="Búsqueda de hospedaje">
        <div className="hospedaje-selector__aviso">
          <IoInformationCircleOutline className="hospedaje-selector__aviso-icon" size={24} />
          <div className="hospedaje-selector__aviso-text">
            <h4>Seleccioná un barrio para ver recomendaciones</h4>
            <p>
              Por favor, elegí primero un barrio en <strong>"¿Qué barrio querés recorrer?"</strong> para que podamos mostrarte hoteles cercanos recomendados.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const tituloSeccion = esPropio
    ? "Tu lugar de hospedaje"
    : selectedBarrio
      ? `Hoteles recomendados en ${barrioLabel(selectedBarrio)}`
      : "Hoteles recomendados";

  const subtitleSeccion = esPropio
    ? "Buscá por nombre o dirección y confirmá el punto de partida del día."
    : "Seleccioná el hotel donde te vas a alojar cerca de tu recorrido.";

  const mostrarBusqueda = !esPropio || !confirmado;

  return (
    <section className="hospedaje-selector" aria-label="Búsqueda de hospedaje">
      <div className="hospedaje-selector__header">
        <h3 className="hospedaje-selector__title">{tituloSeccion}</h3>
        <p className="hospedaje-selector__subtitle">{subtitleSeccion}</p>
      </div>

      {esPropio && confirmado && (
        <div className="hospedaje-elegido">
          <span className="hospedaje-elegido__label">
            Punto de partida confirmado
          </span>
          <span className="hospedaje-elegido__nombre">{confirmado.nombre}</span>
          <span className="hospedaje-elegido__detalle">
            {confirmado.direccion} · {barrioLabel(confirmado.barrio)}
          </span>
          <button
            type="button"
            className="hospedaje-elegido__cambiar"
            onClick={() => setConfirmado(null)}
          >
            Cambiar alojamiento
          </button>
        </div>
      )}

      {mostrarBusqueda && (
        <>
          {/* Barra de búsqueda con autocompletado en modo propio */}
          <form onSubmit={handleSearchSubmit} className="hospedaje-selector__search-form">
            <div className="search-box hospedaje-selector__search-box">
              <span className="search-box__icon">
                <IoSearchOutline size={18} />
              </span>
              <input
                type="search"
                className="search-box__input"
                placeholder={
                  esPropio
                    ? "Ej: Hotel Palermo, Thames 1234"
                    : "Buscar por nombre de hotel o dirección..."
                }
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label={
                  esPropio
                    ? "Buscar alojamiento por nombre o dirección"
                    : "Buscar por nombre de hotel o dirección"
                }
              />
              {searchTerm && (
                <button
                  type="button"
                  className="hospedaje-selector__clear-btn"
                  onClick={handleClearSearch}
                  title="Limpiar búsqueda"
                  aria-label="Limpiar búsqueda"
                >
                  <IoClose aria-hidden="true" />
                </button>
              )}
            </div>
            {!esPropio && (
              <button type="submit" className="hospedaje-selector__search-btn">
                Buscar
              </button>
            )}
          </form>

          {/* Filtros por barrio con chips reutilizados */}
          <div className="hospedaje-selector__barrios">
            <span className="hospedaje-selector__label">FILTRAR POR BARRIO</span>
            <ChipGroup
              variant="ink"
              allLabel="Todos"
              options={BARRIOS}
              value={selectedBarrio}
              onChange={(b) => setSelectedBarrio(b)}
              isOptionDisabled={
                puntoInicio === "HospedajeSugerido" && barrio
                  ? (val) => val !== barrio
                  : undefined
              }
              disabledTooltip={
                puntoInicio === "HospedajeSugerido"
                  ? `Solo se muestran hospedajes del barrio seleccionado${barrio ? ` (${barrioLabel(barrio)})` : ""}`
                  : undefined
              }
            />
          </div>

          {/* Mensaje de error de validación si existe */}
          {error && (
            <div
              id="hospedaje-error"
              className="planificacion-field-error"
              role="alert"
              tabIndex={-1}
            >
              <p>{error}</p>
            </div>
          )}

          {/* Contador de resultados y estado */}
          <div className="hospedaje-selector__status-bar">
            <span className="hospedaje-selector__count">
              {isLoading && lugares.length === 0
                ? "Cargando lugares..."
                : `${total} ${total === 1 ? "alojamiento encontrado" : "alojamientos encontrados"}`}
            </span>
            {appliedSearch && (
              <span className="hospedaje-selector__active-filter">
                Buscando: "{appliedSearch}"
              </span>
            )}
          </div>

          {/* Confirmación del lugar pendiente en modo propio */}
          {esPropio && lugarPendiente && (
            <div className="hospedaje-selector__confirmar" role="status">
              <div className="hospedaje-selector__confirmar-info">
                <span className="hospedaje-selector__confirmar-nombre">
                  {lugarPendiente.nombre}
                </span>
                <span className="hospedaje-selector__confirmar-detalle">
                  {lugarPendiente.direccion} · {barrioLabel(lugarPendiente.barrio)}
                </span>
              </div>
              <div className="hospedaje-selector__confirmar-acciones">
                <button
                  type="button"
                  className="hospedaje-selector__confirmar-btn"
                  onClick={handleConfirmarPendiente}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="hospedaje-selector__descartar-btn"
                  onClick={() => setLugarPendiente(null)}
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}

          {/* Lista de lugares */}
          <div className="hospedaje-selector__results">
            {isLoading && lugares.length === 0 ? (
              <div className="hospedaje-selector__loading">
                <div className="hospedaje-selector__skeleton skeleton" />
                <div className="hospedaje-selector__skeleton skeleton" />
                <div className="hospedaje-selector__skeleton skeleton" />
                <div className="hospedaje-selector__skeleton skeleton" />
              </div>
            ) : apiError ? (
              <div className="hospedaje-selector__error">
                <p>{apiError}</p>
                <button
                  type="button"
                  className="hospedaje-selector__retry-btn"
                  onClick={() => fetchLugares(1, false)}
                >
                  Reintentar
                </button>
              </div>
            ) : lugares.length === 0 ? (
              <div className="hospedaje-selector__empty">
                <p>No encontramos alojamientos con esos filtros.</p>
                <span>Probá modificando el término de búsqueda o seleccionando otro barrio.</span>
              </div>
            ) : (
              <>
                <div className="hospedaje-selector__grid">
                  {lugares.map((lugar) => {
                    const seleccionada = esPropio
                      ? lugarPendiente?.id === lugar.id ||
                        selectedLugarId === lugar.id
                      : selectedLugarId === lugar.id;

                    return (
                      <SelectablePlaceCard
                        key={lugar.id}
                        lugar={lugar}
                        selected={seleccionada}
                        ctaLabel={
                          selectedLugarId === lugar.id
                            ? "Elegido"
                            : "Elegir este hotel"
                        }
                        onClick={() => {
                          if (esPropio) {
                            setLugarPendiente(lugar);
                            return;
                          }

                          onSelectLugar(lugar.id, lugar);
                        }}
                        showImage={true}
                      />
                    );
                  })}
                </div>

                {lugares.length < total && (
                  <button
                    type="button"
                    className="hospedaje-selector__ver-mas"
                    onClick={() => fetchLugares(pagina + 1, true)}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Cargando más alojamientos..."
                      : "Ver más alojamientos"}
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default HospedajeSelector;
