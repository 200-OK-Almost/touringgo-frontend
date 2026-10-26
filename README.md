# TouringGO — Frontend (Explorador de Lugares)

Catálogo de puntos de interés de CABA. Consume únicamente el **API Gateway** (nunca el microservicio directo).

## Stack

- React 19 + Vite + TypeScript
- CSS puro (sin librerías de UI)
- `react-router-dom` para enrutado y sincronización de filtros con la URL

## Requisitos previos

- Node.js 20+ (el Dockerfile usa Node 22).
- Backend corriendo (ver `touringgo-infraestructura`): el Gateway queda en `http://localhost:8000` con `docker compose up`.

## Variables de entorno

Copiá `.env.example` a `.env.local` (o `.env`):

```env
VITE_API_BASE_URL=/api
```

`VITE_API_BASE_URL` es relativa: en dev se resuelve contra el proxy de Vite y en producción contra el proxy de nginx.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí http://localhost:3000 (o el puerto que indique Vite). El proxy de Vite (`/api/*`) reenvía al Gateway en `http://localhost:8000`.

## Build y preview

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Cómo funciona la capa de datos

- `src/api/client.ts` — wrapper de `fetch` con manejo de errores.
- `src/api/lugares.ts` — endpoints de Lugares (lista, detalle, cuota Google).
- `src/api/types.ts` — DTOs y enums tipados como string (fiel al wire format PascalCase del backend).

Los paths del microservicio se alcanzan vía el Gateway con la forma `/api/lugares/api/lugares/...`.

## Estructura

```
src/
├── api/                 # capa de servicios (fetch + DTOs)
├── hooks/               # useDebounce, useCuota, useLugares
├── lib/                 # constantes de filtros y helpers de formato
├── components/          # Header, FilterPanel, PlaceCard, PlaceModal, etc.
├── pages/               # HomePage (Navbar + Explorador) y Explorador
└── features/            # auth (login con Google), profile
```
