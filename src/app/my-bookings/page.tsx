'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Booking = {
  id: string
  pnr_code: string
  status: string
  total_price: number
  booked_at: string
  flights: {
    flight_no: string
    origin: string
    destination: string
    departs_at: string
  }
  seats: {
    seat_number: string
    class: string
  }
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const fetchBookings = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data } = await supabase
      .from('bookings')
      .select('*, flights(*), seats(*)')
      .eq('user_id', user.id)
      .order('booked_at', { ascending: false })

    setBookings(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(bookingId)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.rpc('cancel_booking', {
      p_booking_id: bookingId,
      p_user_id: user?.id
    })
    if (data?.success) {
      fetchBookings()
    } else {
      alert(data?.error || 'Cancellation failed')
    }
    setCancellingId(null)
  }

  const statusColors: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    rescheduled: 'bg-yellow-100 text-yellow-700',
  }

  if (loading) return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <p className="text-blue-600">Loading bookings...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">My Bookings</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + New Booking
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No bookings yet.{' '}
            <a href="/" className="text-blue-600 hover:underline">Book a flight!</a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg text-gray-800">
                      {booking.flights?.origin} → {booking.flights?.destination}
                    </p>
                    <p className="text-gray-500 text-sm">{booking.flights?.flight_no}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <p className="text-gray-400">PNR</p>
                    <p className="font-bold text-blue-600 tracking-wider">{booking.pnr_code}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Seat</p>
                    <p className="font-medium">{booking.seats?.seat_number} ({booking.seats?.class})</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Departure</p>
                    <p className="font-medium">
                      {new Date(booking.flights?.departs_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Paid</p>
                    <p className="font-bold text-blue-600">₹{booking.total_price}</p>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="w-full border border-red-300 text-red-500 rounded-lg py-2 text-sm hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}