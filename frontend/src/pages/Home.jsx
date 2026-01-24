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
    <div className="min-h-screen">
      <section className="relative w-full h-[70vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://videos.pexels.com/video-files/7525996/7525996-sd_640_360_25fps.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
              Experience Live Shows
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mb-8">
              Book premium concerts, comedy, theatre and immersive events near you.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="#discover" className="px-8 py-4 btn-luxury btn-glow text-white font-bold">
                Discover Shows
              </a>
              <form onSubmit={handleSearch} className="w-full sm:w-auto">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search events, artists or venues"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 pl-12 pr-4 py-4 rounded-xl glass-dark focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex space-x-6 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 h-96 glass-dark rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="relative">
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 glass-dark rounded-full p-3 hover-glow transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </button>
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
                    <div className="card-luxury overflow-hidden transition-all duration-300">
                      <div className="relative h-96 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute top-4 right-4 glass-dark px-4 py-2 rounded-full">
                          <span className="text-sm font-bold text-white">
                            ₹{event.price.toLocaleString('en-IN')}
                          </span>
                        </div>
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
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 glass-dark rounded-full p-3 hover-glow transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-300 text-lg">No events available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      <div id="discover" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Premium Events
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">
              Discover and book unforgettable experiences
            </p>
            <p className="text-xl text-gray-300 mb-8">
              Make your events live in minutes
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/events"
                className="px-8 py-4 btn-luxury text-white font-bold hover-glow"
              >
                View Events
              </Link>
              {isOrganizer && (
                <Link
                  to="/admin/events"
                  className="px-8 py-4 btn-luxury text-white font-bold hover-glow"
                >
                  Create Event
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="px-8 py-4 btn-luxury text-white font-bold btn-glow"
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
