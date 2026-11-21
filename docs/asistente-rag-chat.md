# Asistente RAG — Frontend

Documentación del chat del asistente en la vista de viaje.

## Alcance

- Consulta de recomendaciones desde `ChatTab`.
- Render de lugares recomendados con motivo.
- Render de aclaraciones y envío de la opción elegida.
- Agregar o reemplazar paradas del itinerario actual.
- Manejo de permisos, feature flag y errores.
- Refresco del viaje después de aplicar cambios.

La intención se resuelve en el backend por reglas. El frontend envía el texto del usuario y renderiza recomendaciones o aclaraciones; no interpreta la intención por su cuenta.

## Archivos principales

| Archivo | Rol |
|---|---|
| `src/features/viaje/api/asistente.ts` | Llamadas al Gateway: consultar, aplicar y capacidades. |
| `src/features/viaje/types.ts` | Contratos del asistente, aclaraciones y `version` en `ItinerarioDto`. |
| `src/features/viaje/components/panel/tabs/ChatTab.tsx` | Estado del chat, recomendaciones, aclaraciones y acciones. |
| `src/features/viaje/components/panel/tabs/ChatTab.css` | Estilos de mensajes, tarjetas, aclaraciones y acciones. |
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
   - aclaración opcional;
   - advertencia opcional;
   - `puedeAplicar`.
7. Cada recomendación se renderiza con foto, rating, dirección y motivo.
8. Si hay aclaración, se renderizan sus opciones como botones.

## Aclaraciones

Cuando el backend no puede resolver la parada objetivo, devuelve:

```json
{
  "mensaje": "¿A cuál parada te referís?",
  "puedeAplicar": true,
  "recomendaciones": [],
  "accion": null,
  "aclaracion": {
    "pregunta": "¿A cuál parada te referís?",
    "opciones": [
      { "id": "uuid-parada-1", "etiqueta": "Café Uno (Mañana)" },
      { "id": "uuid-parada-2", "etiqueta": "Café Dos (Tarde)" }
    ]
  },
  "advertencia": null
}
```

Comportamiento del `ChatTab`:

- muestra las opciones como botones;
- al elegir una, oculta la aclaración;
- envía un mensaje de seguimiento con la etiqueta elegida;
- conserva el lugar nuevo del pedido original cuando existe un `por ...` o una frase después de coma.

Ejemplo:

```text
Original:  "Reemplazá el café por un bar"
Opción:    "Café Uno (Mañana)"
Seguimiento: "Reemplazá Café Uno (Mañana) por un bar"
```

El seguimiento se envía como un mensaje normal, por lo que pasa otra vez por la interpretación y la recuperación del backend.

## Flujo de aplicar

Cada tarjeta muestra acciones solo si:

- `puedeAplicar=true`;
- el asistente está habilitado;
- el itinerario actual tiene `version`.

El frontend sigue construyendo la acción al aplicar. El campo `accion` de la respuesta del backend es informativo y no se usa para aplicar en esta fase.

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
- aclaraciones y envío de la opción elegida;
- conservación del lugar nuevo al responder una aclaración;
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

- La intención se resuelve en backend por reglas; el frontend no la interpreta.
- El historial no se persiste.
- El seguimiento de una aclaración conserva el lugar nuevo de frases con `por ...` o después de coma; otras formulaciones pueden requerir reescribir el pedido.
- Si dos paradas tienen el mismo nombre y solo cambia el turno, el backend puede volver a pedir aclaración.
- El selector de reemplazo usa las paradas del día actual.
- El refresco vuelve a pedir el viaje completo; no hay actualización optimista.
- La versión del itinerario debe venir del backend; si falta, se ocultan las acciones.

## Documentación relacionada

- Backend Itinerarios: `touringgo-itinerarios/docs/asistente-rag.md`.
- Backend Lugares: `touringgo-lugares/docs/benchmark-busqueda-semantica.md` y `embeddings-y-backfill.md`.
