import type { BarrioCaba, CategoriaDto } from "../../../api/types";
import { BARRIOS } from "../../../lib/filtros";
import type { ItineraryFormData } from "../planificacionFormData";

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

export function aplicarTemaPlanificacion(
  formData: ItineraryFormData,
  tema: TemaPlanificacion,
  categorias: CategoriaDto[]
): ItineraryFormData {
  const categoria = tema.categoriaCodigo
    ? categorias.find((item) => item.codigo === tema.categoriaCodigo) ?? null
    : null;

  return {
    ...formData,
    dias: formData.dias.map((dia) => ({
      ...dia,
      barrio: dia.barrio ?? tema.barrio,
      categoriasPrioritarias:
        dia.categoriasPrioritarias.length > 0 || !categoria
          ? dia.categoriasPrioritarias
          : [categoria],
    })),
  };
}
