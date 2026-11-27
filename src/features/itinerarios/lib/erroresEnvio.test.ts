import { describe, expect, it } from "vitest";
import { ApiError } from "../../../api/client";
import { crearMensajeErrorEnvio } from "./erroresEnvio";

describe("crearMensajeErrorEnvio", () => {
  it("explica problemas de conexión", () => {
    expect(crearMensajeErrorEnvio(new ApiError(0, ""))).toContain(
      "conectar con el servidor"
    );
  });

  it("explica problemas de permisos", () => {
    expect(crearMensajeErrorEnvio(new ApiError(401, ""))).toContain(
      "permisos"
    );
    expect(crearMensajeErrorEnvio(new ApiError(403, ""))).toContain(
      "permisos"
    );
  });

  it("incluye el tiempo de espera cuando hay rate limit", () => {
    expect(crearMensajeErrorEnvio(new ApiError(429, "", 15))).toContain(
      "15 segundos"
    );
  });

  it("distingue errores del servidor", () => {
    expect(crearMensajeErrorEnvio(new ApiError(503, ""))).toContain(
      "servidor"
    );
  });

  it("usa el mensaje de la API para errores de validación", () => {
    expect(
      crearMensajeErrorEnvio(new ApiError(400, "Rango de fechas inválido."))
    ).toBe("Rango de fechas inválido.");
  });

  it("usa un mensaje genérico para errores desconocidos", () => {
    expect(crearMensajeErrorEnvio(new Error("boom"))).toContain(
      "No se pudo crear el viaje"
    );
  });
});
