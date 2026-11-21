import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LugarDetalleDto } from "../../../../../api/types";
import { ApiError } from "../../../../../api/client";
import type {
  AsistenteCapacidadesDto,
  AsistenteResponseDto,
  ItinerarioViewModel,
  RecomendacionLugarDto,
  ViajeDto,
} from "../../../types";
import {
  aplicarAccionAsistente,
  enviarMensajeAsistente,
  getCapacidadesAsistente,
} from "../../../api/asistente";
import ChatTab from "./ChatTab";

vi.mock("../../../api/asistente", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../api/asistente")>();

  return {
    ...actual,
    enviarMensajeAsistente: vi.fn(),
    aplicarAccionAsistente: vi.fn(),
    getCapacidadesAsistente: vi.fn(),
  };
});

const enviarMensajeMock = vi.mocked(enviarMensajeAsistente);
const aplicarAccionMock = vi.mocked(aplicarAccionAsistente);
const capacidadesMock = vi.mocked(getCapacidadesAsistente);

const VIAJE_ID = "11111111-1111-1111-1111-111111111111";
const PARADA_ID = "33333333-3333-3333-3333-333333333333";
const LUGAR_ID = "44444444-4444-4444-4444-444444444444";

const CAPACIDADES_HABILITADAS: AsistenteCapacidadesDto = {
  habilitado: true,
  limites: {
    topK: 12,
    minResultados: 3,
    maxMensajeCaracteres: 1000,
    maxHistorial: 6,
    rateLimitPorUsuario: 20,
    rateLimitPorViaje: 40,
    ventanaRateLimitSegundos: 60,
  },
};

const CAPACIDADES_DESHABILITADAS: AsistenteCapacidadesDto = {
  ...CAPACIDADES_HABILITADAS,
  habilitado: false,
};

function crearViaje(): ViajeDto {
  return {
    id: VIAJE_ID,
    titulo: "Paseo por Palermo",
    tipoViaje: "Pareja",
    estado: "Planificado",
    barrio: "Palermo",
    alcanceTemporal: "DiaCompleto",
    fechaInicio: "2026-03-10",
    fechaFin: "2026-03-10",
    nivelPresupuesto: "Equilibrado",
    ritmoCaminata: "Tranquilo",
    limiteCuadrasEntreParadas: 10,
    tipoPuntoPartida: "PrimeraParada",
    codigoInvitacion: "ABC123",
    creadoPorUsuarioId: "22222222-2222-2222-2222-222222222222",
    fechaCreacion: "2026-03-01T10:00:00Z",
    fechaActualizacion: "2026-03-01T10:00:00Z",
    categoriaCodigos: ["gastronomia_clasica"],
    itinerarios: null,
  };
}

function crearLugar(): LugarDetalleDto {
  return {
    id: "55555555-5555-5555-5555-555555555555",
    nombre: "Museo de prueba",
  } as unknown as LugarDetalleDto;
}

function crearItinerario(conParada = false): ItinerarioViewModel {
  return {
    itinerario: {
      id: "66666666-6666-6666-6666-666666666666",
      viajeId: VIAJE_ID,
      numeroDia: 1,
      fecha: "2026-03-10",
      origenTipo: "PrimeraParada",
      origenDescripcion: null,
      origenLatitud: null,
      origenLongitud: null,
      version: "v1",
      paradas: [],
    },
    paradas: conParada
      ? [
          {
            parada: {
              id: PARADA_ID,
              lugarId: "55555555-5555-5555-5555-555555555555",
              turno: "Manana",
              ordenParada: 1,
              horaInicio: "09:00",
              duracionMinutos: 60,
              origenParada: "Ia",
            },
            lugar: crearLugar(),
          },
        ]
      : [],
  };
}

function crearRecomendacion(): RecomendacionLugarDto {
  return {
    lugarId: LUGAR_ID,
    nombre: "Café recomendado",
    descripcion: "Un café de especialidad",
    direccion: "Thames 1800",
    barrio: "Palermo",
    subzona: "Soho",
    latitud: -34.58,
    longitud: -58.42,
    puntuacion: 4.7,
    cantidadResenas: 120,
    nivelPrecio: 2,
    duracionMinutos: 60,
    esAireLibre: false,
    esBajoTecho: true,
    aptoNinos: true,
    accesible: true,
    fotoPortadaUrl: null,
    categorias: ["cafe_especialidad"],
    opcionesDietarias: [],
    similitud: 0.82,
    motivo: "Coincide con cafe_especialidad.",
  };
}

function crearRespuesta(
  sobrescribir: Partial<AsistenteResponseDto> = {}
): AsistenteResponseDto {
  return {
    mensaje: "Encontré 1 lugar que puede encajar en tu recorrido.",
    puedeAplicar: true,
    recomendaciones: [crearRecomendacion()],
    accion: null,
    aclaracion: null,
    advertencia: null,
    ...sobrescribir,
  };
}

interface RenderOptions {
  itinerarioActual?: ItinerarioViewModel | null;
  onItinerarioActualizado?: () => Promise<void>;
}

