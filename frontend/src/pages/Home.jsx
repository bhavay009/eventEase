import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPinIcon, CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const [events, setEvents] = useState([])
  const [hostEvents, setHostEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [hostLoading, setHostLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All')
  const [uspIndex, setUspIndex] = useState(0)
  const uspPhrases = ['LOCAL HOUSE PARTIES', 'CURATED KICKBACKS', 'LIVE EXPERIENCES', 'UNDERGROUND SETS']

  const navigate = useNavigate()
  const { isAuthenticated, isOrganizer, isAdmin } = useAuth()

  useEffect(() => {
    const interval = setInterval(() => {
      setUspIndex(prev => (prev + 1) % uspPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && (isOrganizer || isAdmin)) {
      navigate('/host')
    }
  }, [isAuthenticated, isOrganizer, isAdmin, navigate])

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchEvents()
    fetchHostEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/events?limit=24`)
      const data = await response.json()
      if (data.success) setEvents(data.events)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHostEvents = async () => {
    try {
      setHostLoading(true)
      const response = await fetch(`${API_URL}/api/events?source=database&limit=10`)
      const data = await response.json()
      if (data.success) setHostEvents(data.events)
    } catch (error) {
      console.error('Error fetching host events:', error)
    } finally {
      setHostLoading(false)
    }
  }

  const getDateParts = (dateString) => {
    const date = new Date(dateString)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
  }

  const nextSlide = () => setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1))
  const prevSlide = () => setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1))
  const getIndex = (idx) => {
    if (idx < 0) return events.length + idx
    if (idx >= events.length) return idx - events.length
    return idx
  }

  const featuredEvent = events[activeIndex]
  const prevEvent = events[getIndex(activeIndex - 1)]
  const nextEvent = events[getIndex(activeIndex + 1)]

  const filteredEvents = events.filter(e => {
    if (activeCategory === 'All') return true;
    const cat = e.category?.toLowerCase() || '';
    if (activeCategory === 'Live Music') return cat.includes('music') || cat.includes('concert') || cat.includes('festival') || cat.includes('electronic');
    if (activeCategory === 'Standup Comedy') return cat.includes('comedy');
    if (activeCategory === 'Theatre & Arts') return cat.includes('theatre') || cat.includes('art');
    if (activeCategory === 'Tech Workshops') return cat.includes('workshop') || cat.includes('tech');
    if (activeCategory === 'Nightlife') return cat.includes('house') || cat.includes('party') || cat.includes('night') || cat.includes('kickback');
    if (activeCategory === 'Networking') return cat.includes('network') || cat.includes('meet');
    if (activeCategory === 'Sports') return cat.includes('sport') || cat.includes('game');
    if (activeCategory === 'Concerts') return cat.includes('concert');
    return cat.includes(activeCategory.toLowerCase());
  })

  // USP: Local Parties — Uses the dedicated hostEvents stream
  const displayLocalEvents = hostEvents.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-white">

      {/* HERO SECTION */}
      <section className="relative bg-black pt-32 pb-48 px-6 min-h-[85vh] flex flex-col justify-center border-b border-[#222]">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            src="/hero-bg-v2.png"
            alt="Background Atmosphere"
            className="w-full h-full object-cover opacity-30 grayscale-[50%]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black opacity-90" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 -translate-y-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[10px] font-bold tracking-[0.4em] text-[#e6192b] uppercase mb-4"
          >
            • THE LIVE ENTERTAINMENT NETWORK •
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="font-black mb-4 tracking-tighter uppercase drop-shadow-2xl leading-tight text-white flex flex-col items-center w-full"
          >
            <span className="text-3xl md:text-5xl lg:text-6xl mb-2">DISCOVER</span>
            <div className="relative flex justify-center w-full h-[60px] md:h-[80px] lg:h-[100px] mt-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={uspIndex}
                  initial={{ y: 40, opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ y: -40, opacity: 0, scale: 1.1, filter: "blur(8px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute text-[#e6192b] text-2xl sm:text-3xl md:text-5xl lg:text-6xl w-full text-center whitespace-nowrap"
                >
                  {uspPhrases[uspIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 font-medium max-w-2xl mx-auto mb-10 text-sm tracking-wide mt-6"
          >
             Discover the underground. Gain access to invite-only local kickbacks, rooftop sets, and private house parties hosted by creators in your area.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4"
          >
             <Link to="/events?category=local" className="bg-[#e6192b] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:scale-105 transition-all shadow-lg shadow-red-900/50">
               Explore Network
             </Link>
             <Link to="/host" className="bg-[#111] border border-[#333] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#333] hover:scale-105 transition-all">
               Host a Party
             </Link>
          </motion.div>
        </div>

        {/* FLOATING DARK SEARCH BAR MIMICKING DRIBBBLE SHOT */}
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-30 hidden md:block">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-[#111111] border border-[#333] p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-black"
          >
              <div className="flex-1 flex divide-x divide-[#333]">
                 <div className="px-6 py-2 w-1/2">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Keywords</p>
                    <input type="text" placeholder="Search Artists..." className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400 font-medium text-sm" />
                 </div>
                 <div className="px-6 py-2 w-1/2">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Location</p>
                    <select className="bg-transparent border-none outline-none text-white w-full cursor-pointer appearance-none font-medium text-sm">
                       <option className="bg-[#111] text-white">All Locations</option>
                       <option className="bg-[#111] text-white">Mumbai</option>
                       <option className="bg-[#111] text-white">Delhi NCR</option>
                    </select>
                 </div>
              </div>
              <div className="pl-6">
                 <Link to="/events" className="bg-[#e6192b] text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-colors inline-block">
                   Find Events
                 </Link>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Curated Kickbacks Showcase (User USP - MOVED TO TOP PRIORITY) */}
      <section className="bg-[#050505] px-6 py-24 border-b border-[#1a1a1a] relative z-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, #e6192b 0%, transparent 40%)' }} />
        <div className="max-w-7xl mx-auto relative z-10 w-full pt-12 md:pt-0">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-2">Curated Kickbacks</h2>
              <p className="text-[#e6192b] text-xs uppercase tracking-widest font-bold">Which are available to use.</p>
            </div>
            <Link to="/events?tab=local" className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              Explore Network <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hostLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-[#111] rounded-3xl animate-pulse border border-[#222]" />)
            ) : displayLocalEvents.length === 0 ? (
              <div className="col-span-full py-16 text-center border border-dashed border-[#333] rounded-3xl bg-[#0a0a0a]">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">The Underground is Quiet</h3>
                <p className="text-gray-500 text-xs font-semibold mb-6 max-w-sm mx-auto leading-relaxed">There are currently no exclusive local parties or kickbacks scheduled in the database. Be the first to host.</p>
                <Link to="/host" className="inline-block bg-[#e6192b] text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg">Become a Host</Link>
              </div>
            ) : (
              displayLocalEvents.map((event, index) => {
                const eventDate = new Date(event.date)
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                const day = eventDate.getDate()
                const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'short' })
                return (
                  <motion.div
                    layout
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#333] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300">
                      {/* Image Area */}
                      <div className="relative h-48 overflow-hidden bg-[#0a0a0a]">
                        {event.image_url ? (
                          <img 
                            src={event.image_url} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111]">
                            <CalendarIcon className="w-10 h-10 text-[#222]" />
                          </div>
                        )}
                        {/* Date Badge */}
                        <div className="absolute top-3 left-3 bg-white text-black rounded-lg px-2.5 py-1.5 text-center shadow-lg min-w-[48px]">
                          <p className="text-[9px] font-bold uppercase leading-none">{month}</p>
                          <p className="text-lg font-black leading-none mt-0.5">{day}</p>
                        </div>
                        {/* Verified Host Tag */}
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/10">
                          <span className="text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                             <span className="w-1 h-1 rounded-full bg-green-500"></span> Verified Host
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#111] to-transparent" />
                      </div>
                      {/* Info Area */}
                      <div className="p-4 pt-3">
                        <h3 className="text-[15px] font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#e6192b] transition-colors">{event.title}</h3>
                        <div className="space-y-1.5 mb-3">
                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <MapPinIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span>{weekday}, {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
                          <div>
                            <span className="text-white font-bold text-sm">₹{(event.price || 499).toLocaleString('en-IN')}</span>
                            <span className="text-gray-500 text-[10px] ml-1">onwards</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#e6192b] group-hover:text-white transition-colors">
                            Explore →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
          
          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
             <Link to="/events?tab=local" className="inline-block border border-[#333] px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#e6192b] hover:border-[#e6192b] transition-colors">
                Explore Network
             </Link>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events (Dark Grid Cards) */}
      <section className="bg-black px-6 pt-32 pb-24 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase text-white tracking-tight mb-2">What's Happening?</h2>
              <p className="text-gray-400 text-sm font-medium">Live Music, Comedy, & Exclusive Shows.</p>
            </div>
            <div className="flex space-x-4">
              <button className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center hover:bg-[#111] hover:border-gray-500 transition-colors">
                  <ChevronLeftIcon className="w-4 h-4 text-white" />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center hover:bg-[#111] hover:border-gray-500 transition-colors">
                  <ChevronRightIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 override-scrollbar">
             {['All', 'Live Music', 'Standup Comedy', 'Theatre & Arts', 'Sports', 'Tech Workshops', 'Nightlife', 'Networking', 'Concerts'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                     activeCategory === cat
                     ? 'bg-[#e6192b] text-white border-[#e6192b] shadow-[0_0_15px_rgba(230,25,43,0.3)]' 
                     : 'bg-[#111111] text-gray-400 border-[#333] hover:border-[#666] hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  {cat}
                </button>
             ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[440px]">
            <AnimatePresence mode='popLayout'>
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-[440px] bg-[#111111] border border-[#222] rounded-3xl animate-pulse" />)
            ) : filteredEvents.length === 0 ? (
              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="col-span-full text-center py-20 bg-[#111] border border-dashed border-[#333] rounded-3xl"
              >
                 <h3 className="text-xl font-bold text-white mb-2 uppercase">No events found</h3>
                 <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Try adjusting your category filter</p>
                 <button onClick={() => setActiveCategory('All')} className="mt-6 text-[#e6192b] text-[10px] font-bold tracking-widest uppercase border-b border-[#e6192b] pb-1 hover:text-white hover:border-white transition-colors">Clear Filters</button>
              </motion.div>
            ) : (
              filteredEvents.slice(0, 8).map((event, index) => {
                const eventDate = new Date(event.date)
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                const day = eventDate.getDate()
                const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'short' })
                return (
                  <motion.div
                    layout
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#333] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-[#0a0a0a]">
                        {event.image_url ? (
                          <img 
                            src={event.image_url} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111]">
                            <CalendarIcon className="w-10 h-10 text-[#333]" />
                          </div>
                        )}
                        {/* Date Badge */}
                        <div className="absolute top-3 left-3 bg-white text-black rounded-lg px-2.5 py-1.5 text-center shadow-lg min-w-[48px]">
                          <p className="text-[9px] font-bold uppercase leading-none">{month}</p>
                          <p className="text-lg font-black leading-none mt-0.5">{day}</p>
                        </div>
                        {/* Category Tag */}
                        {event.category && (
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                            <span className="text-[9px] font-bold uppercase tracking-wider">{event.category}</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#111] to-transparent" />
                      </div>
                      {/* Info */}
                      <div className="p-4 pt-3">
                        <h3 className="text-[15px] font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#e6192b] transition-colors">{event.title}</h3>
                        <div className="space-y-1.5 mb-3">
                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <MapPinIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span>{weekday}, {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
                          <div>
                            <span className="text-white font-bold text-sm">₹{(event.price || 499).toLocaleString('en-IN')}</span>
                            <span className="text-gray-500 text-[10px] ml-1">onwards</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#e6192b] group-hover:text-white transition-colors">
                            Book →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default Home
