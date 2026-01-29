import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
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
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b45309]"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-[#1a1410] mb-4">Event not found</h2>
          <Link to="/events" className="text-[#b45309] hover:text-[#8e3a00] font-bold uppercase tracking-widest text-sm border-b border-[#b45309] pb-1">
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
    <div className="min-h-screen bg-white font-sans text-[#1a1410]">

      {/* Navbar Placeholder/Spacer if needed, but assuming global navbar handles it */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Breadcrumb / Back Link */}
          <Link
            to="/events"
            className="inline-flex items-center text-gray-400 hover:text-[#b45309] mb-8 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">

            {/* Left Column: Image & Details */}
            <div className="lg:col-span-2">

              {/* Event Title Section */}
              <div className="mb-8">
                <span className="text-[#b45309] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
                  {event.category || 'Event'}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-6">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium uppercase tracking-wider">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-[#b45309]" />
                    {formattedDate}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-[#b45309]" />
                    {formattedTime}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-[#b45309]" />
                    {event.location}
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-none overflow-hidden mb-12 relative shadow-xl">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {/* Decorative Overlay */}
                <div className="absolute inset-0 ring-1 ring-black/5"></div>
              </div>

              {/* Description */}
              <div className="prose max-w-none text-gray-600 leading-relaxed mb-16">
                <h3 className="text-2xl font-serif text-[#1a1410] mb-6">About the Event</h3>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>

              {/* Sessions List (if any) */}
              {event.sessions && event.sessions.length > 0 && (
                <div className="mb-12 border-t border-gray-100 pt-12">
                  <h3 className="text-2xl font-serif text-[#1a1410] mb-8">Schedule</h3>
                  <div className="space-y-4">
                    {event.sessions.map((session, idx) => (
                      <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 border border-gray-100 hover:border-[#b45309]/30 transition-colors">
                        <div className="mb-4 md:mb-0">
                          <div className="text-xs font-bold text-[#b45309] uppercase tracking-wider mb-1">Session {idx + 1}</div>
                          <div className="font-serif text-xl">{new Date(session.start_time).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div className="flex items-center text-gray-500 font-medium">
                          <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
                          {new Date(session.start_time).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} - {new Date(session.end_time).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Booking Card (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-white p-8 md:p-10 border border-gray-200 shadow-2xl relative overflow-hidden">

                  {/* Decorative Top Border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#1a1410]" />

                  <div className="text-center mb-8">
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-bold">Tickets starting at</p>
                    <p className="text-5xl font-serif text-[#1a1410]">₹{event.price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <span className="text-gray-500 text-sm font-medium">Date</span>
                      <span className="text-[#1a1410] font-bold">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <span className="text-gray-500 text-sm font-medium">Time</span>
                      <span className="text-[#1a1410] font-bold">{formattedTime}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <span className="text-gray-500 text-sm font-medium">Availability</span>
                      <span className={`font-bold ${!event.remaining_seats ? 'text-red-500' : 'text-green-600'}`}>
                        {event.remaining_seats ? `${event.remaining_seats} Seats Left` : 'Sold Out'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBookNow}
                    disabled={!event.remaining_seats || event.remaining_seats <= 0}
                    className="w-full bg-[#b45309] text-white py-4 text-sm font-bold uppercase tracking-[0.15em] hover:bg-[#8e3a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {!event.remaining_seats || event.remaining_seats <= 0
                      ? 'Sold Out'
                      : isAuthenticated
                        ? 'Book Tickets'
                        : 'Sign In to Book'}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
                    Secure booking powered by EventEase.<br />Instant confirmation via email.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
