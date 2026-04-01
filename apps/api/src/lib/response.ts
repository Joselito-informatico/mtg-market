import type { Response } from 'express'
import type { ApiResponse, ApiError, PaginationMeta } from '@mtg-market/shared-types'

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta
): void {
  const response: ApiResponse<T> = { data, error: null, ...(meta && { meta }) }
  res.status(statusCode).json(response)
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  field?: string
): void {
  const error: ApiError = { code, message, ...(field && { field }) }
  const response: ApiResponse<null> = { data: null, error }
  res.status(statusCode).json(response)
}