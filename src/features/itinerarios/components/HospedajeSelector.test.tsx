import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  LugarDetalleDto,
  LugarResumenDto,
  ResultadoPaginadoDto,
} from "../../../api/types";
import { getLugar, getLugares } from "../../../api/lugares";
import HospedajeSelector from "./HospedajeSelector";

vi.mock("../../../api/lugares", () => ({
  getLugares: vi.fn(),
  getLugar: vi.fn(),
}));

function lugar(id: string, nombre: string): LugarResumenDto {
  return {
    id,
    nombre,
    tipoLugar: "Alojamiento",
    barrio: "Palermo",
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

function resultado(items: LugarResumenDto[]): ResultadoPaginadoDto<LugarResumenDto> {
  return { items, total: items.length, pagina: 1, tamano: 50 };
}

describe("HospedajeSelector — modo Ya tengo lugar", () => {
  it("autocompleta la búsqueda con debounce mientras se tipea", async () => {
    vi.mocked(getLugares).mockResolvedValue(resultado([]));
    vi.mocked(getLugar).mockResolvedValue({} as unknown as LugarDetalleDto);

    render(
      <HospedajeSelector
        puntoInicio="HospedajePropio"
        barrio={null}
        selectedLugarId={null}
        onSelectLugar={vi.fn()}
      />
    );

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute(
      "placeholder",
      "Ej: Hotel Palermo, Thames 1234"
    );

    vi.mocked(getLugares).mockClear();
    fireEvent.change(input, { target: { value: "Hotel Palermo" } });

    await waitFor(
      () =>
        expect(getLugares).toHaveBeenCalledWith(
          expect.objectContaining({
            busqueda: "Hotel Palermo",
            tipoLugar: "Alojamiento",
          })
        ),
      { timeout: 1500 }
    );
  });

  it("confirma el lugar elegido y permite cambiarlo", async () => {
    vi.mocked(getLugares).mockResolvedValue(
      resultado([lugar("h1", "Hotel Ficticio")])
    );
    vi.mocked(getLugar).mockResolvedValue({} as unknown as LugarDetalleDto);
    const onSelectLugar = vi.fn();

    render(
      <HospedajeSelector
        puntoInicio="HospedajePropio"
        barrio={null}
        selectedLugarId={null}
        onSelectLugar={onSelectLugar}
      />
    );

    fireEvent.click(
      await screen.findByRole("radio", { name: /Hotel Ficticio/ })
    );

    const confirmacion = screen.getByRole("status");
    expect(
      within(confirmacion).getByText("Hotel Ficticio")
    ).toBeInTheDocument();
    expect(onSelectLugar).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onSelectLugar).toHaveBeenCalledWith(
      "h1",
      expect.objectContaining({ id: "h1", nombre: "Hotel Ficticio" })
    );
    expect(
      screen.getByText("Punto de partida confirmado")
    ).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cambiar alojamiento" }));

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("muestra el alojamiento ya elegido al restaurar el día", async () => {
    vi.mocked(getLugares).mockResolvedValue(resultado([]));
    vi.mocked(getLugar).mockResolvedValue({
      id: "h1",
      nombre: "Hotel Restaurado",
      barrio: "Palermo",
      subzona: null,
      direccion: "Av. Santa Fe 1234",
    } as unknown as LugarDetalleDto);

    render(
      <HospedajeSelector
        puntoInicio="HospedajePropio"
        barrio={null}
        selectedLugarId="h1"
        onSelectLugar={vi.fn()}
      />
    );

    expect(await screen.findByText("Hotel Restaurado")).toBeInTheDocument();
    expect(
      screen.getByText("Punto de partida confirmado")
    ).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });
});

describe("HospedajeSelector — modo Recomiéndame hospedaje", () => {
  it("mantiene el botón Buscar y la selección directa de hotel", async () => {
    vi.mocked(getLugares).mockResolvedValue(
      resultado([lugar("h1", "Hotel Sugerido")])
    );
    vi.mocked(getLugar).mockResolvedValue({} as unknown as LugarDetalleDto);
    const onSelectLugar = vi.fn();

    render(
      <HospedajeSelector
        puntoInicio="HospedajeSugerido"
        barrio="Palermo"
        selectedLugarId={null}
        onSelectLugar={onSelectLugar}
      />
    );

    expect(
      screen.getByRole("button", { name: "Buscar" })
    ).toBeInTheDocument();

    fireEvent.click(
      await screen.findByRole("radio", { name: /Hotel Sugerido/ })
    );

    expect(onSelectLugar).toHaveBeenCalledWith(
      "h1",
      expect.objectContaining({ id: "h1" })
    );
  });

  it("carga más alojamientos con el botón Ver más", async () => {
    const primeraPagina = Array.from({ length: 8 }, (_, i) =>
      lugar(`h${i + 1}`, `Hotel ${i + 1}`)
    );
    const segundaPagina = [lugar("h9", "Hotel 9")];

    vi.mocked(getLugares).mockImplementation(async (filtro) =>
      (filtro?.pagina ?? 1) === 1
        ? { items: primeraPagina, total: 9, pagina: 1, tamano: 8 }
        : { items: segundaPagina, total: 9, pagina: 2, tamano: 8 }
    );
    vi.mocked(getLugar).mockResolvedValue({} as unknown as LugarDetalleDto);

    render(
      <HospedajeSelector
        puntoInicio="HospedajeSugerido"
        barrio="Palermo"
        selectedLugarId={null}
        onSelectLugar={vi.fn()}
      />
    );

    expect(await screen.findAllByRole("radio", { name: /Hotel/ })).toHaveLength(
      8
    );
    expect(screen.getByText("9 alojamientos encontrados")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Ver más alojamientos" })
    );

    await waitFor(() =>
      expect(screen.getAllByRole("radio", { name: /Hotel/ })).toHaveLength(9)
    );
    expect(getLugares).toHaveBeenCalledWith(
      expect.objectContaining({ pagina: 2, tamano: 8 })
    );
    expect(
      screen.queryByRole("button", { name: "Ver más alojamientos" })
    ).not.toBeInTheDocument();
  });

  it("marca el hotel elegido con el CTA Elegido", async () => {
    vi.mocked(getLugares).mockResolvedValue(
      resultado([lugar("h1", "Hotel Elegido")])
    );
    vi.mocked(getLugar).mockResolvedValue({} as unknown as LugarDetalleDto);

    render(
      <HospedajeSelector
        puntoInicio="HospedajeSugerido"
        barrio="Palermo"
        selectedLugarId="h1"
        onSelectLugar={vi.fn()}
      />
    );

    const card = await screen.findByRole("radio", { name: /Hotel Elegido/ });

    expect(card).toHaveClass("selectable-card-option--selected");
    expect(screen.getByText("Elegido")).toBeInTheDocument();
  });
});
