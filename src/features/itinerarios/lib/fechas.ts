export const MIN_DIAS_VIAJE = 1;
export const MAX_DIAS_VIAJE = 7;
export const MENSAJE_RANGO_INVALIDO = "El viaje puede durar entre 1 y 7 días.";

const FORMATO_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILISEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

export type FechaInput = string | Date | null | undefined;

export function parseFechaLocal(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const coincidencia = FORMATO_FECHA.exec(value);
  if (!coincidencia) {
    return null;
  }

  const anio = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const dia = Number(coincidencia[3]);
  const fecha = new Date(anio, mes - 1, dia);

  const esFechaValida =
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia;

  return esFechaValida ? fecha : null;
}

export function duracionDiasInclusiva(inicio: FechaInput, fin: FechaInput): number | null {
  const fechaInicio = resolverFecha(inicio);
  const fechaFin = resolverFecha(fin);

  if (!fechaInicio || !fechaFin) {
    return null;
  }

  const diferencia = aDiaUtc(fechaFin) - aDiaUtc(fechaInicio);

  return Math.round(diferencia / MILISEGUNDOS_POR_DIA) + 1;
}

export function esRangoValido(inicio: FechaInput, fin: FechaInput): boolean {
  const dias = duracionDiasInclusiva(inicio, fin);

  return dias !== null && dias >= MIN_DIAS_VIAJE && dias <= MAX_DIAS_VIAJE;
}

export function formatearFechaCorta(value: FechaInput): string {
  const fecha = resolverFecha(value);

  if (!fecha) {
    return "";
  }

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}`;
}

export function formatearFechaConDia(value: FechaInput): string {
  const fecha = resolverFecha(value);

  if (!fecha) {
    return "";
  }

  const diaSemana = new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
  })
    .format(fecha)
    .replace(/\.$/, "");

  return `${diaSemana} ${formatearFechaCorta(fecha)}`;
}

export function formatearRangoFechas(inicio: FechaInput, fin: FechaInput): string {
  if (!inicio) {
    return "Elegí la fecha de inicio";
  }

  if (!fin) {
    return "Elegí la fecha de fin";
  }

  const dias = duracionDiasInclusiva(inicio, fin);

  if (dias === null || dias < MIN_DIAS_VIAJE) {
    return "El rango de fechas no es válido";
  }

  const desde = formatearFechaCorta(inicio);
  const hasta = formatearFechaCorta(fin);

  return dias === 1
    ? `El ${desde} · 1 día`
    : `Del ${desde} al ${hasta} · ${dias} días`;
}

function resolverFecha(value: FechaInput): Date | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  return parseFechaLocal(value);
}

function aDiaUtc(fecha: Date): number {
  return Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}
