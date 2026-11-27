import type { TemaItinerario } from "../types";

export const LUGARES_POR_RECORRIDO = 4;

export const ITINERARIOS_DESTACADOS: TemaItinerario[] = [
  {
    id: "recoleta-cultural",
    titulo: "Recoleta cultural",
    descripcion: "Galerías, museos y anticuarios en el corazón de Recoleta.",
    barrio: "Recoleta",
    categoriaCodigo: "museos_galerias",
    orden: "puntuacion",
    resenasMinimas: 10,
    puntuacionMinima: 4.5,
    icono: "🏛️",
  },
  {
    id: "palermo-soho-tendencia",
    titulo: "Palermo Soho en tendencia",
    descripcion: "Los lugares más comentados y mejor puntuados del Soho.",
    barrio: "Palermo",
    subzona: "Soho",
    orden: "resenas",
    resenasMinimas: 1000,
    puntuacionMinima: 4.4,
    icono: "🔥",
  },
  {
    id: "san-telmo-clasico",
    titulo: "San Telmo clásico",
    descripcion: "Bodegones y sabores tradicionales de San Telmo.",
    barrio: "SanTelmo",
    categoriaCodigo: "gastronomia_clasica",
    orden: "puntuacion",
    resenasMinimas: 50,
    puntuacionMinima: 4.5,
    icono: "🥘",
  },
  {
    id: "puerto-madero-aire-libre",
    titulo: "Puerto Madero al aire libre",
    descripcion: "Paseos, parques y postales junto al río.",
    barrio: "PuertoMadero",
    categoriaCodigo: "parques_aire_libre",
    orden: "resenas",
    resenasMinimas: 1000,
    puntuacionMinima: 4.5,
    icono: "🌳",
  },
];
