import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { BarrioCaba, LugarResumenDto } from "../api/types";
import FilterPanel from "../components/FilterPanel";
import Header from "../components/Header";
import PlaceGrid from "../components/PlaceGrid";
import PlaceModal from "../components/PlaceModal";
import { useLugares } from "../hooks/useLugares";
import { BARRIOS, type FiltroPanel } from "../lib/filtros";
import "./Explorador.css";

function isBarrio(value: string): value is BarrioCaba {
  return BARRIOS.some((b) => b.value === value);
}

function parseFiltro(params: URLSearchParams): FiltroPanel {
  const filtro: FiltroPanel = {};

  const barrio = params.get("barrio");
  if (barrio && isBarrio(barrio)) filtro.barrio = barrio;

  const categoria = params.get("categoria");
  if (categoria) filtro.categoriaCodigo = categoria;

  const busqueda = params.get("q");
  if (busqueda) filtro.busqueda = busqueda;

  if (params.get("ninos") === "1") filtro.aptoNinos = true;
  if (params.get("accesible") === "1") filtro.accesibleMovilidadReducida = true;
  if (params.get("bajoTecho") === "1") filtro.soloBajoTecho = true;
  if (params.get("aireLibre") === "1") filtro.soloAlAireLibre = true;

  return filtro;
}

function filtroToParams(filtro: FiltroPanel): URLSearchParams {
  const params = new URLSearchParams();

  if (filtro.barrio) params.set("barrio", filtro.barrio);
  if (filtro.categoriaCodigo) params.set("categoria", filtro.categoriaCodigo);
  if (filtro.busqueda) params.set("q", filtro.busqueda);
  if (filtro.aptoNinos) params.set("ninos", "1");
  if (filtro.accesibleMovilidadReducida) params.set("accesible", "1");
  if (filtro.soloBajoTecho) params.set("bajoTecho", "1");
  if (filtro.soloAlAireLibre) params.set("aireLibre", "1");

  return params;
}

export default function Explorador() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtro = useMemo(() => parseFiltro(searchParams), [searchParams]);

  const [seleccion, setSeleccion] = useState<LugarResumenDto | null>(null);
  const [reintento, setReintento] = useState(0);

  const { lugares, total, loading, error } = useLugares(filtro, reintento);

  const handleFiltroChange = useCallback(
    (nuevo: FiltroPanel) => {
      setSearchParams(filtroToParams(nuevo), { replace: true });
    },
    [setSearchParams],
  );

  const handleLimpiar = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const handleSeleccionar = useCallback((lugar: LugarResumenDto) => {
    setSeleccion(lugar);
  }, []);

  const handleCerrar = useCallback(() => {
    setSeleccion(null);
  }, []);

  const handleReintentar = useCallback(() => {
    setReintento((r) => r + 1);
  }, []);

  return (
    <div className="explorador__container">
      <Header />

      <FilterPanel filtro={filtro} onChange={handleFiltroChange} total={total} />

      <PlaceGrid
        lugares={lugares}
        loading={loading}
        error={error}
        onRetry={handleReintentar}
        onClearFilters={handleLimpiar}
        onSelect={handleSeleccionar}
      />

      <PlaceModal lugarId={seleccion?.Id ?? null} onClose={handleCerrar} />
    </div>
  );
}
