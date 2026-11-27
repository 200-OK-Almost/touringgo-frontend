import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  crearItineraryFormDataInicial,
  type ItineraryFormData,
} from "../planificacionFormData";
import ResumenPlanificacion from "./ResumenPlanificacion";

const CATEGORIA = {
  id: 1,
  codigo: "cafe_especialidad",
  nombre: "Café de especialidad",
};

function crearFormData(
  sobrescribir: Partial<ItineraryFormData> = {}
): ItineraryFormData {
  return {
    ...crearItineraryFormDataInicial(),
    fechaInicio: "2026-11-18",
    fechaFin: "2026-11-19",
    disponibilidadDiaria: "DiaCompleto",
    dias: [
      {
        fecha: "2026-11-18",
        dia: 1,
        barrio: "Palermo",
        puntoInicio: "HospedajePropio",
        hospedajeLugarGuid: "hospedaje-1",
        hospedajeBarrio: "Palermo",
        modalidadViaje: "Pareja",
        categoriasPrioritarias: [CATEGORIA],
        ritmoVisita: "Tranquilo",
        presupuestoNivel: "Equilibrado",
      },
      {
        fecha: "2026-11-19",
        dia: 2,
        barrio: "Recoleta",
        puntoInicio: "NodoUrbano",
        hospedajeLugarGuid: null,
        hospedajeBarrio: null,
        modalidadViaje: "Pareja",
        categoriasPrioritarias: [CATEGORIA],
        ritmoVisita: "Activo",
        presupuestoNivel: "Economico",
      },
    ],
    ...sobrescribir,
  };
}

describe("ResumenPlanificacion", () => {
  it("resume las selecciones del viaje", () => {
    render(<ResumenPlanificacion formData={crearFormData()} />);

    expect(screen.getByText("Resumen del viaje")).toBeInTheDocument();
    expect(screen.getByText("2 días")).toBeInTheDocument();
    expect(
      screen.getByText(/Del 18\/11 al 19\/11/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Día completo/)).toBeInTheDocument();
    expect(screen.getByText("Palermo, Recoleta")).toBeInTheDocument();
    expect(
      screen.getByText("Hospedaje propio, Punto céntrico")
    ).toBeInTheDocument();
    expect(screen.getByText("En pareja")).toBeInTheDocument();
    expect(screen.getByText("Café de especialidad")).toBeInTheDocument();
    expect(screen.getByText("Relajado · Equilibrado")).toBeInTheDocument();
  });

  it("muestra valores pendientes cuando no hay selecciones", () => {
    render(
      <ResumenPlanificacion formData={crearItineraryFormDataInicial()} />
    );

    expect(screen.getAllByText(/Sin definir/).length).toBeGreaterThan(0);
    expect(screen.getByText("Sin días")).toBeInTheDocument();
  });
});
