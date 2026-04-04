import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'MTG Market — Cartas Magic en Chile',
  description: 'Gestiona tu colección, construye mazos y compra o vende singles de Magic: The Gathering.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-obsidian-950 text-gray-100 font-body antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}