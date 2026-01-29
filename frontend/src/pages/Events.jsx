import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarIcon, MapPinIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import Pagination from '../components/Pagination'
import { motion } from 'framer-motion'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [search, location, date])

  useEffect(() => {
    fetchEvents()
  }, [search, location, date, currentPage])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (location) params.append('location', location)
      if (date) params.append('date', date)
      params.append('page', currentPage)
      params.append('limit', 10) // Converted to list view, fewer items per page fits better

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
  }

  // Helper date formatter
  const formatDateParts = (dateString) => {
    const d = new Date(dateString)
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate(),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'long' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Simple & Clean */}
      <div className="bg-[#1a1410] text-white pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end">
          <div className="mb-8 md:mb-0">
            <p className="text-xs font-bold tracking-[0.2em] text-[#a69d96] uppercase mb-4">
              • Discover •
            </p>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">All Events</h1>
          </div>
          <div className="max-w-md">
            <p className="text-[#a69d96] font-light leading-relaxed text-right md:text-left">
              Curated experiences for the discerning audience.<br />Find your next unforgettable night.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Filters - Clean Bar */}
        <div className="border-b border-gray-100 pb-12 mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-2 text-[#1a1410]">
              <FunnelIcon className="h-5 w-5 text-[#b45309]" />
              <span className="font-serif font-bold text-lg">Filter</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full lg:w-auto flex-1 lg:justify-end">
              <div className="relative group min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 py-2 pl-0 pr-8 text-[#1a1410] placeholder-gray-300 focus:border-[#1a1410] focus:ring-0 transition-colors font-serif"
                />
                <MagnifyingGlassIcon className="absolute right-0 top-2 h-5 w-5 text-gray-300 group-focus-within:text-[#b45309] transition-colors" />
              </div>
              <div className="relative group min-w-[200px]">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 py-2 pl-0 pr-8 text-[#1a1410] placeholder-gray-300 focus:border-[#1a1410] focus:ring-0 transition-colors font-serif"
                />
                <MapPinIcon className="absolute right-0 top-2 h-5 w-5 text-gray-300 group-focus-within:text-[#b45309] transition-colors" />
              </div>
              <div className="relative group min-w-[150px]">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 py-2 pl-0 pr-8 text-[#1a1410] placeholder-gray-300 focus:border-[#1a1410] focus:ring-0 transition-colors font-serif uppercase text-sm"
                />
              </div>
              {(search || location || date) && (
                <button onClick={clearFilters} className="text-xs uppercase font-bold tracking-widest text-red-400 hover:text-red-600 transition-colors">
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        {!loading && pagination && (
          <div className="mb-12 flex justify-between items-end">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-400">
              Upcoming Events
            </h2>
            <span className="text-xs font-bold text-[#b45309]">
              {pagination.totalItems} Results
            </span>
          </div>
        )}

        {/* Events List View */}
        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-50 rounded-lg skeleton" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <h3 className="text-3xl font-serif text-[#1a1410] mb-4">No events found</h3>
            <p className="text-gray-500 mb-8 font-light">
              Try adjusting your search criteria to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="text-[#b45309] border-b border-[#b45309] pb-0.5 font-bold uppercase tracking-widest text-xs hover:text-[#1a1410] hover:border-[#1a1410] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {events.map((event, index) => {
              const { month, day, time, weekday } = formatDateParts(event.date)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group flex flex-col md:flex-row items-stretch border-b border-gray-100 pb-12 hover:border-transparent hover-lift p-6 -mx-6 rounded-xl hover:bg-white hover:shadow-luxury-sm transition-all duration-300 cursor-pointer"
                >
                  {/* Left: Date Column */}
                  <div className="md:w-32 flex-shrink-0 flex flex-col pt-2 md:pr-8 md:border-r border-gray-100 mb-4 md:mb-0">
                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">{month}</span>
                    <span className="text-5xl font-serif text-[#1a1410] leading-none mb-2 group-hover:scale-110 origin-left transition-transform duration-500">{day}</span>
                    <span className="text-xs font-bold text-[#b45309] uppercase tracking-wide">{weekday}</span>
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-grow flex flex-col justify-center px-0 md:px-8 py-2">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-[0.2em]">
                        {event.category || 'THEATRE'}
                      </span>
                      <span className="w-8 h-[1px] bg-gray-200"></span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                        {time}
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-3xl font-serif text-[#1a1410] mb-3 group-hover:text-[#b45309] transition-colors leading-tight">
                      {event.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-6 max-w-xl font-light line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <Link to={`/events/${event.id}`} className="text-xs font-bold text-[#1a1410] uppercase tracking-widest border-b-2 border-[#1a1410] pb-1 hover:text-[#b45309] hover:border-[#b45309] transition-colors">
                        Get Tickets
                      </Link>
                      <span className="text-sm font-bold text-gray-400">
                        Starting at <span className="text-[#1a1410]">₹{event.price}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Image Preview (Ticket Stub Shape) */}
                  <div className="hidden md:block w-[300px] h-[160px] relative flex-shrink-0 ml-8 self-center perspective-1000">
                    <div className="w-full h-full relative overflow-hidden ticket-mask bg-gray-100 transform group-hover:rotate-y-12 transition-transform duration-500">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  </div>

                </motion.div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-20 border-t border-gray-100 pt-12">
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
