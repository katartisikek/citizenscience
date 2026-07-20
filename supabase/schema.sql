-- Citizen Science Hub Crete — Database Schema
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS postgis;

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'researcher', 'entity', 'admin')),
  area TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site settings (single row)
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title TEXT,
  hero_title_en TEXT,
  hero_subtitle TEXT,
  hero_subtitle_en TEXT,
  about_text TEXT,
  about_text_en TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  status TEXT NOT NULL DEFAULT 'Ενεργό',
  status_en TEXT DEFAULT 'Active',
  description TEXT,
  description_en TEXT,
  goal TEXT,
  goal_en TEXT,
  participants TEXT,
  participants_en TEXT,
  area TEXT,
  area_en TEXT,
  timeline TEXT,
  timeline_en TEXT,
  image TEXT,
  form_schema JSONB DEFAULT '[]',
  data_types JSONB DEFAULT '["geo","observation","photos","questionnaire","metadata","gdpr"]',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- News
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  date TEXT,
  date_en TEXT,
  type TEXT,
  type_en TEXT,
  content TEXT,
  content_en TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Citizen registrations (Participate form)
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  area TEXT,
  interests TEXT,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project proposals (Propose form)
CREATE TABLE proposals (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  area TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Observations (GPS + photo + form data)
CREATE TABLE observations (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  location GEOGRAPHY(POINT, 4326),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  photo_url TEXT,
  data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project members
CREATE TABLE project_members (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Auto-create profile on signup (never allow admin via client metadata)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role TEXT := COALESCE(NEW.raw_user_meta_data->>'role', 'citizen');
  first_name TEXT := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  last_name TEXT := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  composed_name TEXT := trim(both ' ' from (first_name || ' ' || last_name));
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, phone, area)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(composed_name, ''),
      NEW.raw_user_meta_data->>'full_name',
      ''
    ),
    NEW.email,
    CASE
      WHEN requested_role IN ('citizen', 'researcher', 'entity') THEN requested_role
      ELSE 'citizen'
    END,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'area', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-fill PostGIS location from lat/lng
CREATE OR REPLACE FUNCTION public.set_observation_location()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_observation_location ON observations;
CREATE TRIGGER trg_observation_location
  BEFORE INSERT OR UPDATE OF lat, lng ON observations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_observation_location();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read approved observations" ON observations FOR SELECT USING (status = 'approved');

-- Users update own profile
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE POLICY "Admin update profiles" ON profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users join projects" ON project_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own membership" ON project_members FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Anyone can register / propose
CREATE POLICY "Anyone can register" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can propose" ON proposals FOR INSERT WITH CHECK (true);

-- Authenticated users submit observations
CREATE POLICY "Auth users insert observations" ON observations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users read own observations" ON observations FOR SELECT USING (auth.uid() = user_id OR status = 'approved');

-- Admin policies (role = admin)
CREATE POLICY "Admin all settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all projects" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all news" ON news FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin read registrations" ON registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all proposals" ON proposals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all observations" ON observations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seed data
INSERT INTO site_settings (id, hero_title, hero_title_en, hero_subtitle, hero_subtitle_en, about_text, about_text_en)
VALUES (
  1,
  'Citizen Science Hub of Crete',
  'Citizen Science Hub of Crete',
  'Όταν οι πολίτες συμμετέχουν στην έρευνα, γίνονται μέρος της λύσης.',
  'When citizens participate in research, they become part of the solution.',
  'Ένα δίκτυο πολιτών, επιστημόνων και φορέων της Κρήτης.',
  'A network of citizens, scientists, and entities of Crete.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (title, title_en, status, status_en, description, description_en, goal, goal_en, participants, participants_en, area, area_en, timeline, timeline_en, image, form_schema, data_types)
VALUES
(
  'Mosquito Watch', 'Mosquito Watch', 'Ενεργό', 'Active',
  'Παρακολούθηση και καταγραφή πληθυσμών κουνουπιών στην Κρήτη.',
  'Monitoring mosquito populations in Crete.',
  'Χαρτογράφηση εστιών αναπαραγωγής', 'Mapping breeding grounds',
  'Όλοι οι πολίτες', 'All citizens',
  'Παγκρήτια', 'All over Crete',
  'Μάιος - Οκτώβριος 2026', 'May - October 2026',
  'https://images.unsplash.com/photo-1615814041724-4fec8b74c2e6?auto=format&fit=crop&q=80&w=800',
  '[{"name":"species","label":"Είδος κουνουπιού","type":"text"},{"name":"water_source","label":"Πηγή νερού κοντά","type":"select","options":["Λίμνη","Ποτάμι","Λούκι","Άλλο"]}]',
  '["geo","observation","photos","questionnaire","metadata","gdpr","species","measurements","temporal"]'
),
(
  'Youth4Diagnostics', 'Youth4Diagnostics', 'Ολοκληρωμένο', 'Completed',
  'Συλλογή δειγμάτων νερού από μαθητές.',
  'Water sample collection by students.',
  'Ανάλυση ποιότητας νερού', 'Water quality analysis',
  'Μαθητές & Εκπαιδευτικοί', 'Students & Teachers',
  'Νομός Ηρακλείου', 'Heraklion Prefecture',
  'Σεπτέμβριος 2025 - Μάιος 2026', 'September 2025 - May 2026',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
  '[{"name":"ph","label":"pH (αν γνωστό)","type":"number"},{"name":"notes","label":"Παρατηρήσεις","type":"textarea"}]',
  '["geo","observation","photos","questionnaire","metadata","gdpr","measurements","analysis","education","evaluation"]'
);

INSERT INTO news (title, title_en, date, date_en, type, type_en, content, content_en, image)
VALUES
(
  'Έναρξη καμπάνιας Mosquito Watch 2026',
  'Launch of Mosquito Watch campaign 2026',
  '12 Μαΐου 2026', 'May 12, 2026',
  'Ανακοίνωση', 'Announcement',
  'Η Περιφέρεια Κρήτης ανακοινώνει την έναρξη της καλοκαιρινής δράσης.',
  'The Region of Crete announces the summer action launch.',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
);

-- Storage bucket + policies for observation photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('observations', 'observations', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read observation photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'observations');

CREATE POLICY "Auth users upload observation photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'observations'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own observation photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'observations'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own observation photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'observations'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- After creating your admin account via Authentication > Users (or Sign Up),
-- promote them with (replace the email):
-- UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
