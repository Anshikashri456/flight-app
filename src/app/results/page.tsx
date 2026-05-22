'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFlightStore } from '@/store/useFlightStore'
import { createClient } from '@/lib/supabase/client'
import { Flight } from '@/lib/types'

export default function ResultsPage() {
  const router = useRouter()
  const { searchQuery, setSelectedFlight } = useFlightStore()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlights = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('flights')
        .select('*')
        .eq('origin', searchQuery.origin)
        .eq('destination', searchQuery.destination)
        .eq('status', 'scheduled')
      setFlights(data || [])
      setLoading(false)
    }
    fetchFlights()
  }, [])

  const handleSelect = (flight: Flight) => {
    setSelectedFlight(flight)
    router.push('/booking/seats')
  }

  if (loading) return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <p className="text-blue-600 text-lg">Searching flights...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/')} className="text-blue-600 mb-4 flex items-center gap-1">
          ← Back to Search
        </button>
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          {searchQuery.origin} → {searchQuery.destination}
        </h1>
        <p className="text-gray-500 mb-6">{flights.length} flights found</p>

        {flights.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No flights found for this route. Try different cities.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {flights.map((flight) => (
              <div key={flight.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-800">{flight.flight_no}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(flight.departs_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' → '}
                    {new Date(flight.arrives_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{flight.aircraft_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-bold text-xl">₹{flight.base_price}</p>
                  <button
                    onClick={() => handleSelect(flight)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}