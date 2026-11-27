import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CategoriaDto } from "../../../api/types";
import type { DiaPlanificacion } from "../planificacionFormData";
import type { FormErrors } from "../PlanificationForm.validation";
import InteresesYEstiloStep from "./InteresesYEstiloStep";

const CATEGORIAS: CategoriaDto[] = [
  { id: 1, codigo: "cafe_especialidad", nombre: "Café de especialidad" },
  { id: 2, codigo: "museos_galerias", nombre: "Museos y galerías" },
  { id: 3, codigo: "parques_aire_libre", nombre: "Parques y aire libre" },
  { id: 4, codigo: "gastronomia_clasica", nombre: "Gastronomía clásica" },
  { id: 5, codigo: "bares_vermu", nombre: "Bares y vermú" },
];

function dia(
  fecha: string,
  numero: number,
  sobrescribir: Partial<DiaPlanificacion> = {}
): DiaPlanificacion {
  return {
    fecha,
    dia: numero,
    barrio: "Palermo",
    puntoInicio: "NodoUrbano",
    hospedajeLugarGuid: null,
    hospedajeBarrio: null,
    modalidadViaje: null,
    categoriasPrioritarias: [],
    ritmoVisita: null,
    presupuestoNivel: null,
    ...sobrescribir,
  };
}

function renderPaso(
  dias: DiaPlanificacion[],
  onChangeDia = vi.fn(),
  errors: FormErrors = {}
) {
  return render(
    <InteresesYEstiloStep
      dias={dias}
      categorias={CATEGORIAS}
      onChangeDia={onChangeDia}
      errors={errors}
    />
  );
}

