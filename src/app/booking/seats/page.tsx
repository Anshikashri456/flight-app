'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFlightStore } from '@/store/useFlightStore'
import { createClient } from '@/lib/supabase/client'
import { Seat } from '@/lib/types'

const CLASS_COLORS: Record<string, string> = {
  first: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  business: 'bg-blue-100 border-blue-400 text-blue-800',
  economy: 'bg-gray-100 border-gray-300 text-gray-700',
}

export default function SeatsPage() {
  const router = useRouter()
  const { selectedFlight, selectedSeat, setSelectedSeat, setBookingStep } = useFlightStore()
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedFlight) { router.push('/'); return }
    const fetchSeats = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('seats')
        .select('*')
        .eq('flight_id', selectedFlight.id)
        .order('seat_number')
      setSeats(data || [])
      setLoading(false)
    }
    fetchSeats()

    const supabase = createClient()
    const channel = supabase
      .channel('seats-realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'seats',
        filter: `flight_id=eq.${selectedFlight.id}`
      }, (payload) => {
        setSeats((prev) => prev.map((s) =>
          s.id === payload.new.id ? { ...s, ...payload.new } : s
        ))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleContinue = () => {
    if (!selectedSeat) return
    setBookingStep(1)
    router.push('/booking/passenger')
  }

  const rows = Array.from({ length: 30 }, (_, i) => i + 1)
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']

  if (loading) return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <p className="text-blue-600">Loading seat map...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-lg mx-auto">
        <button onClick={() => router.push('/results')} className="text-blue-600 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-blue-700 mb-1">Select Your Seat</h1>
        <p className="text-gray-500 mb-4">{selectedFlight?.flight_no} · {selectedFlight?.origin} → {selectedFlight?.destination}</p>

        <div className="flex gap-4 mb-4 text-xs flex-wrap">
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-yellow-100 border border-yellow-400 inline-block"></span> First</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-blue-100 border border-blue-400 inline-block"></span> Business</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-gray-100 border border-gray-300 inline-block"></span> Economy</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-400 inline-block"></span> Selected</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-gray-400 inline-block"></span> Taken</span>
        </div>

        <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-[60vh]">
          <div className="flex justify-center gap-1 mb-2">
            <div className="w-7"></div>
            {cols.map(c => (
              <div key={c} className="w-7 text-center text-xs font-bold text-gray-400">{c}</div>
            ))}
          </div>
          {rows.map(row => (
            <div key={row} className="flex justify-center gap-1 mb-1">
              <div className="w-7 text-center text-xs text-gray-400 flex items-center justify-center">{row}</div>
              {cols.map(col => {
                const seatNo = `${row}${col}`
                const seat = seats.find(s => s.seat_number === seatNo)
                if (!seat) return <div key={col} className="w-7 h-7"></div>
                const isSelected = selectedSeat?.id === seat.id
                const isTaken = !seat.is_available
                return (
                  <button
                    key={col}
                    onClick={() => !isTaken && setSelectedSeat(seat)}
                    disabled={isTaken}
                    title={`${seat.class} · ₹${seat.extra_fee} extra`}
                    className={`w-7 h-7 rounded text-xs border-2 font-medium transition
                      ${isTaken ? 'bg-gray-400 border-gray-400 cursor-not-allowed' : ''}
                      ${isSelected ? 'bg-green-400 border-green-500 text-white' : ''}
                      ${!isTaken && !isSelected ? CLASS_COLORS[seat.class] : ''}
                    `}
                  >
                    {isSelected ? '✓' : ''}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {selectedSeat && (
          <div className="mt-4 bg-white rounded-xl p-4 flex justify-between items-center shadow">
            <div>
              <p className="font-bold">Seat {selectedSeat.seat_number}</p>
              <p className="text-gray-500 text-sm capitalize">{selectedSeat.class} · ₹{selectedSeat.extra_fee} extra</p>
            </div>
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}