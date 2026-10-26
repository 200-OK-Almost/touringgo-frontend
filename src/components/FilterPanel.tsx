import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebounce";
import { BARRIOS, CATEGORIAS, type FiltroPanel } from "../lib/filtros";
import ChipGroup from "./ChipGroup";
import ToggleFilter from "./ToggleFilter";
import "./FilterPanel.css";

interface FilterPanelProps {
  filtro: FiltroPanel;
  onChange: (filtro: FiltroPanel) => void;
  total: number;
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function FilterPanel({ filtro, onChange, total }: FilterPanelProps) {
  const [busqueda, setBusqueda] = useState(filtro.busqueda ?? "");
  const debounced = useDebouncedValue(busqueda, 300);
  const emittedRef = useRef(filtro.busqueda ?? "");

  useEffect(() => {
    if (debounced !== emittedRef.current) {
      emittedRef.current = debounced;
      onChange({ ...filtro, busqueda: debounced || undefined });
    }
  }, [debounced, filtro, onChange]);

  useEffect(() => {
    const incoming = filtro.busqueda ?? "";
    if (incoming !== emittedRef.current && incoming !== debounced) {
      setBusqueda(incoming);
    }
  }, [filtro.busqueda, debounced]);

  return (
    <section className="filter-panel" aria-label="Filtros de búsqueda">
      <div className="filter-panel__search">
        <span className="filter-panel__section-label">BÚSQUEDA RÁPIDA</span>
        <div className="search-box">
          <span className="search-box__icon">
            <SearchIcon />
          </span>
          <input
            type="search"
            className="search-box__input"
            placeholder="Buscar por nombre, subzona, descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar lugares"
          />
        </div>
      </div>

      <div className="filter-panel__group">
        <span className="filter-panel__section-label">BARRIO DE CABA</span>
        <ChipGroup
          variant="ink"
          allLabel="Todos"
          options={BARRIOS}
          value={filtro.barrio ?? null}
          onChange={(barrio) => onChange({ ...filtro, barrio: barrio ?? undefined })}
        />
      </div>

      <div className="filter-panel__group">
        <span className="filter-panel__section-label">CATEGORÍA TEMÁTICA</span>
        <ChipGroup
          variant="green"
          allLabel="Todas"
          options={CATEGORIAS}
          value={filtro.categoriaCodigo ?? null}
          onChange={(categoriaCodigo) =>
            onChange({ ...filtro, categoriaCodigo: categoriaCodigo ?? undefined })
          }
        />
      </div>

      <div className="filter-panel__toggles-row">
        <div className="filter-panel__toggles">
          <ToggleFilter
            emoji="👶"
            label="Apto Niños"
            checked={!!filtro.aptoNinos}
            onChange={(v) => onChange({ ...filtro, aptoNinos: v || undefined })}
          />
          <ToggleFilter
            emoji="♿"
            label="Accesibilidad"
            checked={!!filtro.accesibleMovilidadReducida}
            onChange={(v) => onChange({ ...filtro, accesibleMovilidadReducida: v || undefined })}
          />
          <ToggleFilter
            emoji="🌧️"
            label="Modo Lluvia (Bajo techo)"
            checked={!!filtro.soloBajoTecho}
            onChange={(v) => onChange({ ...filtro, soloBajoTecho: v || undefined })}
          />
          <ToggleFilter
            emoji="🌳"
            label="Al aire libre"
            checked={!!filtro.soloAlAireLibre}
            onChange={(v) => onChange({ ...filtro, soloAlAireLibre: v || undefined })}
          />
        </div>

        <span className="filter-panel__count">
          Mostrando {total} {total === 1 ? "lugar" : "lugares"}
        </span>
      </div>
    </section>
  );
}
