import { Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import type { LatLngExpression } from "leaflet";
import "./CustomMarker.css";

interface CustomMarkerProps {
  position: LatLngExpression;
  number?: number;
  variant?: "numbered" | "origin";
  selected?: boolean;
  onSelect?: () => void;
}

const ORIGIN_HTML = `
  <div class="marker-content marker-content--origin">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 21V4" />
      <path d="M5 4h13l-2.5 4L18 12H5" />
    </svg>
  </div>
`;

const CustomMarker = ({
  position,
  number,
  variant = "numbered",
  selected = false,
  onSelect,
}: CustomMarkerProps) => {
  const html =
    variant === "origin"
      ? ORIGIN_HTML
      : `
        <div class="marker-content${selected ? " marker-content--selected" : ""}">
            <span>${number ?? ""}</span>
        </div>
    `;

  const icon = divIcon({
    className: `custom-marker${selected ? " custom-marker--selected" : ""}`,
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

  return (
    <Marker
      position={position}
      icon={icon}
      zIndexOffset={selected ? 1000 : 0}
      eventHandlers={onSelect ? { click: onSelect } : undefined}
    />
  );
};

export default CustomMarker;
