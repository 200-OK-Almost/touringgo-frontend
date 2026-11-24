import { useEffect, useState } from "react"
import type { GastoDto, MiembroViajeDto, ViajeDto } from "../../../types"
import "./GastosTab.css"
import GastoFormModal from "../../modals/GastoFormModal"
import { eliminarGasto, getGastos } from "../../../api/viajes"
import type { ResultadoPaginadoDto } from "../../../../../api/types"
import { IoAddOutline, IoCheckmarkCircleOutline } from "react-icons/io5"
import GastoCard from "../../GastoCard"
import LiquidacionModal from "../../modals/LiquidacionModal"
import GastoCardSkeleton from "../../GastoCardSkeleton"

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
  const [gastoEnEdicion, setGastoEnEdicion] = useState<GastoDto | null>(null);
  const [liquidacionModalOpen, setLiquidacionModalOpen] = useState(false)
  
  const [gastosPendientes, setGastosPendientes] = useState<ResultadoPaginadoDto<GastoDto> | null>(null)
  const [gastosHistorial, setGastosHistorial] = useState<ResultadoPaginadoDto<GastoDto> | null>(null)

  // Estado para los IDs de los gastos seleccionados
  const [selectedGastoIds, setSelectedGastoIds] = useState<Set<string>>(new Set())

  // Estado para confirmación y eliminación de gastos
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function cargarGastos() {
      try {
        setIsLoading(true)
        setError(null)

        if (subTab == "pendientes") {
          const gastosData = await getGastos(viaje.id, {estado: "Pendientes"})
          setGastosPendientes(gastosData)
        } else {
          const gastosData = await getGastos(viaje.id, {estado: "Liquidados"})
          setGastosHistorial(gastosData)
        }
      } catch (err: unknown) {
        setError("Error al cargar gastos")
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    cargarGastos()
  }, [subTab, viaje.id])

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

  function handleSolicitarEliminacion(gasto: GastoDto) {
    setConfirmDeleteId(gasto.id)
    setError(null)
  }

  function handleCancelarEliminacion() {
    if (deletingId) return
    setConfirmDeleteId(null)
    setError(null)
  }

  async function handleEliminarGasto(gasto: GastoDto) {
    setDeletingId(gasto.id)
    setError(null)

    try {
      await eliminarGasto(viaje.id, gasto.id)
      setSelectedGastoIds((prev) => {
        if (!prev.has(gasto.id)) return prev
        const next = new Set(prev)
        next.delete(gasto.id)
        return next
      })
      setConfirmDeleteId(null)
      await cargarGastos()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el gasto."
      )
    } finally {
      setDeletingId(null)
    }
  }

  const gastos: GastoDto[] | undefined = subTab == "pendientes" ? gastosPendientes?.items : gastosHistorial?.items

  function renderGastos() {
    if (isLoading)
      return Array.from({ length: 3 }, (_, index) => (
        <GastoCardSkeleton
          key={index}
          selectable={subTab === "pendientes"}
        />
       ));

    if (error)
      return <p className="gastos-tab__error">{error}</p>

    if (!gastos)
      return

    if (gastos.length <= 0) {
      return <p>{`No hay gastos ${subTab == "pendientes" ? "pendientes" : "liquidados"}`}</p>
    }
    return gastos && gastos.map(gasto => 
      <GastoCard 
        key={gasto.id}
        gasto={gasto}
        miembrosPorId={miembrosPorId}
        selectable={gasto.liquidacionId ? false : true}
        selected={selectedGastoIds.has(gasto.id)}
        onSelectChange={(isSelected) => handleToggleSelectGasto(gasto.id, isSelected)}
        onEdit={() => {
          setGastoEnEdicion(gasto)
          setGastoFormOpen(true)
        }}
        isConfirmingDelete={confirmDeleteId === gasto.id}
        isDeleting={deletingId === gasto.id}
        onDelete={() => handleSolicitarEliminacion(gasto)}
        onCancelDelete={handleCancelarEliminacion}
        onConfirmDelete={() => void handleEliminarGasto(gasto)}
      />

    )
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
              onClick={() => {
                setGastoEnEdicion(null)
                setGastoFormOpen(true)
              }}
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
            {renderGastos()}
          </div>
        </div>

      </div>

      <div className="gastos-tab__footer">
        <button
          type="button"
          className="gastos-tab__btn-liquidar"
          disabled={selectedGastoIds.size === 0 || subTab == "historial"}
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
      mode={gastoEnEdicion ? "editar" : "crear"}
      gasto={gastoEnEdicion ? gastoEnEdicion : null}
      onGastoGuardado={() => cargarGastos()}
    />
    <LiquidacionModal 
      isOpen={liquidacionModalOpen}
      onClose={() => setLiquidacionModalOpen(false)}
      viajeId={viaje.id}
      gastoIds={Array.from(selectedGastoIds)}
      miembrosPorId={miembrosPorId}
      onLiquidacionExitosa={() => {
        setSelectedGastoIds(new Set())
        cargarGastos()
      }}
    />
    </>
  )
}

export default GastosTab
