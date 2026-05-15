// ==================== AUTH STORE ====================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { authApi } from '@/services/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      login: async (email, password) => {
        const response = await authApi.login(email, password)
        const { user, token, refreshToken } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        set({ user, isAuthenticated: true, token })
      },

      register: async (data) => {
        const response = await authApi.register(data)
        const { user, token, refreshToken } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        set({ user, isAuthenticated: true, token })
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        set({ user: null, isAuthenticated: false, token: null })
        window.location.href = '/login'
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            set({ isLoading: false })
            return
          }
          const response = await authApi.me()
          set({ user: response.data, isAuthenticated: true, isLoading: false, token })
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          set({ user: null, isAuthenticated: false, isLoading: false, token: null })
        }
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'lyo-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
)
