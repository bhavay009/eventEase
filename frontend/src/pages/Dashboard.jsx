import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CalendarIcon, MapPinIcon, TicketIcon, ChartBarIcon, PlusIcon, UsersIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user, isOrganizer } = useAuth()
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    if (isOrganizer) {
      fetchOrganizerDashboard()
    } else {
      fetchCustomerDashboard()
    }
  }, [isOrganizer])

  const fetchOrganizerDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const [analyticsRes, eventsRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/events/organizer/my-events`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const analyticsData = await analyticsRes.json()
      const eventsData = await eventsRes.json()

      if (analyticsData.success) {
        setStats(analyticsData.analytics)
      }
      if (eventsData.success) {
        setEvents(eventsData.events.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const [eventsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/api/events`),
        fetch(`${API_URL}/api/bookings/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const eventsData = await eventsRes.json()
      const bookingsData = await bookingsRes.json()

      if (eventsData.success) {
        const upcoming = eventsData.events.filter(
          (e) => new Date(e.date) >= new Date()
        )
        setEvents(upcoming.slice(0, 5))
      }
      if (bookingsData.success) {
        setBookings(bookingsData.bookings)
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - SkillBox Style */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-3">
                {isOrganizer ? 'Organizer Dashboard' : 'Welcome Back, ' + user?.name}
              </h1>
              <p className="text-xl text-gray-300">
                {isOrganizer 
                  ? 'Manage your events and track your success'
                  : 'Discover your next amazing event experience'
                }
              </p>
            </div>
            {isOrganizer && (
              <Link
                to="/admin/events"
                className="hidden md:flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Event</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isOrganizer ? (
          // Organizer Dashboard
          <div>
            {/* Stats Cards - Modern Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TicketIcon className="h-6 w-6 text-gray-700" />
                  </div>
                  <span className="text-2xl">🎪</span>
                </div>
                <h3 className="text-gray-500 text-sm font-semibold mb-1">Total Events</h3>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-gray-700" />
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-gray-500 text-sm font-semibold mb-1">Total Bookings</h3>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-gray-700" />
                  </div>
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-gray-500 text-sm font-semibold mb-1">Total Users</h3>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CurrencyRupeeIcon className="h-6 w-6 text-gray-700" />
                  </div>
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-gray-500 text-sm font-semibold mb-1">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{stats?.totalRevenue?.toLocaleString('en-IN') || '0'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Link
                to="/admin/events"
                className="bg-gray-900 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <PlusIcon className="h-10 w-10 mb-4" />
                <h3 className="text-xl font-bold mb-2">Create Event</h3>
                <p className="text-gray-300">Add a new event to your portfolio</p>
              </Link>

              <Link
                to="/admin/events"
                className="bg-gray-800 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <TicketIcon className="h-10 w-10 mb-4" />
                <h3 className="text-xl font-bold mb-2">Manage Events</h3>
                <p className="text-gray-300">Edit or delete your events</p>
              </Link>

              <Link
                to="/admin/analytics"
                className="bg-gray-700 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <ChartBarIcon className="h-10 w-10 mb-4" />
                <h3 className="text-xl font-bold mb-2">View Analytics</h3>
                <p className="text-gray-300">Track your event performance</p>
              </Link>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
                <Link to="/admin/events" className="text-gray-700 hover:text-gray-900 font-semibold">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <TicketIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No events yet</p>
                    <Link to="/admin/events" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold inline-block hover:bg-gray-800 transition-colors">
                      Create Your First Event
                    </Link>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(event.date).toLocaleDateString('en-IN')}
                          </span>
                          <span className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="text-gray-700 hover:text-gray-900 font-semibold"
                      >
                        View →
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          // Customer Dashboard
          <div>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-900 text-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <TicketIcon className="h-12 w-12 opacity-80" />
                  <span className="text-5xl">🎫</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
                <p className="text-4xl font-bold">{events.length}</p>
              </div>

              <div className="bg-gray-800 text-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <CalendarIcon className="h-12 w-12 opacity-80" />
                  <span className="text-5xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
                <p className="text-4xl font-bold">{bookings.length}</p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                <Link to="/events" className="text-gray-700 hover:text-gray-900 font-semibold">
                  Browse All →
                </Link>
              </div>
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming events</p>
                  <Link to="/events" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold inline-block hover:bg-gray-800 transition-colors">
                    Discover Events
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all border border-gray-200 hover:shadow-lg"
                    >
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString('en-IN')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="text-gray-900 font-bold">₹{event.price.toLocaleString('en-IN')}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* My Bookings */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <TicketIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No bookings yet</p>
                  <Link to="/events" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold inline-block hover:bg-gray-800 transition-colors">
                    Book Your First Event
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">Event</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">Seats</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.event.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(booking.event.date).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.seats}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ₹{booking.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
        )}
      </div>
    </div>
  )
}

export default Dashboard
