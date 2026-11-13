import { IoCafeOutline, IoWalkOutline, IoFlashOutline, IoBusOutline, IoCarOutline, IoHourglassOutline } from "react-icons/io5";
import { SelectableCard } from "../../../components/SelectableCard";
import { SelectableChip } from "../../../components/SelectableChip";
import type { PerfilUsuarioDTO, RitmoVisita, TipoTransporte } from "../types";

const RITMO_OPCIONES: { id: RitmoVisita; label: string; descripcion: string; icon: React.ReactNode; }[] = [
  { id: "Relajado", label: "Relajado", descripcion: "Pausado y contemplativo, con pocas paradas y más tiempo libre.", icon: <IoCafeOutline /> },
  { id: "Moderado", label: "Moderado", descripcion: "Equilibrado entre descanso y actividades programadas.", icon: <IoHourglassOutline /> },
  { id: "Activo", label: "Activo", descripcion: "Días intensos aprovechando al máximo cada atracción.", icon: <IoFlashOutline /> },
];

const TRANSPORTE_OPCIONES: { id: TipoTransporte; label: string; icon: React.ReactNode; }[] = [
  { id: "Caminando", label: "Caminando (A pie)", icon: <IoWalkOutline /> },
  { id: "TransportePublico", label: "Transporte público", icon: <IoBusOutline /> },
  { id: "VehiculoPersonal", label: "Vehículo personal", icon: <IoCarOutline /> },
];

interface PreferencesTabProps {
  preferencias: PerfilUsuarioDTO["preferencias"];
  onRitmoChange: (ritmo: RitmoVisita) => void;
  onTransporteToggle: (transporte: TipoTransporte) => void;
}

export function PreferencesTab({ preferencias, onRitmoChange, onTransporteToggle }: PreferencesTabProps) {
  return (
    <div className="profile-section">
      <header className="profile-section__header">
        <h3 className="profile-section__title">Preferencias de Viaje</h3>
        <p className="profile-section__desc">Personaliza cómo TouringGo planifica y te sugiere itinerarios.</p>
      </header>

      <div className="profile-group">
        <label className="profile-group__label">Ritmo de visita preferido</label>
        <p className="profile-group__hint">Selecciona la intensidad deseada para tus recorridos.</p>
        <div className="profile-options-grid">
          {RITMO_OPCIONES.map((opcion) => (
            <SelectableCard
              key={opcion.id}
              title={opcion.label}
              description={opcion.descripcion}
              icon={opcion.icon}
              selected={preferencias.ritmoVisitaPreferido === opcion.id}
              onClick={() => onRitmoChange(opcion.id)}
            />
          ))}
        </div>
      </div>

      <div className="profile-group">
        <label className="profile-group__label">Transportes preferidos</label>
        <p className="profile-group__hint">Elige los medios que prefieres utilizar (selecciona uno o más).</p>
        <div className="profile-chips-grid">
          {TRANSPORTE_OPCIONES.map((opcion) => (
            <SelectableChip
              key={opcion.id}
              label={opcion.label}
              icon={opcion.icon}
              selected={preferencias.transportesPreferidos.includes(opcion.id)}
              onClick={() => onTransporteToggle(opcion.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}