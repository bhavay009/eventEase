import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

const HostManageEvent = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const [event, setEvent] = useState(null)
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const fetchEventData = async () => {
    try {
      // Fetch Event Details
      const evRes = await fetch(`${API_URL}/api/events/${id}`)
      const evData = await evRes.json()
      if (evData.success) {
        setEvent(evData.event)
      }

      // Fetch Guests
      const guestRes = await fetch(`${API_URL}/api/events/organizer/${id}/guests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const guestData = await guestRes.json()
      if (guestData.success) {
        setGuests(guestData.guests)
      }
    } catch (err) {
      console.error("Failed to load management dashboard", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchEventData()
  }, [id, token])

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/events/organizer/guest/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) {
        // Refresh local state without a full reload
        setGuests(guests.map(g => g.id === bookingId ? { ...g, payment_status: status } : g))
      } else {
        alert("Failed to update status")
      }
    } catch (err) {
      console.error("Error updating status", err)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#1a1410] font-serif text-2xl animate-pulse">Initializing Control Panel...</div>
  }

  if (!event) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500 font-serif text-2xl">Control Matrix Offline. Event Not Found.</div>
  }

  const approvedCount = guests.filter(g => g.payment_status === 'approved').length
  const pendingCount = guests.filter(g => g.payment_status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#1a1410] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="mb-12">
          <Link to="/host" className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#1a1410] transition-colors mb-6">
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Console
          </Link>
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-6 border-b border-gray-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b45309] bg-[#b45309]/10 px-3 py-1 rounded inline-block mb-3">
                {event.category || 'Event'} Management
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-[#1a1410]">{event.title}</h1>
            </div>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
              <div className="text-right">
                <span className="block text-gray-400 text-[10px] mb-1">Approved Guests</span>
                <span className="text-xl font-serif text-[#1a1410]">{approvedCount}</span> <span className="font-normal">/ {event.total_seats}</span>
              </div>
              <div className="text-right">
                <span className="block text-gray-400 text-[10px] mb-1">Pending Requests</span>
                <span className="text-xl font-serif text-[#b45309]">{pendingCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest List Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#1a1410] text-white px-8 py-4 flex justify-between items-center">
            <h2 className="font-serif text-xl">Guest Registry</h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">{guests.length} Total Bookings</span>
          </div>

          <div className="overflow-x-auto">
            {guests.length === 0 ? (
              <div className="p-16 text-center text-gray-400">
                <p className="font-serif text-2xl mb-2 text-[#1a1410]">No Guests Yet</p>
                <p className="font-light">Once attendees request tickets, they will appear here for your approval.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Attendee</th>
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Tickets</th>
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Fee Paid</th>
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-sm text-[#1a1410] mb-0.5">{guest.user.name}</p>
                        <p className="text-xs text-gray-400">{guest.user.email}</p>
                      </td>
                      <td className="px-8 py-6 font-serif text-xl text-[#1a1410]">{guest.seats}</td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-600">₹{guest.amount}</td>
                      <td className="px-8 py-6">
                        {guest.payment_status === 'approved' && (
                          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <CheckCircleIcon className="w-3.5 h-3.5 mr-1" /> Approved
                          </span>
                        )}
                        {guest.payment_status === 'rejected' && (
                          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-1 rounded">
                            <XCircleIcon className="w-3.5 h-3.5 mr-1" /> Rejected
                          </span>
                        )}
                        {guest.payment_status === 'pending' && (
                          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#b45309] bg-[#b45309]/10 px-2 py-1 rounded">
                            <ClockIcon className="w-3.5 h-3.5 mr-1" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {guest.payment_status === 'pending' && (
                          <div className="flex items-center justify-end space-x-3">
                            <button 
                              onClick={() => handleStatusUpdate(guest.id, 'rejected')}
                              className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 transition-colors"
                            >
                              Deny
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(guest.id, 'approved')}
                              className="text-xs font-bold uppercase tracking-wider text-white bg-[#1a1410] hover:bg-[#b45309] px-4 py-2 rounded-sm transition-colors"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                        {guest.payment_status !== 'pending' && (
                          <span className="text-xs font-bold uppercase tracking-wide text-gray-300">Actioned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default HostManageEvent
