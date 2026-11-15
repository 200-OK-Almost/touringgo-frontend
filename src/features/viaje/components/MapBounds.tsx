import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";

interface MapBoundsProps {
    positions: LatLngExpression[];
}

function MapBounds({ positions }: MapBoundsProps) {
    const map = useMap();

    useEffect(() => {
        if (positions.length === 0) return;

        const bounds = L.latLngBounds(positions);

        map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 16
        });
    }, [map, positions]);
    
    return null;
}
export default MapBounds