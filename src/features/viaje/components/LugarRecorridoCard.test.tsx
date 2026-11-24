import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LugarDetalleDto } from "../../../api/types";
import type { ParadaViewModel } from "../types";
import LugarRecorridoCard from "./LugarRecorridoCard";

function crearLugar(): LugarDetalleDto {
  return {
    id: "lugar-1",
    nombre: "Museo de prueba",
    direccion: "Av. Siempre Viva 123",
    puntuacion: 4.5,
    cantidadResenas: 10,
    categorias: [{ id: 1, codigo: "museos_galerias", nombre: "Museos" }],
    fotos: [],
  } as unknown as LugarDetalleDto;
}

function crearParada(): ParadaViewModel {
  return {
    parada: {
      id: "parada-1",
      lugarId: "lugar-1",
      turno: "Tarde",
      ordenParada: 1,
      horaInicio: "16:00",
      duracionMinutos: 60,
      origenParada: "Manual",
    },
    lugar: crearLugar(),
  };
}

describe("LugarRecorridoCard", () => {
  it("muestra el numero de parada", () => {
    render(
      <LugarRecorridoCard
        paradaViewModel={crearParada()}
        numero={2}
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("muestra el badge de punto de partida", () => {
    render(
      <LugarRecorridoCard
        lugarPartida={crearLugar()}
      />
    );

    expect(screen.getByText("Salida")).toBeInTheDocument();
    expect(screen.getByText("Museo de prueba")).toBeInTheDocument();
  });

  it("permite seleccionar la tarjeta", () => {
    const onSeleccionar = vi.fn();

    render(
      <LugarRecorridoCard
        paradaViewModel={crearParada()}
        selected
        onSeleccionar={onSeleccionar}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Ver Museo de prueba en el mapa" })
    );
    expect(onSeleccionar).toHaveBeenCalledTimes(1);
  });

  it("no selecciona al abrir el modal de eliminación", () => {
    const onSeleccionar = vi.fn();

    render(
      <LugarRecorridoCard
        paradaViewModel={crearParada()}
        selected={false}
        onSeleccionar={onSeleccionar}
        puedeEditar
        onEliminar={vi.fn().mockResolvedValue(undefined)}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Quitar Museo de prueba" }));
    expect(onSeleccionar).not.toHaveBeenCalled();
  });

  it("no muestra Quitar si el usuario no puede editar", () => {
    render(
      <LugarRecorridoCard
        paradaViewModel={crearParada()}
        puedeEditar={false}
        onEliminar={vi.fn()}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Quitar Museo de prueba" })
    ).not.toBeInTheDocument();
  });

  it("no muestra Quitar en el punto de partida", () => {
    render(
      <LugarRecorridoCard
        lugarPartida={crearLugar()}
        puedeEditar
        onEliminar={vi.fn()}
      />
    );

    expect(screen.queryByRole("button", { name: /Quitar/ })).not.toBeInTheDocument();
  });

  it("abre el modal, permite cancelar y no elimina", () => {
    const onEliminar = vi.fn().mockResolvedValue(undefined);

    render(
      <LugarRecorridoCard
        paradaViewModel={crearParada()}
        puedeEditar
        onEliminar={onEliminar}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Quitar Museo de prueba" })
    );

    const modal = screen.getByRole("dialog", { name: "Quitar parada" });
    expect(within(modal).getByText("Museo de prueba")).toBeInTheDocument();

    fireEvent.click(within(modal).getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onEliminar).not.toHaveBeenCalled();
  });

  it("confirma la eliminación y cierra el modal", async () => {
    const parada = crearParada();
    const onEliminar = vi.fn().mockResolvedValue(undefined);

    render(
      <LugarRecorridoCard
        paradaViewModel={parada}
        puedeEditar
        onEliminar={onEliminar}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Quitar Museo de prueba" })
    );

    const modal = screen.getByRole("dialog", { name: "Quitar parada" });
    fireEvent.click(within(modal).getByRole("button", { name: "Quitar" }));

    await waitFor(() => {
      expect(onEliminar).toHaveBeenCalledWith(parada);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("muestra el error y mantiene el modal si falla la eliminación", async () => {
    const onEliminar = vi.fn().mockRejectedValue(
      new Error("El itinerario cambió desde que se cargó.")
    );

    render(
      <LugarRecorridoCard
        paradaViewModel={crearParada()}
        puedeEditar
        onEliminar={onEliminar}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Quitar Museo de prueba" })
    );

    const modal = screen.getByRole("dialog", { name: "Quitar parada" });
    fireEvent.click(within(modal).getByRole("button", { name: "Quitar" }));

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("El itinerario cambió desde que se cargó.");
    expect(screen.getByRole("dialog", { name: "Quitar parada" })).toBeInTheDocument();
  });
});
