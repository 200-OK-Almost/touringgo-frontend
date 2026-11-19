import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ResultadoPaginadoDto } from "../../../api/types";
import type { ViajeDto } from "../../viaje/types";
import { actualizarViaje, eliminarViaje, getMisViajes } from "../../viaje/api/viajes";
import MisViajesModal from "./MisViajesModal";

vi.mock("../../viaje/api/viajes", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../viaje/api/viajes")>();

  return {
    ...actual,
    getMisViajes: vi.fn(),
    actualizarViaje: vi.fn(),
    eliminarViaje: vi.fn(),
  };
});

const getMisViajesMock = vi.mocked(getMisViajes);
const actualizarViajeMock = vi.mocked(actualizarViaje);
const eliminarViajeMock = vi.mocked(eliminarViaje);

const VIAJE_ID = "11111111-1111-1111-1111-111111111111";

function crearViaje(sobrescribir: Partial<ViajeDto> = {}): ViajeDto {
  return {
    id: VIAJE_ID,
    titulo: "Paseo por Palermo",
    tipoViaje: "Pareja",
    estado: "Planificado",
    barrio: "Palermo",
    alcanceTemporal: "DiaCompleto",
    fechaInicio: "2026-03-10",
    fechaFin: "2026-03-11",
    nivelPresupuesto: "Equilibrado",
    ritmoCaminata: "Tranquilo",
    limiteCuadrasEntreParadas: 10,
    tipoPuntoPartida: "PrimeraParada",
    codigoInvitacion: "ABC123",
    creadoPorUsuarioId: "22222222-2222-2222-2222-222222222222",
    fechaCreacion: "2026-03-01T10:00:00Z",
    fechaActualizacion: "2026-03-01T10:00:00Z",
    categoriaCodigos: ["Gastronomia", "Cultura"],
    dias: [
      {
        id: "33333333-3333-3333-3333-333333333331",
        viajeId: VIAJE_ID,
        numeroDia: 1,
        fecha: "2026-03-10",
        barrio: "Palermo",
        tipoPuntoPartida: "PrimeraParada",
      },
      {
        id: "33333333-3333-3333-3333-333333333332",
        viajeId: VIAJE_ID,
        numeroDia: 2,
        fecha: "2026-03-11",
        barrio: "Recoleta",
        tipoPuntoPartida: "NodoUrbano",
      },
    ],
    itinerarios: null,
    ...sobrescribir,
  };
}

function crearResultado(viajes: ViajeDto[]): ResultadoPaginadoDto<ViajeDto> {
  return {
    items: viajes,
    total: viajes.length,
    pagina: 1,
    tamano: 20,
  };
}

function renderModal() {
  return render(
    <MemoryRouter>
      <MisViajesModal isOpen onClose={() => undefined} />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  getMisViajesMock.mockResolvedValue(crearResultado([crearViaje()]));
});

describe("MisViajesModal", () => {
  it("muestra Salida por Buenos Aires y los barrios de cada día", async () => {
    renderModal();

    expect(
      await screen.findByRole("heading", { name: "Salida por Buenos Aires" })
    ).toBeInTheDocument();
    expect(screen.getByText("Día 1: Salida por Palermo")).toBeInTheDocument();
    expect(screen.getByText("Día 2: Salida por Recoleta")).toBeInTheDocument();
  });

  it("renderiza los botones de editar y eliminar", async () => {
    renderModal();

    expect(
      await screen.findByRole("button", {
        name: "Editar título de Paseo por Palermo",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Eliminar Paseo por Palermo" })
    ).toBeInTheDocument();
  });

  it("edita el título con la API y actualiza la lista", async () => {
    actualizarViajeMock.mockResolvedValueOnce(
      crearViaje({ titulo: "Nuevo título" })
    );
    renderModal();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Editar título de Paseo por Palermo",
      })
    );

    const input = screen.getByRole("textbox", { name: "Título del viaje" });
    fireEvent.change(input, { target: { value: "Nuevo título" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(actualizarViajeMock).toHaveBeenCalledWith(
        VIAJE_ID,
        expect.objectContaining({ titulo: "Nuevo título" })
      );
    });
    expect(await screen.findByText("Nuevo título")).toBeInTheDocument();
  });

  it("cancela la edición sin llamar a la API", async () => {
    renderModal();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Editar título de Paseo por Palermo",
      })
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Título del viaje" }), {
      target: { value: "Otro título" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(actualizarViajeMock).not.toHaveBeenCalled();
    expect(screen.getByText("Paseo por Palermo")).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Título del viaje" })
    ).not.toBeInTheDocument();
  });

  it("elimina el viaje después de confirmar", async () => {
    eliminarViajeMock.mockResolvedValueOnce();
    renderModal();

    fireEvent.click(
      await screen.findByRole("button", { name: "Eliminar Paseo por Palermo" })
    );

    expect(screen.getByText(/¿Eliminar/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => {
      expect(eliminarViajeMock).toHaveBeenCalledWith(VIAJE_ID);
    });
    await waitFor(() => {
      expect(screen.queryByText("Paseo por Palermo")).not.toBeInTheDocument();
    });
    expect(
      screen.getByText("Aún no tienes viajes creados.")
    ).toBeInTheDocument();
  });

  it("muestra el error de la API sin romper la lista", async () => {
    eliminarViajeMock.mockRejectedValueOnce(
      new Error("No se pudo eliminar el viaje.")
    );
    renderModal();

    fireEvent.click(
      await screen.findByRole("button", { name: "Eliminar Paseo por Palermo" })
    );
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo eliminar el viaje."
    );
    expect(screen.getByText(/Paseo por Palermo/)).toBeInTheDocument();
  });
});
