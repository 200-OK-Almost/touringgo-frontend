import type { BarrioCaba } from "../../../api/types";
import { toDateOnlyString } from "../../../lib/format";
import {
  duracionDiasInclusiva,
  parseFechaLocal,
} from "../../itinerarios/lib/fechas";

export const MAX_DIAS_VISIBLES = 31;
export const MAX_DIAS_RECOMENDADOS = 7;

export interface DiaViaje {
  numeroDia: number;
  fecha: string | null;
  tieneItinerario: boolean;
}

export interface DiasViajeResultado {
  dias: DiaViaje[];
  warning: string | null;
}

export interface BarrioPorDia {
  numeroDia: number;
  barrio: BarrioCaba;
}

interface ItinerarioDia {
  numeroDia: number;
  fecha: string | null;
}

interface DiaConBarrio {
  numeroDia: number;
  barrio: BarrioCaba;
}

export function obtenerBarriosPorDia(
  barrio: BarrioCaba,
  dias: DiaConBarrio[] | null | undefined
): BarrioPorDia[] {
  if (dias && dias.length > 0) {
    return [...dias]
      .sort((a, b) => a.numeroDia - b.numeroDia)
      .map((dia) => ({ numeroDia: dia.numeroDia, barrio: dia.barrio }));
  }

  return [{ numeroDia: 1, barrio }];
}

export function construirDiasViaje(
  fechaInicio: string | null,
  fechaFin: string | null,
  itinerarios: ItinerarioDia[] | null
): DiasViajeResultado {
  const ordenados = [...(itinerarios ?? [])].sort(
    (a, b) => a.numeroDia - b.numeroDia
  );
  const numerosConItinerario = new Set(ordenados.map((i) => i.numeroDia));

  const desde = parseFechaLocal(fechaInicio);
  const hasta = parseFechaLocal(fechaFin);

  if (desde && hasta && hasta >= desde) {
    const total = duracionDiasInclusiva(fechaInicio, fechaFin) ?? 0;
    const visibles = Math.min(total, MAX_DIAS_VISIBLES);

    const dias = Array.from({ length: visibles }, (_, indice) => {
      const fecha = new Date(
        desde.getFullYear(),
        desde.getMonth(),
        desde.getDate() + indice
      );
      const numeroDia = indice + 1;

      return {
        numeroDia,
        fecha: toDateOnlyString(fecha),
        tieneItinerario: numerosConItinerario.has(numeroDia),
      };
    });

    return {
      dias,
      warning: crearWarning(total, visibles),
    };
  }

  const base =
    ordenados.length > 0
      ? ordenados
      : [{ numeroDia: 1, fecha: null }];

  const visibles = base.slice(0, MAX_DIAS_VISIBLES);

  return {
    dias: visibles.map((dia) => ({
      numeroDia: dia.numeroDia,
      fecha: dia.fecha ?? null,
      tieneItinerario: numerosConItinerario.has(dia.numeroDia),
    })),
    warning: crearWarning(base.length, visibles.length),
  };
}

function crearWarning(total: number, visibles: number): string | null {
  if (total > MAX_DIAS_VISIBLES) {
    return `Este viaje tiene ${total} días. Se muestran los primeros ${visibles}.`;
  }

  if (total > MAX_DIAS_RECOMENDADOS) {
    return `Este viaje tiene ${total} días, más que el máximo recomendado de 7.`;
  }

  return null;
}
