import { IoWalkOutline } from "react-icons/io5";
import { formatearTramo, type TramoRecorridoDatos } from "../lib/recorrido";
import "./TramoRecorrido.css";

export function TramoRecorrido({
  distanciaMetros,
  cuadras,
  minutosAPie,
}: TramoRecorridoDatos) {
  const texto = formatearTramo({ distanciaMetros, cuadras, minutosAPie });

  if (!texto) {
    return null;
  }

  return (
    <p className="tramo-recorrido">
      <IoWalkOutline className="tramo-recorrido__icon" aria-hidden="true" />
      <span>{texto}</span>
    </p>
  );
}

export default TramoRecorrido;
