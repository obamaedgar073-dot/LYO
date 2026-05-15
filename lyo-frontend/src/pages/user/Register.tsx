import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '' })
  const { register } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(form)
      window.location.href = '/'
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-lyo-dark">
      <div className="bg-white dark:bg-lyo-card p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">Create Account</h1>
          <p className="text-gray-500">Join LYO today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
          <input
            placeholder="Display Name"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
          <button
            type="submit"
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
