import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import type { LatLngExpression } from "leaflet";
import "./CustomMarker.css";

interface CustomMarkerProps {
  position: LatLngExpression;
  number?: number;
  variant?: "numbered" | "origin";
  children?: React.ReactNode;
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
  children,
}: CustomMarkerProps) => {
  const html =
    variant === "origin"
      ? ORIGIN_HTML
      : `
        <div class="marker-content">
            <span>${number ?? ""}</span>
        </div>
    `;

  const icon = divIcon({
    className: "custom-marker",
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

  return (
    <Marker
      position={position}
      icon={icon}
    >
      <Popup offset={[0, -24]}>
        {children}
      </Popup>
    </Marker>
  );
};

export default CustomMarker;
