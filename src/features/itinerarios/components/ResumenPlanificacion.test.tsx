import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  crearItineraryFormDataInicial,
  type ItineraryFormData,
} from "../planificacionFormData";
import { getLugaresDetalle } from "../../../api/lugares";
import type { CategoriaDto } from "../../../api/types";
import ResumenPlanificacion from "./ResumenPlanificacion";

vi.mock("../../../api/lugares", () => ({
  getLugaresDetalle: vi.fn().mockResolvedValue([
    { id: "hospedaje-1", nombre: "Hotel Palermo Select" },
  ]),
}));

const CATEGORIA: CategoriaDto = {
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
  beforeEach(() => {
    vi.mocked(getLugaresDetalle).mockClear();
  });

  it("resume las selecciones del viaje con detalle por día", async () => {
    render(<ResumenPlanificacion formData={crearFormData()} />);

    expect(screen.getByText("Resumen del viaje")).toBeInTheDocument();
    expect(screen.getByText("2 días")).toBeInTheDocument();
    expect(
      screen.getByText(/Del 18\/11 al 19\/11/)
    ).toBeInTheDocument();
    expect(screen.getByText("Día completo")).toBeInTheDocument();

    const lineaDia1 = await screen.findByText(/Día 1 ·/);
    expect(lineaDia1).toHaveTextContent(
      "Día 1 · Palermo — Hotel Palermo Select"
    );
    expect(screen.getByText(/Día 2 ·/)).toHaveTextContent(
      "Día 2 · Recoleta — Punto céntrico"
    );

    expect(screen.getByText("En pareja")).toBeInTheDocument();
    expect(screen.getByText("Café de especialidad")).toBeInTheDocument();
    expect(
      screen.getByText("Relajado, Activo · Equilibrado, Económico")
    ).toBeInTheDocument();

    expect(getLugaresDetalle).toHaveBeenCalledWith(["hospedaje-1"]);
  });

  it("muestra barrio y punto de partida con nombre del hospedaje en un solo día", async () => {
    const formData = crearFormData();
    formData.dias = formData.dias.slice(0, 1);
    formData.fechaFin = "2026-11-18";

    render(<ResumenPlanificacion formData={formData} />);

    expect(screen.getByText("1 día")).toBeInTheDocument();
    expect(screen.getByText("Palermo")).toBeInTheDocument();
    expect(
      await screen.findByText("Hotel Palermo Select")
    ).toBeInTheDocument();
  });

  it("muestra valores pendientes cuando no hay selecciones", () => {
    render(
      <ResumenPlanificacion formData={crearItineraryFormDataInicial()} />
    );

    expect(screen.getAllByText("Pendiente").length).toBeGreaterThanOrEqual(5);
    expect(screen.getByText("Sin días")).toBeInTheDocument();
    expect(getLugaresDetalle).not.toHaveBeenCalled();
  });
});
