import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LugarResumenDto } from "../api/types";
import { SelectablePlaceCard } from "./SelectablePlaceCard";

function lugarBase(
  sobrescribir: Partial<LugarResumenDto> = {}
): LugarResumenDto {
  return {
    id: "h1",
    nombre: "Hotel Ficticio",
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
    ...sobrescribir,
  };
}

describe("SelectablePlaceCard", () => {
  it("muestra el CTA con check solo cuando está seleccionada", () => {
    const onClick = vi.fn();
    const { container, rerender } = render(
      <SelectablePlaceCard
        lugar={lugarBase()}
        selected={false}
        onClick={onClick}
        ctaLabel="Elegir este hotel"
      />
    );

    expect(screen.getByText("Elegir este hotel")).toBeInTheDocument();
    expect(
      container.querySelector(".selectable-place-card__cta-check")
    ).toBeNull();
    expect(
      container.querySelector(".selectable-place-card__cta--selected")
    ).toBeNull();

    rerender(
      <SelectablePlaceCard
        lugar={lugarBase()}
        selected={true}
        onClick={onClick}
        ctaLabel="Elegido"
      />
    );

    expect(screen.getByText("Elegido")).toBeInTheDocument();
    expect(
      container.querySelector(".selectable-place-card__cta-check")
    ).toBeInTheDocument();
    expect(
      container.querySelector(".selectable-place-card__cta--selected")
    ).toBeInTheDocument();
  });

  it("no renderiza CTA cuando no se indica etiqueta", () => {
    const { container } = render(
      <SelectablePlaceCard lugar={lugarBase()} selected={false} onClick={vi.fn()} />
    );

    expect(container.querySelector(".selectable-place-card__cta")).toBeNull();
  });

  it("muestra la etiqueta de accesibilidad solo si el lugar es accesible", () => {
    const { rerender } = render(
      <SelectablePlaceCard
        lugar={lugarBase({ accesibleMovilidadReducida: true })}
        selected={false}
        onClick={vi.fn()}
      />
    );

    expect(
      screen.getByText("Accesible (movilidad reducida)")
    ).toBeInTheDocument();

    rerender(
      <SelectablePlaceCard
        lugar={lugarBase({ accesibleMovilidadReducida: false })}
        selected={false}
        onClick={vi.fn()}
      />
    );

    expect(
      screen.queryByText("Accesible (movilidad reducida)")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("No adaptado")).not.toBeInTheDocument();
  });
});
