// Imagen de carta con fallback cuando Scryfall no devuelve imagen
import Image from 'next/image'
import type { ScryfallCardDTO } from '@mtg-market/shared-types'

interface CardImageProps {
  card: ScryfallCardDTO
  size?: 'small' | 'normal'
  className?: string
}

export function CardImage({ card, size = 'normal', className = '' }: CardImageProps) {
  const src = size === 'small'
    ? card.imageUris?.small
    : card.imageUris?.normal

  if (!src) {
    return (
      <div
        className={`bg-obsidian-700 flex items-center justify-center rounded-lg ${className}`}
        aria-label={`Imagen no disponible para ${card.name}`}
      >
        <span className="text-gold-400 font-display text-xs text-center px-2">{card.name}</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={card.name}
      fill
      className={`object-cover rounded-lg ${className}`}
      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
    />
  )
}