import { useState, useEffect } from 'react'
import Pagination from '../components/Pagination'

const AdminManageEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    total_seats: '',
    image_url: ''
  })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchEvents()
  }, [currentPage])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      params.append('page', currentPage)
      params.append('limit', 10)

      const response = await fetch(`${API_URL}/api/events/organizer/my-events?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return // Prevent double submission

    try {
      setSubmitting(true)
      const token = localStorage.getItem('token')
      if (!token) {
        alert('You must be logged in to create events')
        setSubmitting(false)
        return
      }

      const url = editingEvent
        ? `${API_URL}/api/events/${editingEvent.id}`
        : `${API_URL}/api/events`
      const method = editingEvent ? 'PUT' : 'POST'

      // Ensure date is in ISO format
      let dateValue = formData.date
      if (dateValue && !dateValue.includes('T')) {
        // If date doesn't have time, add default time
        dateValue = dateValue + 'T00:00:00'
      }
      if (dateValue && !dateValue.includes('Z') && !dateValue.includes('+')) {
        // Convert to ISO string if not already
        dateValue = new Date(dateValue).toISOString()
      }

      const requestBody = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: dateValue,
        location: formData.location.trim(),
        price: parseFloat(formData.price),
        total_seats: parseInt(formData.total_seats),
        image_url: formData.image_url?.trim() || null
      }

      console.log('Submitting event:', requestBody)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log('Response status:', response.status, 'Response data:', data)

      if (response.ok && data.success) {
        setShowModal(false)
        setEditingEvent(null)
        setFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          price: '',
          total_seats: '',
          image_url: ''
        })
        // Refresh events - if we're on a page that might be empty after deletion, go to previous page
        if (events.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          fetchEvents()
        }
        alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!')
      } else {
        // Show detailed error message
        const errorMsg = data.errors 
          ? data.errors.map(e => e.msg || e.message).join(', ')
          : data.message || `Operation failed (Status: ${response.status})`
        alert(`Error: ${errorMsg}`)
        console.error('Create/Update event error:', data)
      }
    } catch (error) {
      console.error('Connection error:', error)
      alert(`Connection error: ${error.message || 'Unable to connect to server. Please check if the backend server is running.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      price: event.price.toString(),
      total_seats: event.total_seats.toString(),
      image_url: event.image_url || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()

      if (data.success) {
        // Refresh events - if we're on a page that might be empty after deletion, go to previous page
        if (events.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          fetchEvents()
        }
      } else {
        alert(data.message || 'Delete failed')
      }
    } catch (error) {
      alert('Connection error')
    }
  }

  return (
    <div className="min-h-screen bg-luxury-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-luxury font-bold text-navy-900">Manage Events</h1>
            {pagination && (
              <p className="text-navy-600 mt-2">
                {pagination.totalItems} {pagination.totalItems === 1 ? 'event' : 'events'} total
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setEditingEvent(null)
              setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                price: '',
                total_seats: '',
                image_url: ''
              })
              setShowModal(true)
            }}
            className="btn-luxury text-white px-6 py-3 rounded-xl font-semibold"
          >
            Create Event
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-luxury-200">
            <p className="text-navy-600 text-lg mb-6">No events yet. Create your first event!</p>
            <button
              onClick={() => {
                setEditingEvent(null)
                setFormData({
                  title: '',
                  description: '',
                  date: '',
                  location: '',
                  price: '',
                  total_seats: '',
                  image_url: ''
                })
                setShowModal(true)
              }}
              className="btn-luxury text-white px-6 py-3 rounded-xl font-semibold"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-luxury-200">
            <table className="min-w-full divide-y divide-luxury-200">
              <thead className="bg-luxury-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-navy-900 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-navy-900 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-navy-900 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-navy-900 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-navy-900 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-navy-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-luxury-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-luxury-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                      {new Date(event.date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gold-700">
                      ₹{event.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                      {event.remaining_seats || 0}/{event.total_seats}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-gold-700 hover:text-gold-800 font-semibold elegant-underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-burgundy-700 hover:text-burgundy-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-luxury-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-luxury font-bold text-navy-900">
                {editingEvent ? 'Edit Event' : 'Create Event'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setEditingEvent(null)
                }}
                className="text-navy-600 hover:text-navy-900 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-luxury-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-navy-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Description</label>
                <textarea
                  placeholder="Event Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-luxury-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-navy-900"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-luxury-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-navy-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Event Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-luxury-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-navy-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-luxury-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-navy-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">Total Seats</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.total_seats}
                    onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-luxury-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-navy-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-luxury-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-navy-900"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingEvent(null)
                  }}
                  className="px-6 py-3 border-2 border-luxury-300 rounded-xl text-navy-900 font-semibold hover:bg-luxury-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-luxury text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting 
                    ? (editingEvent ? 'Updating...' : 'Creating...') 
                    : (editingEvent ? 'Update Event' : 'Create Event')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManageEvents

