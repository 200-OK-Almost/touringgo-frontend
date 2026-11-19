import { describe, expect, it } from "vitest";
import {
  crearItineraryFormDataInicial,
  type ItineraryFormData,
} from "../planificacionFormData";
import { construirViajeCreateDto } from "./viajePayload";

function crearFormData(): ItineraryFormData {
  return {
    ...crearItineraryFormDataInicial(),
    fechaInicio: "2026-11-18",
    fechaFin: "2026-11-19",
    disponibilidadDiaria: "DiaCompleto",
    ritmoVisita: "Activo",
    presupuestoNivel: "Equilibrado",
    duracion: 2,
    dias: [
      {
        fecha: "2026-11-18",
        dia: 1,
        barrio: "Palermo",
        puntoInicio: "NodoUrbano",
        hospedajeLugarGuid: null,
        hospedajeBarrio: null,
        modalidadViaje: "Solo",
        categoriasPrioritarias: [
          { id: 1, codigo: "cafe_especialidad", nombre: "Café de especialidad" },
          { id: 2, codigo: "museos_galerias", nombre: "Museos y galerías" },
        ],
      },
      {
        fecha: "2026-11-19",
        dia: 2,
        barrio: "Recoleta",
        puntoInicio: "HospedajeSugerido",
        hospedajeLugarGuid: "hotel-1",
        hospedajeBarrio: "Recoleta",
        modalidadViaje: "Familia",
        categoriasPrioritarias: [
          { id: 3, codigo: "parques_aire_libre", nombre: "Parques y aire libre" },
          { id: 4, codigo: "gastronomia_clasica", nombre: "Gastronomía clásica" },
        ],
      },
    ],
  };
}

describe("construirViajeCreateDto", () => {
  it("incluye el array de días con barrio y punto de partida", () => {
    const dto = construirViajeCreateDto(crearFormData());

    expect(dto.barrio).toBe("Palermo");
    expect(dto.tipoPuntoPartida).toBe("NodoUrbano");
    expect(dto.dias).toHaveLength(2);
    expect(dto.dias?.[0]).toMatchObject({
      numeroDia: 1,
      fecha: "2026-11-18",
      barrio: "Palermo",
      tipoPuntoPartida: "NodoUrbano",
      tipoViaje: "Solo",
      categoriaCodigos: ["cafe_especialidad", "museos_galerias"],
    });
    expect(dto.dias?.[1]).toMatchObject({
      numeroDia: 2,
      fecha: "2026-11-19",
      barrio: "Recoleta",
      tipoPuntoPartida: "HospedajeSugerido",
      lugarPartidaId: "hotel-1",
      tipoViaje: "Familia",
      categoriaCodigos: ["parques_aire_libre", "gastronomia_clasica"],
    });
  });

  it("usa los datos del primer día para los campos legacy", () => {
    const dto = construirViajeCreateDto(crearFormData());

    expect(dto.titulo).toBe("Salida por Buenos Aires");
    expect(dto.tipoViaje).toBe("Solo");
    expect(dto.lugarPartidaId).toBeUndefined();
    expect(dto.categoriaCodigos).toEqual([
      "cafe_especialidad",
      "museos_galerias",
    ]);
  });

  it("falla si un día está incompleto", () => {
    const formData = crearFormData();
    formData.dias[1] = {
      ...formData.dias[1],
      barrio: null,
    };

    expect(() => construirViajeCreateDto(formData)).toThrow(
      "El día 2 está incompleto."
    );
  });

  it("falla si falta la modalidad de un día", () => {
    const formData = crearFormData();
    formData.dias[1] = {
      ...formData.dias[1],
      modalidadViaje: null,
    };

    expect(() => construirViajeCreateDto(formData)).toThrow(
      "El día 2 está incompleto."
    );
  });

  it("falla si un día tiene menos de dos categorías", () => {
    const formData = crearFormData();
    formData.dias[1] = {
      ...formData.dias[1],
      categoriasPrioritarias: formData.dias[1].categoriasPrioritarias.slice(0, 1),
    };

    expect(() => construirViajeCreateDto(formData)).toThrow(
      "El día 2 necesita al menos 2 categorías."
    );
  });
});
