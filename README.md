# Jain Network — Business Directory

A clean, modern business directory platform for the Jain community. Built with Next.js 15, Supabase, and Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (Email + Password)
- **Deployment**: Vercel

## Features (Phase 1)

- ✅ User registration & login
- ✅ Business registration with admin approval
- ✅ SEO-friendly business slugs (`/businesses/royal-jewellers-indore`)
- ✅ Business search with ILIKE across name, owner, category, description, city
- ✅ Category and city filters
- ✅ Pagination
- ✅ Advertisement creation (without payment)
- ✅ Admin panel — approve/reject/delete businesses, ads, users
- ✅ Admin search across all tables
- ✅ Homepage stats from database
- ✅ Responsive design (desktop + mobile)
- ✅ Row Level Security on all tables

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd JainNetwork
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Add your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database setup

The database schema has already been applied to the Supabase project via migration. It includes:

- `categories` table (seeded with 20 business categories)
- `profiles` table (auto-created on signup via trigger)
- `businesses` table (with slug, category_id FK)
- `advertisements` table
- Row Level Security policies on all tables
- Indexes for search performance

### 5. Set up admin user

After registering your first user, promote them to admin:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

Run this in the Supabase SQL editor.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

No additional configuration needed.

## Project Structure

```
src/
├── actions/          # Server actions (auth, business, advertisement, admin)
├── app/
│   ├── (auth)/       # Login, Register
│   ├── admin/        # Admin panel pages
│   ├── businesses/   # Public business browse & detail
│   └── dashboard/    # User dashboard pages
├── components/       # Shared components
│   └── ui/           # shadcn/ui components
├── lib/
│   ├── supabase/     # Supabase client configs
│   ├── constants.ts  # App constants
│   └── utils.ts      # shadcn utility
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## Phase 2 (Planned)

- Payment integration for advertisements
- Image uploads
- Reviews & ratings
- Maps integration
- Analytics dashboard
- Business verification badges
