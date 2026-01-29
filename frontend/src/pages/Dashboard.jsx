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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1410]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Matches new Theme */}
      <div className="bg-[#1a1410] text-white pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto z-10 relative">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-xs font-bold tracking-[0.2em] text-[#a69d96] uppercase mb-2">
                • {isOrganizer ? 'Organizer Portal' : 'My Account'} •
              </p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight">
                {isOrganizer ? 'Organizer Dashboard' : `Welcome, ${user?.name?.split(' ')[0]}`}
              </h1>
            </div>
            {isOrganizer && (
              <Link
                to="/admin/events"
                className="flex items-center space-x-2 bg-[#b45309] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#8e3a00] transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Event</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isOrganizer ? (
          // Organizer Dashboard
          <div>
            {/* Stats Cards - Minimalist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { icon: TicketIcon, label: 'Total Events', value: stats?.totalEvents, symbol: '' },
                { icon: UsersIcon, label: 'Total Bookings', value: stats?.totalBookings, symbol: '' },
                { icon: UsersIcon, label: 'Total Users', value: stats?.totalUsers, symbol: '' },
                { icon: CurrencyRupeeIcon, label: 'Total Revenue', value: stats?.totalRevenue?.toLocaleString('en-IN'), symbol: '₹' }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-8 border border-gray-100 hover:border-[#b45309] transition-colors group">
                  <item.icon className="h-8 w-8 text-[#b45309] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{item.label}</h3>
                  <p className="text-3xl font-serif text-[#1a1410]">{item.symbol}{item.value || 0}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Link to="/admin/events" className="group block p-8 bg-white border border-gray-200 hover:border-[#1a1410] transition-all">
                <PlusIcon className="h-8 w-8 text-[#1a1410] mb-4 group-hover:text-[#b45309] transition-colors" />
                <h3 className="text-xl font-serif text-[#1a1410] mb-2">Create New Event</h3>
                <p className="text-sm text-gray-500">Launch a new experience for your audience.</p>
              </Link>
              <Link to="/admin/events" className="group block p-8 bg-white border border-gray-200 hover:border-[#1a1410] transition-all">
                <TicketIcon className="h-8 w-8 text-[#1a1410] mb-4 group-hover:text-[#b45309] transition-colors" />
                <h3 className="text-xl font-serif text-[#1a1410] mb-2">Manage Events</h3>
                <p className="text-sm text-gray-500">Edit details and monitor ticket sales.</p>
              </Link>
              <Link to="/admin/analytics" className="group block p-8 bg-white border border-gray-200 hover:border-[#1a1410] transition-all">
                <ChartBarIcon className="h-8 w-8 text-[#1a1410] mb-4 group-hover:text-[#b45309] transition-colors" />
                <h3 className="text-xl font-serif text-[#1a1410] mb-2">View Analytics</h3>
                <p className="text-sm text-gray-500">Deep dive into your performance metrics.</p>
              </Link>
            </div>

            {/* Recent Events List */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-serif text-[#1a1410]">Recent Events</h2>
                <Link to="/admin/events" className="text-xs font-bold uppercase tracking-widest text-[#b45309] hover:text-[#1a1410]">
                  View All
                </Link>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-12 bg-gray-50">
                  <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
                  <Link to="/admin/events" className="text-xs font-bold uppercase tracking-widest text-[#1a1410] border-b border-[#1a1410]">
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-gray-100 hover:border-gray-300 transition-colors">
                      <div>
                        <h3 className="font-serif text-xl text-[#1a1410] mb-1">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wide text-gray-400">
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
                      <Link to={`/events/${event.id}`} className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-[#1a1410] hover:text-[#b45309]">
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Customer Dashboard
          <div>
            {/* Quick Stats - Minimalist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 bg-[#1a1410] text-white relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <TicketIcon className="h-32 w-32" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#a69d96] mb-2">Upcoming Events</h3>
                <p className="text-5xl font-serif mb-6">{events.length}</p>
                <Link to="/events" className="text-xs font-bold uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-colors">
                  Find More Events
                </Link>
              </div>

              <div className="p-8 bg-[#b45309] text-white relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <CalendarIcon className="h-32 w-32" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/80 mb-2">My Bookings</h3>
                <p className="text-5xl font-serif mb-6">{bookings.length}</p>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Confirmed Tickets
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Upcoming Recommended */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-serif text-[#1a1410]">Recommended For You</h2>
                  <Link to="/events" className="text-xs font-bold uppercase tracking-widest text-[#b45309] hover:text-[#1a1410]">
                    Browse All
                  </Link>
                </div>

                {events.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 mb-4">No events found matching your interests.</p>
                    <Link to="/events" className="text-xs font-bold uppercase tracking-widest text-[#1a1410] border-b border-[#1a1410]">
                      Explore Events
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <Link key={event.id} to={`/events/${event.id}`} className="group block bg-white border border-gray-100 hover:border-[#1a1410] transition-colors">
                        <div className="aspect-video bg-gray-200 overflow-hidden">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-serif text-[#1a1410] mb-2 line-clamp-1 group-hover:text-[#b45309] transition-colors">{event.title}</h3>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            {new Date(event.date).toLocaleDateString('en-IN')} • {event.location}
                          </p>
                          <span className="text-sm font-bold text-[#1a1410]">₹{event.price.toLocaleString('en-IN')}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Bookings List */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-serif text-[#1a1410] mb-8 pb-4 border-b border-gray-100">My Bookings</h2>
                {bookings.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 text-sm mb-4">You have no active bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                        <h4 className="font-serif text-lg text-[#1a1410] mb-1">{booking.event.title}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                          {new Date(booking.event.date).toLocaleDateString('en-IN')}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{booking.seats} Seats</span>
                          <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest ${booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {booking.payment_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
