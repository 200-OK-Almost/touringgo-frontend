import {
  IoPencilOutline,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import "./GastoCard.css";

interface GastoCardSkeletonProps {
  selectable: boolean
}

export function GastoCardSkeleton({selectable} : GastoCardSkeletonProps) {
  return (
    <div
      className={`gasto-card`}
    >
      {/* Fila superior: Checkbox, Icono, Concepto + Subtítulo, Monto */}
      <div className="gasto-card__top">
        { selectable && 
          <div 
            className="gasto-card__checkbox"
            style={{
              borderColor: "transparent",
            }}
          >
            <div 
              className="skeleton" 
              style={{
                width: "100%", 
                height: "100%",
                borderRadius: 6
              }}
              
            />
          </div>
        }

        <div 
          className="gasto-card__icon-wrapper skeleton"
          style={{
            backgroundColor: "transparent",
            borderColor: "transparent"
          }}
        >
          <div 
            className="gasto-card__icon skeleton"
            style={{
              width: "100%",
              height: "100%"
            }}
          >
          </div>
        </div>

        <div className="gasto-card__info">
          <div 
            className="gasto-card__concepto skeleton" 
            style={{
              width: 100,
              height: 20,
              borderRadius: 6
            }}
          />
          <div 
            className="gasto-card__subtitulo skeleton" 
            style={{
              width: 150,
              height: 18,
              borderRadius: 6
            }}
          />
        </div>

        <div className="gasto-card__monto">
          <div 
            className="skeleton" 
            style={{
              width: 75,
              height: 21,
              borderRadius: 6
            }}
          />
        </div>
      </div>

      {/* Fila inferior: Fecha/hora y botones de acción (editar y eliminar) */}
      <div className="gasto-card__bottom">
        <div className="gasto-card__fecha">
          <IoTimeOutline className="gasto-card__time-icon" />
          <div 
            className="skeleton" 
            style={{
              width: 95,
              height: 16,
              borderRadius: 6
            }}
          />
        </div>

        <div className="gasto-card__actions" onClick={(e) => e.stopPropagation()}>
          {selectable && (
            <>
            <button
              type="button"
              className="gasto-card__action-btn"
              title="Editar gasto"
              aria-label="Editar gasto"
              disabled
            >
              <IoPencilOutline />
            </button>
            <button
              type="button"
              className="gasto-card__action-btn gasto-card__action-btn--delete"
              title="Eliminar gasto"
              aria-label="Eliminar gasto"
              disabled
            >
              <IoTrashOutline />
            </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GastoCardSkeleton;
