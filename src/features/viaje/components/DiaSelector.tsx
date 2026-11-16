import "./DiaSelector.css"

interface DiaSelectorProps {
  dias: {
    numeroDia: number;
    fecha: string | null;
  }[] | null;
  diaActual: number;
  onDiaChange: (dia: number) => void;
};

function DiaSelector({dias, diaActual, onDiaChange}: DiaSelectorProps) {
  return (
    <div className="dia-selector-container">
      <p className="dia-selector-label">
        DÍAS
      </p>
      <div className="dia-selector">
        {dias && dias.map(dia => 
          <button
            key={dia.numeroDia}
            className={`dia-selector__item ${
              dia.numeroDia === diaActual ? "active" : ""
            }`}
            onClick={() => onDiaChange(dia.numeroDia)}
          >
            <span className="dia-selector__numero">
              {dia.numeroDia}
            </span>

            {/* <span className="dia-selector__fecha">
              {getDayAndMonth(dia.fecha)}
            </span> */}
          </button>
        )}
      </div>
    </div>
  )
}
export default DiaSelector