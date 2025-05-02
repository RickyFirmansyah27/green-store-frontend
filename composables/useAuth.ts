import { useRouter } from 'vue-router'
import { ref } from 'vue'

export const useAuth = () => {
  const router = useRouter()
  const token = ref<string | null>(null)
  const user = ref<any>(null)

  const login = async (email: string, password: string) => {
    try {
      if (email === 'owner@gmail.com' && password === 'owner123') {
        const demoToken = 'demo-token-123'
        token.value = demoToken
        user.value = { 
          id: 1, 
          email, 
          name: 'Admin User' 
        }
        localStorage.setItem('token', demoToken)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      user.value = { id: 1, email: 'owner@gmail.com', name: 'Admin User' }
      return true
    }
    return false
  }
  

  const register = async (name: string, email: string, password: string) => {
    try {
      if (email && password) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return true
      }
      return false
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  return {
    token,
    user,
    login,
    logout,
    checkAuth,
    register
  }
}