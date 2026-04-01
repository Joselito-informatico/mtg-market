import type { Request, Response, NextFunction } from 'express'
import { logger } from '../lib/logger'
import { sendError } from '../lib/response'

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error no manejado', {
    message: error.message,
    stack: error.stack,
  })

  sendError(res, 500, 'INTERNAL_ERROR', 'Error interno del servidor')
}