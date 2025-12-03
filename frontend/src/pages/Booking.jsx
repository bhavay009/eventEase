import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Booking = () => {
  const { eventId } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [seats, setSeats] = useState(1)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchEvent()
  }, [eventId, isAuthenticated])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}`)
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

  const handleBooking = async (e) => {
    e.preventDefault()
    setError('')
    setBooking(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: parseInt(eventId),
          seats: parseInt(seats)
        })
      })

      const data = await response.json()

      if (data.success) {
        navigate('/profile')
      } else {
        setError(data.message || 'Booking failed')
      }
    } catch (error) {
      setError('Connection error')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-luxury-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-luxury-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy-600 text-lg">Event not found</p>
        </div>
      </div>
    )
  }

  const totalAmount = event.price * seats
  const maxSeats = Math.min(event.remaining_seats || 0, 10)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Book Tickets</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{event.title}</h2>
            <p className="text-gray-600 text-lg">
              {new Date(event.date).toLocaleString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })} - {event.location}
            </p>
          </div>

          <form onSubmit={handleBooking}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Number of Seats
              </label>
              <input
                type="number"
                min="1"
                max={maxSeats}
                value={seats}
                onChange={(e) => setSeats(Math.max(1, Math.min(maxSeats, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Available seats: <span className="font-semibold text-gray-900">{event.remaining_seats || 0}</span>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <div className="flex justify-between mb-3">
                <span className="text-gray-700 font-medium">Ticket Price</span>
                <span className="font-bold text-gray-900">₹{event.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-700 font-medium">Number of Seats</span>
                <span className="font-bold text-gray-900">{seats}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between text-xl font-bold">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={booking || !event.remaining_seats || event.remaining_seats <= 0}
              className="bg-gray-900 text-white w-full py-4 rounded-lg font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              {booking ? 'Processing...' : (!event.remaining_seats || event.remaining_seats <= 0) ? 'Sold Out' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Booking

