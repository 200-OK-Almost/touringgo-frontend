import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLugares } from "../../../api/lugares";
import type { LugarResumenDto, ResultadoPaginadoDto } from "../../../api/types";
import {
  calcularPromedioPuntuacion,
  seleccionarPortada,
  useItinerariosDestacados,
} from "./useItinerariosDestacados";

vi.mock("../../../api/lugares", () => ({
  getLugares: vi.fn(),
}));

const getLugaresMock = vi.mocked(getLugares);

function crearLugar(
  overrides: Partial<LugarResumenDto> & Pick<LugarResumenDto, "id" | "nombre">
): LugarResumenDto {
  return {
    tipoLugar: "PuntoInteres",
    barrio: "Recoleta",
    subzona: null,
    direccion: "Calle 1",
    latitud: 0,
    longitud: 0,
    duracionEstimadaMinutos: 60,
    nivelPrecio: 2,
    puntuacion: null,
    cantidadResenas: 0,
    esBajoTecho: true,
    esAlAireLibre: false,
    aptoNinos: true,
    accesibleMovilidadReducida: false,
    fotoPortadaUrl: null,
    categorias: [],
    distanciaMetros: null,
    ...overrides,
  };
}

function resultado(
  items: LugarResumenDto[]
): ResultadoPaginadoDto<LugarResumenDto> {
  return { items, total: items.length, pagina: 1, tamano: 4 };
}

const PALERMO_CAFE = crearLugar({
  id: "palermo-cafe",
  nombre: "QueBiaba!",
  puntuacion: 5,
  fotoPortadaUrl: "https://foto/palermo-cafe.jpg",
});
const PALERMO_MAIN_1 = crearLugar({
  id: "palermo-main-1",
  nombre: "La Cabrera",
  puntuacion: 4.4,
});
const PALERMO_MAIN_2 = crearLugar({
  id: "palermo-main-2",
  nombre: "Temple Craft Soho",
  puntuacion: 4.6,
});
const PALERMO_MAIN_3 = crearLugar({
  id: "palermo-main-3",
  nombre: "Blest",
  puntuacion: 4.5,
});
const PALERMO_BAR = crearLugar({
  id: "palermo-bar",
  nombre: "Casa Temple",
  puntuacion: 4.4,
});
const SAN_CAFE = crearLugar({
  id: "san-cafe",
  nombre: "La Casa del Dulce de Leche",
  puntuacion: 4.9,
});
const SAN_MAIN_1 = crearLugar({
  id: "san-main-1",
  nombre: "PASTA BAR",
  puntuacion: 5,
});
const SAN_MAIN_2 = crearLugar({
  id: "san-main-2",
  nombre: "Lo de Flora",
  puntuacion: 4.9,
});
const SAN_MAIN_3 = crearLugar({
  id: "san-main-3",
  nombre: "El Tata",
  puntuacion: 4.9,
});
const SAN_BAR = crearLugar({
  id: "san-bar",
  nombre: "Nápoles",
  puntuacion: 4.5,
});
const RECOLETA_1 = crearLugar({
  id: "recoleta-1",
  nombre: "Cassia House",
  puntuacion: 5,
  fotoPortadaUrl: "https://foto/recoleta.jpg",
});
const RECOLETA_2 = crearLugar({
  id: "recoleta-2",
  nombre: "DEYÁ",
  puntuacion: 4.6,
});
const PUERTO_1 = crearLugar({
  id: "puerto-1",
  nombre: "Reserva Ecológica",
  puntuacion: 4.5,
});

function mockLugares() {
  getLugaresMock.mockImplementation(async (filtro = {}) => {
    switch (filtro.barrio) {
      case "Recoleta":
        return resultado([RECOLETA_1, RECOLETA_2]);

      case "PuertoMadero":
        return resultado([PUERTO_1]);

      case "Palermo":
        if (filtro.categoriaCodigo === "cafe_especialidad") {
          return resultado([PALERMO_CAFE]);
        }
        if (filtro.categoriaCodigo === "bares_vermu") {
          return resultado([PALERMO_MAIN_1, PALERMO_BAR]);
        }
        return resultado([
          PALERMO_MAIN_1,
          PALERMO_BAR,
          PALERMO_MAIN_2,
          PALERMO_MAIN_3,
        ]);

      case "SanTelmo":
        if (filtro.categoriaCodigo === "cafe_especialidad") {
          return resultado([SAN_CAFE]);
        }
        if (filtro.categoriaCodigo === "bares_vermu") {
          return resultado([SAN_BAR]);
        }
        return resultado([SAN_MAIN_1, SAN_MAIN_2, SAN_MAIN_3]);

      default:
        return resultado([]);
    }
  });
}

