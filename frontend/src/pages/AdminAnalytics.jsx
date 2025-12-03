import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()

      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
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

  if (!analytics) {
    return (
      <div className="min-h-screen bg-white p-8">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    )
  }

  // Format monthly revenue data
  const monthlyRevenueData = analytics.monthlyRevenue?.map((item) => ({
    month: item.month,
    revenue: parseFloat(item.revenue) || 0
  })) || []

  // Format bookings per event data
  const bookingsPerEventData = analytics.bookingsPerEvent?.slice(0, 5).map((item) => ({
    name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
    bookings: item._count.bookings
  })) || []

  // Format seat occupancy data
  const seatOccupancyData = analytics.seatOccupancy?.slice(0, 5).map((item) => ({
    name: item.event_title.length > 15 ? item.event_title.substring(0, 15) + '...' : item.event_title,
    occupancy: Math.round(item.occupancy_rate)
  })) || []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalEvents}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{analytics.totalRevenue?.toLocaleString('en-IN') || '0'}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue */}
          {monthlyRevenueData.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bookings Per Event */}
        {bookingsPerEventData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Top Events by Bookings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsPerEventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        </div>

        {/* Seat Occupancy */}
        {seatOccupancyData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Seat Occupancy Rate (Top 5 Events)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seatOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupancy" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Bookings Table */}
        {analytics.recentBookings && analytics.recentBookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Seats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.seats}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{booking.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAnalytics

