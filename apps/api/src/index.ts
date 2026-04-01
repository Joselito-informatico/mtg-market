import { app } from './app'
import { env } from './config/env'
import { logger } from './lib/logger'
import { prisma } from './lib/prisma'

async function bootstrap(): Promise<void> {
  // Verificar conexión a la DB antes de exponer el servidor
  await prisma.$connect()
  logger.info('Conexión a PostgreSQL establecida')

  const port = parseInt(env.PORT, 10)

  app.listen(port, () => {
    logger.info(`API corriendo en http://localhost:${port}`)
    logger.info(`Entorno: ${env.NODE_ENV}`)
  })
}

bootstrap().catch((error) => {
  logger.error('Error fatal al iniciar el servidor', { error })
  process.exit(1)
})