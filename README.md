# Trackr — Frontend

Modern, responsive expense tracker dashboard built with **Next.js 16**, **TypeScript**, **TailwindCSS v4**, and **shadcn/ui**.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4 + shadcn/ui
- **State & Data:** TanStack Query (React Query)
- **HTTP Client:** Axios (with auto token refresh)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Toast:** Sonner
- **Theme:** next-themes (dark/light/system)

## Features

- Landing page with pricing, FAQs, and feature showcase
- JWT authentication (login, register, password reset)
- Dashboard with stats cards, charts, and insights
- Expense management (CRUD, search, filter, sort, pagination)
- Income management
- Category management (icons, colors, types)
- Budget management with progress tracking
- Analytics & reports with export to CSV
- Settings (profile, password, theme, delete account)
- Dark mode with persistence
- Mobile-responsive layout with slide-out sidebar
- Staggered entrance animations and hover effects
- Loading skeletons and empty states
- Automatic token refresh with redirect on expiry

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see `backend/README.md`)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/               # Login, Register, Forgot password
│   ├── dashboard/          # Dashboard layout + pages
│   │   ├── analytics/
│   │   ├── budgets/
│   │   ├── categories/
│   │   ├── expenses/
│   │   ├── income/
│   │   ├── reports/
│   │   └── settings/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles + theme vars
├── components/
│   ├── auth/               # Auth form component
│   ├── common/             # Theme toggle, animated content
│   ├── dashboard/          # Sidebar, stats cards, charts
│   └── ui/                 # Reusable primitives (Button, Card, etc.)
├── hooks/                  # useAuth
├── lib/                    # Axios client, utils
├── providers/              # Theme, Query, Toast providers
├── services/               # API service functions
├── types/                  # TypeScript interfaces
└── proxy.ts                # Route protection (middleware)
```

## Routes

| Path                     | Description          |
| ------------------------ | -------------------- |
| `/`                      | Landing page         |
| `/auth/login`            | Sign in              |
| `/auth/register`         | Create account       |
| `/auth/forgot-password`  | Reset password       |
| `/dashboard`             | Dashboard home       |
| `/dashboard/expenses`    | Expense management   |
| `/dashboard/income`      | Income management    |
| `/dashboard/categories`  | Category management  |
| `/dashboard/budgets`     | Budget management    |
| `/dashboard/analytics`   | Analytics & reports  |
| `/dashboard/reports`     | Report export        |
| `/dashboard/settings`    | Account settings     |

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run format    # Format with Prettier
```

## Environment Variables

| Variable                  | Description          |
| ------------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL`     | Backend API base URL |
