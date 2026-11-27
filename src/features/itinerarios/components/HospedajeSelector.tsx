import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BarrioCaba, LugarFiltro, LugarResumenDto } from "../../../api/types";
import { getLugares } from "../../../api/lugares";
import { SelectablePlaceCard } from "../../../components/SelectablePlaceCard";
import ChipGroup from "../../../components/ChipGroup";
import { BARRIOS } from "../../../lib/filtros";
import { barrioLabel } from "../../../lib/format";
import { IoClose, IoInformationCircleOutline, IoSearchOutline } from "react-icons/io5";
import "./HospedajeSelector.css";

const DEBOUNCE_BUSQUEDA_MS = 300;
const TAMANO_PAGINA = 8;
const TAMANO_FETCH = 100;
const MAX_PAGINAS_FETCH = 10;

function ordenarPorPuntuacion(lugares: LugarResumenDto[]): LugarResumenDto[] {
  return [...lugares].sort((a, b) => {
    const puntuacionA = a.puntuacion ?? -1;
    const puntuacionB = b.puntuacion ?? -1;

    if (puntuacionB !== puntuacionA) {
      return puntuacionB - puntuacionA;
    }

    return b.cantidadResenas - a.cantidadResenas;
  });
}

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

  // Barrio activo para el filtro de la sección (siempre el barrio del día)
  const [selectedBarrio, setSelectedBarrio] = useState<BarrioCaba | null>(() => {
    return barrio;
  });

  // Estado del input de búsqueda y búsqueda aplicada
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Estado de resultados (lista completa ordenada por ranking + paginación local)
  const [todosLosLugares, setTodosLosLugares] = useState<LugarResumenDto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const lugares = useMemo(
    () => todosLosLugares.slice(0, pagina * TAMANO_PAGINA),
    [todosLosLugares, pagina]
  );

  const debounceRef = useRef<number | undefined>(undefined);
  const fetchSeqRef = useRef(0);
  const prevPuntoInicioRef = useRef(puntoInicio);
  const prevbarrioRef = useRef(barrio);

  // Sincroniza el barrio del filtro cuando cambia el barrio del día o el modo
  useEffect(() => {
    const puntoInicioChanged = prevPuntoInicioRef.current !== puntoInicio;
    const barrioChanged = prevbarrioRef.current !== barrio;

    if (puntoInicioChanged || barrioChanged) {
      setSelectedBarrio(barrio);
    }

    prevPuntoInicioRef.current = puntoInicio;
    prevbarrioRef.current = barrio;
  }, [puntoInicio, barrio]);

  useEffect(() => () => window.clearTimeout(debounceRef.current), []);

  // Consulta a la API, ordena por ranking descendente y pagina localmente
  const fetchLugares = useCallback(async () => {
    if (!selectedBarrio) {
      setTodosLosLugares([]);
      setPagina(1);
      setIsLoading(false);
      return;
    }

    const secuencia = ++fetchSeqRef.current;
    setIsLoading(true);
    setApiError(null);

    try {
      const acumulado: LugarResumenDto[] = [];
      let paginaActual = 1;
      let total = 0;

      do {
        const filtro: LugarFiltro = {
          barrio: selectedBarrio,
          tipoLugar: "Alojamiento",
          busqueda: appliedSearch || undefined,
          pagina: paginaActual,
          tamano: TAMANO_FETCH,
        };

        const res = await getLugares(filtro);

        if (secuencia !== fetchSeqRef.current) {
          return;
        }

        total = res.total;
        acumulado.push(...res.items);
        paginaActual += 1;
      } while (acumulado.length < total && paginaActual <= MAX_PAGINAS_FETCH);

      setTodosLosLugares(ordenarPorPuntuacion(acumulado));
      setPagina(1);
    } catch {
      if (secuencia === fetchSeqRef.current) {
        setApiError("No se pudieron cargar los alojamientos. Verificá tu conexión o intentá nuevamente.");
      }
    } finally {
      if (secuencia === fetchSeqRef.current) {
        setIsLoading(false);
      }
    }
  }, [selectedBarrio, appliedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial y al cambiar filtros
    fetchLugares();
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

  // Sin barrio del día no se pueden buscar alojamientos (misma lógica en ambos modos)
  if (!barrio) {
    return (
      <section className="hospedaje-selector" aria-label="Búsqueda de hospedaje">
        <div className="hospedaje-selector__aviso">
          <IoInformationCircleOutline className="hospedaje-selector__aviso-icon" size={24} />
          <div className="hospedaje-selector__aviso-text">
            <h4>Seleccioná un barrio para ver alojamientos</h4>
            <p>
              Por favor, elegí primero un barrio en <strong>"¿Qué barrio querés recorrer?"</strong> para que podamos mostrarte los alojamientos disponibles.
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
    ? "Buscá por nombre o dirección y elegí el punto de partida del día."
    : "Seleccioná el hotel donde te vas a alojar cerca de tu recorrido.";

  return (
    <section className="hospedaje-selector" aria-label="Búsqueda de hospedaje">
      <div className="hospedaje-selector__header">
        <h3 className="hospedaje-selector__title">{tituloSeccion}</h3>
        <p className="hospedaje-selector__subtitle">{subtitleSeccion}</p>
      </div>

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
          isOptionDisabled={(val) => val !== barrio}
          disabledTooltip={`Solo se muestran alojamientos del barrio seleccionado (${barrioLabel(barrio)})`}
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
          {isLoading && todosLosLugares.length === 0
            ? "Cargando lugares..."
            : `${todosLosLugares.length} ${todosLosLugares.length === 1 ? "alojamiento encontrado" : "alojamientos encontrados"}`}
        </span>
        {appliedSearch && (
          <span className="hospedaje-selector__active-filter">
            Buscando: "{appliedSearch}"
          </span>
        )}
      </div>

      {/* Lista de lugares */}
      <div className="hospedaje-selector__results">
        {isLoading && todosLosLugares.length === 0 ? (
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
                  onClick={fetchLugares}
            >
              Reintentar
            </button>
          </div>
        ) : todosLosLugares.length === 0 ? (
          <div className="hospedaje-selector__empty">
            <p>No encontramos alojamientos con esos filtros.</p>
            <span>Probá modificando el término de búsqueda o seleccionando otro barrio.</span>
          </div>
        ) : (
          <>
            <div className="hospedaje-selector__grid">
              {lugares.map((lugar) => {
                const seleccionada = selectedLugarId === lugar.id;

                return (
                  <SelectablePlaceCard
                    key={lugar.id}
                    lugar={lugar}
                    selected={seleccionada}
                    ctaLabel={
                      seleccionada ? "Elegido" : "Elegir este hotel"
                    }
                    onClick={() => onSelectLugar(lugar.id, lugar)}
                    showImage={true}
                  />
                );
              })}
            </div>

            {lugares.length < todosLosLugares.length && (
              <button
                type="button"
                className="hospedaje-selector__ver-mas"
                onClick={() => setPagina((actual) => actual + 1)}
              >
                Ver más alojamientos
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default HospedajeSelector;
