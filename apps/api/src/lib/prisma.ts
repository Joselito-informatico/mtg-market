import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  })

prisma.$on('error', (e) => {
  logger.error('Prisma error', { message: e.message, target: e.target })
})

prisma.$on('warn', (e) => {
  logger.warn('Prisma warning', { message: e.message, target: e.target })
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}