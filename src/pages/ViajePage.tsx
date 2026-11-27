import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar"
import ViajeView from "../features/viaje/components/ViajeView";
import { useState, useEffect, useMemo } from "react";
import type { ItinerarioDto, ItinerarioViewModel, MiembroViajeDto, ParadaItinerarioDto, ParadaViewModel, ViajeDto } from "../features/viaje/types";
import { generateViaje, getMiembrosViaje, getViaje } from "../features/viaje/api/viajes";
import type { LugarDetalleDto } from "../api/types";
import { getLugar, getLugaresDetalle } from "../api/lugares";
import { ViajeViewSkeleton } from "../features/viaje/components/ViajeViewSkeleton";
import { GeneracionItinerarioOverlay } from "../features/viaje/components/GeneracionItinerarioOverlay";


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

function estaGenerando(
  viaje: ViajeDto | null
): viaje is ViajeDto & { estado: "Borrador" | "EnPlanificacion" } {
  return viaje?.estado === "Borrador" || viaje?.estado === "EnPlanificacion";
}

function ViajePage() {
    const { id } = useParams<{ id: string }>();

    const [lugares, setLugares] = useState<LugarDetalleDto[]>([]);
    const [viaje, setViaje] = useState<ViajeDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lugarPartida, setLugarPartida] = useState<LugarDetalleDto | null>(null)
    const [miembros, setMiembros] = useState<MiembroViajeDto[]>([])

    const miembrosPorId = useMemo(
      () => new Map(
        miembros.map(m => [m.usuarioId, m])
      ),
      [miembros]
    );

    useEffect(() => {
      const controller = new AbortController();
      let pollTimeout: NodeJS.Timeout;

      // Función helper para procesar las paradas y cargar detalles de lugares
      async function procesarItinerariosYParadas(itinerarios: ItinerarioDto[] | null | undefined) {
        if (!itinerarios || itinerarios.length === 0) return;

        const lugarIds = [
          ...new Set(
            itinerarios.flatMap((itinerario) =>
              itinerario.paradas.map((parada) => parada.lugarId)
            )
          ),
        ];

        if (lugarIds.length > 0) {
          const lugaresData = await getLugaresDetalle(lugarIds);
          if (!controller.signal.aborted) {
            setLugares(lugaresData);
          }
        }
      }

    async function cargarViaje() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        // 1. Consultar estado actual del viaje
        const viajeData = await getViaje(id);

        // obtener lugar de partida
        if (viajeData.lugarPartidaId != null) {
          const lugarPartidaData = await getLugar(viajeData.lugarPartidaId)
          setLugarPartida(lugarPartidaData)
        }

        // Obtener miembros
        // El usuario creador se agrega como administrador al momento de crear el viaje
        const miembrosData = await getMiembrosViaje(viajeData.id)
        setMiembros(miembrosData)

        if (controller.signal.aborted) return;
        setViaje(viajeData);

        // CASO 1: Ya está listo (Planificado o Finalizado)
        if (viajeData.estado === "Finalizado" || viajeData.estado === "Planificado") {
          await procesarItinerariosYParadas(viajeData.itinerarios);
          if (!controller.signal.aborted) setLoading(false);
        } 
        
        // CASO 2: Está en Borrador -> Iniciamos la generación
        else if (viajeData.estado === "Borrador") {
          // generateViaje (POST /api/viajes/{id}/itinerario) devuelve los itinerarios generados
          const nuevosItinerarios = await generateViaje(id);
          if (controller.signal.aborted) return;
        // Actualizamos el estado del viaje a Planificado y le asociamos los itinerarios
        setViaje((prev) =>
          prev
            ? {
                ...prev,
                estado: "Planificado",
                itinerarios: nuevosItinerarios,
              }
            : prev
        );

          await procesarItinerariosYParadas(nuevosItinerarios);
          if (!controller.signal.aborted) setLoading(false);
        } 
        
        // CASO 3: Ya se está generando (EnPlanificacion) -> Polling hasta terminar
        else if (viajeData.estado === "EnPlanificacion") {
          // Mantenemos loading en true y reintentamos en 2 segundos
          pollTimeout = setTimeout(() => {
            if (!controller.signal.aborted) {
              cargarViaje();
            }
          }, 2000);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setError("No se pudo cargar o generar el viaje.");
        setLoading(false);
      }
    }

    cargarViaje();
    // Limpieza al desmontar el componente o cambiar de viaje

    return () => {
      controller.abort();
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [id]);

  const recargarViaje = async () => {
    if (!id) return;

    const viajeData = await getViaje(id);
    setViaje(viajeData);

    if (viajeData.lugarPartidaId != null) {
      const lugarPartidaData = await getLugar(viajeData.lugarPartidaId);
      setLugarPartida(lugarPartidaData);
    }

    const itinerarios = viajeData.itinerarios ?? [];
    const lugarIds = [
      ...new Set(
        itinerarios.flatMap((itinerario) =>
          itinerario.paradas.map((parada) => parada.lugarId)
        )
      ),
    ];

    if (lugarIds.length > 0) {
      const lugaresData = await getLugaresDetalle(lugarIds);
      setLugares(lugaresData);
    } else {
      setLugares([]);
    }
  };

  if (loading) {
    const generando = estaGenerando(viaje);

    if (generando && viaje) {
      return (
        <>
          <Navbar />
          <GeneracionItinerarioOverlay estado={viaje.estado} />
        </>
      );
    }

    return (
      <>
        <Navbar />
        <ViajeViewSkeleton />
      </>
    );
  }
  if (error || !viaje) {
  return (
    <>
      <Navbar />
      <div className="page-error">
        <h2>{error ?? "Viaje no encontrado."}</h2>
        <div className="page-error-btns">
          <Link className="page-error-home-btn"
            to="/"
          >
            Volver al inicio
          </Link>
          <button className="page-error-reload-btn"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    </>
    );
  }

  // Si hay itinerarios (viaje generado), armar ItinerarioViewModel, si no, marcar null
  const itinerariosViewModel: ItinerarioViewModel[] | null = 
    viaje.itinerarios ?
      viaje.itinerarios.map(itinerario => ({
        itinerario,
        paradas: construirParadasViewModel(itinerario.paradas, lugares)
      }))
      : null

  const itinerarioGenerado = (viaje.itinerarios?.length ?? 0) > 0;

  return (
    <>
    <Navbar showNuevoViaje={itinerarioGenerado} />
    <ViajeView
      viaje={viaje}
      itinerariosViewModel={itinerariosViewModel}
      lugarPartida={lugarPartida}
      miembros={miembros}
      miembrosPorId={miembrosPorId}
      onItinerarioActualizado={recargarViaje}
    />
    </>
  )
}
export default ViajePage