import { IoLeaf, IoLeafOutline } from "react-icons/io5";
import type { TipoDieta } from "../types";
import { SelectableCard } from "../../../components/SelectableCard";
import { FaRestroom, FaWheelchair } from "react-icons/fa";

interface RestriccionesStepProps {
  requiereRecorridoSinEscalones: boolean
  requiereBanoAccesible: boolean
  tipoDietas: TipoDieta[]
  onChange: (changes: {
    requiereRecorridoSinEscalones?: boolean
    requiereBanoAccesible?: boolean
    tipoDietas?: TipoDieta[]
  }) => void;
}

type TipoDietaOption = {
  title: string;
  icon: React.ReactNode;
  value: TipoDieta;
}

function RestriccionesStep({
  requiereRecorridoSinEscalones,
  requiereBanoAccesible,
  tipoDietas,
  onChange
} : RestriccionesStepProps) {
  const tipoDietaOptions: TipoDietaOption[] = [
    {
      title: "Vegano", value: "Vegano", icon: <IoLeaf />
    },
    {
      title: "Vegetariano", value: "Vegetariano", icon: <IoLeafOutline />
    },
    {
      title: "Celiaco", value: "Celiaco", 
      icon: <svg  viewBox="0 0 24 24"  width="1em"  height="1em"  fill="currentColor"  xmlns="http://www.w3.org/2000/svg"  transform="matrix(-1, 0, 0, 1, 0, 0)">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
        <path stroke="currentColor" d="M4.90709946,11.4653026 C7.01338466,13.0450699 7.44021176,16.0332059 5.86044447,18.1394911 C5.64363317,18.428563 5.39483672,18.6918116 5.11898453,18.9243074 L4.90709946,19.0928361 C2.80081426,17.5130688 2.37398717,14.5249329 3.95375445,12.4186477 C4.17056575,12.1295757 4.41936221,11.8663271 4.6952144,11.6338313 L4.90709946,11.4653026 Z M8.72073729,7.65153593 C10.8270225,9.23130322 11.2538496,12.2194392 9.6740823,14.3257244 C9.457271,14.6147963 9.20847454,14.8780449 8.93262236,15.1105407 L8.72073729,15.2790694 C6.61445209,13.6993021 6.18762499,10.7111661 7.76739228,8.60488094 C7.98420358,8.31580898 8.23300004,8.05256039 8.50885222,7.8200646 L8.72073729,7.65153593 Z M12.5343751,3.83776921 C14.6406603,5.4175365 15.0674874,8.40567244 13.4877201,10.5119576 C13.2709088,10.8010296 13.0221124,11.0642782 12.7462602,11.296774 L12.5343751,11.4653026 C10.4280899,9.88553536 10.0012628,6.89739942 11.5810301,4.79111422 C11.7978414,4.50204226 12.0466379,4.23879367 12.32249,4.00629788 L12.5343751,3.83776921 Z M20.1616508,11.4653026 C18.5820436,13.5715167 15.5940953,13.9984159 13.4878812,12.4188088 C13.1987527,12.2019697 12.9354572,11.953132 12.7029271,11.6772283 L12.5343751,11.4653026 C14.1139822,9.35908863 17.1019306,8.9321894 19.2081446,10.5117965 C19.4972732,10.7286356 19.7605687,10.9774733 19.9930988,11.253377 L20.1616508,11.4653026 Z M16.3480129,15.2790694 C14.7684058,17.3852834 11.7804574,17.8121826 9.67424341,16.2325755 C9.38511489,16.0157364 9.12181933,15.7668988 8.88928925,15.490995 L8.72073729,15.2790694 C10.3003444,13.1728554 13.2882928,12.7459561 15.3945068,14.3255632 C15.6836353,14.5424023 15.9469309,14.79124 16.179461,15.0671437 L16.3480129,15.2790694 Z M12.5343751,19.0928361 C10.954768,21.1990501 7.9668196,21.6259493 5.86060558,20.0463422 C5.57147707,19.8295031 5.30818151,19.5806655 5.07565143,19.3047617 L4.90709946,19.0928361 C6.48670659,16.9866221 9.47465498,16.5597228 11.580869,18.13933 C11.8699975,18.356169 12.1332931,18.6050067 12.3658232,18.8809104 L12.5343751,19.0928361 Z M20.9514816,3.04791286 C21.3238283,5.6544274 19.5128192,8.06908238 16.9065088,8.44139985 C16.548771,8.49250352 16.1866752,8.50272288 15.8271945,8.47205796 L15.5581541,8.44118932 C15.1858366,5.83487893 16.9968457,3.42022395 19.6031561,3.04790648 C20.0503283,2.9840269 20.5043101,2.98402905 20.9514816,3.04791286 Z"
        />
      </g>
    </svg>
    }
  ]

  return (
    <>
    <div className="planificacion-form-header">
      <h2>Restricciones y Accesibilidad</h2>
      <p className="planificacion-form-description text-muted">
        Selecciona las opciones acorde a tus necesidades de movilidad y accesibilidad.
      </p>
    </div>
    <div className="selectable-card-group grid-2">
      <SelectableCard
        title="Recorrido sin escalones"
        description="Priorizar accesos y trayectos sin escaleras, con rampas o ascensores."
        icon={<FaWheelchair size={22} className="profile-switch-card__icon" />}
        selected={requiereRecorridoSinEscalones}
        variant="big" 
        selectionIndicator="checkbox"
        onClick={() => onChange({requiereRecorridoSinEscalones: !requiereRecorridoSinEscalones})}
      />
      <SelectableCard
        title="Baño accesible"
        description="Priorizar instalaciones con sanitarios adaptados para personas con movilidad reducida."
        icon={<FaRestroom size={24} />}
        selected={requiereBanoAccesible}
        variant="big" 
        selectionIndicator="checkbox"
        onClick={() => onChange({requiereBanoAccesible: !requiereBanoAccesible})}
      />
    </div>
    <div className="planificacion-form-header duration-step__availability-header">
      <h2>Preferencia y tipo de dieta</h2>
      <p className="planificacion-form-description text-muted">
        Selecciona las opciones que aplican a tus hábitos o restricciones alimentarias.
      </p>
    </div>
    <div className="selectable-card-group grid-3">
      {tipoDietaOptions.map((tipo) => (
        <SelectableCard
          key={tipo.value}
          title={tipo.title}
          icon={tipo.icon}
          selected={tipoDietas.includes(tipo.value)}
          variant="big" 
          selectionIndicator="checkbox"
          onClick={() => {
            const index = tipoDietas.indexOf(tipo.value)
            index != -1 ?
              tipoDietas.splice(index, 1) : tipoDietas.push(tipo.value)

            onChange({ tipoDietas: tipoDietas })
          }}
        />
      ))}
    </div>
    </>
  )
}
export default RestriccionesStep