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
      <div className="flex justify-center items-center min-h-screen bg-[#1e293b]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#1e293b] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-lg">Event not found</p>
        </div>
      </div>
    )
  }

  const totalAmount = event.price * seats
  const maxSeats = Math.min(event.remaining_seats || 0, 10)

  return (
    <div className="min-h-screen bg-[#1e293b]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black text-white mb-8">Book Tickets</h1>

        <div className="bg-[#334155] rounded-lg p-8 border border-[#475569]">
          <div className="mb-6 pb-6 border-b border-[#475569]">
            <h2 className="text-3xl font-bold text-white mb-3">{event.title}</h2>
            <p className="text-gray-300 text-lg">
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
              <label className="block text-sm font-semibold text-white mb-2">
                Number of Seats
              </label>
              <input
                type="number"
                min="1"
                max={maxSeats}
                value={seats}
                onChange={(e) => setSeats(Math.max(1, Math.min(maxSeats, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 bg-[#1e293b] border-2 border-[#475569] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                required
              />
              <p className="text-sm text-gray-300 mt-2">
                Available seats: <span className="font-semibold text-white">{event.remaining_seats || 0}</span>
              </p>
            </div>

            <div className="bg-[#334155] rounded-lg p-6 mb-6 border border-[#475569]">
              <div className="flex justify-between mb-3">
                <span className="text-gray-300 font-medium">Ticket Price</span>
                <span className="font-bold text-white">₹{event.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-300 font-medium">Number of Seats</span>
                <span className="font-bold text-white">{seats}</span>
              </div>
              <div className="border-t border-[#475569] pt-3 flex justify-between text-xl font-bold">
                <span className="text-white">Total Amount</span>
                <span className="text-primary-400">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border-2 border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={booking || !event.remaining_seats || event.remaining_seats <= 0}
              className="btn-luxury text-white w-full py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

