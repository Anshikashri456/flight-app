# ✈️ FlightApp — Flight Management Web App

A responsive, production-like Flight Management Web App built as part of an internship technical assignment. Passengers can search flights, book seats, manage bookings, and cancel reservations.

## 🔗 Live Demo
**[https://flight-app-ashy.vercel.app](https://flight-app-ashy.vercel.app)**

## 🧪 Test Credentials
- **Email:** testuser@flightapp.com
- **Password:** Test@1234

## 🚀 Tech Stack
- **Frontend & API:** Next.js 16 (App Router)
- **Database & Auth:** Supabase (PostgreSQL + Auth + Realtime)
- **State Management:** Zustand with persist middleware
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## ✅ Features Implemented
- 🔐 User authentication (signup/login) via Supabase Auth
- 🔍 Flight search by origin, destination and date
- 📋 Flight results with price and duration
- 💺 Interactive seat map with color-coded classes (First / Business / Economy)
- ⚡ Real-time seat availability via Supabase Realtime
- 📝 Passenger details booking form
- 🎫 PNR confirmation page with booking summary
- 📦 My Bookings page with status badges
- ❌ Cancel booking (blocked within 2 hours of departure at DB level)
- 🔒 Row Level Security — users see only their own bookings

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `flights` | Flight details, routes, pricing |
| `seats` | Seat map per flight with class and availability |
| `bookings` | User bookings with PNR code |
| `passengers` | Passenger details per booking |
| `reschedules` | Reschedule history |

## 🔐 Security
- RLS enabled on all tables
- Users can only access their own bookings
- Atomic seat reservation via Supabase RPC (prevents double-booking)
- Cancellation blocked within 2 hours of departure (DB trigger)
- Sensitive data (passport numbers) excluded from localStorage via Zustand `partialize`

## 📦 Zustand Store Structure

### useFlightStore
### useUserStore
## 🛠️ Local Setup

1. Clone the repository:
```bash
git clone https://github.com/Anshikashri456/flight-app.git
cd flight-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run migrations in Supabase SQL Editor (in order):
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_rls.sql`
   - `supabase/migrations/003_rpc.sql`
   - `supabase/migrations/004_seed.sql`

5. Start the dev server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
## ⚠️ Trade-offs & What I Would Improve
- **Reschedule feature** — partially designed at DB level but UI not completed due to time
- **PWA** — bonus task not implemented; would add next-pwa with manifest and service worker
- **UI polish** — Tailwind v4 had some compatibility issues with custom classes; would refine further
- **Error handling** — would add more granular error messages and loading states
- **Testing** — would add Jest + React Testing Library for unit tests

## 🌱 Seed Data
- 8 flights across 4 routes: Delhi↔Mumbai, Delhi↔Bangalore, Mumbai↔Bangalore, Delhi↔Chennai
- Each flight has 180 seats (30 rows × 6 columns)
- First class: rows 1-2, Business: rows 3-8, Economy: rows 9-30