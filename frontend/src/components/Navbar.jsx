import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MagnifyingGlassIcon, MapPinIcon, TicketIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-50 bg-[#000000] border-b border-[#222] text-white transition-all duration-300 h-20"
    >
      <div className="max-w-[1400px] mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full gap-8">

          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <span className="text-2xl font-black uppercase tracking-tighter transition-colors duration-300">
              <span className="text-white group-hover:text-[#e6192b]">Event</span><span className="text-[#e6192b]">Ease</span>
            </span>
          </Link>

          {/* Center: E-Commerce Search Engine */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex items-center w-full bg-[#111111] border border-[#333] rounded-full px-2 py-1.5 focus-within:border-[#e6192b] focus-within:bg-[#1a1a1a] transition-all hover:bg-[#151515]">
              <div className="pl-3 pr-2 text-gray-500">
                <MagnifyingGlassIcon className="w-5 h-5 pointer-events-none" />
              </div>
              <input 
                type="text" 
                placeholder="Search for artists, venues, and events..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 font-bold"
              />
              <div className="hidden lg:flex items-center pl-4 pr-3 py-1 border-l border-[#333] ml-2 text-gray-400 hover:text-white cursor-pointer transition-colors group">
                <MapPinIcon className="w-4 h-4 mr-1.5 group-hover:text-[#e6192b]" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Pune</span>
                <ChevronDownIcon className="w-3 h-3 ml-2" />
              </div>
            </div>
          </div>

          {/* Right Section: Utilities & Auth */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            
            {/* Global E-Commerce Links */}
            <div className="hidden lg:flex items-center space-x-6 mr-4 border-r border-[#333] pr-6">
              <Link to="/events" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                All Events
              </Link>
              <Link to="/events?tab=local" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                Local Kickbacks
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                {/* E-Commerce Host CTA */}
                <Link to="/host" className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.2em] text-[#e6192b] border border-[#e6192b]/30 px-5 py-2 rounded-full hover:bg-[#e6192b] hover:text-white transition-all shadow-md shadow-red-900/10 whitespace-nowrap">
                  Host Network
                </Link>

                {/* Profile Interactive Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 hover:bg-[#111] p-2 rounded-full border border-transparent hover:border-[#333] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="hidden md:block text-xs font-bold text-white uppercase tracking-widest">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDownIcon className="hidden md:block w-3 h-3 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-[#111111] border border-[#333] rounded-xl shadow-2xl py-2 overflow-hidden"
                      >
                        <div className="px-5 py-3 border-b border-[#222] mb-1">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Signed In As</p>
                          <p className="text-sm font-black text-white truncate">{user?.email}</p>
                        </div>
                        
                        <Link to="/dashboard" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-300 hover:bg-[#1a1a1a] hover:text-[#e6192b] transition-colors">
                          <TicketIcon className="w-4 h-4" /> My Vault
                        </Link>
                        
                        <Link to="/host" onClick={() => setShowProfileMenu(false)} className="sm:hidden flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-300 hover:bg-[#1a1a1a] hover:text-[#e6192b] transition-colors border-t border-[#222]">
                          <span>Host Network</span>
                        </Link>

                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors border-t border-[#222] border-opacity-50 mt-1">
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="text-[10px] font-bold bg-[#e6192b] text-white px-5 py-2 rounded-full uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap shadow-[0_0_10px_rgba(230,25,43,0.3)]">
                  Register
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
