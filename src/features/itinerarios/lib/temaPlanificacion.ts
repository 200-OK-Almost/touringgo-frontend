import type { BarrioCaba } from "../../../api/types";
import { BARRIOS } from "../../../lib/filtros";

export interface TemaPlanificacion {
  barrio: BarrioCaba | null;
  categoriaCodigo: string | null;
}

function esBarrio(value: string): value is BarrioCaba {
  return BARRIOS.some((barrio) => barrio.value === value);
}

export function leerTemaPlanificacion(
  params: URLSearchParams
): TemaPlanificacion | null {
  const barrioParam = params.get("barrio");
  const categoriaParam = params.get("categoria");

  const barrio = barrioParam && esBarrio(barrioParam) ? barrioParam : null;
  const categoriaCodigo = categoriaParam?.trim() || null;

  if (!barrio && !categoriaCodigo) {
    return null;
  }

  return { barrio, categoriaCodigo };
}
