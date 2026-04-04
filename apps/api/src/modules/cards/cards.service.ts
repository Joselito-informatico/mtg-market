// Capa de servicio — lógica de negocio para el módulo de cartas
import { findCardById, searchCards, type SearchResult } from './cards.repository'
import { logger } from '../../lib/logger'
import type { ScryfallCardDTO } from '@mtg-market/shared-types'

export async function getCardById(
  scryfallId: string
): Promise<ScryfallCardDTO | null> {
  logger.debug('Buscando carta por ID', { scryfallId })
  return findCardById(scryfallId)
}

export interface SearchCardsResult extends SearchResult {
  page: number
}

export async function searchCardsCatalog(params: {
  q: string
  format?: string
  color?: string
  page: number
}): Promise<SearchCardsResult> {
  logger.debug('Búsqueda de cartas', { params })

  const result = await searchCards(params)

  return {
    ...result,
    page: params.page,
  }
}