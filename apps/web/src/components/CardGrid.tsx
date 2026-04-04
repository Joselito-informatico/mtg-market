// Grid de resultados de búsqueda de cartas
'use client'

import type { ScryfallCardDTO } from '@mtg-market/shared-types'
import { CardImage } from './CardImage'

interface CardGridProps {
  cards: ScryfallCardDTO[]
}

const RARITY_COLORS: Record<string, string> = {
  common:   'border-gray-500',
  uncommon: 'border-slate-300',
  rare:     'border-gold-400',
  mythic:   'border-orange-500',
  special:  'border-purple-400',
  bonus:    'border-pink-400',
}

const RARITY_LABELS: Record<string, string> = {
  common:   'C',
  uncommon: 'U',
  rare:     'R',
  mythic:   'M',
}

export function CardGrid({ cards }: CardGridProps) {
  return (
    <ul
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      aria-label="Resultados de búsqueda"
    >
      {cards.map((card, index) => (
        <li
          key={card.id}
          className="group animate-slide-up"
          style={{ animationDelay: `${Math.min(index * 40, 400)}ms`, animationFillMode: 'both' }}
        >
          <button
            className={`
              w-full text-left rounded-xl border-2 overflow-hidden
              bg-obsidian-800 hover:bg-obsidian-700
              transition-all duration-200 cursor-pointer
              hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-500/10
              focus-visible:ring-2 focus-visible:ring-gold-400
              ${RARITY_COLORS[card.rarity] ?? 'border-obsidian-600'}
            `}
            aria-label={`Ver carta ${card.name}`}
          >
            {/* Imagen de la carta */}
            <div className="relative aspect-[63/88] w-full">
              <CardImage card={card} size="normal" />
              {/* Badge de rareza */}
              <span className={`
                absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center
                text-[10px] font-display font-bold
                bg-obsidian-900/80 backdrop-blur-sm border
                ${RARITY_COLORS[card.rarity] ?? 'border-obsidian-600'}
              `}>
                {RARITY_LABELS[card.rarity] ?? '?'}
              </span>
            </div>

            {/* Info de la carta */}
            <div className="p-2.5">
              <p className="font-display text-xs font-semibold text-gray-100 leading-tight line-clamp-2">
                {card.name}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-body">{card.setName}</p>
              {card.prices.usd ? (
                <p className="text-[11px] text-gold-400 mt-1 font-semibold">
                  USD ${card.prices.usd}
                </p>
              ) : null}
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}