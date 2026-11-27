import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LugarResumenDto } from "../../../api/types";
import type { ItinerarioDestacado } from "../types";
import ItinerariosDestacados from "./ItinerariosDestacados";

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
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 0));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it("navega al planificador con barrio y categoría del recorrido", () => {
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

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/planificacion?nuevo=1&barrio=Recoleta&categoria=museos_galerias"
    );
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
