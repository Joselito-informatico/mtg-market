// Hook de búsqueda de cartas — conecta con /api/v1/cards/search
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import type { ScryfallCardDTO, PaginationMeta } from '@mtg-market/shared-types'

interface UseCardSearchParams {
  q: string
  format?: string
  color?: string
  page?: number
}

interface CardSearchResult {
  cards: ScryfallCardDTO[]
  meta: PaginationMeta | undefined
}

export function useCardSearch({ q, format, color, page = 1 }: UseCardSearchParams) {
  return useQuery<CardSearchResult>({
    // La query se invalida automáticamente cuando cambian los parámetros
    queryKey: ['cards', 'search', { q, format, color, page }],
    queryFn: async () => {
      const response = await apiFetch<ScryfallCardDTO[]>('/api/v1/cards/search', {
        q,
        ...(format && { format }),
        ...(color && { color }),
        page,
      })

      return {
        cards: response.data ?? [],
        meta: response.meta,
      }
    },
    // Solo buscar cuando hay al menos 2 caracteres
    enabled: q.trim().length >= 2,
    placeholderData: (prev) => prev,
  })
}