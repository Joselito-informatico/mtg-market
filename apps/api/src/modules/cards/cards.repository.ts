// Acceso a la API de Scryfall — con cache Redis obligatorio y retry con backoff
import axios, { type AxiosInstance } from 'axios'
import { getFromCache, setInCache, CACHE_TTL } from '../../lib/redis'
import { logger } from '../../lib/logger'
import { mapScryfallCard } from './cards.mapper'
import type { ScryfallApiCard, ScryfallSearchResponse } from './cards.repository.types'
import type { ScryfallCardDTO } from '@mtg-market/shared-types'
import crypto from 'crypto'

// Cliente Axios configurado para Scryfall
const scryfallClient: AxiosInstance = axios.create({
  baseURL: 'https://api.scryfall.com',
  timeout: 10_000,
  headers: {
    'Accept': 'application/json',
    // Scryfall pide identificar la aplicación en el User-Agent
    'User-Agent': 'MTGMarket/1.0 (contacto@mtgmarket.cl)',
  },
})

// Retry con backoff exponencial — respeta las reglas del proyecto (máx 3 intentos)
async function fetchWithRetry<T>(
  url: string,
  attempt = 1
): Promise<T> {
  try {
    const { data } = await scryfallClient.get<T>(url)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429 && attempt <= 3) {
      // Backoff exponencial: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000
      logger.warn('Scryfall 429 recibido, reintentando con backoff', { attempt, delay })
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchWithRetry<T>(url, attempt + 1)
    }
    throw error
  }
}

export async function findCardById(
  scryfallId: string
): Promise<ScryfallCardDTO | null> {
  const cacheKey = `scryfall:card:${scryfallId}`

  // Intentar cache primero
  const cached = await getFromCache<ScryfallCardDTO>(cacheKey)
  if (cached) {
    logger.debug('Cache hit — card', { scryfallId })
    return cached
  }

  try {
    const raw = await fetchWithRetry<ScryfallApiCard>(`/cards/${scryfallId}`)
    const card = mapScryfallCard(raw)

    // Guardar en cache con TTL de 24h
    await setInCache(cacheKey, card, CACHE_TTL.CARD)

    return card
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export interface SearchResult {
  cards: ScryfallCardDTO[]
  totalCards: number
  hasMore: boolean
}

export async function searchCards(params: {
  q: string
  format?: string
  color?: string
  page: number
}): Promise<SearchResult> {
  // Hash de los parámetros para la cache key
  const paramHash = crypto
    .createHash('md5')
    .update(JSON.stringify(params))
    .digest('hex')
  const cacheKey = `scryfall:search:${paramHash}`

  // Intentar cache primero
  const cached = await getFromCache<SearchResult>(cacheKey)
  if (cached) {
    logger.debug('Cache hit — search', { params })
    return cached
  }

  // Construir query para Scryfall
  let query = params.q
  if (params.format) query += ` format:${params.format}`
  if (params.color) query += ` color:${params.color}`

  const url = `/cards/search?q=${encodeURIComponent(query)}&page=${params.page}&order=name`

  try {
    const raw = await fetchWithRetry<ScryfallSearchResponse>(url)

    const result: SearchResult = {
      cards: raw.data.map(mapScryfallCard),
      totalCards: raw.total_cards,
      hasMore: raw.has_more,
    }

    // Guardar en cache con TTL de 15 min
    await setInCache(cacheKey, result, CACHE_TTL.SEARCH)

    return result
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Scryfall devuelve 404 cuando no hay resultados
      return { cards: [], totalCards: 0, hasMore: false }
    }
    throw error
  }
}