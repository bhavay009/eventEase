import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    // Unified Identity: All users belong to a single generic tier
    const result = await signup(name, email, password, 'attendee')

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Signup failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block group">
            <h1 className="text-4xl font-serif font-bold text-[#1a1410] tracking-tight mb-2 group-hover:text-[#b45309] transition-colors">
              Event Ease
            </h1>
            <span className="text-xs uppercase tracking-[0.3em] text-[#a69d96]">
              Theatre & Events
            </span>
          </Link>
          <h2 className="text-2xl font-serif mt-10 text-[#1a1410]">Join Event Ease</h2>
          <p className="text-[#a69d96] text-sm mt-2">Start your journey with amazing events</p>
        </div>

        {/* Minimal Form */}
        <div className="bg-white p-0">

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-[#a69d96] mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 transition-colors text-[#1a1410] placeholder-gray-300 font-serif text-lg"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-[#a69d96] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 transition-colors text-[#1a1410] placeholder-gray-300 font-serif text-lg"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-[#a69d96] mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 transition-colors text-[#1a1410] placeholder-gray-300 font-serif text-lg"
                  placeholder="••••••••"
                />
                <p className="mt-2 text-[10px] uppercase tracking-wide text-gray-400">At least 6 characters</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-2 border-red-500 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1a1410] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#b45309] transition-all disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-[#a69d96]">
                Already a member?{' '}
                <Link to="/login" className="font-bold text-[#1a1410] border-b border-[#1a1410] pb-0.5 hover:text-[#b45309] hover:border-[#b45309] transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
