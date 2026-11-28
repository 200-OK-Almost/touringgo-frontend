import { describe, expect, it } from "vitest";
import type { LugarResumenDto } from "../../../api/types";
import type { ItinerarioDestacado, TemaItinerario } from "../types";
import { construirViajeRecomendadoDto } from "./recorridoRecomendado";

function crearLugar(
  id: string,
  nombre: string,
  latitud: number,
  longitud: number
): LugarResumenDto {
  return {
    id,
    nombre,
    tipoLugar: "PuntoInteres",
    barrio: "Palermo",
    subzona: null,
    direccion: "Calle 1",
    latitud,
    longitud,
    duracionEstimadaMinutos: 60,
    nivelPrecio: 2,
    puntuacion: 4.5,
    cantidadResenas: 100,
    esBajoTecho: true,
    esAlAireLibre: false,
    aptoNinos: true,
    accesibleMovilidadReducida: false,
    fotoPortadaUrl: null,
    categorias: [],
    distanciaMetros: null,
  };
}

function crearItinerario(
  tema: TemaItinerario,
  lugares: LugarResumenDto[]
): ItinerarioDestacado {
  return {
    tema,
    lugares,
    promedioPuntuacion: 4.5,
    portadaUrl: null,
  };
}

const TEMA_BASE: TemaItinerario = {
  id: "tema",
  titulo: "Tema",
  descripcion: "Descripción",
  barrio: "Palermo",
  orden: "resenas",
  resenasMinimas: 0,
  puntuacionMinima: 0,
  icono: "🔥",
};

describe("construirViajeRecomendadoDto", () => {
  it("preserva el orden compuesto cuando el tema tiene slots", () => {
    const tema: TemaItinerario = { ...TEMA_BASE, slots: [{}, {}, {}, {}] };
    const lugares = [
      crearLugar("cafe", "Café", -34.58, -58.42),
      crearLugar("main", "Principal", -34.61, -58.4),
      crearLugar("bar", "Bar", -34.59, -58.41),
      crearLugar("otro", "Otro", -34.6, -58.43),
    ];

    const dto = construirViajeRecomendadoDto(
      crearItinerario(tema, lugares),
      new Date(2026, 10, 27)
    );

    expect(dto.lugarIds).toEqual(["cafe", "main", "bar", "otro"]);
    expect(dto.titulo).toBe("Recorrido: Tema");
    expect(dto.barrio).toBe("Palermo");
    expect(dto.fechaInicio).toBe("2026-11-27");
    expect(dto.fechaFin).toBe("2026-11-27");
  });

  it("ordena por cercanía cuando el tema no tiene slots", () => {
    const lugares = [
      crearLugar("a", "A", 0, 0),
      crearLugar("lejos", "Lejos", 10, 10),
      crearLugar("cerca", "Cerca", 0.1, 0.1),
    ];

    const dto = construirViajeRecomendadoDto(
      crearItinerario(TEMA_BASE, lugares),
      new Date(2026, 10, 27)
    );

    expect(dto.lugarIds).toEqual(["a", "cerca", "lejos"]);
  });
});
