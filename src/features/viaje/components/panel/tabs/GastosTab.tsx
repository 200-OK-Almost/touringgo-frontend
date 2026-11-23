import { useState } from "react"
import type { MiembroViajeDto, ViajeDto } from "../../../types"
import "./GastosTab.css"
import GastoFormModal from "../../modals/GastoFormModal"
interface GastosTabProps {
  viaje: ViajeDto
  miembros: MiembroViajeDto[]
  miembrosPorId?: Map<string, MiembroViajeDto>
}

function GastosTab({viaje, miembros, miembrosPorId} : GastosTabProps) {
  const [gastoFormOpen, setGastoFormOpen] = useState(false)

  return (
    <>
    <div className="gastos-tab">
      <div className="gastos-tab__header">
        <h2>Gastos compartidos</h2>
        <p className="gastos-tab__subtitle">
          Controla gastos grupales, saldos en vivo y división equitativa.
        </p>
      </div>

      <div className="gastos-tab__body">

        <div className="gastos-tab__section">
          <h2>Gastos sin liquidar</h2>
          <button
            onClick={() => setGastoFormOpen(true)}
          >
            Agregar gasto
          </button>
        </div>


      </div>

      <div className="gastos-tab__footer">
        <button
          type="button"
          className=""
          // onClick={}
        >
          <span>Compartir invitación</span>
        </button>
      </div>
    </div>

    <GastoFormModal 
      isOpen={gastoFormOpen}
      onClose={() => setGastoFormOpen(false)}
      viajeId={viaje.id}
      miembros={miembros}
      // miembrosPorId={miembrosPorId}
    />
    </>

  )
}
export default GastosTab