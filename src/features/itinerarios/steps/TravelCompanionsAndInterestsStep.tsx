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
      title: "Solo", value: "solo", description: "Viajo por mi cuenta",
      icon: <IoPersonOutline />
    },
    {
      title: "Grupo", value: "grupo", description: "Viajo con amigos",
      icon: <IoPeopleOutline />
    },
    {
      title: "Familia", value: "familia", description: "Viajo con familiares",
      icon: <IoPeople />
    },
    {
      title: "Pareja", value: "pareja", description: "Viajo en pareja",
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
    <h2>Modalidad de viaje</h2>
    <div className="selectable-card-group horizontal-group">
      {modalidadViajeOptions.map(m => 
        <SelectableCard 
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

    <h2>Categorías de interés</h2>
    <div className="selectable-card-group horizontal-grid">
      {categoriaOptions.map(c => 
        <SelectableCard 
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