import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../../api/client";
import type { LugarResumenDto } from "../../../api/types";
import { crearViajeRecomendado } from "../../viaje/api/viajes";
import type { ViajeDto } from "../../viaje/types";
import type { ItinerarioDestacado } from "../types";
import ItinerariosDestacados from "./ItinerariosDestacados";

vi.mock("../../viaje/api/viajes", () => ({
  crearViajeRecomendado: vi.fn(),
}));

const crearViajeMock = vi.mocked(crearViajeRecomendado);

const authState = vi.hoisted(() => ({ isAuthenticated: true }));

const hookState = vi.hoisted(() => ({
  value: {
    itinerarios: [] as ItinerarioDestacado[],
    loading: false,
    error: null as string | null,
  },
}));

vi.mock("../../auth/auth-context", () => ({
  useAuth: () => ({ isAuthenticated: authState.isAuthenticated }),
}));

vi.mock("../hooks/useItinerariosDestacados", () => ({
  useItinerariosDestacados: () => hookState.value,
}));

vi.mock("../../../components/LoginModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="login-modal">Iniciar sesión</div> : null,
}));

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
    puntuacion: 5,
    cantidadResenas: 100,
    esBajoTecho: true,
    esAlAireLibre: false,
    aptoNinos: true,
    accesibleMovilidadReducida: false,
    fotoPortadaUrl: "https://foto.jpg",
    categorias: [],
    distanciaMetros: null,
    ...overrides,
  };
}

function crearItinerario(
  overrides: Partial<ItinerarioDestacado> = {}
): ItinerarioDestacado {
  return {
    tema: {
      id: "recoleta-cultural",
      titulo: "Recoleta cultural",
      descripcion: "Galerías y museos.",
      barrio: "Recoleta",
      categoriaCodigo: "museos_galerias",
      orden: "puntuacion",
      resenasMinimas: 10,
      puntuacionMinima: 4.5,
      icono: "🏛️",
    },
    lugares: [
      crearLugar({ id: "1", nombre: "Cassia House" }),
      crearLugar({ id: "2", nombre: "DEYÁ" }),
      crearLugar({ id: "3", nombre: "Antigüedades Masini" }),
      crearLugar({ id: "4", nombre: "Pieruzzini Gallery" }),
    ],
    promedioPuntuacion: 4.9,
    portadaUrl: "https://foto.jpg",
    ...overrides,
  };
}

function crearItinerarioSecundario(): ItinerarioDestacado {
  return crearItinerario({
    tema: {
      id: "palermo-soho",
      titulo: "Palermo Soho en tendencia",
      descripcion: "Lugares del Soho.",
      barrio: "Palermo",
      orden: "resenas",
      resenasMinimas: 1000,
      puntuacionMinima: 4.4,
      icono: "🔥",
    },
    lugares: [crearLugar({ id: "5", nombre: "La Cabrera" })],
    promedioPuntuacion: 4.6,
    portadaUrl: "https://foto-2.jpg",
  });
}

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname + location.search}</span>;
}

function renderCarrusel() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ItinerariosDestacados />
      <LocationProbe />
    </MemoryRouter>
  );
}

