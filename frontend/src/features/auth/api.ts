import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, isUnauthorized } from '@/lib/api'

export type Me = {
  userId: string
  email: string
}

export type LoginInput = { email: string; password: string }
export type RegisterInput = { email: string; password: string; characterName: string }

export const authKeys = {
  me: ['auth', 'me'] as const,
}

/** ログイン中のユーザー。未ログインなら null。 */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        return await api.get<Me>('/api/auth/me')
      } catch (error) {
        if (isUnauthorized(error)) return null
        throw error
      }
    },
    staleTime: Infinity,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LoginInput) => api.post<Me>('/api/auth/login', input),
    onSuccess: (me) => {
      queryClient.clear()
      queryClient.setQueryData(authKeys.me, me)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RegisterInput) => api.post<Me>('/api/auth/register', input),
    onSuccess: (me) => {
      queryClient.clear()
      queryClient.setQueryData(authKeys.me, me)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post<void>('/api/auth/logout'),
    onSuccess: () => {
      // 前のユーザーのデータが残らないよう、キャッシュをすべて消す
      queryClient.clear()
      queryClient.setQueryData(authKeys.me, null)
    },
  })
}
