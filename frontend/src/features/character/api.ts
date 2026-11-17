import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type CharacterStats = {
  int: number
  str: number
  dex: number
  cha: number
}

export type Character = {
  name: string
  level: number
  totalXp: number
  xpIntoLevel: number
  xpForNextLevel: number
  isMaxLevel: boolean
  stats: CharacterStats
}

export const characterKeys = {
  detail: ['character'] as const,
}

export function useCharacter() {
  return useQuery({
    queryKey: characterKeys.detail,
    queryFn: () => api.get<Character>('/api/character'),
  })
}
