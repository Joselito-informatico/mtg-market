import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import { toNodeHandler } from 'better-auth/node'
import { env } from './config/env'
import { globalRateLimiter } from './middleware/rate-limit.middleware'
import { errorMiddleware } from './middleware/error.middleware'
import { apiRoutes } from './routes'
import { auth } from './lib/auth'

const app = express()

// Seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'https://cards.scryfall.io', 'https://svgs.scryfall.io'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}))

// CORS — solo permite el frontend configurado
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

app.use(compression())
app.use(express.json({ limit: '10kb' }))

// Rate limit global
app.use(globalRateLimiter)

// Better Auth maneja sus propias rutas bajo /api/auth/*
app.all('/api/auth/*', toNodeHandler(auth))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rutas de la API
app.use('/api/v1', apiRoutes)

// Manejador de errores — siempre al final
app.use(errorMiddleware)

export { app }