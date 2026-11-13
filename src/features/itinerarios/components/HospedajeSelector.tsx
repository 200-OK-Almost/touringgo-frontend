import React, { useCallback, useEffect, useRef, useState } from "react";
import type { BarrioCaba, LugarFiltro, LugarResumenDto } from "../../../api/types";
import { getLugares } from "../../../api/lugares";
import { SelectablePlaceCard } from "../../../components/SelectablePlaceCard";
import ChipGroup from "../../../components/ChipGroup";
import { BARRIOS } from "../../../lib/filtros";
import { barrioLabel } from "../../../lib/format";
import { IoInformationCircleOutline, IoSearchOutline } from "react-icons/io5";
import "./HospedajeSelector.css";

export interface HospedajeSelectorProps {
  puntoInicio: "hospedajeDefinido" | "recomendarHospedaje";
  barrio: BarrioCaba | null;
  selectedLugarId: string | null;
  onSelectLugar: (id: string | null) => void;
  error?: string;
}

export function HospedajeSelector({
  puntoInicio,
  barrio,
  selectedLugarId,
  onSelectLugar,
  error,
}: HospedajeSelectorProps) {
  // Barrio activo para el filtro de la sección
  const [selectedBarrio, setSelectedBarrio] = useState<BarrioCaba | null>(() => {
    return puntoInicio === "recomendarHospedaje" ? barrio : null;
  });

  // Estado del input de búsqueda y búsqueda confirmada
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Estado de resultados
  const [lugares, setLugares] = useState<LugarResumenDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const prevPuntoInicioRef = useRef(puntoInicio);
  const prevbarrioRef = useRef(barrio);

  // Sincronización cuando cambia el tipo de puntoInicio o el barrio seleccionado arriba
  useEffect(() => {
    const puntoInicioChanged = prevPuntoInicioRef.current !== puntoInicio;
    const barrioChanged = prevbarrioRef.current !== barrio;

    if (puntoInicio === "recomendarHospedaje") {
      // Si cambió a recomendar hospedaje o cambió el barrio de inicio, sincronizar
      if (puntoInicioChanged || barrioChanged) {
        setSelectedBarrio(barrio);
      }
    } else if (puntoInicio === "hospedajeDefinido" && puntoInicioChanged) {
      // Si cambió a "Ya tengo lugar", mostrar sin filtro de barrio pre-aplicado
      setSelectedBarrio(null);
    }

    prevPuntoInicioRef.current = puntoInicio;
    prevbarrioRef.current = barrio;
  }, [puntoInicio, barrio]);

  // Consulta a la API
  const fetchLugares = useCallback(async () => {
    if (puntoInicio === "recomendarHospedaje" && !selectedBarrio) {
      setLugares([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const filtro: LugarFiltro = {
        barrio: selectedBarrio ?? undefined,
        tipoLugar: "Alojamiento",
        busqueda: appliedSearch || undefined,
        tamano: 50,
      };

      const res = await getLugares(filtro);
      setLugares(res.items);
    } catch {
      setApiError("No se pudieron cargar los alojamientos. Verificá tu conexión o intentá nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }, [puntoInicio, selectedBarrio, appliedSearch]);

  useEffect(() => {
    fetchLugares();
  }, [fetchLugares]);

  // Manejo de búsqueda al presionar "Buscar" o enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchTerm.trim());
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setAppliedSearch("");
  };

  // Si es recomendación y aún no seleccionó barrio arriba, pedir que seleccione uno
  if (puntoInicio === "recomendarHospedaje" && !barrio) {
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

  const tituloSeccion =
    puntoInicio === "recomendarHospedaje"
      ? selectedBarrio
        ? `Hoteles recomendados en ${barrioLabel(selectedBarrio)}`
        : "Hoteles recomendados"
      : "Buscá tu lugar de hospedaje";

  return (
    <section className="hospedaje-selector" aria-label="Búsqueda de hospedaje">
      <div className="hospedaje-selector__header">
        <h3 className="hospedaje-selector__title">{tituloSeccion}</h3>
        <p className="hospedaje-selector__subtitle">
          {puntoInicio === "recomendarHospedaje"
            ? "Seleccioná el hotel donde te vas a alojar cerca de tu recorrido."
            : "Buscá por nombre de hotel o dirección para definir tu punto de partida."}
        </p>
      </div>

      {/* Barra de búsqueda con botón explícito */}
      <form onSubmit={handleSearchSubmit} className="hospedaje-selector__search-form">
        <div className="search-box hospedaje-selector__search-box">
          <span className="search-box__icon">
            <IoSearchOutline size={18} />
          </span>
          <input
            type="search"
            className="search-box__input"
            placeholder="Buscar por nombre de hotel o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar por nombre de hotel o dirección"
          />
          {searchTerm && (
            <button
              type="button"
              className="hospedaje-selector__clear-btn"
              onClick={handleClearSearch}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="hospedaje-selector__search-btn">
          Buscar
        </button>
      </form>

      {/* Filtros por barrio con chips reutilizados */}
      <div className="hospedaje-selector__barrios">
        <span className="hospedaje-selector__label">FILTRAR POR BARRIO</span>
        <ChipGroup
          variant="ink"
          allLabel="Todos"
          options={BARRIOS}
          value={selectedBarrio}
          onChange={(barrio) => setSelectedBarrio(barrio)}
        />
      </div>

      {/* Mensaje de error de validación si existe */}
      {error && (
        <div className="planificacion-field-error">
          <p>{error}</p>
        </div>
      )}

      {/* Contador de resultados y estado */}
      <div className="hospedaje-selector__status-bar">
        <span className="hospedaje-selector__count">
          {isLoading
            ? "Cargando lugares..."
            : `${lugares.length} ${lugares.length === 1 ? "alojamiento encontrado" : "alojamientos encontrados"}`}
        </span>
        {appliedSearch && (
          <span className="hospedaje-selector__active-filter">
            Buscando: "{appliedSearch}"
          </span>
        )}
      </div>

      {/* Lista de lugares */}
      <div className="hospedaje-selector__results">
        {isLoading ? (
          <div className="hospedaje-selector__loading">
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
        ) : lugares.length === 0 ? (
          <div className="hospedaje-selector__empty">
            <p>No se encontraron alojamientos con los criterios seleccionados.</p>
            <span>Probá modificando el término de búsqueda o seleccionando otro barrio.</span>
          </div>
        ) : (
          <div className="hospedaje-selector__grid">
            {lugares.map((lugar) => (
              <SelectablePlaceCard
                key={lugar.id}
                lugar={lugar}
                selected={selectedLugarId === lugar.id}
                onClick={() => onSelectLugar(lugar.id)}
                showImage={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HospedajeSelector;