describe("ItinerariosDestacados", () => {
  beforeEach(() => {
    authState.isAuthenticated = true;
    hookState.value = { itinerarios: [], loading: false, error: null };
    crearViajeMock.mockReset();
    crearViajeMock.mockResolvedValue({ id: "viaje-1" } as ViajeDto);
  });

  it("muestra los recorridos con promedio de estrellas y paradas", () => {
    hookState.value = {
      itinerarios: [crearItinerario()],
      loading: false,
      error: null,
    };

    renderCarrusel();

    expect(
      screen.getByRole("heading", { name: "Recoleta cultural" })
    ).toBeInTheDocument();
    expect(screen.getByText("4 paradas")).toBeInTheDocument();
    expect(screen.getByText("★ 4.9")).toBeInTheDocument();
    expect(screen.getByText("Cassia House")).toBeInTheDocument();
  });

  it("repite las tarjetas para el loop y no muestra flechas", () => {
    hookState.value = {
      itinerarios: [crearItinerario(), crearItinerarioSecundario()],
      loading: false,
      error: null,
    };

    const { container } = renderCarrusel();

    expect(container.querySelectorAll(".recorridos__group")).toHaveLength(3);
    expect(container.querySelectorAll(".recorrido-card")).toHaveLength(6);
    expect(
      screen.queryByRole("button", { name: "Recorrido anterior" })
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Siguiente recorrido" })
    ).toBeNull();
  });

  it("oculta las copias duplicadas para lectores de pantalla", () => {
    hookState.value = {
      itinerarios: [crearItinerario(), crearItinerarioSecundario()],
      loading: false,
      error: null,
    };

    const { container } = renderCarrusel();
    const groups = Array.from(
      container.querySelectorAll<HTMLElement>(".recorridos__group")
    );
    const cards = Array.from(
      container.querySelectorAll<HTMLButtonElement>(".recorrido-card")
    );

    expect(groups).toHaveLength(3);
    expect(groups[0]).not.toHaveAttribute("aria-hidden");
    expect(groups[1]).toHaveAttribute("aria-hidden", "true");
    expect(groups[2]).toHaveAttribute("aria-hidden", "true");

    expect(cards).toHaveLength(6);
    expect(cards[0]).not.toHaveAttribute("aria-hidden");
    expect(cards[1]).not.toHaveAttribute("aria-hidden");

    for (const card of cards.slice(2)) {
      expect(card).toHaveAttribute("aria-hidden", "true");
      expect(card).toHaveAttribute("tabindex", "-1");
    }
  });

  it("crea el viaje con las paradas y navega a la vista del viaje", async () => {
    hookState.value = {
      itinerarios: [crearItinerario()],
      loading: false,
      error: null,
    };

    renderCarrusel();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Planificar el recorrido Recoleta cultural",
      })
    );

    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/viajes/viaje-1")
    );

    expect(crearViajeMock).toHaveBeenCalledTimes(1);

    const payload = crearViajeMock.mock.calls[0][0];
    expect(payload).toEqual(
      expect.objectContaining({
        titulo: "Recorrido: Recoleta cultural",
        barrio: "Recoleta",
        categoriaCodigo: "museos_galerias",
        lugarIds: ["1", "2", "3", "4"],
      })
    );
    expect(payload.fechaInicio).toBe(payload.fechaFin);
    expect(payload.fechaInicio).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("muestra un error si falla la creación del viaje", async () => {
    crearViajeMock.mockRejectedValue(new ApiError(500, "No se pudo crear"));
    hookState.value = {
      itinerarios: [crearItinerario()],
      loading: false,
      error: null,
    };

    renderCarrusel();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Planificar el recorrido Recoleta cultural",
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo crear"
    );
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("abre el login si la sesión expiró al crear el viaje", async () => {
    crearViajeMock.mockRejectedValue(new ApiError(401, "No autorizado"));
    hookState.value = {
      itinerarios: [crearItinerario()],
      loading: false,
      error: null,
    };

    renderCarrusel();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Planificar el recorrido Recoleta cultural",
      })
    );

    expect(await screen.findByTestId("login-modal")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("abre el login cuando el usuario no está autenticado", () => {
    authState.isAuthenticated = false;
    hookState.value = {
      itinerarios: [crearItinerario()],
      loading: false,
      error: null,
    };

    renderCarrusel();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Planificar el recorrido Recoleta cultural",
      })
    );

    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("no renderiza la sección cuando no hay recorridos", () => {
    renderCarrusel();

    expect(
      screen.queryByRole("heading", { name: "Inspirate con lo más elegido" })
    ).toBeNull();
  });

  it("muestra skeletons mientras carga", () => {
    hookState.value = { itinerarios: [], loading: true, error: null };

    const { container } = renderCarrusel();

    expect(container.querySelectorAll(".recorrido-skeleton")).toHaveLength(4);
    expect(container.querySelector(".recorridos__track")).toHaveAttribute(
      "aria-busy",
      "true"
    );
  });
});
