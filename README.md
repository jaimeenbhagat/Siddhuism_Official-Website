# siddhuism_official Portfolio

Modern, high-performance single-page creator portfolio built with Next.js App Router, Tailwind CSS, and Framer Motion.

## Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Framer Motion
- Nodemailer (contact API route)

## Features

- Full-screen hero with animated gradient and dynamic typing effect
- Sticky navigation + smooth scroll + scroll progress bar
- About section with glow profile treatment and social links
- Interactive category cards for dynamic video filtering
- Viewport-aware video autoplay/pause via Intersection Observer
- Lazy-loaded video sources + skeleton loaders
- Highlights carousel cards
- Contact form with toast states and API email delivery
- Loading screen + back-to-top button
- SEO metadata and mobile-first responsive layout

## Project Structure

```text
app/
	api/contact/route.ts
	globals.css
	layout.tsx
	page.tsx
components/
	ui/
	about-section.tsx
	categories-section.tsx
	contact-section.tsx
	footer.tsx
	hero-section.tsx
	highlights-section.tsx
	navbar.tsx
	portfolio-page.tsx
	video-showcase-section.tsx
lib/
	content.ts
public/
	profile-orb.svg
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Contact API Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in SMTP credentials.

Required environment variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO_EMAIL`

## Social Data Setup

The live social section uses:

- YouTube Data API v3 for subscriber counts, latest uploads, and trending videos
- Instagram Graph API for media posts and engagement data
- MongoDB for cached snapshots and 15-minute sync persistence

Add these environment variables before deployment:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`
- `CRON_SECRET`

The `/api/cron/social-sync` route is scheduled in `vercel.json` to refresh both snapshots every 15 minutes.

## Supabase YouTube Ingestion

This project also includes a dedicated YouTube ingestion + display pipeline backed by Supabase.

### Database Schema

Run the SQL file at `supabase/youtube_videos.sql` in your Supabase SQL editor.

### Required Variables

- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### Admin Upload

This project includes a lightweight admin upload page at `/admin/upload`.

Add these variables before using it:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `ADMIN_UPLOAD_SECRET`

The admin page uses signed uploads to send files directly to Supabase Storage, then inserts a row into `portfolio_videos`.

### Routes

- `GET /api/youtube/full-sync`: paginated full channel sync (manual trigger), supports up to 500 videos
- `GET /api/youtube/fetch`: incremental sync for latest uploads + stats refresh on existing rows
- `GET /api/youtube/videos`: reads from Supabase and returns `trendingVideos`, `trendingShorts`, and `latestUploads`
- `GET /api/portfolio/videos`: loads featured portfolio content for the homepage and portfolio page
- `POST /api/admin/portfolio-upload/init`: creates signed upload URLs for direct-to-storage uploads
- `POST /api/admin/portfolio-upload`: secret-protected upload + insert endpoint

### Sync Strategy

- Initial full sync: call `/api/youtube/full-sync?secret=CRON_SECRET&maxVideos=400`
- Incremental updates: cron hits `/api/youtube/fetch` every 15 minutes

### Trending Logic

Trending score is computed per row as:

- `views + (likes * 5) + (comments * 10)`

Collections are then built as:

- Trending Videos: `is_short = false`, ordered by score descending
- Trending Shorts: `is_short = true`, ordered by score descending
- Latest Uploads: ordered by `published_at` descending

### Auto Refresh

`vercel.json` schedules `GET /api/youtube/fetch` every 15 minutes for incremental refreshes.

## Performance Notes

- Heavy sections are dynamically imported.
- Videos load metadata first and only fetch source near viewport.
- Animations are transform/opacity-based.
- Layout is mobile-first and optimized for Lighthouse.

## Deploy

Deploy directly to Vercel. The app is ready for App Router deployment.
