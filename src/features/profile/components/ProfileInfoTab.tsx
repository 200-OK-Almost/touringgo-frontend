import { Avatar } from "../../../components/Avatar";
import type { PerfilUsuarioDTO } from "../types";

interface ProfileInfoTabProps {
  perfil: PerfilUsuarioDTO;
}

export function ProfileInfoTab({ perfil }: ProfileInfoTabProps) {
  const formatearFecha = (fechaStr: string) => {
    try {
      return new Date(fechaStr).toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <div className="profile-section">
      <header className="profile-section__header">
        <h3 className="profile-section__title">Información de Usuario</h3>
        <p className="profile-section__desc">Datos vinculados a tu cuenta de acceso.</p>
      </header>

      <div className="profile-user-card">
        <Avatar 
          src={perfil.usuario.fotoUrl} 
          alt={perfil.usuario.nombre} 
          name={perfil.usuario.nombre} 
          size="lg" 
          className="profile-user-card__avatar" 
        />
        <div className="profile-user-card__info">
          <h4 className="profile-user-card__name">{perfil.usuario.nombre}</h4>
          <p className="profile-user-card__email">{perfil.usuario.email}</p>
          <span className="profile-user-card__badge">Cuenta de Google verificada</span>
        </div>
      </div>

      <div className="profile-fields">
        <div className="profile-field">
          <span className="profile-field__label">Fecha de registro</span>
          <span className="profile-field__value">{formatearFecha(perfil.usuario.fechaCreacion)}</span>
        </div>
        <div className="profile-field">
          <span className="profile-field__label">Último acceso</span>
          <span className="profile-field__value">{formatearFecha(perfil.usuario.ultimoAcceso)}</span>
        </div>
      </div>
    </div>
  );
}