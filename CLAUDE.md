# TCG Market — CLAUDE.md

Lee siempre TCG-Market-Proyecto.md antes de responder.

## Reglas absolutas

- Capas: Route → Service → Repository. Nunca saltear.
- scryfallId ÚNICO en DB. Nunca nombres/texto/imágenes de cartas.
- Cache Redis obligatorio para toda llamada a Scryfall.
- Response envelope: { data, error, meta } siempre.
- TypeScript strict. Cero `any`. Cero `console.log`.
- Variables/funciones/archivos en inglés. Comentarios en español.
