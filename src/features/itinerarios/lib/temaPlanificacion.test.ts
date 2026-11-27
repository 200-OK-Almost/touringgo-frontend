import { describe, expect, it } from "vitest";
import type { BarrioCaba, CategoriaDto } from "../../../api/types";
import type { ItineraryFormData } from "../planificacionFormData";
import { aplicarTemaPlanificacion, leerTemaPlanificacion } from "./temaPlanificacion";

const MUSEO: CategoriaDto = {
  id: 1,
  codigo: "museos_galerias",
  nombre: "Museos y galerías",
};

const CAFE: CategoriaDto = {
  id: 2,
  codigo: "cafe_especialidad",
  nombre: "Café de especialidad",
};

function crearFormData(
  barrio: BarrioCaba | null,
  categorias: CategoriaDto[] = []
): ItineraryFormData {
  return {
    duracion: 1,
    fechaInicio: "2026-11-18",
    fechaFin: "2026-11-18",
    disponibilidadDiaria: null,
    tipoTransporte: null,
    dias: [
      {
        fecha: "2026-11-18",
        dia: 1,
        barrio,
        puntoInicio: null,
        hospedajeLugarGuid: null,
        hospedajeBarrio: null,
        modalidadViaje: null,
        categoriasPrioritarias: categorias,
        ritmoVisita: null,
        presupuestoNivel: null,
      },
    ],
  };
}

describe("leerTemaPlanificacion", () => {
  it("lee barrio y categoría de los parámetros", () => {
    const tema = leerTemaPlanificacion(
      new URLSearchParams("barrio=Recoleta&categoria=museos_galerias")
    );

    expect(tema).toEqual({
      barrio: "Recoleta",
      categoriaCodigo: "museos_galerias",
    });
  });

  it("ignora un barrio inválido pero conserva la categoría", () => {
    const tema = leerTemaPlanificacion(
      new URLSearchParams("barrio=Nuñoa&categoria=cafe_especialidad")
    );

    expect(tema).toEqual({
      barrio: null,
      categoriaCodigo: "cafe_especialidad",
    });
  });

  it("devuelve null cuando no hay parámetros útiles", () => {
    expect(leerTemaPlanificacion(new URLSearchParams())).toBeNull();
    expect(
      leerTemaPlanificacion(new URLSearchParams("categoria=   "))
    ).toBeNull();
  });
});

describe("aplicarTemaPlanificacion", () => {
  it("asigna barrio y categoría a los días vacíos", () => {
    const resultado = aplicarTemaPlanificacion(
      crearFormData(null),
      { barrio: "Recoleta", categoriaCodigo: "museos_galerias" },
      [MUSEO, CAFE]
    );

    expect(resultado.dias[0].barrio).toBe("Recoleta");
    expect(resultado.dias[0].categoriasPrioritarias).toEqual([MUSEO]);
  });

  it("respeta el barrio y las categorías ya elegidas", () => {
    const resultado = aplicarTemaPlanificacion(
      crearFormData("Palermo", [CAFE]),
      { barrio: "Recoleta", categoriaCodigo: "museos_galerias" },
      [MUSEO, CAFE]
    );

    expect(resultado.dias[0].barrio).toBe("Palermo");
    expect(resultado.dias[0].categoriasPrioritarias).toEqual([CAFE]);
  });

  it("no agrega categoría si el código no existe", () => {
    const resultado = aplicarTemaPlanificacion(
      crearFormData(null),
      { barrio: "Palermo", categoriaCodigo: "inexistente" },
      [MUSEO]
    );

    expect(resultado.dias[0].barrio).toBe("Palermo");
    expect(resultado.dias[0].categoriasPrioritarias).toEqual([]);
  });

  it("aplica el tema a todos los días", () => {
    const formData = crearFormData(null);
    formData.dias.push({ ...formData.dias[0], dia: 2, fecha: "2026-11-19" });

    const resultado = aplicarTemaPlanificacion(
      formData,
      { barrio: "Recoleta", categoriaCodigo: null },
      []
    );

    expect(resultado.dias).toHaveLength(2);
    expect(resultado.dias.every((dia) => dia.barrio === "Recoleta")).toBe(true);
  });
});
