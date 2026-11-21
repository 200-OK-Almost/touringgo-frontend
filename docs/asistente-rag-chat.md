# Asistente RAG — Frontend

Documentación del chat del asistente en la vista de viaje.

## Alcance

- Consulta de recomendaciones desde `ChatTab`.
- Render de lugares recomendados con motivo.
- Agregar o reemplazar paradas del itinerario actual.
- Manejo de permisos, feature flag y errores.
- Refresco del viaje después de aplicar cambios.

Sin intención ni LLM en el frontend: el mensaje se envía tal cual al backend, que en esta fase usa recuperación determinista.

## Archivos principales

| Archivo | Rol |
|---|---|
| `src/features/viaje/api/asistente.ts` | Llamadas al Gateway: consultar, aplicar y capacidades. |
| `src/features/viaje/types.ts` | Contratos del asistente y `version` en `ItinerarioDto`. |
| `src/features/viaje/components/panel/tabs/ChatTab.tsx` | Estado del chat, recomendaciones y acciones. |
| `src/features/viaje/components/panel/tabs/ChatTab.css` | Estilos de mensajes, tarjetas y acciones. |
| `src/features/viaje/components/ViajeView.tsx` | Pasa día actual, itinerario y callback de refresco. |
| `src/pages/ViajePage.tsx` | `recargarViaje` para actualizar datos después de aplicar. |
| `src/api/client.ts` | `ApiError` con `Retry-After`. |

## Endpoints usados

```http
GET  /api/itinerarios/api/viajes/asistente/capacidades
POST /api/itinerarios/api/viajes/{id}/asistente
POST /api/itinerarios/api/viajes/{id}/asistente/aplicar
```

La capa `http` agrega `/api` y el Gateway resuelve `/itinerarios/**`.

## Flujo de consulta

1. `ChatTab` monta y consulta capacidades.
2. Si `habilitado=false`, bloquea el chat y muestra un aviso.
3. El usuario escribe un mensaje.
4. Se envía `{ mensaje, numeroDia, historial }`.
5. El historial se limita a los últimos 6 mensajes y vive solo en memoria.
6. La respuesta agrega un mensaje del asistente con:
   - texto;
   - recomendaciones;
   - advertencia opcional;
   - `puedeAplicar`.
7. Cada recomendación se renderiza con foto, rating, dirección y motivo.

## Flujo de aplicar

Cada tarjeta muestra acciones solo si:
- `puedeAplicar=true`;
- el asistente está habilitado;
- el itinerario actual tiene `version`.

### Agregar

```json
{
  "tipo": "AgregarParada",
  "numeroDia": 1,
  "lugarId": "uuid",
  "paradaId": null,
  "turno": null,
  "version": "xmin-opaco"
}
```

### Reemplazar

El usuario elige una parada del día en el selector. Se envía:

```json
{
  "tipo": "ReemplazarParada",
  "numeroDia": 1,
  "lugarId": "uuid",
  "paradaId": "uuid",
  "turno": null,
  "version": "xmin-opaco"
}
```

Después de aplicar, se llama a `onItinerarioActualizado`, que recarga:
- el viaje;
- el lugar de partida;
- los detalles de todos los lugares del itinerario.

## Feature flag

`ChatTab` consulta capacidades al montar:

```ts
const capacidades = await getCapacidadesAsistente();
const habilitado = capacidades.habilitado;
```

Si está deshabilitado:
- se muestra un estado informativo;
- el textarea y el botón de envío quedan deshabilitados;
- se puede reintentar la consulta de capacidades.

## Errores

`ApiError` incluye `status` y `retryAfterSeconds`.

| Estado | Comportamiento |
|---|---|
| `400` | Muestra el mensaje del backend. |
| `403` | Avisa que solo el administrador puede aplicar. |
| `404` | Avisa que no se encontró el viaje/lugar/parada y ofrece recargar. |
| `409` | Avisa que el itinerario cambió y ofrece **Recargar itinerario**. |
| `429` | Muestra los segundos de `Retry-After` y permite reintentar. |
| otro | Mensaje genérico de error. |

En fallos de envío se restaura el texto del mensaje para facilitar el reintento.

## Tests

Archivo:

```text
src/features/viaje/components/panel/tabs/ChatTab.test.tsx
```

Cubre:

- envío y render de recomendaciones;
- advertencias;
- agregar parada y refrescar;
- reemplazar parada;
- ocultar acciones sin permiso;
- chat bloqueado por feature flag;
- `409` con botón de recarga;
- `429` con `Retry-After` y restauración del mensaje.

Comandos:

```powershell
npm run lint
npm test
npm run build
```

## Limitaciones actuales

- No hay detección de intención ni LLM en el frontend.
- El historial no se persiste.
- El selector de reemplazo usa las paradas del día actual.
- El refresco vuelve a pedir el viaje completo; no hay actualización optimista.
- La versión del itinerario debe venir del backend; si falta, se ocultan las acciones.

## Documentación relacionada

- Backend Itinerarios: `touringgo-itinerarios/docs/asistente-rag.md`.
- Backend Lugares: `touringgo-lugares/docs/benchmark-busqueda-semantica.md` y `embeddings-y-backfill.md`.
