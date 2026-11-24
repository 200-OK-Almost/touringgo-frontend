import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

interface MapFocusProps {
  posicionSeleccionada: LatLngExpression | null;
}

function MapFocus({ posicionSeleccionada }: MapFocusProps) {
  const map = useMap();

  useEffect(() => {
    if (!posicionSeleccionada) return;

    map.flyTo(posicionSeleccionada, map.getZoom(), {
      animate: true,
      duration: 0.75,
    });
  }, [map, posicionSeleccionada]);

  return null;
}

export default MapFocus;
