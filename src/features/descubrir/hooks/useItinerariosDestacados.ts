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

interface SlotResuelto {
  categoriaCodigo: TemaItinerario["categoriaCodigo"];
  orden: TemaItinerario["orden"];
  resenasMinimas: number;
  puntuacionMinima: number;
}

function resolverSlots(tema: TemaItinerario): SlotResuelto[] {
  if (!tema.slots || tema.slots.length === 0) {
    return [
      {
        categoriaCodigo: tema.categoriaCodigo,
        orden: tema.orden,
        resenasMinimas: tema.resenasMinimas,
        puntuacionMinima: tema.puntuacionMinima,
      },
    ];
  }

  return tema.slots.map((slot) => ({
    categoriaCodigo: slot.categoriaCodigo ?? tema.categoriaCodigo,
    orden: slot.orden ?? tema.orden,
    resenasMinimas: slot.resenasMinimas ?? tema.resenasMinimas,
    puntuacionMinima: slot.puntuacionMinima ?? tema.puntuacionMinima,
  }));
}

function claveFiltro(tema: TemaItinerario, slot: SlotResuelto): string {
  return JSON.stringify({
    barrio: tema.barrio,
    subzona: tema.subzona ?? null,
    categoriaCodigo: slot.categoriaCodigo ?? null,
    orden: slot.orden,
    resenasMinimas: slot.resenasMinimas,
    puntuacionMinima: slot.puntuacionMinima,
  });
}

async function cargarTema(tema: TemaItinerario): Promise<ItinerarioDestacado | null> {
  const slots = resolverSlots(tema);
  const cache = new Map<string, Promise<LugarResumenDto[]>>();

  const buscar = (slot: SlotResuelto): Promise<LugarResumenDto[]> => {
    const clave = claveFiltro(tema, slot);
    const cacheado = cache.get(clave);

    if (cacheado) {
      return cacheado;
    }

    const solicitud = getLugares({
      barrio: tema.barrio,
      subzona: tema.subzona,
      categoriaCodigo: slot.categoriaCodigo,
      orden: slot.orden,
      resenasMinimas: slot.resenasMinimas,
      puntuacionMinima: slot.puntuacionMinima,
      pagina: 1,
      tamano: LUGARES_POR_RECORRIDO,
    }).then((resultado) => resultado.items);

    cache.set(clave, solicitud);
    return solicitud;
  };

  const usados = new Set<string>();
  const lugares: LugarResumenDto[] = [];

  if (slots.length === 1) {
    const items = await buscar(slots[0]);
    lugares.push(...items.slice(0, LUGARES_POR_RECORRIDO));
  } else {
    for (const slot of slots) {
      const items = await buscar(slot);
      const elegido = items.find((item) => !usados.has(item.id));

      if (elegido) {
        usados.add(elegido.id);
        lugares.push(elegido);
      }
    }

    if (lugares.length < LUGARES_POR_RECORRIDO) {
      const fallback = await buscar({
        categoriaCodigo: tema.categoriaCodigo,
        orden: tema.orden,
        resenasMinimas: tema.resenasMinimas,
        puntuacionMinima: tema.puntuacionMinima,
      });

      for (const item of fallback) {
        if (lugares.length >= LUGARES_POR_RECORRIDO) {
          break;
        }

        if (!usados.has(item.id)) {
          usados.add(item.id);
          lugares.push(item);
        }
      }
    }
  }

  if (lugares.length === 0) {
    return null;
  }

  return {
    tema,
    lugares,
    promedioPuntuacion: calcularPromedioPuntuacion(lugares),
    portadaUrl: seleccionarPortada(lugares),
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
