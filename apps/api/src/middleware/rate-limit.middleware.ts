import rateLimit from 'express-rate-limit'
import { sendError } from '../lib/response'

// 100 req / 15 min — global
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'RATE_LIMIT_EXCEEDED', 'Demasiadas solicitudes, intenta más tarde')
  },
})

// 5 intentos / hora — auth
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'AUTH_RATE_LIMIT', 'Demasiados intentos de autenticación')
  },
})

// 30 req / min — proxy Scryfall
export const scryfallRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'SCRYFALL_RATE_LIMIT', 'Límite de búsquedas alcanzado, espera un momento')
  },
})