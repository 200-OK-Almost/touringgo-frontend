import { capitalize, toDateOnlyString } from "../../../lib/format";
import type { DiaPlanificacion } from "../planificacionFormData";
import {
  duracionDiasInclusiva,
  formatearFechaConDia,
  MAX_DIAS_VIAJE,
  parseFechaLocal,
} from "./fechas";

export function construirDias(
  fechaInicio: string | null,
  fechaFin: string | null,
  previos: DiaPlanificacion[] = []
): DiaPlanificacion[] {
  const inicio = parseFechaLocal(fechaInicio);
  const fin = parseFechaLocal(fechaFin);

  if (!inicio || !fin || fin < inicio) {
    return [];
  }

  const cantidad = duracionDiasInclusiva(fechaInicio, fechaFin);

  if (cantidad === null || cantidad < 1 || cantidad > MAX_DIAS_VIAJE) {
    return [];
  }

  const previosPorFecha = new Map(previos.map((dia) => [dia.fecha, dia]));

  return Array.from({ length: cantidad }, (_, indice) => {
    const fecha = new Date(
      inicio.getFullYear(),
      inicio.getMonth(),
      inicio.getDate() + indice
    );
    const fechaString = toDateOnlyString(fecha);
    const previo = previosPorFecha.get(fechaString);

    return {
      fecha: fechaString,
      dia: indice + 1,
      barrio: previo?.barrio ?? null,
      puntoInicio: previo?.puntoInicio ?? null,
      hospedajeLugarGuid: previo?.hospedajeLugarGuid ?? null,
      hospedajeBarrio: previo?.hospedajeBarrio ?? null,
      modalidadViaje: previo?.modalidadViaje ?? null,
      categoriasPrioritarias: previo?.categoriasPrioritarias ?? [],
    };
  });
}

export function formatearDiaPlanificacion(dia: DiaPlanificacion): string {
  return `Día ${dia.dia} · ${capitalize(formatearFechaConDia(dia.fecha))}`;
}

export function diaEstaCompleto(dia: DiaPlanificacion): boolean {
  if (!dia.barrio || !dia.puntoInicio) {
    return false;
  }

  if (
    dia.puntoInicio === "HospedajePropio" ||
    dia.puntoInicio === "HospedajeSugerido"
  ) {
    if (!dia.hospedajeLugarGuid) {
      return false;
    }

    return !(
      dia.hospedajeBarrio != null &&
      dia.hospedajeBarrio !== dia.barrio
    );
  }

  return true;
}

export function diasFaltantes(dias: DiaPlanificacion[]): string[] {
  return dias
    .filter((dia) => !diaEstaCompleto(dia))
    .map((dia) => `Día ${dia.dia}`);
}

export function preferenciasDiaCompletas(dia: DiaPlanificacion): boolean {
  return Boolean(
    dia.modalidadViaje &&
      dia.categoriasPrioritarias.length >= 2 &&
      dia.categoriasPrioritarias.length <= 4
  );
}

export function diasConPreferenciasFaltantes(
  dias: DiaPlanificacion[]
): string[] {
  return dias
    .filter((dia) => !preferenciasDiaCompletas(dia))
    .map((dia) => `Día ${dia.dia}`);
}
