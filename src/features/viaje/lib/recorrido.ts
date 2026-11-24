import type { ParadaViewModel } from "../types";

export interface TramoRecorridoDatos {
  distanciaMetros?: number | null;
  cuadras?: number | null;
  minutosAPie?: number | null;
}

export interface ResumenDia {
  totalParadas: number;
  totalMinutosAPie: number;
  totalMetros: number;
}

export function formatearMetros(
  distanciaMetros: number | null | undefined
): string | null {
  if (distanciaMetros == null || distanciaMetros <= 0) {
    return null;
  }

  if (distanciaMetros < 1000) {
    return `${Math.round(distanciaMetros)} m`;
  }

  return `${(distanciaMetros / 1000).toFixed(1)} km`;
}

export function formatearMinutosAPie(
  minutosAPie: number | null | undefined
): string | null {
  if (minutosAPie == null || minutosAPie <= 0) {
    return null;
  }

  return `${minutosAPie} min a pie`;
}

export function formatearCuadras(
  cuadras: number | null | undefined
): string | null {
  if (cuadras == null || cuadras <= 0) {
    return null;
  }

  return `${cuadras} ${cuadras === 1 ? "cuadra" : "cuadras"}`;
}

export function formatearTramo(
  tramo: TramoRecorridoDatos
): string | null {
  const partes = [
    formatearMinutosAPie(tramo.minutosAPie),
    formatearMetros(tramo.distanciaMetros),
    formatearCuadras(tramo.cuadras),
  ].filter((parte): parte is string => parte != null);

  return partes.length > 0 ? partes.join(" · ") : null;
}

export function resumirDia(
  paradas: ParadaViewModel[] | null | undefined
): ResumenDia {
  const lista = paradas ?? [];

  return {
    totalParadas: lista.length,
    totalMinutosAPie: lista.reduce(
      (total, parada) => total + (parada.parada.minutosAPieDesdeAnterior ?? 0),
      0
    ),
    totalMetros: lista.reduce(
      (total, parada) => total + (parada.parada.distanciaMetrosDesdeAnterior ?? 0),
      0
    ),
  };
}

export function formatearResumenDia(
  resumen: ResumenDia
): string | null {
  if (resumen.totalParadas === 0) {
    return null;
  }

  const partes = [
    `${resumen.totalParadas} ${
      resumen.totalParadas === 1 ? "parada" : "paradas"
    }`,
    formatearMinutosAPie(resumen.totalMinutosAPie),
    formatearMetros(resumen.totalMetros),
  ].filter((parte): parte is string => parte != null);

  return partes.join(" · ");
}
