import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const { isAuthenticated, user, logout, isOrganizer, isCustomer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight">EVENTEASE®</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-gold-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                to="/events"
                className={`text-sm font-medium transition-colors ${
                  isActive('/events') || location.pathname.startsWith('/events/')
                    ? 'text-gold-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Events
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-gold-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Center Section - Location and Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>📍</span>
              <span>India</span>
            </div>
            {isOrganizer && (
              <Link
                to="/admin/events"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Create Listings
              </Link>
            )}
            <Link
              to="/events"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Browse Events
            </Link>
          </div>

          {/* Right Section - Search and Auth */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block p-2 text-gray-400 hover:text-white transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
