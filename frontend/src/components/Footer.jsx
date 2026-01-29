import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#1a1410] text-white border-t border-white/5 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <span className="text-2xl font-serif font-bold tracking-tight text-white group-hover:text-[#b45309] transition-colors">
                Event Ease
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-[#a69d96] mt-1">
                Theatre & Events
              </span>
            </Link>
            <p className="text-[#a69d96] text-sm leading-relaxed max-w-xs">
              Experience the underground culture with verified hosts and exclusive vibes. Your gateway to premium entertainment.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-[#a69d96]">
              <li><Link to="/events" className="hover:text-white transition-colors">All Events</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Categories</h4>
            <ul className="space-y-4 text-sm text-[#a69d96]">
              <li><Link to="/events?category=Theatre" className="hover:text-white transition-colors">Theatre</Link></li>
              <li><Link to="/events?category=Music" className="hover:text-white transition-colors">Music Concerts</Link></li>
              <li><Link to="/events?category=Comedy" className="hover:text-white transition-colors">Stand-up Comedy</Link></li>
              <li><Link to="/events?category=Workshops" className="hover:text-white transition-colors">Workshops</Link></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Stay Updated</h4>
            <p className="text-[#a69d96] text-sm mb-4">
              Subscribe for exclusive access to pre-sales and theatre news.
            </p>
            <div className="flex border-b border-[#a69d96]/30 pb-2">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 w-full px-0 py-1 text-sm font-serif"
              />
              <button className="text-xs font-bold uppercase tracking-widest text-[#b45309] hover:text-white transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[#a69d96] text-xs uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Event Ease. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
