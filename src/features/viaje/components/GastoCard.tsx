import type { GastoDto, MiembroViajeDto } from "../types";
import {
  IoCashOutline,
  IoCheckmark,
  IoPencilOutline,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import "./GastoCard.css";

export interface GastoCardProps {
  gasto: GastoDto;
  miembrosPorId?: Map<string, MiembroViajeDto>;
  selected: boolean;
  onSelectChange?: (selected: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function GastoCard({
  gasto,
  miembrosPorId,
  selected,
  onSelectChange,
  onEdit,
  onDelete,
}: GastoCardProps) {
  const handleToggleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectChange?.(!selected);
  };

  // Formato de moneda / monto
  const formattedMonto = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: gasto.moneda === "USD" ? "USD" : "ARS",
    maximumFractionDigits: 0,
  }).format(gasto.monto);

  // Formato de fecha "Jue 19/11 • 23:40"
  const formatFechaGasto = (fechaStr: string) => {
    if (!fechaStr) return "";
    const date = new Date(fechaStr);
    if (isNaN(date.getTime())) return fechaStr;

    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const diaNombre = diasSemana[date.getDay()];
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");

    return `${diaNombre} ${dia}/${mes} • ${horas}:${minutos}`;
  };

  // Nombre de quien pagó
  const pagador = miembrosPorId?.get(gasto.pagadoPorMiembroId);
  const nombrePagador = pagador?.nombre?.trim() || "Alguien";

  // Nombres de participantes entre los que se divide
  const divisiones = gasto.divisiones || [];
  const nombresParticipantes = divisiones.map((d) => {
    const m = miembrosPorId?.get(d.usuarioId);
    return m?.nombre?.trim() || "Miembro";
  });

  const textoDivision =
    nombresParticipantes.length > 0
      ? `entre ${nombresParticipantes.join(", ")}`
      : "";

  return (
    <div
      className={`gasto-card ${selected ? "gasto-card--selected" : ""}`}
      onClick={handleToggleSelect}
    >
      {/* Fila superior: Checkbox, Icono, Concepto + Subtítulo, Monto */}
      <div className="gasto-card__top">
        <button
          type="button"
          className={`gasto-card__checkbox ${
            selected ? "gasto-card__checkbox--checked" : ""
          }`}
          onClick={handleToggleSelect}
          aria-label={selected ? "Deseleccionar gasto" : "Seleccionar gasto"}
        >
          {selected && <IoCheckmark className="gasto-card__check-icon" />}
        </button>

        <div className="gasto-card__icon-wrapper">
          <IoCashOutline className="gasto-card__icon" />
        </div>

        <div className="gasto-card__info">
          <h4 className="gasto-card__concepto" title={gasto.concepto}>
            {gasto.concepto}
          </h4>
          <p className="gasto-card__subtitulo">
            Pagó <strong>{nombrePagador}</strong>
            {textoDivision && ` • ${textoDivision}`}
          </p>
        </div>

        <div className="gasto-card__monto">{formattedMonto}</div>
      </div>

      {/* Fila inferior: Fecha/hora y botones de acción (editar y eliminar) */}
      <div className="gasto-card__bottom">
        <div className="gasto-card__fecha">
          <IoTimeOutline className="gasto-card__time-icon" />
          <span>{formatFechaGasto(gasto.fechaGasto)}</span>
        </div>

        <div className="gasto-card__actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="gasto-card__action-btn"
            title="Editar gasto"
            onClick={onEdit}
            aria-label="Editar gasto"
          >
            <IoPencilOutline />
          </button>
          <button
            type="button"
            className="gasto-card__action-btn gasto-card__action-btn--delete"
            title="Eliminar gasto"
            onClick={onDelete}
            aria-label="Eliminar gasto"
          >
            <IoTrashOutline />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GastoCard;
