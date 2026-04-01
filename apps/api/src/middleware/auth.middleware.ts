import type { Request, Response, NextFunction } from 'express'
import { auth } from '../lib/auth'
import { sendError } from '../lib/response'

// Extiende el tipo Request para agregar el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        username: string
      }
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    })

    if (!session?.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Autenticación requerida')
      return
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      username: (session.user as { username?: string }).username ?? '',
    }

    next()
  } catch {
    sendError(res, 401, 'UNAUTHORIZED', 'Sesión inválida')
  }
}