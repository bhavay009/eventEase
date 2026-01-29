import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPinIcon, CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const Home = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/events?limit=8`)
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

  const getDateParts = (dateString) => {
    const date = new Date(dateString)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
  }

  // Calculate Date Range for Hero Headline
  const getEventDateRange = () => {
    if (events.length === 0) return 'Coming Soon'

    // Sort events by date to find min and max
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
    const firstEvent = new Date(sortedEvents[0].date)
    const lastEvent = new Date(sortedEvents[sortedEvents.length - 1].date)

    const format = (date) => {
      // Add ordinal suffix (th, st, nd, rd)
      const d = date.getDate()
      const suffix = (d > 3 && d < 21) ? 'th' : (d % 10 === 1 ? 'st' : (d % 10 === 2 ? 'nd' : (d % 10 === 3 ? 'rd' : 'th')))
      return `${date.toLocaleDateString('en-US', { month: 'long' })} ${d}${suffix}`
    }

    if (firstEvent.toDateString() === lastEvent.toDateString()) {
      return format(firstEvent)
    }

    return `${format(firstEvent)} – ${format(lastEvent)}`
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1))
  }

  // Get index helper with wrap-around
  const getIndex = (idx) => {
    if (idx < 0) return events.length + idx
    if (idx >= events.length) return idx - events.length
    return idx
  }

  const featuredEvent = events[activeIndex]
  const prevEvent = events[getIndex(activeIndex - 1)]
  const nextEvent = events[getIndex(activeIndex + 1)]

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* 
        HERO SECTION - Infinite Carousel
      */}
      <section className="relative bg-[#1a1410] text-white pt-24 pb-24 px-6 overflow-hidden min-h-[70vh] flex flex-col justify-center">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg-v2.png"
            alt="Background Atmosphere"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410] via-transparent to-[#1a1410] opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1410] via-[#1a1410]/20 to-[#1a1410] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 translate-y-12">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xs font-bold tracking-[0.3em] text-[#a69d96] uppercase mb-6"
          >
            • The Event Ease Events •
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif mb-24 leading-tight drop-shadow-2xl"
          >
            {getEventDateRange()}
          </motion.h1>
        </div>

        {/* CAROUSEL CONTAINER */}
        <div className="relative z-20 max-w-6xl mx-auto mt-8 h-[320px] flex items-center justify-center">

          {events.length > 0 && (
            <>
              {/* Navigation Buttons - Absolute positioned for accessibility */}
              <button
                onClick={prevSlide}
                className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1a1410] shadow-lg hover:scale-110 transition-transform z-40 cursor-pointer"
              >
                <ChevronLeftIcon className="w-5 h-5 font-bold" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1a1410] shadow-lg hover:scale-110 transition-transform z-40 cursor-pointer"
              >
                <ChevronRightIcon className="w-5 h-5 font-bold" />
              </button>

              {/* PREVIOUS CARD (Left Peeking) */}
              {prevEvent && events.length > 1 && (
                <div className="absolute left-0 md:left-10 top-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[240px] opacity-40 scale-90 blur-[1px] hidden md:block select-none overflow-hidden rounded-lg">
                  <div className="flex w-full h-full bg-white text-gray-800">
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <h2 className="text-xl font-serif">{prevEvent.title}</h2>
                    </div>
                    <div className="w-[200px] bg-black">
                      <img src={prevEvent.image_url} className="w-full h-full object-cover opacity-50" />
                    </div>
                  </div>
                </div>
              )}

              {/* NEXT CARD (Right Peeking) */}
              {nextEvent && events.length > 1 && (
                <div className="absolute right-0 md:right-10 top-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[240px] opacity-40 scale-90 blur-[1px] hidden md:block select-none overflow-hidden rounded-lg">
                  <div className="flex w-full h-full bg-white text-gray-800">
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <h2 className="text-xl font-serif">{nextEvent.title}</h2>
                    </div>
                    <div className="w-[200px] bg-black">
                      <img src={nextEvent.image_url} className="w-full h-full object-cover opacity-50" />
                    </div>
                  </div>
                </div>
              )}

              {/* MAIN FEATURED CARD (Center) */}
              <AnimatePresence mode='wait'>
                <motion.div
                  key={featuredEvent.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-30 max-w-3xl w-full mx-auto"
                >
                  <div className="bg-white rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden relative min-h-[280px]">

                    {/* Left: Info Section */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
                      <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-[0.2em] mb-3">
                        {featuredEvent.category || 'COMEDY'}
                      </span>
                      <h2 className="text-3xl md:text-3xl font-serif text-[#1e1e1e] mb-2 leading-tight">
                        {featuredEvent.title}
                      </h2>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-6">
                        {featuredEvent.location?.split(',')[0]} • 2026 Tour
                      </p>

                      <div className="flex items-center space-x-6 mb-8 text-[#1e1e1e]">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-[#b45309]" />
                          <span className="text-sm font-bold">{getDateParts(featuredEvent.date).month} {getDateParts(featuredEvent.date).day}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-4 h-4 text-[#b45309]" />
                          <span className="text-sm font-bold">{getDateParts(featuredEvent.date).time}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <Link
                          to={`/events/${featuredEvent.id}`}
                          className="btn-primary shadow-lg shadow-orange-900/20"
                        >
                          Get Tickets
                        </Link>
                        <Link to={`/events/${featuredEvent.id}`} className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#1e1e1e] border-b border-gray-200 pb-0.5 hover:border-black transition-all">
                          View Details
                        </Link>
                      </div>

                      {/* Serrated Border (Right Side of content) */}
                      <div className="absolute right-0 top-4 bottom-4 w-[1px] border-r-2 border-dashed border-gray-200 hidden md:block" />

                      {/* Top/Bottom Notches simulating perforation */}
                      <div className="absolute -top-3 right-[-12px] w-6 h-6 bg-[#1a1410] rounded-full z-10 hidden md:block" />
                      <div className="absolute -bottom-3 right-[-12px] w-6 h-6 bg-[#1a1410] rounded-full z-10 hidden md:block" />
                    </div>

                    {/* Right: Image Section */}
                    <div className="md:w-[240px] bg-black relative">
                      <img
                        src={featuredEvent.image_url}
                        alt={featuredEvent.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          )}

        </div>
      </section>

      {/* Featured Upcoming Events (White List) */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-20">

        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-[#1e1e1e] mb-3">Featured Upcoming Events</h2>
          <p className="text-gray-500 text-sm">Keep coming back to stay informed about the activities.</p>
        </div>

        <div className="space-y-12">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => <div key={i} className="h-44 bg-gray-100 rounded-lg skeleton" />)}
            </div>
          ) : (
            events.map((event, index) => {
              const { month, day, time } = getDateParts(event.date)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col md:flex-row items-stretch group cursor-pointer hover-lift p-4 -mx-4 rounded-xl hover:bg-white hover:shadow-luxury-sm transition-all duration-300"
                >
                  {/* Left: Date */}
                  <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-start pt-4 border-r border-gray-100 md:pr-8 md:mr-8 mb-6 md:mb-0">
                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">{month}</span>
                    <span className="text-5xl font-serif text-[#1e1e1e] leading-none mb-2 group-hover:scale-110 transition-transform duration-300">{day}</span>
                    <span className="text-xs font-bold text-gray-500">{time}</span>
                  </div>

                  {/* Center: Info */}
                  <div className="flex-grow flex flex-col justify-center pb-6 md:pb-0">
                    <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-2">
                      {event.category || 'THEATRE'}
                    </span>
                    <h3 className="text-2xl font-serif text-[#1e1e1e] mb-2 group-hover:text-[#b45309] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {event.location}
                    </p>

                    <div className="flex items-center space-x-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      <Link to={`/events/${event.id}`} className="bg-[#1e1e1e] text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#b45309] transition-colors shadow-lg shadow-black/20">
                        Get Tickets
                      </Link>
                      <Link to={`/events/${event.id}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#1e1e1e]">
                        Details
                      </Link>
                    </div>
                  </div>

                  {/* Right: Ticket Stub Image */}
                  <div className="md:w-[320px] h-[160px] relative mt-6 md:mt-0 ml-0 md:ml-8 flex-shrink-0">
                    <div className="w-full h-full relative overflow-hidden ticket-mask bg-black">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </section>

    </div>
  )
}

export default Home
