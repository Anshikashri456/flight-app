import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Flight, Seat } from '@/lib/types'

type PassengerForm = {
  full_name: string
  passport_no: string
  nationality: string
  dob: string
}

type SearchQuery = {
  origin: string
  destination: string
  date: string
  passengers: number
}

type FlightStore = {
  searchQuery: SearchQuery
  selectedFlight: Flight | null
  selectedSeat: Seat | null
  bookingStep: number
  passengerForm: PassengerForm
  setSearchQuery: (query: SearchQuery) => void
  setSelectedFlight: (flight: Flight | null) => void
  setSelectedSeat: (seat: Seat | null) => void
  setBookingStep: (step: number) => void
  setPassengerForm: (form: PassengerForm) => void
  reset: () => void
}

const initialState = {
  searchQuery: { origin: '', destination: '', date: '', passengers: 1 },
  selectedFlight: null,
  selectedSeat: null,
  bookingStep: 0,
  passengerForm: { full_name: '', passport_no: '', nationality: '', dob: '' },
}

export const useFlightStore = create<FlightStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      setSelectedSeat: (seat) => set({ selectedSeat: seat }),
      setBookingStep: (step) => set({ bookingStep: step }),
      setPassengerForm: (form) => set({ passengerForm: form }),
      reset: () => set(initialState),
    }),
    {
      name: 'flight-store',
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedFlight: state.selectedFlight,
        bookingStep: state.bookingStep,
      }),
    }
  )
)