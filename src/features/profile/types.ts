export interface UsuarioDTO {
    id: string
    email: string
    nombre: string
    fotoUrl: string | null
    fechaCreacion: string,
    ultimoAcceso: string
}