// Rutas del módulo cards — proxy Scryfall con rate limit específico
import { Router, type Request, type Response } from 'express'
import { scryfallRateLimiter } from '../../middleware/rate-limit.middleware'
import { searchCardsSchema, cardIdSchema } from './cards.schema'
import { getCardById, searchCardsCatalog } from './cards.service'
import { sendSuccess, sendError } from '../../lib/response'
import { logger } from '../../lib/logger'

const router = Router()

// Todas las rutas de cards usan el rate limiter específico de Scryfall
router.use(scryfallRateLimiter)

/**
 * GET /api/v1/cards/search?q=&format=&color=&page=
 * Búsqueda de cartas via Scryfall con cache Redis
 */
router.get('/search', async (req: Request, res: Response) => {
  const parsed = searchCardsSchema.safeParse(req.query)

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    sendError(res, 400, 'VALIDATION_ERROR', firstError?.message ?? 'Parámetros inválidos', firstError?.path[0]?.toString())
    return
  }

  try {
    const result = await searchCardsCatalog(parsed.data)

    sendSuccess(
      res,
      result.cards,
      200,
      {
        page: result.page,
        total: result.totalCards,
        limit: 175, // Scryfall devuelve hasta 175 resultados por página
      }
    )
  } catch (error) {
    logger.error('Error en búsqueda de cartas', { error, query: req.query })
    sendError(res, 502, 'SCRYFALL_ERROR', 'Error al conectar con Scryfall')
  }
})

/**
 * GET /api/v1/cards/:scryfallId
 * Obtiene una carta por su UUID de Scryfall
 */
router.get('/:scryfallId', async (req: Request, res: Response) => {
  const parsed = cardIdSchema.safeParse(req.params)

  if (!parsed.success) {
    sendError(res, 400, 'VALIDATION_ERROR', 'scryfallId debe ser un UUID válido', 'scryfallId')
    return
  }

  try {
    const card = await getCardById(parsed.data.scryfallId)

    if (!card) {
      sendError(res, 404, 'CARD_NOT_FOUND', 'Carta no encontrada')
      return
    }

    sendSuccess(res, card)
  } catch (error) {
    logger.error('Error al obtener carta', { error, scryfallId: req.params.scryfallId })
    sendError(res, 502, 'SCRYFALL_ERROR', 'Error al conectar con Scryfall')
  }
})

export { router as cardsRoutes }