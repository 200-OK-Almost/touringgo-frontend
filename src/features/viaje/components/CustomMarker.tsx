import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import type { LatLngExpression } from "leaflet";
import "./CustomMarker.css"
interface CustomMarkerProps {
  position: LatLngExpression;
  number: number;
  children?: React.ReactNode;

}

const CustomMarker = ({ position, number, children }: CustomMarkerProps) => {
  const icon = divIcon({
    className: "custom-marker",
    html: `
        <div class="marker-content">
            <span>${number ?? ""}</span>
        </div>
    `,
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