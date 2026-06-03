# 📰 NEAT MEDIA

A production-ready, full-stack journalism and media Content Management System built with Next.js 15, Supabase, and Tailwind CSS.

---

## ✨ Features

### Public Website
- **Editorial homepage** — Hero, featured stories, trending, breaking news ticker
- **Article pages** — Full SEO, Open Graph, reading time, social sharing (Facebook, X, WhatsApp, LinkedIn)
- **Category pages** — Paginated, filterable by section
- **Search** — Full-text search across all published articles
- **Author pages** — Bios, photo, social links
- **About & Contact** — Contact form with Supabase storage
- **Newsletter** — Email subscription capture
- **RSS Feed** — `/api/rss`
- **XML Sitemap** — `/sitemap.xml`
- **PWA** — Installable on mobile
- **Dark / Light mode**

### Admin CMS
- **Secure login** — Supabase Auth (email + password)
- **Dashboard** — Stats: total articles, views, drafts, popular stories
- **Rich text editor** — TipTap (bold, italic, headings, lists, blockquotes, images, links)
- **Article management** — Create, edit, delete, publish, schedule, mark as featured/breaking
- **Media library** — Drag-and-drop upload, preview, copy URL, delete
- **Categories** — Create, edit, delete with color picker
- **Tags** — Bulk manage tags
- **Author profile** — Photo, bio, social links
- **Analytics** — Views by article and by category

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── (public)/           ← Public website layout
│   │   ├── page.tsx         ← Homepage
│   │   ├── article/[slug]/  ← Article page
│   │   ├── category/[slug]/ ← Category page
│   │   ├── search/          ← Search
│   │   ├── about/           ← About page
│   │   └── contact/         ← Contact page
│   ├── admin/               ← Protected admin area
│   │   ├── login/           ← Login page
│   │   ├── page.tsx         ← Dashboard
│   │   ├── articles/        ← Article management
│   │   ├── categories/      ← Category management
│   │   ├── tags/            ← Tag management
│   │   ├── media/           ← Media library
│   │   ├── authors/         ← Author profile
│   │   └── analytics/       ← Analytics
│   └── api/                 ← API routes
│       ├── contact/         ← Contact form
│       ├── newsletter/      ← Newsletter subscribe
│       ├── views/           ← View tracking
│       └── rss/             ← RSS feed
├── components/
│   ├── article/             ← ArticleCard, AuthorCard, SocialShare
│   ├── admin/               ← ArticleEditor, AdminSidebar, etc.
│   ├── layout/              ← SiteHeader, SiteFooter, BreakingTicker
│   └── shared/              ← SectionHeader, etc.
├── lib/
│   ├── supabase.ts          ← Supabase client helpers
│   ├── articles.ts          ← Data access layer
│   └── utils.ts             ← Utilities
├── types/index.ts           ← TypeScript types
└── styles/globals.css       ← Global styles + design tokens
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)

---

## 📦 Installation

### 1. Clone and install

```bash
git clone <your-repo-url> my-cms
cd my-cms
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (see step 3 for Supabase keys).

---

## 🗄 Supabase Setup

### 3. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, database password, and region
3. Wait for project to initialize (~2 minutes)

### 4. Run the database schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run**

This creates all tables, indexes, RLS policies, storage buckets, and seed data.

### 5. Get your API keys

In Supabase dashboard → **Settings → API**:

- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 6. Configure Auth

In Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://yourdomain.com` (or `http://localhost:3000` for dev)
- **Redirect URLs**: Add `https://yourdomain.com/**` and `http://localhost:3000/**`

### 7. Create your admin user

