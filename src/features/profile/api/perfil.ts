import { http } from "../../../api/client";
import type {
  ActualizarPreferenciasUsuarioDTO,
  ActualizarRestriccionesUsuarioDTO,
  PerfilUsuarioDTO,
  PreferenciasUsuarioDTO,
  RestriccionesUsuarioDTO,
} from "../types";

const ME_BASE = "/usuarios/api/me";

export function getPerfil(): Promise<PerfilUsuarioDTO> {
  return http.get<PerfilUsuarioDTO>(`${ME_BASE}/perfil`);
}

export function actualizarPreferencias(
  dto: ActualizarPreferenciasUsuarioDTO
): Promise<PreferenciasUsuarioDTO> {
  return http.patch<PreferenciasUsuarioDTO>(`${ME_BASE}/preferencias`, dto);
}

export function actualizarRestricciones(
  dto: ActualizarRestriccionesUsuarioDTO
): Promise<RestriccionesUsuarioDTO> {
  return http.patch<RestriccionesUsuarioDTO>(`${ME_BASE}/restricciones`, dto);
}

