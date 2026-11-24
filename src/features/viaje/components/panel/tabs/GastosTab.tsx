import { useEffect, useState } from "react"
import type { GastoDto, MiembroViajeDto, ViajeDto } from "../../../types"
import "./GastosTab.css"
import GastoFormModal from "../../modals/GastoFormModal"
import { getGastos } from "../../../api/viajes"
import type { ResultadoPaginadoDto } from "../../../../../api/types"
import { IoAddOutline, IoCheckmarkCircleOutline } from "react-icons/io5"
import GastoCard from "../../GastoCard"
import LiquidacionModal from "../../modals/LiquidacionModal"

interface GastosTabProps {
  viaje: ViajeDto
  miembros: MiembroViajeDto[]
  miembrosPorId?: Map<string, MiembroViajeDto>
}

type subTab = "pendientes" | "historial"

function GastosTab({viaje, miembros, miembrosPorId} : GastosTabProps) {
  const [subTab, setSubTab] = useState<subTab>("pendientes")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [gastoFormOpen, setGastoFormOpen] = useState(false)
  const [liquidacionModalOpen, setLiquidacionModalOpen] = useState(false)
  
  const [gastosPendientes, setGastosPendientes] = useState<ResultadoPaginadoDto<GastoDto> | null>(null)
  const [gastosHistorial, setGastosHistorial] = useState<ResultadoPaginadoDto<GastoDto> | null>(null)

  // Estado para los IDs de los gastos seleccionados
  const [selectedGastoIds, setSelectedGastoIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function cargarGastos() {
      try {
        setIsLoading(true)
        setError(null)

        if (subTab == "pendientes") {
          const gastosData = await getGastos(viaje.id, {estado: "Pendientes"})
          console.log(gastosData)
          setGastosPendientes(gastosData)
        } else {
          const gastosData = await getGastos(viaje.id, {estado: "Liquidados"})
          console.log(gastosData)
          setGastosHistorial(gastosData)
        }
      } catch (err: unknown) {
        setError("Error al cargar gastos")
      } finally {
        setIsLoading(false)
      }
    }
    cargarGastos()
  }, [subTab, viaje.id])

  const gastos: GastoDto[] | undefined = subTab == "pendientes" ? gastosPendientes?.items : gastosHistorial?.items

  const handleToggleSelectGasto = (gastoId: string, isSelected: boolean) => {
    setSelectedGastoIds((prev) => {
      const next = new Set(prev)
      if (isSelected) {
        next.add(gastoId)
      } else {
        next.delete(gastoId)
      }
      return next
    })
  }

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
          <h2>Balance</h2>
        </div>

        <div className="gastos-tab__section">
          <div className="gastos-tab__section__header">
            <h2>Gastos</h2>
            <button
              type="button"
              className="gastos-tab__btn-agregar"
              onClick={() => setGastoFormOpen(true)}
            >
              <IoAddOutline className="gastos-tab__btn-icon" />
              <span>Agregar gasto</span>
            </button>
          </div>
          <div className="gastos-tab__subtab__switcher">
            <button
              onClick={() => setSubTab("pendientes")}
              className={
                `gastos-tab__subtab__switcher__btn ${subTab == "pendientes" && "subtab-selected"}`
              }
            >
              <p>Pendientes</p>
            </button>
            <button
              onClick={() => setSubTab("historial")}
              className={
                `gastos-tab__subtab__switcher__btn ${subTab == "historial" && "subtab-selected"}`
              }
            >
              <p>Historial</p>
            </button>
          </div>
          <div className="gastos-tab__gastos__list"> 
            {isLoading && <p>Cargando gastos...</p>}
            {error && <p className="gastos-tab__error">{error}</p>}
            {!isLoading && gastos && gastos.map(gasto => 
              <GastoCard 
                key={gasto.id}
                gasto={gasto}
                miembrosPorId={miembrosPorId}
                selected={selectedGastoIds.has(gasto.id)}
                onSelectChange={(isSelected) => handleToggleSelectGasto(gasto.id, isSelected)}
              />
            )}
          </div>
        </div>

      </div>

      <div className="gastos-tab__footer">
        <button
          type="button"
          className="gastos-tab__btn-liquidar"
          disabled={selectedGastoIds.size === 0}
          onClick={() => setLiquidacionModalOpen(true)}
        >
          <IoCheckmarkCircleOutline className="gastos-tab__btn-icon" />
          <span>
            {selectedGastoIds.size > 0
              ? `Liquidar gastos (${selectedGastoIds.size})`
              : "Liquidar gastos"}
          </span>
        </button>
      </div>
    </div>

    <GastoFormModal 
      isOpen={gastoFormOpen}
      onClose={() => setGastoFormOpen(false)}
      viajeId={viaje.id}
      miembros={miembros}
      miembrosPorId={miembrosPorId}
    />

    <LiquidacionModal 
      isOpen={liquidacionModalOpen}
      onClose={() => setLiquidacionModalOpen(false)}
      viajeId={viaje.id}
      gastoIds={Array.from(selectedGastoIds)}
      miembrosPorId={miembrosPorId}
      onLiquidacionExitosa={() => {
        setSelectedGastoIds(new Set())
        // Recargar gastos tras liquidar
        if (subTab === "pendientes") {
          getGastos(viaje.id, { estado: "Pendientes" }).then(setGastosPendientes)
        } else {
          getGastos(viaje.id, { estado: "Liquidados" }).then(setGastosHistorial)
        }
      }}
    />
    </>
  )
}

export default GastosTab
