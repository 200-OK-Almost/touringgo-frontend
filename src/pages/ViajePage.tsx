import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar"
import ViajeView from "../features/viaje/components/ViajeView";
import { useState, useEffect } from "react";
import type { ViajeDto } from "../features/viaje/types";
import { getViaje } from "../features/viaje/api/viajes";


function ViajePage() {
    const { id } = useParams<{ id: string }>();

    const [viaje, setViaje] = useState<ViajeDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchViaje = async () => {
            try {
                const data = await getViaje(id)
                setViaje(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchViaje();
    }, [id]);

    if (loading) return <p>Cargando viaje...</p>;
    if (!viaje) return <p>No se encontró el viaje.</p>;

  return (
    <>
    <Navbar />
    <ViajeView
      viaje={viaje}
    />
    </>
  )
}
export default ViajePage