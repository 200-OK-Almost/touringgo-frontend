import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import type { LatLngExpression } from "leaflet";

const MAP_PADDING = 24;
const MOBILE_PANEL_HEIGHT_RATIO = 0.65;

interface MapBoundsProps {
  positions: LatLngExpression[];
  panelWidth: number;
  isMobile?: boolean;
  isMobilePanelExpanded?: boolean;
}

function MapBounds({
  positions,
  panelWidth,
  isMobile = false,
  isMobilePanelExpanded = false,
}: MapBoundsProps) {
  const map = useMap();
  const lastPositionsRef = useRef<LatLngExpression[] | null>(null);
  const lastIsMobileRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (positions.length === 0) {
      lastPositionsRef.current = positions;
      lastIsMobileRef.current = isMobile;
      return;
    }

    const positionsChanged = lastPositionsRef.current !== positions;
    const layoutChanged = lastIsMobileRef.current !== isMobile;

    if (!positionsChanged && !layoutChanged) return;

    lastPositionsRef.current = positions;
    lastIsMobileRef.current = isMobile;

    const bounds = L.latLngBounds(positions);
    const mobileBottomPadding =
      isMobile && isMobilePanelExpanded
        ? Math.round(map.getSize().y * MOBILE_PANEL_HEIGHT_RATIO)
        : 0;

    map.fitBounds(bounds, {
      paddingTopLeft: [panelWidth + MAP_PADDING, MAP_PADDING],
      paddingBottomRight: [MAP_PADDING, MAP_PADDING + mobileBottomPadding],
      maxZoom: 16,
    });
  }, [map, positions, panelWidth, isMobile, isMobilePanelExpanded]);

  return null;
}

export default MapBounds;
