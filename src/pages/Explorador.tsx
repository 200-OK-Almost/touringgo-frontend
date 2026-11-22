import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { BarrioCaba, LugarResumenDto, TipoLugar } from "../api/types";
import FilterPanel from "../components/FilterPanel";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import PlaceGrid from "../components/PlaceGrid";
import PlaceModal from "../components/PlaceModal";
import { useLugares } from "../hooks/useLugares";
import { BARRIOS, type FiltroPanel } from "../lib/filtros";
import "./Explorador.css";

const TAMANO_PAGINA = 24;

function isBarrio(value: string): value is BarrioCaba {
  return BARRIOS.some((b) => b.value === value);
}

function parseFiltro(params: URLSearchParams): { filtro: FiltroPanel; pagina: number } {
  const filtro: FiltroPanel = {};

  const barrio = params.get("barrio");
  if (barrio && isBarrio(barrio)) filtro.barrio = barrio;

  const categoria = params.get("categoria");
  if (categoria) filtro.categoriaCodigo = categoria;

  const tipo = params.get("tipo");
  if (tipo === "PuntoInteres" || tipo === "Alojamiento" || tipo === "NodoUrbano") {
    filtro.tipoLugar = tipo as TipoLugar;
  }

  const busqueda = params.get("q");
  if (busqueda) filtro.busqueda = busqueda;

  if (params.get("ninos") === "1") filtro.aptoNinos = true;
  if (params.get("accesible") === "1") filtro.accesibleMovilidadReducida = true;
  if (params.get("bajoTecho") === "1") filtro.soloBajoTecho = true;
  if (params.get("aireLibre") === "1") filtro.soloAlAireLibre = true;

  const rawPagina = parseInt(params.get("p") ?? "1", 10);
  const pagina = Number.isFinite(rawPagina) && rawPagina > 0 ? rawPagina : 1;

  return { filtro, pagina };
}

function filtroToParams(filtro: FiltroPanel, pagina: number = 1): URLSearchParams {
  const params = new URLSearchParams();

  if (filtro.barrio) params.set("barrio", filtro.barrio);
  if (filtro.categoriaCodigo) params.set("categoria", filtro.categoriaCodigo);
  if (filtro.tipoLugar) params.set("tipo", filtro.tipoLugar);
  if (filtro.busqueda) params.set("q", filtro.busqueda);
  if (filtro.aptoNinos) params.set("ninos", "1");
  if (filtro.accesibleMovilidadReducida) params.set("accesible", "1");
  if (filtro.soloBajoTecho) params.set("bajoTecho", "1");
  if (filtro.soloAlAireLibre) params.set("aireLibre", "1");
  if (pagina > 1) params.set("p", String(pagina));

  return params;
}

export default function Explorador() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filtro, pagina } = useMemo(() => parseFiltro(searchParams), [searchParams]);

  const [seleccion, setSeleccion] = useState<LugarResumenDto | null>(null);
  const [reintento, setReintento] = useState(0);

  const queryParams = useMemo(
    () => ({
      ...filtro,
      pagina,
      tamano: TAMANO_PAGINA,
    }),
    [filtro, pagina],
  );

  const { lugares, total, loading, error } = useLugares(queryParams, reintento);
  const totalPaginas = Math.max(1, Math.ceil(total / TAMANO_PAGINA));

  const handleFiltroChange = useCallback(
    (nuevo: FiltroPanel) => {
      setSearchParams(filtroToParams(nuevo, 1), { replace: true });
    },
    [setSearchParams],
  );

  const handlePageChange = useCallback(
    (nuevaPagina: number) => {
      setSearchParams(filtroToParams(filtro, nuevaPagina));
      const el = document.getElementById("catalogo-explorador");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [filtro, setSearchParams],
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
    <div id="catalogo-explorador" className="explorador__container">
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

      {!loading && !error && lugares && lugares.length > 0 && (
        <Pagination
          pagina={pagina}
          totalPaginas={totalPaginas}
          totalItems={total}
          tamanoPagina={TAMANO_PAGINA}
          onPageChange={handlePageChange}
        />
      )}

      <PlaceModal lugarId={seleccion?.id ?? null} onClose={handleCerrar} />
    </div>
  );
}
