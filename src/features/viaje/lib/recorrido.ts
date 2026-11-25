import type { ParadaViewModel } from "../types";

export interface TramoRecorridoDatos {
  distanciaMetros?: number | null;
  cuadras?: number | null;
  minutosAPie?: number | null;
}

export interface PuntoRecorrido {
  latitud: number;
  longitud: number;
}

export interface ResumenDia {
  totalParadas: number;
  totalMinutosAPie: number;
  totalMetros: number;
}

const RADIO_TIERRA_METROS = 6371000;
const METROS_POR_CUADRA = 100;
const METROS_POR_MINUTO_A_PIE = 80;

function aRadianes(valor: number): number {
  return valor * Math.PI / 180;
}

export function distanciaMetrosEntrePuntos(
  puntoA: PuntoRecorrido,
  puntoB: PuntoRecorrido
): number {
  const deltaLatitud = aRadianes(puntoB.latitud - puntoA.latitud);
  const deltaLongitud = aRadianes(puntoB.longitud - puntoA.longitud);

  const a =
    Math.sin(deltaLatitud / 2) * Math.sin(deltaLatitud / 2) +
    Math.cos(aRadianes(puntoA.latitud)) *
      Math.cos(aRadianes(puntoB.latitud)) *
      Math.sin(deltaLongitud / 2) *
      Math.sin(deltaLongitud / 2);

  return RADIO_TIERRA_METROS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function obtenerTramoDesdePunto(
  puntoAnterior: PuntoRecorrido | null | undefined,
  paradaActual: ParadaViewModel | null | undefined
): TramoRecorridoDatos | null {
  if (!puntoAnterior || !paradaActual) {
    return null;
  }

  const metricas = paradaActual.parada;
  const tieneCoordenadas =
    paradaActual.lugar.latitud != null &&
    paradaActual.lugar.longitud != null;

  const distanciaMetros =
    metricas.distanciaMetrosDesdeAnterior ??
    (tieneCoordenadas
      ? Math.round(
          distanciaMetrosEntrePuntos(puntoAnterior, paradaActual.lugar)
        )
      : null);

  const cuadras =
    metricas.cuadrasDesdeAnterior ??
    (distanciaMetros != null
      ? Math.round(distanciaMetros / METROS_POR_CUADRA)
      : null);

  const minutosAPie =
    metricas.minutosAPieDesdeAnterior ??
    (distanciaMetros != null
      ? Math.round(distanciaMetros / METROS_POR_MINUTO_A_PIE)
      : null);

  if (
    distanciaMetros == null &&
    cuadras == null &&
    minutosAPie == null
  ) {
    return null;
  }

  return { distanciaMetros, cuadras, minutosAPie };
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
