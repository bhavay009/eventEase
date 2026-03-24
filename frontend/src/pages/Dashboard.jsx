import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPinIcon, TicketIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchCustomerDashboard()
  }, [])

  const fetchCustomerDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const [eventsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/api/events`),
        fetch(`${API_URL}/api/bookings/user/${user?.id || ''}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const eventsData = await eventsRes.json()
      const bookingsData = await bookingsRes.json()

      if (eventsData.success) {
        const upcoming = eventsData.events.filter(
          (e) => new Date(e.date) >= new Date()
        )
        setEvents(upcoming.slice(0, 4))
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
      <div className="flex justify-center flex-col gap-4 items-center min-h-screen bg-[#000000]">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-[#e6192b] animate-spin"></div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Accessing Vault...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* 1. HERO - VIP PROFILE OVERLAY */}
      <section className="relative pt-32 pb-16 px-6 bg-black border-b border-[#222] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e6192b] blur-[150px] opacity-20 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto z-10 relative">
          <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckBadgeIcon className="w-6 h-6 text-[#e6192b]" />
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#e6192b]">
                  Verified Attendee Network
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
                {user?.name?.split(' ')[0] || 'My Vault'}
              </h1>
              <p className="text-gray-400 text-sm font-medium w-full max-w-lg leading-relaxed mix-blend-lighten">
                Your authenticated digital ticket vault. Track upcoming kickbacks, massive arena performances, and view your historic booking telemetry natively.
              </p>
            </div>

            {/* VIP Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-[#111] border border-[#333] p-6 rounded-xl flex flex-col justify-center text-center">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Total Tickets</p>
                <p className="text-4xl font-black text-white">{bookings.length}</p>
              </div>
              <div className="bg-[#111] border border-[#333] p-6 rounded-xl flex flex-col justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#e6192b]" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Network Status</p>
                <p className="text-xl font-black text-[#e6192b] tracking-widest uppercase mt-1">VIP Target</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE VAULT: TICKET STUBS */}
      <section className="max-w-7xl mx-auto px-6 py-16 min-h-[40vh]">
        <div className="flex justify-between items-end mb-12 border-b border-[#333] pb-6">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Access Passes</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Your Secured Digital Tickets</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-[#111111] border border-dashed border-[#333] rounded-2xl p-20 text-center flex flex-col items-center">
            <TicketIcon className="w-12 h-12 text-[#333] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Empty Vault</h3>
            <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-6">You possess zero active access passes.</p>
            <Link to="/events" className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded hover:bg-[#e6192b] hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-none">
              Discover Grid
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {bookings.map((booking) => {
              const eventDate = new Date(booking.event.date)
              const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
              const day = eventDate.getDate().toString().padStart(2, '0')
              const year = eventDate.getFullYear()
              
              return (
                <div key={booking.id} className="relative group flex flex-col md:flex-row hover:-translate-y-1 transition-transform duration-300">
                  {/* Left Side: Art & Main Info */}
                  <div className="flex-1 bg-[#1a1a1a] border border-[#333] md:border-r-[2px] md:border-r-dashed border-r-[#111] p-8 flex flex-col justify-between relative overflow-hidden min-h-[200px] rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#e6192b]/20 to-transparent blur-2xl opacity-50 mix-blend-screen pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[8px] font-black tracking-[0.3em] uppercase bg-white/10 text-white px-2 py-1 rounded">Secured Ticket</span>
                        <span className="text-[8px] font-black tracking-[0.3em] uppercase text-[#e6192b] border border-[#e6192b]/30 px-2 py-1 rounded">{booking.event.category}</span>
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter line-clamp-1 group-hover:text-[#e6192b] transition-colors">
                        {booking.event.title}
                      </h3>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-3 flex items-center gap-2">
                        <MapPinIcon className="w-3 h-3 text-[#555]" /> {booking.event.location}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-10 relative z-10 border-t border-[#333] pt-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest font-bold text-gray-600 mb-1">Pass Configuration</p>
                        <p className="text-sm font-black text-white tracking-widest uppercase">{booking.seats}x Gen Admittance</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase tracking-widest font-bold text-gray-600 mb-1">Volume Rendered</p>
                        <p className="text-sm font-black text-white tracking-widest">₹{(booking.event.price * booking.seats).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: The Perforated Stub / Barcode */}
                  <div className="bg-[#111111] border border-[#333] border-t-0 md:border-y-[#333] md:border-r-[#333] md:border-l-0 w-full md:w-40 p-6 flex flex-row md:flex-col items-center justify-between relative rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
                    <div className="text-center w-full">
                      <p className="text-[12px] font-black text-[#e6192b] tracking-[0.2em]">{month}</p>
                      <p className="text-5xl font-black text-white leading-none my-2 tracking-tighter">{day}</p>
                      <p className="text-[10px] font-black text-gray-500 tracking-widest">{year}</p>
                    </div>
                    {/* Simulated Barcode Text */}
                    <div className="hidden md:flex flex-col items-center my-6 h-full min-h-[60px] opacity-30">
                      <div className="flex gap-1 h-full w-4 items-center justify-center -rotate-90 origin-center whitespace-nowrap overflow-hidden text-xs tracking-[-0.2em] font-mono text-white">
                        ||| || | | || | | ||| || || |
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center">
                      <TicketIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 3. RECOMMENDED LOCAL NETWORK */}
      <section className="bg-[#0a0a0a] py-20 border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10 border-b border-[#333] pb-6">
             <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Live Discoveries</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Upcoming Verified Parties</p>
             </div>
             <Link to="/events" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e6192b] hover:text-white transition-colors border-b border-[#e6192b] hover:border-white pb-1 hidden md:block">
               Browse Full Grid
             </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">No signals broadcasting in your area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((evt) => (
                <Link key={evt.id} to={`/events/${evt.id}`} className="group block bg-black border border-[#333] hover:border-[#555] transition-colors rounded-xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] bg-[#1a1a1a] overflow-hidden relative">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#e6192b] text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                        {evt.category}
                      </span>
                    </div>
                    <img src={evt.image_url} alt={evt.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 mix-blend-screen" onError={(e) => { e.target.style.display = 'none' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                    <div className="absolute bottom-5 left-5 right-5">
                       <p className="text-[10px] uppercase tracking-widest font-bold text-[#e6192b] mb-2">
                         {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                       </p>
                       <h3 className="text-xl font-black text-white leading-tight uppercase line-clamp-2">{evt.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