**Option A: Via Supabase Dashboard**
1. Go to **Authentication → Users → Add User**
2. Enter your admin email and password
3. After creation, run this SQL to make them admin:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = '<paste-user-uuid-here>';
```

**Option B: Sign up and promote**
1. Start the dev server (`npm run dev`)
2. Go to `/admin/login` and sign up (if signups are enabled)
3. Run the SQL above to promote to admin

---

## 💻 Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public site  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — CMS

---

## 🌐 Vercel Deployment

### 8. Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

**Option B: GitHub Integration (Recommended)**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js — click **Deploy**

### 9. Add environment variables in Vercel

In Vercel dashboard → your project → **Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_SITE_NAME` | Your publication name |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Your site description |
| `NEXT_PUBLIC_SITE_TWITTER` | `@yourhandle` |

Then redeploy: **Deployments → Redeploy**.

---

## 🌍 Custom Domain

### 10. Connect your domain

**In Vercel:**
1. Go to your project → **Settings → Domains**
2. Add your domain (e.g., `yoursite.com`)
3. Vercel shows you DNS records to add

**In your DNS provider (GoDaddy, Namecheap, Cloudflare, etc.):**

For an apex domain (`yoursite.com`):
```
Type: A
Name: @
Value: 76.76.21.21
```

For a www subdomain:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Back in Supabase**, update your Site URL to the live domain:
- **Authentication → URL Configuration → Site URL**: `https://yoursite.com`

---

## 📝 Publishing Your First Article

1. Go to `/admin/login` and sign in
2. Click **New Article** in the header
3. Write your title, content using the rich text editor
4. Set **Category** and add **Tags** in the sidebar
5. Upload a **Featured Image**
6. Toggle **Published** in the status selector
7. Click **Publish**
8. Your article is live at `/article/your-article-slug`

---

## 🔧 Customization

### Change publication name
Edit `NEXT_PUBLIC_SITE_NAME` in `.env.local`

### Change colors/branding
Edit `tailwind.config.js` → `colors.accent` for the primary red color

### Add navigation categories
Edit `src/components/layout/SiteHeader.tsx` → `NAV_LINKS` array

### Modify homepage layout
Edit `src/app/(public)/page.tsx`

---

## 🔒 Security Notes

- **Service role key** is never exposed to the browser — only used server-side
- **Row Level Security** is enabled on all tables
- **Admin routes** are protected by middleware
- **Input validation** on all API routes
- **XSS protection** via React's built-in escaping (article HTML uses `dangerouslySetInnerHTML` — TipTap output is sanitized)

> **Tip**: For extra XSS protection on article content, add `isomorphic-dompurify` and sanitize `article.content` before rendering.

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` 15 | Framework (App Router) |
| `@supabase/supabase-js` | Database + Auth + Storage |
| `@supabase/ssr` | Server-side Supabase helpers |
| `@tiptap/react` | Rich text editor |
| `tailwindcss` | Styling |
| `next-themes` | Dark/light mode |
| `lucide-react` | Icons |
| `date-fns` | Date formatting |
| `react-hot-toast` | Notifications |

---

## 🗓 Scheduled Publishing

To auto-publish scheduled articles, set up a cron job that calls:

```sql
SELECT public.publish_scheduled_articles();
```

You can do this with:
- **Supabase pg_cron** (enable in Extensions, then schedule)
- **Vercel Cron Jobs** (call an API route that executes the function)
- **GitHub Actions** (scheduled workflow)

---

## 📊 Analytics (Optional: Google Analytics)

Add your GA4 measurement ID to `.env.local`:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Then add the Google Analytics script to `src/app/layout.tsx`.

---

## 🐛 Troubleshooting

**"relation does not exist" error**  
→ The SQL schema wasn't run. Go to Supabase SQL Editor and run `supabase-schema.sql`.

**Admin redirect loop**  
→ Your user isn't being found. Check that you created a user in Supabase Auth, not just the profiles table.

**Images not loading**  
→ Check that storage buckets were created and are set to **public**. In Supabase → Storage → bucket → make public.

**"Invalid JWT" errors**  
→ Your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is wrong. Double-check it in Supabase → Settings → API.

---

## 📄 License

MIT — feel free to use for personal or commercial projects.

---

*Built with ❤️ using Next.js 15, Supabase, and Tailwind CSS*
