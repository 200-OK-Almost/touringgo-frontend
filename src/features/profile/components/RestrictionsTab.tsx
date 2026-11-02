import { FaWheelchair, FaRestroom } from "react-icons/fa";
import { SelectableChip } from "../../../components/SelectableChip";
import SwitchCard from "../../../components/SwitchCard";
import type { PerfilUsuarioDTO, TipoDieta } from "../types";

const DIETA_OPCIONES: { id: TipoDieta; label: string; }[] = [
  { id: "Celiaco", label: "Celíaco (Sin TACC)" },
  { id: "Vegetariano", label: "Vegetariano" },
  { id: "Vegano", label: "Vegano" },
  { id: "IntoleranteLactosa", label: "Intolerante a la lactosa" },
];

interface RestrictionsTabProps {
  restricciones: PerfilUsuarioDTO["restricciones"];
  onDietaToggle: (dieta: TipoDieta) => void;
  onAccesibilidadToggle: (campo: "requiereBanoAccesible" | "requiereRecorridoSinEscalones", valor: boolean) => void;
}

export function RestrictionsTab({ restricciones, onDietaToggle, onAccesibilidadToggle }: RestrictionsTabProps) {
  return (
    <div className="profile-section">
      <header className="profile-section__header">
        <h3 className="profile-section__title">Restricciones y Accesibilidad</h3>
        <p className="profile-section__desc">Filtros automáticos para adaptar lugares y gastronomía a tus necesidades.</p>
      </header>

      <div className="profile-group">
        <label className="profile-group__label">Preferencia y tipo de dieta</label>
        <p className="profile-group__hint">Selecciona las opciones que aplican a tus hábitos o restricciones alimentarias.</p>
        <div className="profile-chips-grid">
          {DIETA_OPCIONES.map((opcion) => (
            <SelectableChip
              key={opcion.id}
              label={opcion.label}
              selected={restricciones.dieta.includes(opcion.id)}
              onClick={() => onDietaToggle(opcion.id)}
            />
          ))}
        </div>
      </div>

      <div className="profile-group">
        <label className="profile-group__label">Accesibilidad y movilidad</label>
        <p className="profile-group__hint">Ajustes para asegurar lugares adecuados a tus requerimientos de movilidad.</p>
        <div className="profile-switches-list">
          <SwitchCard
            icon={<FaWheelchair size={22} className="profile-switch-card__icon" />}
            title="Recorrido sin escalones"
            description="Priorizar accesos y trayectos sin escaleras, con rampas o ascensores."
            checked={restricciones.requiereRecorridoSinEscalones}
            onChange={() => onAccesibilidadToggle("requiereRecorridoSinEscalones", !restricciones.requiereRecorridoSinEscalones)}
          />
          <SwitchCard
            icon={<FaRestroom size={24} className="profile-switch-card__icon" />}
            title="Baño accesible"
            description="Priorizar instalaciones con sanitarios adaptados para personas con movilidad reducida."
            checked={restricciones.requiereBanoAccesible}
            onChange={() => onAccesibilidadToggle("requiereBanoAccesible", !restricciones.requiereBanoAccesible)}
          />
        </div>
      </div>
    </div>
  );
}