-- Citizen Science Hub Crete — Initial Schema
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS postgis;

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'researcher', 'entity', 'admin')),
  region TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  status TEXT NOT NULL DEFAULT 'Ενεργό',
  status_en TEXT DEFAULT 'Active',
  image TEXT,
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
  form_schema JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS news (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  type TEXT DEFAULT 'Ανακοίνωση',
  type_en TEXT DEFAULT 'Announcement',
  date TEXT,
  date_en TEXT,
  content TEXT,
  content_en TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title TEXT,
  hero_title_en TEXT,
  hero_subtitle TEXT,
  hero_subtitle_en TEXT,
  about_text TEXT,
  about_text_en TEXT
);

-- Registrations (Participate form)
CREATE TABLE IF NOT EXISTS registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  region TEXT,
  interests TEXT,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project proposals
CREATE TABLE IF NOT EXISTS proposals (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  area TEXT,
  description TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project members
CREATE TABLE IF NOT EXISTS project_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, user_id)
);

-- Observations
CREATE TABLE IF NOT EXISTS observations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location GEOGRAPHY(POINT, 4326),
  photo_url TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Set geography from lat/lng
CREATE OR REPLACE FUNCTION set_observation_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS observation_location_trigger ON observations;
CREATE TRIGGER observation_location_trigger
  BEFORE INSERT OR UPDATE ON observations
  FOR EACH ROW EXECUTE FUNCTION set_observation_location();

-- Helper: check admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_researcher_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('researcher', 'admin'));
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles readable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL USING (is_admin());

-- Projects policies
CREATE POLICY "Projects public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin manage projects" ON projects FOR ALL USING (is_admin());
CREATE POLICY "Researchers manage own projects" ON projects FOR ALL
  USING (created_by = auth.uid() AND is_researcher_or_admin());

-- News policies
CREATE POLICY "News public read" ON news FOR SELECT USING (true);
CREATE POLICY "Admin manage news" ON news FOR ALL USING (is_admin());

-- Site settings policies
CREATE POLICY "Settings public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON site_settings FOR ALL USING (is_admin());

-- Registrations policies
CREATE POLICY "Anyone can register" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read registrations" ON registrations FOR SELECT USING (is_admin());
CREATE POLICY "Users read own registration" ON registrations FOR SELECT USING (user_id = auth.uid());

-- Proposals policies
CREATE POLICY "Anyone can propose" ON proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage proposals" ON proposals FOR ALL USING (is_admin());
CREATE POLICY "Users read own proposals" ON proposals FOR SELECT USING (user_id = auth.uid());

-- Project members policies
CREATE POLICY "Members public read" ON project_members FOR SELECT USING (true);
CREATE POLICY "Users join projects" ON project_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage members" ON project_members FOR ALL USING (is_admin());

-- Observations policies
CREATE POLICY "Approved observations public" ON observations FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid() OR is_researcher_or_admin());
CREATE POLICY "Auth users submit observations" ON observations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own pending" ON observations FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Researchers approve observations" ON observations FOR UPDATE
  USING (is_researcher_or_admin());

-- Storage buckets (run separately in Storage UI or via API):
-- observations: public read, authenticated upload
-- project-images: public read, admin upload

-- Seed data
INSERT INTO site_settings (id, hero_title, hero_title_en, hero_subtitle, hero_subtitle_en, about_text, about_text_en)
VALUES (
  1,
  'Citizen Science Hub of Crete',
  'Citizen Science Hub of Crete',
  'Όταν οι πολίτες συμμετέχουν στην έρευνα, γίνονται μέρος της λύσης. Ελάτε να κατανοήσουμε και να προστατεύσουμε το περιβάλλον της Κρήτης μαζί.',
  'When citizens participate in research, they become part of the solution. Come understand and protect the environment of Crete with us.',
  'Ένα δίκτυο πολιτών, επιστημόνων και φορέων της Κρήτης που συνεργάζονται για τη συλλογή κρίσιμων περιβαλλοντικών δεδομένων με σύγχρονες μεθόδους.',
  'A network of citizens, scientists, and entities of Crete collaborating to collect critical environmental data with modern methods.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (title, title_en, status, status_en, image, description, description_en, goal, goal_en, participants, participants_en, area, area_en, timeline, timeline_en, form_schema)
VALUES
(
  'Mosquito Watch', 'Mosquito Watch', 'Ενεργό', 'Active',
  'https://images.unsplash.com/photo-1615814041724-4fec8b74c2e6?auto=format&fit=crop&q=80&w=800',
  'Παρακολούθηση και καταγραφή πληθυσμών κουνουπιών στην Κρήτη για την προστασία της δημόσιας υγείας.',
  'Monitoring and recording mosquito populations in Crete to protect public health.',
  'Χαρτογράφηση εστιών αναπαραγωγής', 'Mapping breeding grounds',
  'Όλοι οι πολίτες', 'All citizens', 'Παγκρήτια', 'All over Crete',
  'Μάιος - Οκτώβριος 2026', 'May - October 2026',
  '[{"name":"water_source","label":"Τύπος υδάτινης πηγής","label_en":"Water source type","type":"select","options":["Λίμνη","Ποτάμι","Λακκούβα","Άλλο"]},{"name":"notes","label":"Σημειώσεις","label_en":"Notes","type":"textarea"}]'::jsonb
),
(
  'Youth4Diagnostics', 'Youth4Diagnostics', 'Ολοκληρωμένο', 'Completed',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
  'Συλλογή δειγμάτων νερού από μαθητές για την ανάλυση της ποιότητας των υδάτινων πόρων της περιοχής.',
  'Collection of water samples by students for the analysis of the area''s water resources quality.',
  'Ανάλυση ποιότητας νερού', 'Water quality analysis',
  'Μαθητές & Εκπαιδευτικοί', 'Students & Teachers', 'Νομός Ηρακλείου', 'Heraklion Prefecture',
  'Σεπτέμβριος 2025 - Μάιος 2026', 'September 2025 - May 2026',
  '[{"name":"ph_level","label":"pH (αν γνωστό)","label_en":"pH (if known)","type":"number"},{"name":"turbidity","label":"Θολερότητα","label_en":"Turbidity","type":"select","options":["Καθαρό","Μετρίως θολό","Θολό"]}]'::jsonb
);

INSERT INTO news (title, title_en, type, type_en, date, date_en, content, content_en, image)
VALUES
(
  'Έναρξη της νέας καμπάνιας Mosquito Watch για το καλοκαίρι του 2026',
  'Launch of the new Mosquito Watch campaign for summer 2026',
  'Ανακοίνωση', 'Announcement', '12 Μαΐου 2026', 'May 12, 2026',
  'Η Περιφέρεια Κρήτης σε συνεργασία με το Citizen Science Hub ανακοινώνουν την έναρξη της καλοκαιρινής δράσης για την παρακολούθηση κουνουπιών...',
  'The Region of Crete in collaboration with the Citizen Science Hub announces the launch of the summer action for mosquito monitoring...',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
),
(
  'Αποτελέσματα Δειγματοληψίας Νερού Youth4Diagnostics',
  'Youth4Diagnostics Water Sampling Results',
  'Αποτελέσματα', 'Results', '10 Απριλίου 2026', 'April 10, 2026',
  'Δημοσιεύθηκαν σήμερα τα αποτελέσματα από την ανάλυση 500 δειγμάτων νερού που συλλέχθηκαν από μαθητές...',
  'The results from the analysis of 500 water samples collected by students were published today...',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800'
);
