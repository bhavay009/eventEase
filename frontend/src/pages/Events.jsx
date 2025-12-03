import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarIcon, MapPinIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import Pagination from '../components/Pagination'

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
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - SkillBox Style */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-black mb-3">All Events</h1>
          <p className="text-xl text-gray-300">Discover extraordinary experiences across India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters - Modern Style */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-10 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FunnelIcon className="h-6 w-6 mr-3 text-gray-600" />
              Search & Filters
            </h2>
            {(search || location || date) && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-700 hover:text-gray-900 font-semibold"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-400" />
              <input
                type="text"
                placeholder="City or State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-luxury-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-navy-900"
              />
            </div>
          </div>
          {(search || location || date) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {search && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 font-semibold border border-gray-300">
                  Search: {search}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 font-semibold border border-gray-300">
                  Location: {location}
                </span>
              )}
              {date && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 font-semibold border border-gray-300">
                  Date: {new Date(date).toLocaleDateString('en-IN')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && pagination && (
          <div className="mb-8 flex items-center justify-between">
            <p className="text-lg text-gray-700 font-semibold">
              Showing {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, pagination.totalItems)} of {pagination.totalItems} {pagination.totalItems === 1 ? 'event' : 'events'}
            </p>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-luxury-200">
                <div className="h-64 skeleton-luxury"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 skeleton-luxury rounded"></div>
                  <div className="h-4 skeleton-luxury rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="max-w-md mx-auto">
              <MagnifyingGlassIcon className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No events found</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Try adjusting your search filters or check back later for new events.
              </p>
              <button
                onClick={clearFilters}
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-navy-800 to-navy-900">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title || 'Event image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-navy-800', 'to-navy-900')
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                      <span className="text-white/50 text-sm">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-300">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{event.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {event.remaining_seats < 20 && event.remaining_seats > 0 && (
                    <div className="absolute top-4 left-4 bg-burgundy-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      Only {event.remaining_seats} left!
                    </div>
                  )}
                  {event.remaining_seats <= 0 && (
                    <div className="absolute top-4 left-4 bg-navy-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      Sold Out
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px] leading-relaxed">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center text-gray-600 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(event.date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="bg-gray-900 text-white text-center py-3 rounded-lg font-semibold block hover:bg-gray-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}

export default Events
