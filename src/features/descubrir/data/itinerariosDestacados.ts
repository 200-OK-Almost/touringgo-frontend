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
    descripcion: "Café de especialidad, clásicos del Soho y un bar para cerrar la tarde.",
    barrio: "Palermo",
    subzona: "Soho",
    orden: "resenas",
    resenasMinimas: 1000,
    puntuacionMinima: 4.4,
    icono: "🔥",
    slots: [
      {
        categoriaCodigo: "cafe_especialidad",
        orden: "puntuacion",
        resenasMinimas: 50,
        puntuacionMinima: 4.3,
      },
      {},
      {
        categoriaCodigo: "bares_vermu",
        orden: "resenas",
        resenasMinimas: 100,
        puntuacionMinima: 4.3,
      },
      {},
    ],
  },
  {
    id: "san-telmo-clasico",
    titulo: "San Telmo clásico",
    descripcion: "Café, bodegones tradicionales y un bar clásico para la tarde.",
    barrio: "SanTelmo",
    categoriaCodigo: "gastronomia_clasica",
    orden: "puntuacion",
    resenasMinimas: 50,
    puntuacionMinima: 4.5,
    icono: "🥘",
    slots: [
      {
        categoriaCodigo: "cafe_especialidad",
        orden: "puntuacion",
        resenasMinimas: 30,
        puntuacionMinima: 4.3,
      },
      { categoriaCodigo: "gastronomia_clasica" },
      {
        categoriaCodigo: "bares_vermu",
        orden: "resenas",
        resenasMinimas: 100,
        puntuacionMinima: 4.3,
      },
      { categoriaCodigo: "gastronomia_clasica" },
    ],
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
