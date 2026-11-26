import CategoriaAfinidadSlider from "../components/CategoriaAfinidadSlider"
import type { PreferenciasCategoriaDTO } from "../types"

interface PreferenciasStepProps {
  preferenciasCategorias: PreferenciasCategoriaDTO[]
  onAfinidadChange: (categoriaCodigo: string, afinidad: number) => void;
}

function PreferenciasStep({
  preferenciasCategorias,
  onAfinidadChange
} : PreferenciasStepProps) {

  return (
    <>
    <div className="planificacion-form-header">
      <h2>Categorías de interes</h2>
      <p className="planificacion-form-description text-muted">
        Indicá cuánto te interesa cada categoría. Podés dejar las que no te interesan en neutral.
      </p>
    </div>
    <div className="selectable-card-group grid-2">
      {preferenciasCategorias.map(pref => 
        <CategoriaAfinidadSlider
          key={pref.categoriaCodigo}
          preferencia={pref}
          onChange={(afinidad) => onAfinidadChange(pref.categoriaCodigo, afinidad)}
        />
      )}
    </div>
    </>
  )
}
export default PreferenciasStep