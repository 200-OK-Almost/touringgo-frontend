import { useEffect, useRef, useState } from "react"
import { PinIcon } from "../../../components/SelectablePlaceCard"
import SmartImage from "../../../components/SmartImage"
import type { ParadaViewModel } from "../types";
import "./LugarRecorridoCard.css"
import {
  IoCalendarOutline,
  IoEllipsisVertical,
  IoStar,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import type { LugarDetalleDto } from "../../../api/types";
import { formatearPuntuacion } from "../../../lib/format";
import ConfirmarEliminarParadaModal from "./ConfirmarEliminarParadaModal";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../../../components/Dropdown";

export interface LugarRecorridoCardProps {
  paradaViewModel?: ParadaViewModel;
  lugarPartida?: LugarDetalleDto | null;
  numero?: number;
  selected?: boolean;
  onSeleccionar?: () => void;
  puedeEditar?: boolean;
  onEliminar?: (parada: ParadaViewModel) => Promise<void>;
}

function formatearHora(hora: string | null): string {
  if (!hora) return "—";

  const [horas, minutos] = hora.split(":");

  if (!horas || !minutos) return "—";

  return `${horas.padStart(2, "0")}:${minutos}`;
}

function formatearDuracion(duracion: number | null): string {
  return duracion == null ? "—" : `${duracion}m`;
}

function LugarRecorridoCard({
  paradaViewModel,
  lugarPartida = null,
  numero,
  selected = false,
  onSeleccionar,
  puedeEditar = false,
  onEliminar,
} : LugarRecorridoCardProps) {
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);
  const tarjetaRef = useRef<HTMLDivElement>(null);
  const esPartida = Boolean(lugarPartida);
  const esSeleccionable = Boolean(onSeleccionar);

  useEffect(() => {
    if (!selected) return;
    tarjetaRef.current?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selected]);

  const lugar = lugarPartida ? lugarPartida : paradaViewModel?.lugar
  const puntuacion = formatearPuntuacion(lugar?.puntuacion ?? null);
  const categoria = lugar?.categorias?.[0]?.nombre;
  const puedeQuitar = Boolean(paradaViewModel && puedeEditar && onEliminar);

  const abrirConfirmacion = () => {
    setErrorEliminar(null);
    setConfirmando(true);
  };

  const cerrarConfirmacion = () => {
    if (!eliminando) {
      setConfirmando(false);
      setErrorEliminar(null);
    }
  };

  const confirmarEliminacion = async () => {
    if (!paradaViewModel || !onEliminar) return;

    setEliminando(true);
    setErrorEliminar(null);

    try {
      await onEliminar(paradaViewModel);
      setConfirmando(false);
    } catch (error) {
      setErrorEliminar(
        error instanceof Error
          ? error.message
          : "No se pudo quitar la parada."
      );
    } finally {
      setEliminando(false);
    }
  };

  const manejarSeleccion = () => {
    onSeleccionar?.();
  };

  const manejarTeclaSeleccion = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      manejarSeleccion();
    }
  };

  return (
    <>
    <div
      ref={tarjetaRef}
      className={`lugar-recorrido-card ${
        selected ? "lugar-recorrido-card--selected" : ""
      } ${esSeleccionable ? "lugar-recorrido-card--seleccionable" : ""} ${
        puedeQuitar ? "lugar-recorrido-card--con-acciones" : ""
      }`}
    >
      <div
        className="lugar-recorrido-card__seleccion"
        role={esSeleccionable ? "button" : undefined}
        tabIndex={esSeleccionable ? 0 : undefined}
        aria-pressed={esSeleccionable ? selected : undefined}
        aria-label={esSeleccionable ? `Ver ${lugar?.nombre ?? "parada"} en el mapa` : undefined}
        onClick={esSeleccionable ? manejarSeleccion : undefined}
        onKeyDown={esSeleccionable ? manejarTeclaSeleccion : undefined}
      >
        <div className="lugar-recorrido-card__body">
          <div className="lugar-recorrido-card__thumb">
            {typeof numero === "number" && (
              <span className="lugar-recorrido-card__numero">
                {numero}
              </span>
            )}
            <SmartImage
              src={lugar?.fotos?.[0]?.url}
              alt={lugar?.nombre ?? ""}
            />
          </div>

          <div className="lugar-recorrido-card__info">
            {esPartida && (
              <span className="lugar-recorrido-card__badge">
                Salida
              </span>
            )}
            <h4 className="lugar-recorrido-card__nombre">
              {lugar?.nombre}
            </h4>
            {(puntuacion || categoria) && (
              <div className="lugar-recorrido-card__meta">
                {puntuacion && (
                  <span className="lugar-recorrido-card__rating">
                    <IoStar className="lugar-recorrido-card__rating-icon" />
                    {puntuacion}
                    {lugar?.cantidadResenas ? (
                      <span className="lugar-recorrido-card__resenas">
                        ({lugar.cantidadResenas})
                      </span>
                    ) : null}
                  </span>
                )}
                {categoria && (
                  <span className="lugar-recorrido-card__categoria">
                    {categoria}
                  </span>
                )}
              </div>
            )}
            <p className="lugar-recorrido-card__direccion">
              <PinIcon />
              <span>{lugar?.direccion}</span>
            </p>
            {paradaViewModel && (
              <p className="lugar-recorrido-card__tiempo">
                <IoCalendarOutline className="lugar-recorrido-card__icon"/>
                {formatearHora(paradaViewModel.parada.horaInicio)}
                <span>·</span>
                <IoTimeOutline className="lugar-recorrido-card__icon"/>
                {formatearDuracion(paradaViewModel.parada.duracionMinutos)}
              </p>
            )}
          </div>
        </div>
      </div>

      {puedeQuitar && (
        <Dropdown
          align="right"
          className="lugar-recorrido-card__acciones"
        >
          <DropdownTrigger
            className="lugar-recorrido-card__menu-trigger"
            ariaLabel={`Acciones de ${lugar?.nombre ?? "parada"}`}
          >
            <IoEllipsisVertical aria-hidden="true" />
          </DropdownTrigger>
          <DropdownMenu className="lugar-recorrido-card__menu">
            <DropdownItem
              variant="danger"
              icon={<IoTrashOutline />}
              onClick={abrirConfirmacion}
            >
              Quitar parada
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>

    {puedeQuitar && paradaViewModel && (
      <ConfirmarEliminarParadaModal
        isOpen={confirmando}
        nombre={lugar?.nombre ?? "esta parada"}
        turno={paradaViewModel.parada.turno}
        eliminando={eliminando}
        error={errorEliminar}
        onClose={cerrarConfirmacion}
        onConfirm={confirmarEliminacion}
      />
    )}
    </>
  )
}
export default LugarRecorridoCard