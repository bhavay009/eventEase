import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/bookings/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()

      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-900">User Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="font-semibold text-gray-900 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-900">My Bookings</h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookings yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">
                          Seats
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/events/${booking.event.id}`}
                              className="text-gray-900 hover:text-gray-700 font-medium"
                            >
                              {booking.event.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(booking.event.date).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.seats}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ₹{booking.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.payment_status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {booking.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

