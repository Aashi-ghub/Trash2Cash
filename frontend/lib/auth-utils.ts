// Token management utilities
const TOKEN_KEY = 'trash2cash_token'
const USER_KEY = 'trash2cash_user'

export interface StoredUser {
  id: string
  email: string
  name: string
  role: "user" | "host" | "admin"
  points: number
}

export const tokenUtils = {
  // Store JWT token
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
    }
  },

  // Get JWT token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  },

  // Remove JWT token
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  // Store user data
  setUser: (user: StoredUser) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  },

  // Get user data
  getUser: (): StoredUser | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY)
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          return null
        }
      }
    }
    return null
  },

  // Remove user data
  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY)
    }
  },

  // Clear all auth data
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = tokenUtils.getToken()
    const user = tokenUtils.getUser()
    return !!(token && user)
  },

  // Get auth headers for API requests
  getAuthHeaders: (): Record<string, string> => {
    const token = tokenUtils.getToken()
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    return {
      'Content-Type': 'application/json'
    }
  }
}
