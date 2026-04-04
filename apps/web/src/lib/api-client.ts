// Cliente HTTP centralizado — todas las llamadas a la API pasan por aquí
import axios from 'axios'
import type { ApiResponse } from '@mtg-market/shared-types'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper tipado para extraer datos del envelope { data, error, meta }
export async function apiFetch<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  const { data } = await apiClient.get<ApiResponse<T>>(url, { params })
  return data
}

export { apiClient }