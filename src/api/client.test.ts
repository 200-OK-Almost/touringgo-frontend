import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, http } from "./client";

function respuestaError(status: number, body: unknown): Response {
  return {
    ok: false,
    status,
    json: async () => body,
    headers: new Headers(),
  } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("http", () => {
  it("usa detail de ProblemDetails como mensaje de ApiError", async () => {
    const detalle =
      "Disculpa pero no puedo agregar una parada más al itinerario, ya está completo.";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        respuestaError(400, {
          status: 400,
          title: "Business rule violation",
          detail: detalle,
        })
      )
    );

    const error = await http.post("/viajes").catch((err: unknown) => err);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      message: detalle,
    });
  });
});
