import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { env } from '../config/env'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.FRONTEND_URL],
  emailAndPassword: {
    enabled: true,
    // Nunca exponer si el email ya existe (previene user enumeration)
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,        // 7 días
    updateAge: 60 * 60 * 24,             // Renovar si tiene más de 1 día
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,                    // Cache de cookie: 5 minutos
    },
  },
})