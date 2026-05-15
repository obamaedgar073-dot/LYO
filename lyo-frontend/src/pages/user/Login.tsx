import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      window.location.href = '/'
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-lyo-dark">
      <div className="bg-white dark:bg-lyo-card p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">Welcome to LYO</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
          <button
            type="submit"
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          Don't have an account? <Link to="/register" className="text-primary-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
