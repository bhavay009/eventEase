import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black to-navy-900/80 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-gold-400 mb-3">EVENTEASE</div>
            <p className="text-sm text-gray-300">Premium event booking platform.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/events" className="elegant-underline text-gray-300 hover:text-white">Events</Link></li>
              <li><Link to="/dashboard" className="elegant-underline text-gray-300 hover:text-white">Dashboard</Link></li>
              <li><Link to="/login" className="elegant-underline text-gray-300 hover:text-white">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="elegant-underline text-gray-300 hover:text-white">About</a></li>
              <li><a href="#" className="elegant-underline text-gray-300 hover:text-white">Careers</a></li>
              <li><a href="#" className="elegant-underline text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Follow</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover-glow">✦</a>
              <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover-glow">✿</a>
              <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover-glow">✷</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} EventEase. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
