import { useState, useEffect } from 'react'
import Pagination from '../components/Pagination'
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

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

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

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
        // Refresh events
        if (events.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          fetchEvents()
        }
        alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!')
      } else {
        const errorMsg = data.errors
          ? data.errors.map(e => e.msg || e.message).join(', ')
          : data.message || `Operation failed (Status: ${response.status})`
        alert(`Error: ${errorMsg}`)
      }
    } catch (error) {
      console.error('Connection error:', error)
      alert(`Connection error: ${error.message}`)
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
    <div className="min-h-screen bg-white font-sans text-[#1a1410]">

      {/* Header */}
      <div className="bg-[#1a1410] text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#a69d96] uppercase mb-2">
              • Organizer Portal •
            </p>
            <h1 className="text-4xl font-serif mb-2">Manage Events</h1>
            {pagination && (
              <p className="text-[#a69d96] text-sm">
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
            className="mt-6 md:mt-0 flex items-center bg-[#b45309] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#8e3a00] transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b45309]"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1a1410] mb-2">No events yet</h3>
            <p className="text-gray-500 mb-6">Create your first event to get started.</p>
            <button
              onClick={() => {
                setEditingEvent(null)
                setShowModal(true)
              }}
              className="text-[#b45309] font-bold uppercase tracking-widest text-xs border-b border-[#b45309] pb-0.5 hover:text-[#1a1410] hover:border-[#1a1410] transition-colors"
            >
              Create Event Now
            </button>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-lg">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Seats</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-serif font-bold text-[#1a1410]">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#b45309]">
                      ₹{event.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={!event.remaining_seats ? 'text-red-500 font-bold' : ''}>
                        {event.remaining_seats || 0}
                      </span>
                      <span className="text-gray-400"> / {event.total_seats}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-gray-400 hover:text-[#1a1410] mr-4 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
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

      {/* Modal - Clean Light Theme */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1a1410]/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-2xl p-8 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-serif text-[#1a1410]">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setEditingEvent(null)
                }}
                className="text-gray-400 hover:text-[#1a1410] text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Jazz Festival"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 text-[#1a1410] placeholder-gray-300 font-serif text-lg transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                <textarea
                  placeholder="Describe the event..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#1a1410] focus:ring-0 rounded-none text-[#1a1410] placeholder-gray-300 transition-colors text-sm"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 text-[#1a1410] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Theatre, Mumbai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 text-[#1a1410] placeholder-gray-300 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 text-[#1a1410] placeholder-gray-300 font-serif text-lg transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Total Seats</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.total_seats}
                    onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 text-[#1a1410] placeholder-gray-300 font-serif text-lg transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-[#1a1410] focus:ring-0 text-[#1a1410] placeholder-gray-300 transition-colors"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 text-sm font-bold uppercase tracking-widest">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingEvent(null)
                  }}
                  className="px-6 py-3 text-gray-400 hover:text-[#1a1410] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#1a1410] text-white px-8 py-3 hover:bg-[#b45309] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? (editingEvent ? 'Updating...' : 'Creating...')
                    : (editingEvent ? 'Save Changes' : 'Create Event')
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
