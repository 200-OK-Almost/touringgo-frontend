import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar"
import ViajeView from "../features/viaje/components/ViajeView";
import { useState, useEffect } from "react";
import type { ItinerarioViewModel, ParadaItinerarioDto, ParadaViewModel, ViajeDto } from "../features/viaje/types";
import { getViaje } from "../features/viaje/api/viajes";
import type { LugarDetalleDto } from "../api/types";
import { getLugaresDetalle } from "../api/lugares";


function construirParadasViewModel(
    paradas: ParadaItinerarioDto[],
    lugares: LugarDetalleDto[]
): ParadaViewModel[] {
    const lugaresPorId = new Map(
        lugares.map(lugar => [lugar.id, lugar])
    );

    return paradas.flatMap(parada => {
        const lugar = lugaresPorId.get(parada.lugarId);

        return lugar ? [{ parada, lugar }] : [];
    });
}

function ViajePage() {
    const { id } = useParams<{ id: string }>();

    const [lugares, setLugares] = useState<LugarDetalleDto[]>([]);
    const [viaje, setViaje] = useState<ViajeDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      
      const controller = new AbortController();
      
      async function cargarViaje() {
        if (!id) return;
          try {
              setLoading(true);
              setError(null);

              const viajeData = await getViaje(id);
              setViaje(viajeData);

              // Obtener IDs únicos de todas las paradas
              const lugarIds = [
                  ...new Set(
                      viajeData.itinerarios.flatMap(itinerario =>
                          itinerario.paradas.map(parada => parada.lugarId)
                      )
                  )
              ];

              const lugaresData = await getLugaresDetalle(lugarIds);

              setLugares(lugaresData);

          } catch (err) {
              if (controller.signal.aborted) return;

              console.error(err);
              setError("No se pudo cargar el viaje.");
          } finally {
              if (!controller.signal.aborted) {
                  setLoading(false);
              }
          }
      }

      cargarViaje();

      return () => controller.abort();
    }, [id]);

  if (loading) return <p>Cargando viaje...</p>;
  if (error || !viaje) return <p>{error ?? "Viaje no encontrado."}</p>;

  const itinerariosViewModel: ItinerarioViewModel[] = viaje.itinerarios.map(itinerario => ({
      itinerario,
      paradas: construirParadasViewModel(itinerario.paradas, lugares)
  }));
  console.log(itinerariosViewModel)

  return (
    <>
    <Navbar />
    <ViajeView
      viaje={viaje}
      itinerariosViewModel={itinerariosViewModel}
    />
    </>
  )
}
export default ViajePage