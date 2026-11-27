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

  it("consulta los cuatro recorridos y calcula promedio y portada", async () => {
    getLugaresMock.mockImplementation(async (filtro = {}) => {
      if (filtro.barrio === "Recoleta") {
        return resultado([
          crearLugar({
            id: "recoleta-1",
            nombre: "Cassia House",
            puntuacion: 5,
            fotoPortadaUrl: "https://foto/recoleta.jpg",
          }),
          crearLugar({
            id: "recoleta-2",
            nombre: "DEYÁ",
            puntuacion: 4.6,
          }),
        ]);
      }

      return resultado([
        crearLugar({ id: `${filtro.barrio}-1`, nombre: "Otro lugar", puntuacion: 4.5 }),
      ]);
    });

    const { result } = renderHook(() => useItinerariosDestacados());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.itinerarios).toHaveLength(4);
    expect(result.current.error).toBeNull();

    const recoleta = result.current.itinerarios.find(
      (itinerario) => itinerario.tema.id === "recoleta-cultural"
    );

    expect(recoleta?.promedioPuntuacion).toBe(4.8);
    expect(recoleta?.portadaUrl).toBe("https://foto/recoleta.jpg");

    expect(getLugaresMock).toHaveBeenCalledTimes(4);
    expect(getLugaresMock).toHaveBeenCalledWith(
      expect.objectContaining({
        barrio: "Recoleta",
        categoriaCodigo: "museos_galerias",
        orden: "puntuacion",
        resenasMinimas: 10,
        puntuacionMinima: 4.5,
        pagina: 1,
        tamano: 4,
      })
    );
    expect(getLugaresMock).toHaveBeenCalledWith(
      expect.objectContaining({
        barrio: "Palermo",
        subzona: "Soho",
        orden: "resenas",
        resenasMinimas: 1000,
        puntuacionMinima: 4.4,
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
