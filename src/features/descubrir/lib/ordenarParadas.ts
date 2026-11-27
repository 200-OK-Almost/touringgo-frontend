import type { LugarResumenDto } from "../../../api/types";

function distanciaCuadrada(
  origen: LugarResumenDto,
  destino: LugarResumenDto
): number {
  const deltaLatitud = destino.latitud - origen.latitud;
  const deltaLongitud = destino.longitud - origen.longitud;

  return deltaLatitud * deltaLatitud + deltaLongitud * deltaLongitud;
}

export function ordenarPorCercania(
  lugares: LugarResumenDto[]
): LugarResumenDto[] {
  if (lugares.length <= 1) {
    return [...lugares];
  }

  const [primero, ...resto] = lugares;
  const ordenados: LugarResumenDto[] = [primero];
  const pendientes = [...resto];

  while (pendientes.length > 0) {
    const actual = ordenados[ordenados.length - 1];
    let mejorIndice = 0;
    let mejorDistancia = Number.POSITIVE_INFINITY;

    pendientes.forEach((lugar, indice) => {
      const distancia = distanciaCuadrada(actual, lugar);

      if (distancia < mejorDistancia) {
        mejorDistancia = distancia;
        mejorIndice = indice;
      }
    });

    const [siguiente] = pendientes.splice(mejorIndice, 1);
    ordenados.push(siguiente);
  }

  return ordenados;
}
