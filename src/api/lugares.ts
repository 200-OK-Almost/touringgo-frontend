import { http } from "./client";
import type {
  ControlCuotaGoogleDto,
  LugarDetalleDto,
  LugarFiltro,
  LugarResumenDto,
  ResultadoPaginadoDto,
} from "./types";

const LUGARES_BASE = "/lugares/api/lugares";

function buildQuery(filtro: LugarFiltro): string {
  const params = new URLSearchParams();

  if (filtro.barrio) params.set("barrio", filtro.barrio);
  if (filtro.categoriaCodigo) params.set("categoriaCodigo", filtro.categoriaCodigo);
  if (filtro.soloBajoTecho) params.set("soloBajoTecho", "true");
  if (filtro.soloAlAireLibre) params.set("soloAlAireLibre", "true");
  if (filtro.aptoNinos) params.set("aptoNinos", "true");
  if (filtro.accesibleMovilidadReducida) params.set("accesibleMovilidadReducida", "true");
  if (filtro.busqueda) params.set("busqueda", filtro.busqueda);

  params.set("pagina", String(filtro.pagina ?? 1));
  params.set("tamano", String(filtro.tamano ?? 100));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getLugares(
  filtro: LugarFiltro = {},
): Promise<ResultadoPaginadoDto<LugarResumenDto>> {
  return http.get(`${LUGARES_BASE}${buildQuery(filtro)}`);
}

export function getLugar(id: string): Promise<LugarDetalleDto> {
  return http.get(`${LUGARES_BASE}/${id}`);
}

export function getCuota(): Promise<ControlCuotaGoogleDto> {
  return http.get(`${LUGARES_BASE}/google/cuota`);
}
