import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LatLngExpression } from "leaflet";
import MapBounds from "./MapBounds";

const { fitBounds, latLngBounds, mapMock } = vi.hoisted(() => {
  const fitBounds = vi.fn();

  return {
    fitBounds,
    latLngBounds: vi.fn((positions: LatLngExpression[]) => ({ positions })),
    mapMock: {
      fitBounds,
      getSize: () => ({ x: 800, y: 600 }),
    },
  };
});

vi.mock("react-leaflet", () => ({
  useMap: () => mapMock,
}));

vi.mock("leaflet", () => ({
  default: { latLngBounds },
}));

const POSITIONS: LatLngExpression[] = [
  [-34.6037, -58.3816],
  [-34.61, -58.39],
];

describe("MapBounds", () => {
  beforeEach(() => {
    fitBounds.mockClear();
    latLngBounds.mockClear();
  });

  it("reencuadra al montar con paradas", () => {
    render(<MapBounds positions={POSITIONS} panelWidth={480} />);

    expect(fitBounds).toHaveBeenCalledTimes(1);
  });

  it("no reencuadra al cambiar el ancho del panel", () => {
    const { rerender } = render(
      <MapBounds positions={POSITIONS} panelWidth={480} />
    );

    rerender(<MapBounds positions={POSITIONS} panelWidth={54} />);

    expect(fitBounds).toHaveBeenCalledTimes(1);
  });

  it("no reencuadra al expandir el panel mobile", () => {
    const { rerender } = render(
      <MapBounds
        positions={POSITIONS}
        panelWidth={0}
        isMobile
        isMobilePanelExpanded={false}
      />
    );

    rerender(
      <MapBounds
        positions={POSITIONS}
        panelWidth={0}
        isMobile
        isMobilePanelExpanded
      />
    );

    expect(fitBounds).toHaveBeenCalledTimes(1);
  });

  it("aplica padding inferior mobile cuando el sheet está expandido", () => {
    render(
      <MapBounds
        positions={POSITIONS}
        panelWidth={0}
        isMobile
        isMobilePanelExpanded
      />
    );

    expect(fitBounds).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        paddingBottomRight: [24, 414],
      })
    );
  });

  it("reencuadra cuando cambian las paradas", () => {
    const { rerender } = render(
      <MapBounds positions={POSITIONS} panelWidth={480} />
    );

    rerender(
      <MapBounds
        positions={[...POSITIONS, [-34.62, -58.4]]}
        panelWidth={480}
      />
    );

    expect(fitBounds).toHaveBeenCalledTimes(2);
  });
});
