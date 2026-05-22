'use client'
import { useRouter } from 'next/navigation'
import { useFlightStore } from '@/store/useFlightStore'

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai']

export default function Home() {
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useFlightStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/results')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="text-center mb-10 z-10">
        <div className="text-6xl mb-4">✈️</div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight">FlightApp</h1>
        <p className="text-blue-200 mt-2 text-lg">Search, book and manage your flights with ease</p>
      </div>

      {/* Search Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-2xl z-10">
        <h2 className="text-white font-semibold text-xl mb-6">🔍 Search Flights</h2>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-blue-200 text-sm font-medium">From</label>
            <select
              className="bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery.origin}
              onChange={(e) => setSearchQuery({ ...searchQuery, origin: e.target.value })}
              required
            >
              <option value="" className="text-black">Select city</option>
              {CITIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-blue-200 text-sm font-medium">To</label>
            <select
              className="bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery.destination}
              onChange={(e) => setSearchQuery({ ...searchQuery, destination: e.target.value })}
              required
            >
              <option value="" className="text-black">Select city</option>
              {CITIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-blue-200 text-sm font-medium">Date</label>
            <input
              type="date"
              className="bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery.date}
              onChange={(e) => setSearchQuery({ ...searchQuery, date: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-blue-200 text-sm font-medium">Passengers</label>
            <input
              type="number"
              min={1}
              max={9}
              className="bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery.passengers}
              onChange={(e) => setSearchQuery({ ...searchQuery, passengers: Number(e.target.value) })}
              required
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            Search Flights 🚀
          </button>
        </form>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-6 mt-10 z-10 max-w-2xl w-full">
        {[
          { icon: '🛫', title: 'Easy Booking', desc: 'Book in minutes' },
          { icon: '💺', title: 'Seat Selection', desc: 'Pick your seat' },
          { icon: '📋', title: 'Manage Trips', desc: 'Reschedule anytime' },
        ].map((f) => (
          <div key={f.title} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-center text-white">
            <div className="text-3xl mb-2">{f.icon}</div>
            <div className="font-semibold text-sm">{f.title}</div>
            <div className="text-blue-200 text-xs mt-1">{f.desc}</div>
          </div>
        ))}
      </div>
    </main>
  )
}