describe("calcularPromedioPuntuacion", () => {
  it("ignora los lugares sin puntuación", () => {
    const lugares = [
      crearLugar({ id: "1", nombre: "A", puntuacion: 5 }),
      crearLugar({ id: "2", nombre: "B", puntuacion: null }),
      crearLugar({ id: "3", nombre: "C", puntuacion: 4.6 }),
    ];

    expect(calcularPromedioPuntuacion(lugares)).toBe(4.8);
  });

  it("devuelve null cuando no hay puntuaciones", () => {
    expect(calcularPromedioPuntuacion([])).toBeNull();
  });
});

describe("seleccionarPortada", () => {
  it("toma la primera foto de portada disponible", () => {
    const lugares = [
      crearLugar({ id: "1", nombre: "A", fotoPortadaUrl: null }),
      crearLugar({ id: "2", nombre: "B", fotoPortadaUrl: "https://foto/b.jpg" }),
      crearLugar({ id: "3", nombre: "C", fotoPortadaUrl: "https://foto/c.jpg" }),
    ];

    expect(seleccionarPortada(lugares)).toBe("https://foto/b.jpg");
  });
});

describe("useItinerariosDestacados", () => {
  beforeEach(() => {
    getLugaresMock.mockReset();
  });

  it("compone Palermo Soho y San Telmo con café primero y bar tercero", async () => {
    mockLugares();

    const { result } = renderHook(() => useItinerariosDestacados());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.itinerarios).toHaveLength(4);
    expect(result.current.error).toBeNull();

    const palermo = result.current.itinerarios.find(
      (itinerario) => itinerario.tema.id === "palermo-soho-tendencia"
    );
    expect(palermo?.lugares.map((lugar) => lugar.id)).toEqual([
      "palermo-cafe",
      "palermo-main-1",
      "palermo-bar",
      "palermo-main-2",
    ]);

    const sanTelmo = result.current.itinerarios.find(
      (itinerario) => itinerario.tema.id === "san-telmo-clasico"
    );
    expect(sanTelmo?.lugares.map((lugar) => lugar.id)).toEqual([
      "san-cafe",
      "san-main-1",
      "san-bar",
      "san-main-2",
    ]);

    const recoleta = result.current.itinerarios.find(
      (itinerario) => itinerario.tema.id === "recoleta-cultural"
    );
    expect(recoleta?.promedioPuntuacion).toBe(4.8);
    expect(recoleta?.portadaUrl).toBe("https://foto/recoleta.jpg");

    expect(getLugaresMock).toHaveBeenCalledWith(
      expect.objectContaining({
        barrio: "Palermo",
        subzona: "Soho",
        categoriaCodigo: "cafe_especialidad",
        orden: "puntuacion",
        resenasMinimas: 50,
        puntuacionMinima: 4.3,
      })
    );
    expect(getLugaresMock).toHaveBeenCalledWith(
      expect.objectContaining({
        barrio: "Palermo",
        subzona: "Soho",
        categoriaCodigo: "bares_vermu",
        orden: "resenas",
        resenasMinimas: 100,
        puntuacionMinima: 4.3,
      })
    );
    expect(getLugaresMock).toHaveBeenCalledWith(
      expect.objectContaining({
        barrio: "SanTelmo",
        categoriaCodigo: "cafe_especialidad",
        orden: "puntuacion",
        resenasMinimas: 30,
        puntuacionMinima: 4.3,
      })
    );
    expect(getLugaresMock).toHaveBeenCalledWith(
      expect.objectContaining({
        barrio: "SanTelmo",
        categoriaCodigo: "bares_vermu",
        orden: "resenas",
        resenasMinimas: 100,
        puntuacionMinima: 4.3,
      })
    );
  });

  it("descarta los recorridos sin resultados", async () => {
    getLugaresMock.mockResolvedValue(resultado([]));

    const { result } = renderHook(() => useItinerariosDestacados());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.itinerarios).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("tolera fallos parciales y conserva los recorridos que sí cargaron", async () => {
    getLugaresMock.mockImplementation(async (filtro = {}) => {
      if (filtro.barrio === "SanTelmo") {
        throw new Error("boom");
      }

      return resultado([
        crearLugar({ id: `${filtro.barrio}-1`, nombre: "Otro lugar", puntuacion: 4.5 }),
      ]);
    });

    const { result } = renderHook(() => useItinerariosDestacados());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.itinerarios).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it("expone un error cuando fallan todos los recorridos", async () => {
    getLugaresMock.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useItinerariosDestacados());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.itinerarios).toEqual([]);
    expect(result.current.error).toBe("No se pudieron cargar los recorridos.");
  });
});
