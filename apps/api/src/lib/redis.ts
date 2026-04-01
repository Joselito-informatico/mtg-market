import { Redis } from '@upstash/redis'
import { env } from '../config/env'
import { logger } from './logger'

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

// TTLs definidos según las reglas del proyecto
export const CACHE_TTL = {
  CARD: 60 * 60 * 24,       // 24 horas
  PRICE: 60 * 60,            // 1 hora
  SEARCH: 60 * 15,           // 15 minutos
} as const

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key)
  } catch (error) {
    logger.warn('Redis get falló, continuando sin cache', { key, error })
    return null
  }
}

export async function setInCache(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds })
  } catch (error) {
    logger.warn('Redis set falló, continuando sin cache', { key, error })
  }
}