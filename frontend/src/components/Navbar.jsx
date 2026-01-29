import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { isAuthenticated, user, logout, isOrganizer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-50 glass text-white transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">

          {/* Logo - Serif & Elegant */}
          <Link to="/" className="flex flex-col items-start group">
            <span className="text-2xl font-serif font-bold tracking-tight text-white group-hover:text-primary-400 transition-colors duration-300">
              Event Ease
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors duration-300">
              Theatre & Events
            </span>
          </Link>

          {/* Center Navigation - Minimal Text links */}
          <div className="hidden md:flex items-center space-x-12">
            <Link to="/events" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:text-glow transition-all duration-300">
              Tickets & Events
            </Link>
            <Link to="/categories" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:text-glow transition-all duration-300">
              Calendar
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:text-glow transition-all duration-300">
                My Dashboard
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-8">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider hidden sm:block">
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="text-xs font-bold text-[#b45309] uppercase tracking-widest hover:text-white transition-colors duration-300">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#b45309] transition-colors duration-300">
                  Login
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
