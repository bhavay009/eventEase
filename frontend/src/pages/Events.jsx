import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Pagination from '../components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // Read URL param to auto-activate Local Kickbacks tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'local') {
      setActiveTab('local')
    }
  }, [searchParams])

  const categories = ['All', 'Concerts', 'Comedy', 'Nightlife', 'Festivals', 'Theatre', 'Workshops']

  useEffect(() => {
    setCurrentPage(1)
  }, [search, location, date, activeTab])

  useEffect(() => {
    fetchEvents()
  }, [search, location, date, currentPage, activeTab])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (location) params.append('location', location)
      if (date) params.append('date', date)
      if (activeTab === 'local') {
        params.append('source', 'database')
      } else if (activeTab !== 'all') {
        params.append('category', activeTab)
      }
      params.append('page', currentPage)
      params.append('limit', 12)

      const response = await fetch(`${API_URL}/api/events?${params}`)
      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearch('')
    setLocation('')
    setDate('')
    setActiveTab('all')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* COMPACT HEADER */}
      <div className="bg-[#000000] pt-24 pb-8 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#e6192b] uppercase mb-2">Browse</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Events & Experiences</h1>
            </div>
            <p className="text-gray-500 text-xs font-medium">
              {pagination ? `${pagination.totalItems} events found` : 'Loading...'}
            </p>
          </div>

          {/* INLINE SEARCH BAR */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#e6192b] focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="relative w-full lg:w-56">
              <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="City or area..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#e6192b] focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="relative w-full lg:w-48">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#e6192b] focus:outline-none transition-colors text-sm"
              />
            </div>
            {(search || location || date) && (
              <button onClick={clearFilters} className="text-xs font-bold text-[#e6192b] hover:text-white uppercase tracking-widest transition-colors px-4 py-3 border border-[#e6192b]/30 rounded-lg hover:bg-[#e6192b] whitespace-nowrap">
                Clear
              </button>
            )}
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat === 'All' ? 'all' : cat.toLowerCase())}
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                  (activeTab === 'all' && cat === 'All') || activeTab === cat.toLowerCase()
                    ? 'bg-[#e6192b] text-white border-[#e6192b]'
                    : 'bg-transparent text-gray-400 border-[#333] hover:border-white hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('local')}
              className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeTab === 'local'
                  ? 'bg-[#e6192b] text-white border-[#e6192b]'
                  : 'bg-transparent text-gray-400 border-[#333] hover:border-white hover:text-white'
              }`}
            >
              Local Kickbacks
            </button>
          </div>
        </div>
      </div>

      {/* EVENTS GRID */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-[#111] rounded-2xl animate-pulse border border-[#222]">
                <div className="h-48 bg-[#1a1a1a] rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-[#222] rounded w-1/3" />
                  <div className="h-5 bg-[#222] rounded w-3/4" />
                  <div className="h-3 bg-[#222] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full border-2 border-[#333] flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="bg-[#e6192b] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode='popLayout'>
            {events.map((event, index) => {
              const eventDate = new Date(event.date)
              const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
              const day = eventDate.getDate()
              const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'short' })

              return (
                <motion.div
                  layout
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {/* EVENT CARD */}
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

                      {/* Bottom Gradient */}
                      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#111] to-transparent" />
                    </div>

                    {/* Event Info */}
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

                      {/* Price & CTA */}
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
            })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center pt-8 border-t border-[#1a1a1a]">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
