'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFlightStore } from '@/store/useFlightStore'
import { createClient } from '@/lib/supabase/client'

export default function PassengerPage() {
  const router = useRouter()
  const { selectedFlight, selectedSeat, passengerForm, setPassengerForm, reset } = useFlightStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    const totalPrice = (selectedFlight?.base_price || 0) + (selectedSeat?.extra_fee || 0)

    const { data, error } = await supabase.rpc('reserve_seat', {
      p_flight_id: selectedFlight?.id,
      p_seat_id: selectedSeat?.id,
      p_user_id: user.id,
      p_total_price: totalPrice,
      p_passenger: passengerForm
    })

    if (error || !data?.success) {
      setError(error?.message || data?.error || 'Booking failed')
      setLoading(false)
      return
    }

    router.push(`/booking/confirmation?pnr=${data.pnr_code}`)
  }

  if (!selectedFlight || !selectedSeat) {
    router.push('/')
    return null
  }

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-lg mx-auto">
        <button onClick={() => router.back()} className="text-blue-600 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-blue-700 mb-1">Passenger Details</h1>
        <p className="text-gray-500 mb-6">
          {selectedFlight.flight_no} · Seat {selectedSeat.seat_number} · ₹{selectedFlight.base_price + selectedSeat.extra_fee}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleBooking} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="As on passport"
                value={passengerForm.full_name}
                onChange={(e) => setPassengerForm({ ...passengerForm, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Passport Number</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. A1234567"
                value={passengerForm.passport_no}
                onChange={(e) => setPassengerForm({ ...passengerForm, passport_no: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Nationality</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Indian"
                value={passengerForm.nationality}
                onChange={(e) => setPassengerForm({ ...passengerForm, nationality: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={passengerForm.dob}
                onChange={(e) => setPassengerForm({ ...passengerForm, dob: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Booking...' : 'Confirm Booking 🎫'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}