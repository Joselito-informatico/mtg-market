// Pantalla principal — búsqueda de cartas y catálogo
'use client'

import { useState, useCallback } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { CardGrid } from '@/components/CardGrid'
import { useCardSearch } from '@/hooks/useCardSearch'
import { Loader2, Frown, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [query, setQuery] = useState('')

  const { data, isFetching, isError } = useCardSearch({ q: query })

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
  }, [])

  const hasResults = (data?.cards?.length ?? 0) > 0
  const isEmpty = query.trim().length >= 2 && !isFetching && !hasResults && !isError

  return (
    <main className="min-h-screen bg-obsidian-950">

      {/* Hero header */}
      <header className="relative pt-20 pb-14 px-4 text-center overflow-hidden">
        {/* Fondo decorativo */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 0%, #fbbf24 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-display text-gold-400 text-sm tracking-[0.3em] uppercase mb-3 animate-fade-in">
            Magic: The Gathering
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-gray-50 leading-tight mb-4 animate-slide-up">
            MTG Market
          </h1>
          <p className="font-body text-lg text-gray-400 max-w-xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '80ms' }}>
            Busca cartas, gestiona tu colección y compra o vende singles en Chile.
          </p>

          {/* Barra de búsqueda */}
          <div className="animate-slide-up" style={{ animationDelay: '160ms' }}>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Sugerencias rápidas */}
          {query.length === 0 ? (
            <div className="flex flex-wrap gap-2 justify-center mt-4 animate-fade-in" style={{ animationDelay: '240ms' }}>
              {['Lightning Bolt', 'Counterspell', 'Sol Ring', 'Black Lotus', 'Force of Will'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="
                    px-3 py-1.5 rounded-lg text-xs font-body
                    bg-obsidian-800 border border-obsidian-600 text-gray-400
                    hover:border-gold-400 hover:text-gold-400
                    transition-colors duration-200 cursor-pointer
                  "
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {/* Contenido principal */}
      <section className="max-w-7xl mx-auto px-4 pb-20">

        {/* Loading */}
        {isFetching ? (
          <div className="flex flex-col items-center gap-3 py-20 text-gold-400" role="status" aria-live="polite">
            <Loader2 className="animate-spin" size={32} />
            <span className="font-body text-gray-400">Buscando en Scryfall...</span>
          </div>
        ) : null}

        {/* Error */}
        {isError && !isFetching ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center" role="alert">
            <Frown className="text-red-400" size={32} />
            <p className="font-body text-gray-400">Error al conectar con el servidor.</p>
            <p className="text-sm text-gray-500">Verifica que la API esté corriendo en el puerto 3001.</p>
          </div>
        ) : null}

        {/* Sin resultados */}
        {isEmpty ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center" aria-live="polite">
            <Frown className="text-gray-500" size={32} />
            <p className="font-body text-gray-400">No se encontraron cartas para "{query}".</p>
          </div>
        ) : null}

        {/* Estado inicial — sin búsqueda */}
        {query.trim().length === 0 && !isFetching ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center animate-fade-in">
            <Sparkles className="text-obsidian-600" size={40} aria-hidden="true" />
            <p className="font-body text-gray-500 text-lg">
              Busca cualquier carta de Magic para comenzar.
            </p>
          </div>
        ) : null}

        {/* Resultados */}
        {hasResults && !isFetching ? (
          <div>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-sm tracking-widest text-gray-500 uppercase">
                Resultados para <span className="text-gold-400">"{query}"</span>
              </h2>
              {data?.meta ? (
                <span className="text-xs text-gray-600 font-body">
                  {data.meta.total.toLocaleString()} cartas encontradas
                </span>
              ) : null}
            </div>
            <CardGrid cards={data?.cards ?? []} />
          </div>
        ) : null}

      </section>
    </main>
  )
}