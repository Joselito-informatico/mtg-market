// Barra de búsqueda principal con filtros de formato y color
'use client'

import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (q: string) => void
  initialValue?: string
}

export function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim().length >= 2) onSearch(value.trim())
  }, [value, onSearch])

  const handleClear = useCallback(() => {
    setValue('')
    onSearch('')
  }, [onSearch])

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto"
      role="search"
      aria-label="Buscar cartas de Magic"
    >
      <label htmlFor="card-search" className="sr-only">
        Buscar cartas
      </label>

      {/* Ícono de búsqueda */}
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400 pointer-events-none"
        size={20}
        aria-hidden="true"
      />

      <input
        id="card-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar carta... (ej: Black Lotus, Counterspell)"
        autoComplete="off"
        className="
          w-full pl-12 pr-12 py-4
          bg-obsidian-800 border-2 border-obsidian-600
          rounded-xl font-body text-base text-gray-100
          placeholder:text-gray-500
          focus:outline-none focus:border-gold-400
          transition-colors duration-200
        "
      />

      {/* Botón limpiar */}
      {value.length > 0 ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-100 transition-colors cursor-pointer"
          aria-label="Limpiar búsqueda"
        >
          <X size={18} />
        </button>
      ) : null}
    </form>
  )
}