function renderChat({
  itinerarioActual = crearItinerario(),
  onItinerarioActualizado = vi.fn().mockResolvedValue(undefined),
}: RenderOptions = {}) {
  render(
    <ChatTab
      viaje={crearViaje()}
      numeroDia={1}
      itinerarioActual={itinerarioActual}
      onItinerarioActualizado={onItinerarioActualizado}
    />
  );

  return { onItinerarioActualizado };
}

async function enviarTexto(texto: string) {
  const input = await screen.findByPlaceholderText(
    "Escribe una consulta a tu asistente de viaje..."
  );

  fireEvent.change(input, { target: { value: texto } });
  fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
}

beforeEach(() => {
  vi.resetAllMocks();
  capacidadesMock.mockResolvedValue(CAPACIDADES_HABILITADAS);
  aplicarAccionMock.mockResolvedValue([]);
});

describe("ChatTab", () => {
  it("envía el mensaje y muestra recomendaciones", async () => {
    enviarMensajeMock.mockResolvedValue(
      crearRespuesta({ advertencia: "Usé el catálogo filtrado." })
    );

    renderChat();
    await enviarTexto("café");

    expect(
      await screen.findByText("Encontré 1 lugar que puede encajar en tu recorrido.")
    ).toBeInTheDocument();
    expect(screen.getByText("Café recomendado")).toBeInTheDocument();
    expect(screen.getByText("Coincide con cafe_especialidad.")).toBeInTheDocument();
    expect(screen.getByText("Usé el catálogo filtrado.")).toBeInTheDocument();
    expect(enviarMensajeMock).toHaveBeenCalledWith(
      VIAJE_ID,
      expect.objectContaining({ mensaje: "café", numeroDia: 1 })
    );
  });

  it("aplica una recomendación agregando la parada y refresca", async () => {
    enviarMensajeMock.mockResolvedValue(crearRespuesta());
    const { onItinerarioActualizado } = renderChat();

    await enviarTexto("café");
    fireEvent.click(
      await screen.findByRole("button", { name: "Agregar al día 1" })
    );

    await waitFor(() => {
      expect(aplicarAccionMock).toHaveBeenCalledWith(VIAJE_ID, {
        tipo: "AgregarParada",
        numeroDia: 1,
        lugarId: LUGAR_ID,
        paradaId: null,
        turno: null,
        version: "v1",
      });
    });

    expect(onItinerarioActualizado).toHaveBeenCalled();
    expect(
      await screen.findByText(/agregué “Café recomendado” al día 1/)
    ).toBeInTheDocument();
  });

  it("reemplaza una parada existente", async () => {
    enviarMensajeMock.mockResolvedValue(crearRespuesta());
    renderChat({ itinerarioActual: crearItinerario(true) });

    await enviarTexto("café");
    const selector = await screen.findByRole("combobox", {
      name: "Reemplazar una parada",
    });

    fireEvent.change(selector, { target: { value: PARADA_ID } });

    await waitFor(() => {
      expect(aplicarAccionMock).toHaveBeenCalledWith(VIAJE_ID, {
        tipo: "ReemplazarParada",
        numeroDia: 1,
        lugarId: LUGAR_ID,
        paradaId: PARADA_ID,
        turno: null,
        version: "v1",
      });
    });
  });

  it("no muestra acciones si puedeAplicar es false", async () => {
    enviarMensajeMock.mockResolvedValue(
      crearRespuesta({ puedeAplicar: false })
    );

    renderChat();
    await enviarTexto("café");
    await screen.findByText("Café recomendado");

    expect(
      screen.queryByRole("button", { name: "Agregar al día 1" })
    ).not.toBeInTheDocument();
  });

  it("bloquea el chat si el asistente está deshabilitado", async () => {
    capacidadesMock.mockResolvedValue(CAPACIDADES_DESHABILITADAS);

    renderChat();

    expect(
      await screen.findByText(
        "El asistente no está habilitado en este entorno."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Asistente no disponible")
    ).toBeDisabled();
  });

  it("muestra una acción para recargar ante un 409", async () => {
    enviarMensajeMock.mockResolvedValue(crearRespuesta());
    aplicarAccionMock.mockRejectedValueOnce(
      new ApiError(409, "El itinerario cambió.")
    );
    const { onItinerarioActualizado } = renderChat();

    await enviarTexto("café");
    fireEvent.click(
      await screen.findByRole("button", { name: "Agregar al día 1" })
    );

    expect(
      await screen.findByText(
        "El itinerario cambió desde que se generó esta recomendación."
      )
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Recargar itinerario" })
    );

    await waitFor(() => {
      expect(onItinerarioActualizado).toHaveBeenCalled();
    });
  });

  it("muestra los segundos de espera ante un 429 y restaura el mensaje", async () => {
    enviarMensajeMock.mockRejectedValueOnce(
      new ApiError(429, "Demasiadas consultas.", 7)
    );

    renderChat();
    await enviarTexto("café");

    expect(
      await screen.findByText("Podés reintentar en 7 segundos.")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Escribe una consulta a tu asistente de viaje..."
      )
    ).toHaveValue("café");
  });
});
