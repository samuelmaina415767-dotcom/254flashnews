-- ============================================================
-- JOURNALISM CMS — Complete Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL DEFAULT '',
  bio          TEXT,
  avatar_url   TEXT,
  role         TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'editor', 'author')),
  twitter_url  TEXT,
  linkedin_url TEXT,
  website_url  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  color       TEXT DEFAULT '#c41e3a',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Articles
CREATE TABLE IF NOT EXISTS public.articles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                TEXT NOT NULL,
  subtitle             TEXT,
  slug                 TEXT NOT NULL UNIQUE,
  content              TEXT NOT NULL DEFAULT '',
  excerpt              TEXT,
  featured_image_url   TEXT,
  featured_image_alt   TEXT,
  status               TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  author_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id          UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  seo_title            TEXT,
  seo_description      TEXT,
  meta_keywords        TEXT,
  published_at         TIMESTAMPTZ,
  scheduled_at         TIMESTAMPTZ,
  reading_time         INTEGER,
  view_count           INTEGER NOT NULL DEFAULT 0,
  is_featured          BOOLEAN NOT NULL DEFAULT FALSE,
  is_breaking          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Article-Tag pivot
CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Media
CREATE TABLE IF NOT EXISTS public.media (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename          TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  url               TEXT NOT NULL,
  size              INTEGER NOT NULL DEFAULT 0,
  mime_type         TEXT NOT NULL DEFAULT 'image/jpeg',
  width             INTEGER,
  height            INTEGER,
  alt_text          TEXT,
  uploaded_by       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id   UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_name  TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content      TEXT NOT NULL,
  is_approved  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT NOT NULL UNIQUE,
  name       TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Article views (for detailed analytics)
CREATE TABLE IF NOT EXISTS public.article_views (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  ip_hash    TEXT,
  user_agent TEXT,
  referrer   TEXT,
  viewed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON public.articles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_is_breaking ON public.articles(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_view_count ON public.articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_articles_search ON public.articles USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
);
CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON public.article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON public.article_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON public.article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON public.article_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_articles
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = current_setting('app.admin_email', TRUE)
         THEN 'admin' ELSE 'author' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment view count (atomic, safe)
CREATE OR REPLACE FUNCTION public.increment_view_count(article_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = article_id AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-publish scheduled articles (call via pg_cron or external cron)
CREATE OR REPLACE FUNCTION public.publish_scheduled_articles()
RETURNS INTEGER AS $$
DECLARE published_count INTEGER;
BEGIN
  UPDATE public.articles
  SET status = 'published', published_at = NOW()
  WHERE status = 'scheduled' AND scheduled_at <= NOW();
  GET DIAGNOSTICS published_count = ROW_COUNT;
  RETURN published_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ---- PROFILES ----
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ---- ARTICLES ----
-- Anyone can read published articles
CREATE POLICY "Published articles are public"
  ON public.articles FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id OR public.is_admin());

-- Authors can create articles
CREATE POLICY "Authenticated users can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own; admins can update any
CREATE POLICY "Authors can update their own articles"
  ON public.articles FOR UPDATE
  USING (auth.uid() = author_id OR public.is_admin());

-- Only admins can delete
CREATE POLICY "Only admins can delete articles"
  ON public.articles FOR DELETE
  USING (auth.uid() = author_id OR public.is_admin());

-- ---- CATEGORIES ----
CREATE POLICY "Categories are public"
  ON public.categories FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can manage categories"
  ON public.categories FOR ALL USING (public.is_admin());

-- ---- TAGS ----
CREATE POLICY "Tags are public"
  ON public.tags FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can manage tags"
  ON public.tags FOR ALL USING (auth.uid() IS NOT NULL);

-- ---- ARTICLE TAGS ----
CREATE POLICY "Article tags are public"
  ON public.article_tags FOR SELECT USING (TRUE);

CREATE POLICY "Authors manage their article tags"
  ON public.article_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE id = article_id AND (author_id = auth.uid() OR public.is_admin())
    )
  );

-- ---- MEDIA ----
CREATE POLICY "Media is public"
  ON public.media FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can upload media"
  ON public.media FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own media"
  ON public.media FOR DELETE USING (auth.uid() = uploaded_by OR public.is_admin());

-- ---- COMMENTS ----
CREATE POLICY "Approved comments are public"
  ON public.comments FOR SELECT USING (is_approved = TRUE OR public.is_admin());

CREATE POLICY "Anyone can submit a comment"
  ON public.comments FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Only admins can update comments"
  ON public.comments FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete comments"
  ON public.comments FOR DELETE USING (public.is_admin());

-- ---- NEWSLETTER ----
CREATE POLICY "Only admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT USING (public.is_admin());

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Only admins can manage subscribers"
  ON public.newsletter_subscribers FOR UPDATE USING (public.is_admin());

-- ---- CONTACT MESSAGES ----
CREATE POLICY "Only admins can view contact messages"
  ON public.contact_messages FOR SELECT USING (public.is_admin());

CREATE POLICY "Anyone can send a contact message"
  ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

-- ---- ARTICLE VIEWS ----
CREATE POLICY "Admins can view all article views"
  ON public.article_views FOR SELECT USING (public.is_admin());

CREATE POLICY "Anyone can record a view"
  ON public.article_views FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these in Supabase Dashboard → Storage, or via the API

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('article-images', 'article-images', TRUE, 10485760,  -- 10MB
   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('author-images', 'author-images', TRUE, 5242880,     -- 5MB
   ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('media-library', 'media-library', TRUE, 10485760,    -- 10MB
   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read for article-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated upload for article-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete for article-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public read for author-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'author-images');

CREATE POLICY "Authenticated upload for author-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'author-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public read for media-library"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media-library');

CREATE POLICY "Authenticated upload for media-library"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media-library' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete for media-library"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media-library' AND auth.uid() IS NOT NULL);

-- ============================================================
-- SEED DATA — Default Categories
-- ============================================================

INSERT INTO public.categories (name, slug, description, color) VALUES
  ('News',       'news',       'Breaking news and current events', '#c41e3a'),
  ('Features',   'features',   'In-depth feature stories',         '#1a56db'),
  ('Opinion',    'opinion',    'Editorials and opinion pieces',     '#7e3af2'),
  ('Politics',   'politics',   'Political news and analysis',       '#057a55'),
  ('Business',   'business',   'Business and economic news',        '#b45309'),
  ('Technology', 'technology', 'Tech news and innovation',          '#0694a2'),
  ('Sports',     'sports',     'Sports news and results',           '#e02424'),
  ('Lifestyle',  'lifestyle',  'Culture, food and lifestyle',       '#d61f69'),
  ('Church',     'church',     'Faith and community news',          '#5521b5')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- NOTES:
-- 1. After running this, go to Supabase Dashboard → Auth → 
--    Settings and configure your site URL.
-- 2. Create your admin user via Supabase Dashboard → Auth → 
--    Users → Invite User (use your ADMIN_EMAIL).
-- 3. After creating the user, manually update their profile 
--    role to 'admin':
--    UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-id>';
-- ============================================================
