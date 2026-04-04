// Schemas de validación para los endpoints de cards
import { z } from 'zod'

// Parámetros de búsqueda de cartas
export const searchCardsSchema = z.object({
  q: z.string().min(2, 'La búsqueda debe tener al menos 2 caracteres').max(200),
  format: z.string().optional(),
  color: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
})

// Parámetro de ID en la ruta
export const cardIdSchema = z.object({
  scryfallId: z.string().uuid('scryfallId debe ser un UUID válido'),
})

export type SearchCardsQuery = z.infer<typeof searchCardsSchema>
export type CardIdParams = z.infer<typeof cardIdSchema>