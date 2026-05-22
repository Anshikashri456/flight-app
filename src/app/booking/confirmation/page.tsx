'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFlightStore } from '@/store/useFlightStore'
import { Suspense } from 'react'

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pnr = searchParams.get('pnr')
  const { selectedFlight, selectedSeat, reset } = useFlightStore()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          reset()
          router.push('/my-bookings')
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-6">Your flight has been booked successfully</p>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">PNR Code</p>
            <p className="text-3xl font-bold text-blue-700 tracking-widest">{pnr}</p>
          </div>

          <div className="flex flex-col gap-3 text-left mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Flight</span>
              <span className="font-medium">{selectedFlight?.flight_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Route</span>
              <span className="font-medium">{selectedFlight?.origin} → {selectedFlight?.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Seat</span>
              <span className="font-medium">{selectedSeat?.seat_number} ({selectedSeat?.class})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Departure</span>
              <span className="font-medium">
                {selectedFlight ? new Date(selectedFlight.departs_at).toLocaleString() : ''}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-bold text-blue-600">
                ₹{(selectedFlight?.base_price || 0) + (selectedSeat?.extra_fee || 0)}
              </span>
            </div>
          </div>

          <button
            onClick={() => { reset(); router.push('/my-bookings') }}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition"
          >
            View My Bookings
          </button>

          <p className="text-gray-400 text-sm mt-4">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </div>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  )
}