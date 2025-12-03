import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CalendarIcon, MapPinIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const scrollContainerRef = useRef(null)
  const { isAuthenticated, isOrganizer } = useAuth()

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/events?limit=20`)
      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      window.location.href = `/events?search=${encodeURIComponent(search)}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - SkillBox Style */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-4 text-center">
            Everything Live!
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Book live events (music, comedy, art, theatre), workshops and online events.
          </p>

          {/* Centered Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, artists or celebrities"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
              />
            </div>
          </form>

          {/* Events Carousel */}
          {loading ? (
            <div className="flex space-x-6 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
              </button>

              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {events.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="flex-shrink-0 w-80 group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      {/* Event Image */}
                      <div className="relative h-96 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/50 text-sm">No Image</span>
                          </div>
                        )}
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{event.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Sold Out / Low Seats Badge */}
                        {event.remaining_seats <= 0 && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            SOLD OUT
                          </div>
                        )}
                        {event.remaining_seats > 0 && event.remaining_seats < 20 && (
                          <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            Only {event.remaining_seats} left!
                          </div>
                        )}

                        {/* Event Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-200">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(event.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              <span className="line-clamp-1">{event.location.split(',')[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No events available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Section - SkillBox Style */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              Events
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
              DO-IT-YOURSELF event listing platform
            </p>
            <p className="text-xl text-gray-600 mb-8">
              Make your events live in under 5 minutes
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/events"
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
              >
                View Events
              </Link>
              {isOrganizer && (
                <Link
                  to="/admin/events"
                  className="px-8 py-4 bg-gold-600 text-white font-bold rounded-lg hover:bg-gold-700 transition-colors"
                >
                  Create Event
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gold-600 text-white font-bold rounded-lg hover:bg-gold-700 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
