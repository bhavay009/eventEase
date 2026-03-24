import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const { user } = useAuth()
  const isOrganizer = user && (user.role === 'organizer' || user.role === 'admin')

  return (
    <footer className="bg-[#000000] text-gray-500 border-t border-[#222] pt-8 pb-4 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #e6192b 0%, transparent 60%)' }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 mb-6">
          
          {/* Brand - Span 5 */}
          <div className="md:col-span-5 pr-8">
            <Link to={isOrganizer ? "/host" : "/"} className="inline-block group mb-4">
              <span className="text-3xl font-black uppercase text-white tracking-tighter transition-colors">EventEase</span>
              <span className="block text-[10px] uppercase tracking-[0.4em] text-[#e6192b] mt-1 font-bold group-hover:text-white transition-colors">
                {isOrganizer ? "Organizer Console" : "Live Network"}
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm font-bold tracking-wide">
              {isOrganizer 
                ? "The premier platform for deploying secure ticketing instances. Monitor your attendees, scale your reach, and execute flawlessly."
                : "Curating the most volatile and exclusive live entertainment grids. Global infrastructure for unforgettable nights."}
            </p>
          </div>

          {/* Links - Span 3 each */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#e6192b] mb-4">Platform</h4>
            {isOrganizer ? (
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link to="/host" className="hover:text-white hover:translate-x-1 inline-block transition-all">Command Center</Link></li>
                <li><Link to="/host" className="hover:text-white hover:translate-x-1 inline-block transition-all">Deploy Flow</Link></li>
                <li><Link to="/host" className="hover:text-white hover:translate-x-1 inline-block transition-all">Escrow Routing</Link></li>
                <li><Link to="/profile" className="hover:text-white hover:translate-x-1 inline-block transition-all">Configurations</Link></li>
              </ul>
            ) : (
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link to="/events" className="hover:text-white hover:translate-x-1 inline-block transition-all">Live Grid</Link></li>
                <li><Link to="/host" className="hover:text-white hover:translate-x-1 inline-block transition-all">Host Console</Link></li>
                <li><Link to="/events?category=local" className="text-[#e6192b] hover:text-white hover:translate-x-1 inline-block transition-all">Kickback Flow</Link></li>
                <li><Link to="/dashboard" className="hover:text-white hover:translate-x-1 inline-block transition-all">My Vault</Link></li>
              </ul>
            )}
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#e6192b] mb-4">
              {isOrganizer ? "Resources" : "Grid Categories"}
            </h4>
            {isOrganizer ? (
               <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                 <li><Link to="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Secure Protocols</Link></li>
                 <li><Link to="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Venue Guidelines</Link></li>
                 <li><Link to="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Support Terminal</Link></li>
                 <li><Link to="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Live API Keys</Link></li>
               </ul>
            ) : (
               <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                 <li><Link to="/events?curated=theatre" className="hover:text-white hover:translate-x-1 inline-block transition-all">Arenas</Link></li>
                 <li><Link to="/events?curated=music" className="hover:text-white hover:translate-x-1 inline-block transition-all">Festivals</Link></li>
                 <li><Link to="/events?curated=comedy" className="hover:text-white hover:translate-x-1 inline-block transition-all">Comedy Clubs</Link></li>
                 <li><Link to="/events?curated=workshops" className="hover:text-white hover:translate-x-1 inline-block transition-all">Underground Sets</Link></li>
               </ul>
            )}
          </div>

        </div>
        {/* Bottom Bar */}
        <div className="pt-4 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            © {new Date().getFullYear()} EventEase Live Network. All rights reserved.
          </p>
          <div className="flex space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
