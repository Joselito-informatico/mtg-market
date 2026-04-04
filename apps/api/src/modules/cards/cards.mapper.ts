// Transforma la respuesta cruda de Scryfall al DTO que expone la API
import type { ScryfallCardDTO } from '@mtg-market/shared-types'
import type { ScryfallApiCard } from './cards.repository.types'

export function mapScryfallCard(raw: ScryfallApiCard): ScryfallCardDTO {
  // Maneja cartas con dos caras (double-faced) que no tienen image_uris en el nivel raíz
  const imageUris = raw.image_uris ?? raw.card_faces?.[0]?.image_uris

  return {
    id: raw.id,
    name: raw.name,
    ...(imageUris && {
      imageUris: {
        small: imageUris.small,
        normal: imageUris.normal,
        large: imageUris.large,
        png: imageUris.png,
      },
    }),
    prices: {
      usd: raw.prices.usd ?? undefined,
      usd_foil: raw.prices.usd_foil ?? undefined,
    },
    setName: raw.set_name,
    set: raw.set,
    collectorNumber: raw.collector_number,
    rarity: raw.rarity,
    colors: raw.colors,
    colorIdentity: raw.color_identity,
    typeLine: raw.type_line,
    oracleText: raw.oracle_text,
    legalities: raw.legalities,
  }
}