describe("InteresesYEstiloStep", () => {
  it("con un solo día no muestra tabs ni atajo", () => {
    renderPaso([
      dia("2026-11-18", 1, { modalidadViaje: "Solo" }),
    ]);

    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Usar las mismas preferencias para todos los días",
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /Solo/ })
    ).toHaveClass("selectable-card-option--selected");
  });

  it("con varios días muestra tabs y permite cambiar de día", () => {
    renderPaso([
      dia("2026-11-18", 1, {
        modalidadViaje: "Solo",
        categoriasPrioritarias: CATEGORIAS.slice(0, 2),
      }),
      dia("2026-11-19", 2, {
        modalidadViaje: "Familia",
        categoriasPrioritarias: CATEGORIAS.slice(2, 4),
      }),
    ]);

    const tabDia1 = screen.getByRole("tab", { name: /Día 1/ });
    const tabDia2 = screen.getByRole("tab", { name: /Día 2/ });

    expect(tabDia1).toHaveAttribute("aria-selected", "true");
    expect(tabDia2).toHaveAttribute("aria-selected", "false");

    fireEvent.click(tabDia2);

    expect(tabDia2).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("radio", { name: /Con familia/ })
    ).toHaveClass("selectable-card-option--selected");
  });

  it("guarda el ritmo y presupuesto de cada día por separado", () => {
    renderPaso([
      dia("2026-11-18", 1, {
        ritmoVisita: "Tranquilo",
        presupuestoNivel: "Economico",
      }),
      dia("2026-11-19", 2),
    ]);

    expect(
      screen.getByRole("radio", { name: /Relajado/ })
    ).toHaveClass("selectable-card-option--selected");
    expect(
      screen.getByRole("radio", { name: /Económico/ })
    ).toHaveClass("selectable-card-option--selected");

    fireEvent.click(screen.getByRole("tab", { name: /Día 2/ }));

    expect(
      screen.getByRole("radio", { name: /Relajado/ })
    ).not.toHaveClass("selectable-card-option--selected");
    expect(
      screen.getByRole("radio", { name: /Económico/ })
    ).not.toHaveClass("selectable-card-option--selected");
  });

  it("notifica cambios de modalidad y estilo en el día activo", () => {
    const onChangeDia = vi.fn();

    renderPaso(
      [
        dia("2026-11-18", 1, { modalidadViaje: "Solo" }),
        dia("2026-11-19", 2, { modalidadViaje: "Familia" }),
      ],
      onChangeDia
    );

    fireEvent.click(screen.getByRole("tab", { name: /Día 2/ }));
    fireEvent.click(screen.getByRole("radio", { name: /Con Grupo/ }));

    expect(onChangeDia).toHaveBeenCalledWith(2, {
      modalidadViaje: "Amigos",
    });

    fireEvent.click(screen.getByRole("radio", { name: /Activo/ }));
    fireEvent.click(screen.getByRole("radio", { name: /Flexible/ }));

    expect(onChangeDia).toHaveBeenCalledWith(2, { ritmoVisita: "Activo" });
    expect(onChangeDia).toHaveBeenCalledWith(2, {
      presupuestoNivel: "SinRestricciones",
    });
  });

  it("copia las preferencias del día 1 al resto con el atajo", () => {
    const onChangeDia = vi.fn();

    renderPaso(
      [
        dia("2026-11-18", 1, {
          modalidadViaje: "Solo",
          categoriasPrioritarias: CATEGORIAS.slice(0, 2),
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
        }),
        dia("2026-11-19", 2),
      ],
      onChangeDia
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Usar las mismas preferencias para todos los días",
      })
    );

    expect(onChangeDia).toHaveBeenCalledWith(2, {
      modalidadViaje: "Solo",
      categoriasPrioritarias: CATEGORIAS.slice(0, 2),
      ritmoVisita: "Activo",
      presupuestoNivel: "Equilibrado",
    });
  });

  it("marca un tab como completo solo con las 4 secciones resueltas", () => {
    renderPaso([
      dia("2026-11-18", 1, {
        modalidadViaje: "Solo",
        categoriasPrioritarias: CATEGORIAS.slice(0, 2),
      }),
      dia("2026-11-19", 2, {
        modalidadViaje: "Familia",
        categoriasPrioritarias: CATEGORIAS.slice(2, 4),
        ritmoVisita: "Activo",
        presupuestoNivel: "Economico",
      }),
    ]);

    expect(screen.getByRole("tab", { name: /Día 1/ }).textContent).toContain(
      "Falta completar"
    );
    expect(screen.getByRole("tab", { name: /Día 2/ }).textContent).toContain(
      "Completo"
    );
  });

  it("no permite seleccionar más de 4 categorías", () => {
    const onChangeDia = vi.fn();

    renderPaso(
      [
        dia("2026-11-18", 1, {
          modalidadViaje: "Solo",
          categoriasPrioritarias: CATEGORIAS.slice(0, 4),
        }),
      ],
      onChangeDia
    );

    const quinta = screen.getByRole("checkbox", { name: "Bares y vermú" });

    expect(quinta).toBeDisabled();
    expect(screen.getByText("Límite alcanzado")).toBeInTheDocument();

    fireEvent.click(quinta);

    expect(onChangeDia).not.toHaveBeenCalled();
  });

  it("muestra el contador y el medidor de categorías", () => {
    const { container } = renderPaso([
      dia("2026-11-18", 1, {
        modalidadViaje: "Solo",
        categoriasPrioritarias: CATEGORIAS.slice(0, 2),
      }),
    ]);

    expect(screen.getByText("2 de 4 seleccionadas")).toBeInTheDocument();
    expect(
      container.querySelectorAll(".categories-meter__segment--on")
    ).toHaveLength(2);
  });

  it("indica que faltan categorías para el mínimo", () => {
    renderPaso([dia("2026-11-18", 1, { modalidadViaje: "Solo" })]);

    expect(screen.getByText("0 de 4 seleccionadas")).toBeInTheDocument();
    expect(screen.getByText("Elegí al menos 2")).toBeInTheDocument();
  });

  it("muestra los días faltantes informados por validación", () => {
    renderPaso(
      [dia("2026-11-18", 1), dia("2026-11-19", 2)],
      vi.fn(),
      { dias: "Faltan completar: Día 1, Día 2." }
    );

    expect(
      screen.getByText("Faltan completar: Día 1, Día 2.")
    ).toBeInTheDocument();
  });
});
