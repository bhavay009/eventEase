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
    <div className="min-h-screen bg-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black text-white mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-[#334155] rounded-lg p-6 border border-[#475569]">
              <h2 className="text-xl font-bold mb-4 text-white">User Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Name</p>
                  <p className="font-semibold text-white">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="font-semibold text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Role</p>
                  <p className="font-semibold text-white capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-[#334155] rounded-lg p-6 border border-[#475569]">
              <h2 className="text-xl font-bold mb-4 text-white">My Bookings</h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-gray-300 text-center py-8">No bookings yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#475569]">
                    <thead className="bg-[#334155]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">
                          Seats
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-[#334155]">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/events/${booking.event.id}`}
                              className="text-white hover:text-primary-400 font-medium"
                            >
                              {booking.event.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(booking.event.date).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.seats}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                            ₹{booking.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.payment_status === 'paid'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
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

