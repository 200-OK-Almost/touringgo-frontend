import { useEffect, useState } from "react";
import { getLugares } from "../../../api/lugares";
import type { LugarResumenDto } from "../../../api/types";
import {
  ITINERARIOS_DESTACADOS,
  LUGARES_POR_RECORRIDO,
} from "../data/itinerariosDestacados";
import type { ItinerarioDestacado, TemaItinerario } from "../types";

interface EstadoItinerariosDestacados {
  itinerarios: ItinerarioDestacado[];
  loading: boolean;
  error: string | null;
}

const ESTADO_INICIAL: EstadoItinerariosDestacados = {
  itinerarios: [],
  loading: true,
  error: null,
};

export function calcularPromedioPuntuacion(lugares: LugarResumenDto[]): number | null {
  const puntuaciones = lugares
    .map((lugar) => lugar.puntuacion)
    .filter((puntuacion): puntuacion is number => typeof puntuacion === "number");

  if (puntuaciones.length === 0) {
    return null;
  }

  const total = puntuaciones.reduce((acumulado, puntuacion) => acumulado + puntuacion, 0);
  return Number((total / puntuaciones.length).toFixed(1));
}

export function seleccionarPortada(lugares: LugarResumenDto[]): string | null {
  return lugares.find((lugar) => lugar.fotoPortadaUrl)?.fotoPortadaUrl ?? null;
}

async function cargarTema(tema: TemaItinerario): Promise<ItinerarioDestacado | null> {
  const resultado = await getLugares({
    barrio: tema.barrio,
    subzona: tema.subzona,
    categoriaCodigo: tema.categoriaCodigo,
    orden: tema.orden,
    resenasMinimas: tema.resenasMinimas,
    puntuacionMinima: tema.puntuacionMinima,
    pagina: 1,
    tamano: LUGARES_POR_RECORRIDO,
  });

  if (resultado.items.length === 0) {
    return null;
  }

  return {
    tema,
    lugares: resultado.items,
    promedioPuntuacion: calcularPromedioPuntuacion(resultado.items),
    portadaUrl: seleccionarPortada(resultado.items),
  };
}

function esCumplida(
  resultado: PromiseSettledResult<ItinerarioDestacado | null>
): resultado is PromiseFulfilledResult<ItinerarioDestacado | null> {
  return resultado.status === "fulfilled";
}

export function useItinerariosDestacados(): EstadoItinerariosDestacados {
  const [estado, setEstado] = useState<EstadoItinerariosDestacados>(ESTADO_INICIAL);

  useEffect(() => {
    let activo = true;

    Promise.allSettled(ITINERARIOS_DESTACADOS.map(cargarTema)).then((resultados) => {
      if (!activo) {
        return;
      }

      const itinerarios = resultados
        .filter(esCumplida)
        .map((resultado) => resultado.value)
        .filter((itinerario): itinerario is ItinerarioDestacado => itinerario !== null);

      const huboError = resultados.some((resultado) => resultado.status === "rejected");

      setEstado({
        itinerarios,
        loading: false,
        error:
          itinerarios.length === 0 && huboError
            ? "No se pudieron cargar los recorridos."
            : null,
      });
    });

    return () => {
      activo = false;
    };
  }, []);

  return estado;
}
