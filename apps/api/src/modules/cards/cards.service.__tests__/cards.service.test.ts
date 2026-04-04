// Tests unitarios del servicio de cartas
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCardById, searchCardsCatalog } from '../cards.service'
import * as repository from '../cards.repository'

// Mock del repository completo
vi.mock('../cards.repository')

const mockCard = {
  id: '5f8287b1-5bb6-5f4c-ad8f-e6168a3d9f6a',
  name: 'Black Lotus',
  prices: { usd: '50000.00' },
  setName: 'Limited Edition Alpha',
  set: 'lea',
  collectorNumber: '232',
  rarity: 'rare',
  colorIdentity: [],
  typeLine: 'Artifact',
  legalities: { vintage: 'restricted' },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getCardById', () => {
  it('retorna la carta cuando existe en Scryfall', async () => {
    vi.mocked(repository.findCardById).mockResolvedValue(mockCard)

    const result = await getCardById(mockCard.id)

    expect(result).toEqual(mockCard)
    expect(repository.findCardById).toHaveBeenCalledWith(mockCard.id)
  })

  it('retorna null cuando la carta no existe', async () => {
    vi.mocked(repository.findCardById).mockResolvedValue(null)

    const result = await getCardById('00000000-0000-0000-0000-000000000000')

    expect(result).toBeNull()
  })
})

describe('searchCardsCatalog', () => {
  it('retorna resultados y paginación correctamente', async () => {
    vi.mocked(repository.searchCards).mockResolvedValue({
      cards: [mockCard],
      totalCards: 1,
      hasMore: false,
    })

    const result = await searchCardsCatalog({ q: 'Black Lotus', page: 1 })

    expect(result.cards).toHaveLength(1)
    expect(result.totalCards).toBe(1)
    expect(result.page).toBe(1)
  })

  it('retorna vacío cuando no hay resultados', async () => {
    vi.mocked(repository.searchCards).mockResolvedValue({
      cards: [],
      totalCards: 0,
      hasMore: false,
    })

    const result = await searchCardsCatalog({ q: 'xxxxxx', page: 1 })

    expect(result.cards).toHaveLength(0)
  })
})