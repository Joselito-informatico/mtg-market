// Tipos crudos de la API de Scryfall — solo para uso interno del repository

export interface ScryfallApiCard {
  id: string
  name: string
  image_uris?: {
    small: string
    normal: string
    large: string
    png: string
  }
  card_faces?: Array<{
    image_uris?: {
      small: string
      normal: string
      large: string
      png: string
    }
  }>
  prices: {
    usd?: string | null
    usd_foil?: string | null
  }
  set_name: string
  set: string
  collector_number: string
  rarity: string
  colors?: string[]
  color_identity: string[]
  type_line: string
  oracle_text?: string
  legalities: Record<string, string>
}

export interface ScryfallSearchResponse {
  object: string
  total_cards: number
  has_more: boolean
  next_page?: string
  data: ScryfallApiCard[]
}