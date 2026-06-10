import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline'

const EventDetails = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`)
      const data = await response.json()

      if (data.success) {
        setEvent(data.event)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/bookings/${id}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6192b]"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Event not found</h2>
          <Link to="/events" className="text-[#e6192b] hover:text-red-400 font-bold uppercase tracking-widest text-[10px] border-b border-[#e6192b] pb-1">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const formattedTime = eventDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-white">

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Breadcrumb / Back Link */}
          <Link
            to="/events"
            className="inline-flex items-center text-gray-500 hover:text-white mb-8 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            <ArrowLeftIcon className="h-3 w-3 mr-2" />
            Back to Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">

            {/* Left Column: Image & Details */}
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.7, ease: "easeOut" }}
               className="lg:col-span-2"
            >

              {/* Event Title Section */}
              <div className="mb-8">
                <span className="text-[#e6192b] font-bold tracking-[0.4em] uppercase text-[10px] mb-3 block">
                  {event.category || 'Event'}
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest py-6 border-y border-[#222]">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-[#e6192b]" />
                    {formattedDate}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2 text-[#e6192b]" />
                    {formattedTime}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-[#e6192b]" />
                    {event.location}
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="w-full h-[400px] md:h-[500px] bg-[#0a0a0a] rounded-2xl overflow-hidden mb-12 relative shadow-2xl flex items-center justify-center border border-[#222]">
                {event.image_url ? (
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] bg-black/80 backdrop-blur py-2 px-6 rounded text-center border border-[#333]">Photo not provided by host</span>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed mb-16 text-sm font-medium">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-6">About the Event</h3>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>

              {/* Sessions List (if any) */}
              {event.sessions && event.sessions.length > 0 && (
                <div className="mb-12 border-t border-[#222] pt-12">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-8">Schedule</h3>
                  <div className="space-y-4">
                    {event.sessions.map((session, idx) => (
                      <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#111111] border border-[#222] rounded-xl hover:border-[#444] transition-colors">
                        <div className="mb-4 md:mb-0">
                          <div className="text-[10px] font-bold text-[#e6192b] uppercase tracking-[0.2em] mb-1">Session {idx + 1}</div>
                          <div className="font-bold text-xl text-white">{new Date(session.start_time).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div className="flex items-center text-gray-400 font-medium text-sm">
                          <ClockIcon className="h-4 w-4 mr-3 text-gray-500" />
                          {new Date(session.start_time).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} - {new Date(session.end_time).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>

            {/* Right Column: Booking Card (Sticky) */}
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
               className="lg:col-span-1"
            >
              <div className="sticky top-32">
                <div className="bg-[#111111] p-8 md:p-10 border border-[#333] shadow-2xl rounded-3xl relative overflow-hidden">

                  {/* Red Live Nation Top Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#e6192b]" />

                  <div className="text-left mb-8">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">General Admission</p>
                    <p className="text-5xl font-black text-white">₹{event.price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="space-y-6 mb-8 border-y border-[#333] py-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Date</span>
                      <span className="text-white font-bold text-sm">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Time</span>
                      <span className="text-white font-bold text-sm">{formattedTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Availability</span>
                      <span className={`font-bold text-sm flex items-center ${!event.remaining_seats ? 'text-[#e6192b]' : 'text-white'}`}>
                        <UsersIcon className="w-4 h-4 mr-2 opacity-50" />
                        {event.remaining_seats ? `${event.remaining_seats} Seats Left` : 'Sold Out'}
                      </span>
                    </div>
                  </div>

                  {event.source === 'Ticketmaster' ? (
                    <a
                      href={event.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#0055ff] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:scale-[1.02] transition-all text-center block shadow-[0_0_15px_rgba(0,85,255,0.2)]"
                    >
                      Buy on Ticketmaster
                    </a>
                  ) : (
                    <button
                      onClick={handleBookNow}
                      disabled={!event.remaining_seats || event.remaining_seats <= 0}
                      className="w-full bg-[#e6192b] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(230,25,43,0.2)]"
                    >
                      {!event.remaining_seats || event.remaining_seats <= 0
                        ? 'Sold Out'
                        : isAuthenticated
                          ? 'Order Tickets Now'
                          : 'Sign In to Order'}
                    </button>
                  )}

                  <p className="text-center text-[10px] uppercase font-bold tracking-[0.1em] text-gray-500 mt-6 md:mt-8">
                    Secure checkout guaranteed.<br />Instant mobile delivery.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
