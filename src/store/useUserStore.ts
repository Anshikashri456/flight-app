import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Booking } from '@/lib/types'

interface UserStore {
  session: {
    access_token: string
    user_id: string
    email: string
  } | null
  cachedBookings: Booking[]

  setSession: (session: UserStore['session']) => void
  setCachedBookings: (bookings: Booking[]) => void
  reset: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      session: null,
      cachedBookings: [],

      setSession: (session) => set({ session }),
      setCachedBookings: (bookings) => set({ cachedBookings: bookings }),
      reset: () => set({ session: null, cachedBookings: [] }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        session: state.session
          ? { access_token: state.session.access_token, user_id: state.session.user_id, email: state.session.email }
          : null,
      }),
    }
  )
)