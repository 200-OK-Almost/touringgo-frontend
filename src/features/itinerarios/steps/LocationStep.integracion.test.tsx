import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LugarResumenDto } from "../../../api/types";
import type { DiaPlanificacion } from "../planificacionFormData";
import { getLugares } from "../../../api/lugares";
import LocationStep from "./LocationStep";
import { validateStep } from "../PlanificationForm.validation";
import { crearItineraryFormDataInicial } from "../planificacionFormData";

vi.mock("../../../api/lugares", () => ({
  getLugares: vi.fn(),
}));

function hotel(barrio: LugarResumenDto["barrio"]): LugarResumenDto {
  return {
    id: "h1",
    nombre: "Hotel Elegido",
    tipoLugar: "Alojamiento",
    barrio,
    subzona: null,
    direccion: "Thames 1234",
    latitud: -34.58,
    longitud: -58.43,
    duracionEstimadaMinutos: 60,
    nivelPrecio: 2,
    puntuacion: 4.5,
    cantidadResenas: 10,
    esBajoTecho: true,
    esAlAireLibre: false,
    aptoNinos: true,
    accesibleMovilidadReducida: false,
    fotoPortadaUrl: null,
    categorias: [],
    distanciaMetros: null,
  };
}

function dia(
  barrio: DiaPlanificacion["barrio"],
  puntoInicio: DiaPlanificacion["puntoInicio"]
): DiaPlanificacion {
  return {
    fecha: "2026-11-18",
    dia: 1,
    barrio,
    puntoInicio,
    hospedajeLugarGuid: null,
    hospedajeBarrio: null,
    modalidadViaje: "Solo",
    categoriasPrioritarias: [],
    ritmoVisita: "Activo",
    presupuestoNivel: "Equilibrado",
  };
}

describe("LocationStep + HospedajeSelector (integracion)", () => {
  it("busca alojamientos dentro del barrio del día en Ya tengo lugar", async () => {
    vi.mocked(getLugares).mockResolvedValue({
      items: [hotel("Palermo")],
      total: 1,
      pagina: 1,
      tamano: 8,
    });

    render(
      <LocationStep
        dias={[dia("Palermo", "HospedajePropio")]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    await screen.findByRole("radio", { name: /Hotel Elegido/ });

    expect(getLugares).toHaveBeenCalledWith(
      expect.objectContaining({ barrio: "Palermo", tipoLugar: "Alojamiento" })
    );
  });

  it("al elegir un hotel en Ya tengo lugar notifica guid y barrio", async () => {
    vi.mocked(getLugares).mockResolvedValue({
      items: [hotel("Palermo")],
      total: 1,
      pagina: 1,
      tamano: 8,
    });
    const onChangeDia = vi.fn();

    render(
      <LocationStep
        dias={[dia("Palermo", "HospedajePropio")]}
        onChangeDia={onChangeDia}
        errors={{}}
      />
    );

    fireEvent.click(
      await screen.findByRole("radio", { name: /Hotel Elegido/ })
    );

    expect(onChangeDia).toHaveBeenCalledWith(1, {
      hospedajeLugarGuid: "h1",
      hospedajeBarrio: "Palermo",
    });
  });

  it("valida el paso solo si el hotel pertenece al barrio del día", () => {
    const diaBase: DiaPlanificacion = {
      ...dia("Palermo", "HospedajePropio"),
      hospedajeLugarGuid: "h1",
      hospedajeBarrio: "Palermo",
    };

    const formData = {
      ...crearItineraryFormDataInicial(),
      fechaInicio: "2026-11-18",
      fechaFin: "2026-11-18",
      disponibilidadDiaria: "DiaCompleto" as const,
      duracion: 1,
      dias: [diaBase],
    };

    expect(validateStep(formData, 1)).toEqual({});

    const diaInvalido: DiaPlanificacion = {
      ...diaBase,
      hospedajeBarrio: "Recoleta",
    };
    const formDataInvalido = {
      ...formData,
      dias: [diaInvalido],
    };

    expect(validateStep(formDataInvalido, 1).hospedajeLugarGuid).toBe(
      "El alojamiento recomendado debe pertenecer al barrio seleccionado (Palermo)."
    );
  });
});
