import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, UsersIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <Link to="/events" className="text-gray-700 hover:text-gray-900 font-semibold">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/events"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-6 font-semibold"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Events
        </Link>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          {/* Hero Image */}
          {event.image_url ? (
            <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-navy-800 to-navy-900">
              <img
                src={event.image_url}
                alt={event.title || 'Event image'}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white drop-shadow-lg">
                <h1 className="text-4xl md:text-5xl font-luxury font-bold mb-2">{event.title}</h1>
                <div className="flex items-center space-x-4 text-lg">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8 md:p-12 text-white">
              <h1 className="text-4xl md:text-5xl font-luxury font-bold mb-4">{event.title}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {event.location}
                </div>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                {event.sessions && event.sessions.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-luxury font-bold text-navy-900 mb-4">Schedule</h3>
                    <div className="space-y-3">
                      {event.sessions.map((session, idx) => (
                        <div key={session.id} className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-5 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">Session {idx + 1}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(session.start_time).toLocaleString('en-IN', {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>
                                {new Date(session.start_time).toLocaleTimeString('en-IN', {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                                {' - '}
                                {new Date(session.end_time).toLocaleTimeString('en-IN', {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 sticky top-8 border border-gray-200">
                  <div className="space-y-6">
                    {/* Price */}
                    <div className="text-center pb-6 border-b border-gray-300">
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <p className="text-4xl font-bold text-gray-900">₹{event.price.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-gray-500 mt-1">per ticket</p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CalendarIcon className="h-5 w-5 text-gray-700 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(event.date).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(event.date).toLocaleTimeString('en-IN', {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 text-gray-700 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{event.location}</p>
                      </div>

                      <div className="flex items-start">
                        <UsersIcon className="h-5 w-5 text-gray-700 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {event.remaining_seats || 0} of {event.total_seats} seats available
                          </p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gray-900 h-2 rounded-full transition-all"
                              style={{
                                width: `${((event.total_seats - (event.remaining_seats || 0)) / event.total_seats) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={handleBookNow}
                      disabled={!event.remaining_seats || event.remaining_seats <= 0}
                      className="bg-gray-900 text-white w-full py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                    >
                      {!event.remaining_seats || event.remaining_seats <= 0
                        ? 'Sold Out'
                        : isAuthenticated
                        ? 'Book Now'
                        : 'Sign In to Book'}
                    </button>

                    {(!event.remaining_seats || event.remaining_seats <= 0) && (
                      <p className="text-center text-sm text-red-700 font-semibold">
                        This event is fully booked
                      </p>
                    )}

                    {event.remaining_seats > 0 && event.remaining_seats < 10 && (
                      <p className="text-center text-sm text-orange-700 font-semibold">
                        ⚠️ Only {event.remaining_seats} seats remaining!
                      </p>
                    )}
                  </div>
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
