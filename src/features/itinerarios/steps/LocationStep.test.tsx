import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DiaPlanificacion } from "../planificacionFormData";
import LocationStep from "./LocationStep";

vi.mock("../components/HospedajeSelector", () => ({
  default: () => <div data-testid="hospedaje-selector" />,
}));

function dia(
  fecha: string,
  numero: number,
  barrio: DiaPlanificacion["barrio"] = null
): DiaPlanificacion {
  return {
    fecha,
    dia: numero,
    barrio,
    puntoInicio: barrio ? "NodoUrbano" : null,
    hospedajeLugarGuid: null,
    hospedajeBarrio: null,
    modalidadViaje: barrio ? "Solo" : null,
    categoriasPrioritarias: [],
    ritmoVisita: null,
    presupuestoNivel: null,
  };
}

describe("LocationStep", () => {
  it("con un solo día mantiene la UI simple, sin tabs ni atajo", () => {
    render(
      <LocationStep
        dias={[dia("2026-11-18", 1, "Palermo")]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(
      screen.getByRole("heading", { name: "¿Qué barrio querés recorrer?" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Usar el mismo barrio/alojamiento para todos los días",
      })
    ).not.toBeInTheDocument();
  });

  it("con varios días muestra tabs y permite cambiar de día", () => {
    render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2, "Recoleta"),
        ]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    const tabDia1 = screen.getByRole("tab", { name: /Día 1/ });
    const tabDia2 = screen.getByRole("tab", { name: /Día 2/ });

    expect(tabDia1).toHaveAttribute("aria-selected", "true");
    expect(tabDia2).toHaveAttribute("aria-selected", "false");

    fireEvent.click(tabDia2);

    expect(tabDia2).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("radio", { name: "Recoleta" })
    ).toHaveClass("selectable-card-option--selected");
  });

  it("notifica el día correcto al elegir un barrio", () => {
    const onChangeDia = vi.fn();

    render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2),
        ]}
        onChangeDia={onChangeDia}
        errors={{}}
      />
    );

    fireEvent.click(screen.getByRole("tab", { name: /Día 2/ }));
    fireEvent.click(screen.getByRole("radio", { name: "San Telmo" }));

    expect(onChangeDia).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ barrio: "SanTelmo" })
    );
  });

  it("copia el barrio, punto de partida y alojamiento del día 1 con el atajo", () => {
    const onChangeDia = vi.fn();

    render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2),
        ]}
        onChangeDia={onChangeDia}
        errors={{}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Usar el mismo barrio/alojamiento para todos los días",
      })
    );

    expect(onChangeDia).toHaveBeenCalledWith(
      2,
      expect.objectContaining({
        barrio: "Palermo",
        puntoInicio: "NodoUrbano",
        hospedajeLugarGuid: null,
        hospedajeBarrio: null,
      })
    );
  });

  it("copia el hospedaje elegido del día 1 con el atajo", () => {
    const onChangeDia = vi.fn();

    render(
      <LocationStep
        dias={[
          {
            ...dia("2026-11-18", 1, "Palermo"),
            puntoInicio: "HospedajePropio",
            hospedajeLugarGuid: "hotel-1",
            hospedajeBarrio: "Palermo",
          },
          dia("2026-11-19", 2, "Recoleta"),
        ]}
        onChangeDia={onChangeDia}
        errors={{}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Usar el mismo barrio/alojamiento para todos los días",
      })
    );

    expect(onChangeDia).toHaveBeenCalledWith(
      2,
      expect.objectContaining({
        barrio: "Palermo",
        puntoInicio: "HospedajePropio",
        hospedajeLugarGuid: "hotel-1",
        hospedajeBarrio: "Palermo",
      })
    );
  });

  it("confirma el punto central del barrio al elegir Estoy de paso", () => {
    render(
      <LocationStep
        dias={[dia("2026-11-18", 1, "Palermo")]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(
      screen.getByText(
        "Usaremos el punto central de Palermo como inicio del día."
      )
    ).toBeInTheDocument();
  });

  it("no muestra el aviso de punto central sin opción elegida", () => {
    render(
      <LocationStep
        dias={[{ ...dia("2026-11-18", 1, "Palermo"), puntoInicio: null }]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(
      screen.queryByText(
        "Usaremos el punto central de Palermo como inicio del día."
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Usaremos el punto central del barrio que elijas como inicio del día."
      )
    ).not.toBeInTheDocument();
  });

  it("desplaza a los días cuando se completa el día activo y hay más días", () => {
    const original = Element.prototype.scrollIntoView;
    const scrollSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    const { rerender } = render(
      <LocationStep
        dias={[
          { ...dia("2026-11-18", 1, "Palermo"), puntoInicio: null },
          dia("2026-11-19", 2),
        ]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(scrollSpy).not.toHaveBeenCalled();

    rerender(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2),
        ]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(scrollSpy).toHaveBeenCalled();

    Element.prototype.scrollIntoView = original;
  });

  it("no desplaza si el día completado es el último", () => {
    const original = Element.prototype.scrollIntoView;
    const scrollSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    const { rerender } = render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          { ...dia("2026-11-19", 2, "Recoleta"), puntoInicio: null },
        ]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    fireEvent.click(screen.getByRole("tab", { name: /Día 2/ }));

    rerender(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2, "Recoleta"),
        ]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(scrollSpy).not.toHaveBeenCalled();

    Element.prototype.scrollIntoView = original;
  });

  it("muestra los días faltantes informados por validación", () => {
    render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2),
        ]}
        onChangeDia={vi.fn()}
        errors={{ dias: "Faltan completar: Día 2." }}
      />
    );

    expect(
      screen.getByText("Faltan completar: Día 2.")
    ).toBeInTheDocument();
  });

  it("muestra las tres opciones de alojamiento con la etiqueta corregida", () => {
    render(
      <LocationStep
        dias={[dia("2026-11-18", 1, "Palermo")]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(
      screen.getByRole("radio", { name: /Ya tengo lugar/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /Recomiéndame hospedaje/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /Estoy de paso/ })
    ).toBeInTheDocument();
  });

  it("muestra el panel de hospedaje debajo de las opciones cuando corresponde", () => {
    const { rerender } = render(
      <LocationStep
        dias={[
          {
            ...dia("2026-11-18", 1, "Palermo"),
            puntoInicio: "HospedajeSugerido",
          },
        ]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(screen.getByTestId("hospedaje-selector")).toBeInTheDocument();

    rerender(
      <LocationStep
        dias={[
          {
            ...dia("2026-11-18", 1, "Palermo"),
            puntoInicio: "NodoUrbano",
          },
        ]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(screen.queryByTestId("hospedaje-selector")).not.toBeInTheDocument();
  });

  it("marca la opción elegida y limpia el hospedaje al elegir Estoy de paso", () => {
    const onChangeDia = vi.fn();

    render(
      <LocationStep
        dias={[{ ...dia("2026-11-18", 1, "Palermo"), puntoInicio: null }]}
        onChangeDia={onChangeDia}
        errors={{}}
      />
    );

    fireEvent.click(screen.getByRole("radio", { name: /Ya tengo lugar/ }));

    expect(onChangeDia).toHaveBeenCalledWith(1, {
      puntoInicio: "HospedajePropio",
      hospedajeLugarGuid: null,
      hospedajeBarrio: null,
    });

    fireEvent.click(screen.getByRole("radio", { name: /Estoy de paso/ }));

    expect(onChangeDia).toHaveBeenCalledWith(1, {
      puntoInicio: "NodoUrbano",
      hospedajeLugarGuid: null,
      hospedajeBarrio: null,
    });
  });
});
