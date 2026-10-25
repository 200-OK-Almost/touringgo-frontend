import type { UsuarioDTO } from "../profile/types";

export interface LoginResponseDTO {
    accessToken: string;
    expiresAt: string;
    usuario: UsuarioDTO;
}