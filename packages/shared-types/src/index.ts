// ─── Enums (espejo de Prisma, para uso en el cliente) ───

export type Plan = 'FREE' | 'PREMIUM'
export type Condition = 'MINT' | 'NEAR_MINT' | 'EXCELLENT' | 'GOOD' | 'LIGHT_PLAYED' | 'PLAYED' | 'POOR'
export type Language = 'EN' | 'ES' | 'PT' | 'DE' | 'FR' | 'IT' | 'JA' | 'KO' | 'RU' | 'ZHS' | 'ZHT'
export type ListingStatus = 'ACTIVE' | 'INACTIVE' | 'SOLD'

// ─── Response envelope estándar ───

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  meta?: PaginationMeta
}

export interface ApiError {
  code: string
  message: string
  field?: string
}

export interface PaginationMeta {
  page: number
  total: number
  limit: number
}

// ─── DTOs de User ───

export interface UserPublicDTO {
  id: string
  username: string
  lgs?: string
  plan: Plan
  avatarUrl?: string
  // nombre/teléfono omitidos — respetar privacidad
}

export interface UserPrivateDTO extends UserPublicDTO {
  email: string
  name?: string
  phone?: string
  isPrivate: boolean
  createdAt: string
}

// ─── DTOs de Deck ───

export interface DeckDTO {
  id: string
  userId: string | null
  name: string
  format?: string
  description?: string
  isPublic: boolean
  cards: DeckCardDTO[]
  createdAt: string
  updatedAt: string
}

export interface DeckCardDTO {
  id: string
  scryfallId: string
  quantity: number
  isCommander: boolean
  isSideboard: boolean
}

// ─── DTOs de Collection ───

export interface CollectionEntryDTO {
  id: string
  scryfallId: string
  condition: Condition
  quantity: number
  foil: boolean
  language: Language
  createdAt: string
}

// ─── DTOs de Marketplace ───

export interface ListingDTO {
  id: string
  collectionId: string
  scryfallId: string
  priceUsd: string
  status: ListingStatus
  notes?: string
  seller: UserPublicDTO
  createdAt: string
}

// ─── Scryfall (solo lo que el backend expone al cliente) ───

export interface ScryfallCardDTO {
  id: string
  name: string
  imageUris?: {
    small: string
    normal: string
    large: string
    png: string
  }
  prices: {
    usd?: string
    usd_foil?: string
  }
  setName: string
  set: string
  collectorNumber: string
  rarity: string
  colors?: string[]
  colorIdentity: string[]
  typeLine: string
  oracleText?: string
  legalities: Record<string, string>
}