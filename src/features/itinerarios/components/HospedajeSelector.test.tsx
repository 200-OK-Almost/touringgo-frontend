import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LugarResumenDto, ResultadoPaginadoDto } from "../../../api/types";
import { getLugares } from "../../../api/lugares";
import HospedajeSelector from "./HospedajeSelector";

vi.mock("../../../api/lugares", () => ({
  getLugares: vi.fn(),
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
  it("pide elegir un barrio antes de mostrar alojamientos, igual que recomendados", () => {
    render(
      <HospedajeSelector
        puntoInicio="HospedajePropio"
        barrio={null}
        selectedLugarId={null}
        onSelectLugar={vi.fn()}
      />
    );

    expect(
      screen.getByText("Seleccioná un barrio para ver alojamientos")
    ).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("autocompleta la búsqueda con debounce mientras se tipea", async () => {
    vi.mocked(getLugares).mockResolvedValue(resultado([]));

    render(
      <HospedajeSelector
        puntoInicio="HospedajePropio"
        barrio="Palermo"
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
            barrio: "Palermo",
          })
        ),
      { timeout: 1500 }
    );
  });

  it("elige el hotel directamente al hacer click, como en recomendados", async () => {
    vi.mocked(getLugares).mockResolvedValue(
      resultado([lugar("h1", "Hotel Ficticio")])
    );
    const onSelectLugar = vi.fn();

    render(
      <HospedajeSelector
        puntoInicio="HospedajePropio"
        barrio="Palermo"
        selectedLugarId={null}
        onSelectLugar={onSelectLugar}
      />
    );

    fireEvent.click(
      await screen.findByRole("radio", { name: /Hotel Ficticio/ })
    );

    expect(onSelectLugar).toHaveBeenCalledWith(
      "h1",
      expect.objectContaining({ id: "h1", nombre: "Hotel Ficticio" })
    );
  });

  it("marca el hotel elegido con el CTA Elegido al restaurar el día", async () => {
    vi.mocked(getLugares).mockResolvedValue(
      resultado([lugar("h1", "Hotel Restaurado")])
    );

    render(
      <HospedajeSelector
        puntoInicio="HospedajePropio"
        barrio="Palermo"
        selectedLugarId="h1"
        onSelectLugar={vi.fn()}
      />
    );

    const card = await screen.findByRole("radio", { name: /Hotel Restaurado/ });

    expect(card).toHaveClass("selectable-card-option--selected");
    expect(screen.getByText("Elegido")).toBeInTheDocument();
  });
});

describe("HospedajeSelector — modo Recomiéndame hospedaje", () => {
  it("mantiene el botón Buscar y la selección directa de hotel", async () => {
    vi.mocked(getLugares).mockResolvedValue(
      resultado([lugar("h1", "Hotel Sugerido")])
    );
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
        ? { items: primeraPagina, total: 9, pagina: 1, tamano: 100 }
        : { items: segundaPagina, total: 9, pagina: 2, tamano: 100 }
    );

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
      expect.objectContaining({ pagina: 2, tamano: 100 })
    );
    expect(
      screen.queryByRole("button", { name: "Ver más alojamientos" })
    ).not.toBeInTheDocument();
  });

  it("muestra primero los alojamientos mejor rankeados", async () => {
    vi.mocked(getLugares).mockResolvedValue(
      resultado([
        { ...lugar("h1", "Hotel Regular"), puntuacion: 3.3 },
        { ...lugar("h2", "Hotel Top"), puntuacion: 4.9 },
        { ...lugar("h3", "Hotel Medio"), puntuacion: 4.2 },
      ])
    );

    render(
      <HospedajeSelector
        puntoInicio="HospedajeSugerido"
        barrio="Palermo"
        selectedLugarId={null}
        onSelectLugar={vi.fn()}
      />
    );

    const cards = await screen.findAllByRole("radio", { name: /Hotel/ });

    expect(cards[0]).toHaveTextContent("Hotel Top");
    expect(cards[1]).toHaveTextContent("Hotel Medio");
    expect(cards[2]).toHaveTextContent("Hotel Regular");
  });

  it("marca el hotel elegido con el CTA Elegido", async () => {
    vi.mocked(getLugares).mockResolvedValue(
      resultado([lugar("h1", "Hotel Elegido")])
    );

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
