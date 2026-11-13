import { IoBeerOutline, IoCafeOutline, IoColorPaletteOutline, IoHeartOutline, IoLeafOutline, IoLibraryOutline, IoPeople, IoPeopleOutline, IoPersonOutline, IoPizzaOutline, IoWineOutline } from "react-icons/io5";
import { SelectableCard } from "../../../components/SelectableCard";
import type { ModalidadViaje } from "../types"
import type { CategoriaDto } from "../../../api/types";
import type { FormErrors } from "../PlanificationForm.validation";

interface TravelCompanionsAndInterestsStepProps {
    modalidadViaje: ModalidadViaje | null
    categoriasPrioritarias: CategoriaDto[]
    categorias: CategoriaDto[]
    onChange: (changes: {
      modalidadViaje?: ModalidadViaje
      categoriasPrioritarias?: CategoriaDto[]
    }) => void;
  errors: FormErrors
}

type ModalidadViajeOption = {
  title: string, 
  description: string,
  icon: React.ReactNode
  value: ModalidadViaje
}
type CategoriaOption = {
  title: string, 
  icon: React.ReactNode
  value: CategoriaDto
}

function TravelCompanionsAndInterestsStep({categorias, modalidadViaje, categoriasPrioritarias, onChange, errors}: TravelCompanionsAndInterestsStepProps) {
  const modalidadViajeOptions: ModalidadViajeOption[] = [
    {
      title: "Solo", value: "solo", description: "Un recorrido pensado para disfrutar a tu propio ritmo",
      icon: <IoPersonOutline />
    },
    {
      title: "Con Grupo", value: "grupo", description: "Propuestas para disfrutar en grupo",
      icon: <IoPeopleOutline />
    },
    {
      title: "Con familia", value: "familia", description: "Actividades para las necesidades de los distintos integrantes",
      icon: <IoPeople />
    },
    {
      title: "En pareja", value: "pareja", description: "Experiencias para compartir de a dos",
      icon: <IoHeartOutline />
    },
  ]
  
  const iconMap: {[key: string]: React.ReactNode} = {
    "cafe_especialidad": <IoCafeOutline />,
    "museos_galerias": <IoColorPaletteOutline />,
    "parques_aire_libre": <IoLeafOutline />,
    "librerias_diseno": <IoLibraryOutline />,
    "bares_vermu": <IoBeerOutline />,
    "gastronomia_clasica": <IoPizzaOutline />,
    "cocteleria_autor": <IoWineOutline />,
  }

  const categoriaOptions: CategoriaOption[] = categorias.map(c => {
    return ({
      title: c.nombre,
      value: c,
      icon: iconMap[c.codigo]
    })
  })
  
  return (
    <>
    <div className="planificacion-form-header">
      <h2>Modalidad de viaje</h2>
    </div>
    <div className="selectable-card-group grid-4">
      {modalidadViajeOptions.map(m => 
        <SelectableCard 
          key={m.value}
          title={m.title}
          icon={m.icon}
          selected={modalidadViaje === m.value}
          description={m.description}
          onClick={() => onChange({modalidadViaje: m.value})}
          variant="big"
        />
      )}
    </div>
    {errors.modalidadViaje && <div className="planificacion-field-error">
      <p>{errors.modalidadViaje}</p>
    </div>
    }

    <div className="planificacion-form-header">
      <h2>Categorías de interés</h2>
      <p className="planificacion-form-description">Elegí las categorías que más te interesan para esta salida. Las vamos a priorizar, pero también tendremos en cuenta tus preferencias habituales y podremos incluir otras actividades que complementen el recorrido.</p>
      <p className="planificacion-form-description text-muted">Podés dejar todas las categorías sin seleccionar para usar tus preferencias habituales.</p>
    </div>
    <div className="selectable-card-group grid-auto">
      {categoriaOptions.map(c => 
        <SelectableCard 
          key={c.value.id ?? c.title}
          title={c.title}
          icon={c.icon}
          selected={categoriasPrioritarias.includes(c.value)}
          variant="big"
          selectionIndicator="checkbox"
          onClick={() => {
            const index = categoriasPrioritarias.indexOf(c.value)
            index != -1 ?
              categoriasPrioritarias.splice(index, 1) : categoriasPrioritarias.push(c.value)
                    
            onChange({categoriasPrioritarias: categoriasPrioritarias})
          }}
        />
      )}
      
    </div>
    </>
  )
}
export default TravelCompanionsAndInterestsStep