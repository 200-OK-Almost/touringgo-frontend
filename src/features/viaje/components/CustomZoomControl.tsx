import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { IoAdd, IoRemove } from 'react-icons/io5';
import { useState, type MouseEvent } from 'react';

export type CustomZoomControlPosition = 
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"

interface CustomZoomControlProps {
  position: CustomZoomControlPosition
}

export function CustomZoomControl({ position = 'topRight' } : CustomZoomControlProps) {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(() => map.getZoom());

  // Listen for zoom changes (from buttons, scroll wheel, pinch, etc.)
  useMapEvents({
    zoomend: () => {
      setZoomLevel(map.getZoom());
    },
  });

  const minZoom = map.getMinZoom() ?? 0;
  const maxZoom = map.getMaxZoom() === Infinity ? 18 : map.getMaxZoom();
  
  const percentage = Math.round(
    ((zoomLevel - minZoom) / (maxZoom - minZoom)) * 100
  );

  // Map friendly position names to Leaflet's built-in CSS classes
  const positionClasses: Record<CustomZoomControlPosition, string>  = {
    topLeft: 'leaflet-top leaflet-left',
    topRight: 'leaflet-top leaflet-right',
    bottomLeft: 'leaflet-bottom leaflet-left',
    bottomRight: 'leaflet-bottom leaflet-right',
  };

  // Prevent map clicks/double-clicks from firing when clicking the buttons
  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    L.DomEvent.stopPropagation(e.nativeEvent);
  };

  return (
    <div className={positionClasses[position]}>
      <div 
        className="leaflet-control leaflet-bar map-zoom-btn-container" 
        onClick={stopPropagation}
        onDoubleClick={stopPropagation}
      >
        <button
          type="button"
          title="Alejar mapa"
          aria-label="Alejar mapa"
          onClick={() => map.zoomOut()}
          className='map-zoom-btn'
        >
          <IoRemove />
        </button>

        <div title="Nivel de zoom actual" className='map-zoom-value'>
          <p>{percentage}%</p>
        </div>

        <button
          type="button"
          title="Acercar mapa"
          aria-label="Acercar mapa"
          onClick={() => map.zoomIn()}
          className='map-zoom-btn'
        >
          <IoAdd />
        </button>        
      </div>
    </div>
  );
}