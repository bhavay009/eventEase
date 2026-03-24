import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarIcon, ClockIcon, UsersIcon, ShieldCheckIcon, MapPinIcon, CurrencyRupeeIcon, CheckBadgeIcon, TicketIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const HostDashboard = () => {
  const { user, token } = useAuth()
  const [hostedEvents, setHostedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '', type: 'house', date: '', time: '19:00', location: '',
    guestLimit: '50', price: '0', image_url: '', guidelines: ''
  })
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const hostMetrics = {
    totalEvents: hostedEvents.length,
    totalRevenue: hostedEvents.reduce((acc, ev) => acc + ((ev.booked_seats || 0) * (ev.price || 0)), 0),
    guestsPending: hostedEvents.reduce((acc, ev) => acc + (ev.booked_seats || 0), 0),
    verified: true,
  }

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events/organizer/my-events`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setHostedEvents(data.events)
        }
      } catch (err) {
        console.error("Failed to fetch host events", err)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchMyEvents()
  }, [token, API_URL])

  const getDateParts = (dateString, timeString) => {
    const date = new Date(dateString)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      time: timeString || date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    try {
      const dbDate = new Date(`${formData.date}T${formData.time}`);
      
      const payload = {
        title: formData.title,
        description: formData.guidelines || `Local ${formData.type} gathering.`,
        date: dbDate.toISOString(),
        location: formData.location,
        price: parseFloat(formData.price) || 0,
        total_seats: parseInt(formData.guestLimit) || 50,
        category: formData.type,
        image_url: formData.image_url || null,
      }

      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (data.success) {
        alert('Event Created! It is now instantly live on the Attendee Discovery page.')
        setShowCreateModal(false)
        window.location.reload()
      } else {
        alert('Creation Failed: ' + data.message)
      }
    } catch(err) {
      alert('Network Error Creating Event')
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-white overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 min-h-[50vh] flex flex-col justify-center bg-black border-b border-[#222]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/hero-bg-v2.png"
            alt="Background Atmosphere"
            className="w-full h-full object-cover opacity-20 grayscale"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="text-left lg:w-1/2">
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#e6192b] block mb-4">
              Verified Host Network
            </span>
            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
              Host Your Local Kickback
            </h1>
            <p className="text-gray-400 text-sm font-medium max-w-lg leading-relaxed mb-8">
              A completely secure, verified platform to host your house parties. We handle local guest screening and upfront payments so you can focus exclusively on the night.
            </p>
          </div>

          {/* Quick Create Card */}
          <div className="lg:w-[450px] w-full">
            <div className="bg-[#111111] p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden border border-[#333]">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#e6192b]"></div>
              <div className="mb-8">
                <h3 className="text-2xl font-black uppercase text-white mb-2">Post a Party</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Go live in seconds natively</p>
              </div>
              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Party Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-[#1a1a1a] text-white text-sm font-bold border border-[#333] rounded-lg p-3 outline-none focus:border-[#e6192b] cursor-pointer">
                    <option value="" disabled>Select Format...</option>
                    <option value="concerts">Arena Concert</option>
                    <option value="festivals">Music Festival</option>
                    <option value="comedy">Standup Comedy</option>
                    <option value="house">Underground Kickback</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-[#1a1a1a] text-white text-sm font-bold border border-[#333] rounded-lg p-3 outline-none focus:border-[#e6192b] uppercase" />
                  </div>
                  <div className="w-1/3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Guest Limit</label>
                    <input type="number" placeholder="50" value={formData.guestLimit} onChange={(e) => setFormData({...formData, guestLimit: e.target.value})} className="w-full bg-[#1a1a1a] text-white text-sm font-bold border border-[#333] rounded-lg p-3 outline-none focus:border-[#e6192b]" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Cover Image URL</label>
                  <input type="text" placeholder="https://..." value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full bg-[#1a1a1a] text-white text-sm font-bold border border-[#333] rounded-lg p-3 outline-none focus:border-[#e6192b] placeholder-gray-600" />
                </div>
              </div>
              <div className="flex flex-col space-y-4 pt-4 border-t border-[#222]">
                <button onClick={() => setShowCreateModal(true)} className="w-full py-4 bg-[#e6192b] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(230,25,43,0.2)]">
                  Publish Party
                </button>
                <a href="#hosted-events" className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors pt-2">
                  View Active Parties
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD METRICS */}
      <section className="relative py-12 px-6 z-10 bg-[#0a0a0a] border-b border-[#222]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111111] p-6 rounded-2xl border border-[#333] flex items-center justify-between group hover:border-[#444] transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#e6192b] blur-3xl opacity-20 pointer-events-none" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Host Security</p>
                <p className="text-lg font-black text-[#e6192b] mb-1">ID Verified</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Screening Active</p>
              </div>
              <div className="w-12 h-12 bg-[rgba(230,25,43,0.1)] rounded-full flex items-center justify-center border border-[#e6192b]/30">
                <ShieldCheckIcon className="w-5 h-5 text-[#e6192b]" />
              </div>
            </div>
            <div className="bg-[#111111] p-6 rounded-2xl border border-[#333] flex items-center justify-between group hover:border-[#444] transition-colors">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Active Parties</p>
                <p className="text-3xl font-black text-white">{hostMetrics.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#333] group-hover:border-[#e6192b] transition-colors">
                <TicketIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </div>
            </div>
            <div className="bg-[#111111] p-6 rounded-2xl border border-[#333] flex items-center justify-between group hover:border-[#444] transition-colors">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Total Guests Hosted</p>
                <p className="text-3xl font-black text-white">{hostMetrics.guestsPending}</p>
              </div>
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#333] group-hover:border-[#e6192b] transition-colors">
                <UsersIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </div>
            </div>
            <div className="bg-[#111111] p-6 rounded-2xl border border-[#333] flex items-center justify-between group hover:border-[#444] transition-colors">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Total Earnings</p>
                <p className="text-3xl font-black text-white">₹{hostMetrics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#333] group-hover:border-[#e6192b] transition-colors">
                <CurrencyRupeeIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE & PAYOUTS */}
      <section className="py-16 bg-[#000000] border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Left: Revenue Chart */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-8">
                 <div>
                   <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-2">Earnings</h3>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Trailing 30-Day Revenue</p>
                 </div>
                 <h4 className="text-3xl font-black text-white">₹{hostMetrics.totalRevenue.toLocaleString()}</h4>
              </div>
              
              <div className="bg-[#111111] border border-[#333] rounded-2xl p-8 h-[300px] flex items-end justify-between gap-4">
                 {[40, 70, 45, 90, 65, 80, 50, 100, 85, 60, 30, 75].map((h, i) => (
                   <div key={i} className="w-full flex flex-col items-center group relative cursor-pointer h-full justify-end">
                     <div className="absolute bottom-[calc(100%+8px)] bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 z-10 whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                       ₹{(h*1000).toLocaleString()}
                     </div>
                     <div style={{ height: `${h}%` }} className="w-full bg-[#222] group-hover:bg-[#e6192b] rounded-t-sm transition-all duration-300 relative overflow-hidden">
                       <div className="absolute top-0 w-full h-[2px] bg-white/20 transition-colors" />
                     </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Right: Escrow Payout Table */}
            <div>
              <div className="flex justify-between items-end mb-8">
                 <div>
                   <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-2">Payouts</h3>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure Revenue Transfers</p>
                 </div>
              </div>

              <div className="bg-[#111111] border border-[#333] rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col h-[300px]">
                 <div className="px-8 py-6 border-b border-[#333] flex justify-between items-center bg-[#151515]">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Available Balance</span>
                   <span className="text-2xl font-black text-white">₹12,400</span>
                 </div>
                 <div className="p-8 space-y-6 flex-grow overflow-y-auto override-scrollbar">
                    <div className="flex justify-between items-center">
                       <div>
                         <p className="font-bold text-sm text-white mb-1">Private Kickback</p>
                         <p className="text-[10px] uppercase tracking-widest text-[#e6192b] font-bold">Clearing Apr 22</p>
                       </div>
                       <span className="text-white font-bold text-sm">₹8,500</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#333] pt-6">
                       <div>
                         <p className="font-bold text-sm text-white mb-1">Terminal Launch Party</p>
                         <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Settled</p>
                       </div>
                       <span className="text-white font-bold text-sm">₹3,900</span>
                    </div>
                 </div>
                 <button className="w-full py-5 bg-[#e6192b] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                   Withdraw Funds
                 </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* YOUR EVENTS */}
      <section id="hosted-events" className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12 border-b border-[#333] pb-6 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Your Active Parties</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Manage your upcoming and past events safely</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="mt-6 md:mt-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e6192b] hover:text-white transition-colors border-b border-[#e6192b] hover:border-white pb-1 inline-block">
            + Host Another Party
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-[#111] border border-[#222] rounded-2xl animate-pulse" />)}
            </div>
          ) : hostedEvents.length === 0 ? (
             <div className="bg-[#111111] border border-dashed border-[#333] rounded-2xl p-16 text-center">
                <h3 className="text-xl font-bold text-white mb-2 uppercase">Zero Active Instances</h3>
                <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Draft an event to populate the registry.</p>
             </div>
          ) : (
            hostedEvents.map((event) => {
              const { month, day, time } = getDateParts(event.date, event.time)
              const isFull = event.status === 'Full'
              return (
                <div key={event.id} className="bg-[#111111] border border-[#333] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-[#555] hover:bg-[#151515] transition-all duration-300">
                  
                  {/* Date Block */}
                  <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-[#333] pr-6 hidden md:flex">
                    <span className="text-[10px] font-bold text-[#e6192b] tracking-widest uppercase mb-1">{month}</span>
                    <span className="text-4xl font-black text-white leading-none mb-2">{day}</span>
                    <span className="text-[10px] font-bold text-gray-500">{time}</span>
                  </div>

                  {/* Info Core */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                       <span className="text-[10px] font-bold text-[#e6192b] uppercase tracking-[0.2em]">{event.category}</span>
                       <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${isFull ? 'bg-[#e6192b]/20 text-[#e6192b] border border-[#e6192b]/30' : 'bg-white/10 text-white border border-white/20'}`}>{event.status || 'Active'}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight truncate">{event.title}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                      <div className="flex items-center gap-2"><MapPinIcon className="w-3 h-3 text-[#555]" /> {event.location}</div>
                      <div className="flex items-center gap-2"><UsersIcon className="w-3 h-3 text-[#555]" /> Load: {event.guestsJoined || event.booked_seats || 0} / {event.totalCapacity || event.total_seats || 50} Limit</div>
                    </div>
                  </div>

                  {/* Action Commands */}
                  <div className="flex flex-row md:flex-col items-stretch gap-2 w-full md:w-auto mt-6 md:mt-0">
                    <button className="flex-1 md:flex-none px-6 py-2 bg-[#222] border border-[#333] text-white text-[10px] font-bold uppercase tracking-widest hover:border-gray-400 hover:bg-[#333] transition-colors rounded">
                      Configuration
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2 bg-[#222] border border-[#333] text-white text-[10px] font-bold uppercase tracking-widest hover:border-gray-400 hover:bg-[#333] transition-colors rounded">
                      Export Data
                    </button>
                    <Link to={`/host/event/${event.id}`} className="flex-1 md:flex-none px-6 py-2 bg-[#e6192b] border border-[#e6192b] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all text-center rounded whitespace-nowrap shadow-[0_0_10px_rgba(230,25,43,0.3)]">
                      Control Room
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* EVENT CREATION MODAL OVERRIDE (DARK) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4 py-12">
          <div className="relative bg-[#0a0a0a] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden mt-10 border border-[#333]">
            <div className="bg-[#111111] border-b border-[#333] text-white p-8 flex justify-between items-center">
               <div>
                 <h3 className="text-3xl font-black uppercase tracking-tight">Post a Party</h3>
                 <p className="text-[#e6192b] text-[10px] font-bold tracking-[0.2em] uppercase mt-2">Initialize event parameters</p>
               </div>
               <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white text-3xl font-light transition-colors">×</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Party Name</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Diwali Underground Kickback" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] transition-colors outline-none placeholder-gray-600 text-lg" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Party Format</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none cursor-pointer text-sm">
                    <option value="house">Underground Kickback</option>
                    <option value="concerts">Arena Concert</option>
                    <option value="festivals">Music Festival</option>
                    <option value="comedy">Standup Routine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Guest Limit</label>
                  <input type="number" value={formData.guestLimit} onChange={(e) => setFormData({...formData, guestLimit: e.target.value})} placeholder="50" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none placeholder-gray-600 text-sm" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none text-sm uppercase" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Start Time</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none text-sm" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Cover Image URL (Optional)</label>
                  <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none placeholder-gray-600 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Location (City or Address)</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Pune, Maharashtra" className="flex-1 bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none placeholder-gray-600 text-sm" required />
                    <select className="md:w-1/3 bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-[#e6192b] font-bold focus:border-[#e6192b] outline-none cursor-pointer text-sm">
                      <option value="hide">Hide exact address until booked</option>
                      <option value="show">Show address publicly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Ticket Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0 (Leave empty for free access)" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none placeholder-gray-600 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Guest Screening Checks</label>
                  <select className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none cursor-pointer text-sm">
                    <option value="approval">Strict (Screen guests manually)</option>
                    <option value="invite">Invite Only (Secret Link)</option>
                    <option value="open">Open (Auto-Approve everyone)</option>
                  </select>
                </div>
                
                {/* SAFETY PROTOCOLS / TERMS SECTION */}
                <div className="md:col-span-2 space-y-4 pt-4 border-t border-[#222]">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Safety Guidelines & House Rules</label>
                  <textarea value={formData.guidelines} onChange={(e) => setFormData({...formData, guidelines: e.target.value})} placeholder="e.g., 21+ strictly enforced at the door. No plus ones allowed without screening. Security will be present..." className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-bold focus:border-[#e6192b] outline-none placeholder-gray-600 text-sm h-24 resize-none" required />
                </div>
                
                <div className="md:col-span-2 pt-2">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 bg-[#111] border border-[#333] rounded accent-[#e6192b] cursor-pointer" required />
                    <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-gray-400 group-hover:text-white transition-colors leading-[1.6]">
                      I accept the <span className="text-[#e6192b]">Host Terms & Conditions</span>. I declare that I am solely responsible for the physical safety and conduct of my attendees, and that EventEase operates purely as a secure ticketing and identity facilitator. I will strictly enforce the rules listed above.
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-6 pt-8 mt-6 border-t border-[#222]">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3 text-[10px] font-bold tracking-[0.2em] text-gray-500 hover:text-white uppercase transition-colors">Cancel</button>
                <button type="submit" disabled={!agreedToTerms} className="px-10 py-3 bg-[#e6192b] text-white uppercase tracking-[0.2em] font-bold text-[10px] hover:bg-white hover:text-black rounded transition-colors shadow-[0_0_15px_rgba(230,25,43,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">Publish Party</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default HostDashboard
