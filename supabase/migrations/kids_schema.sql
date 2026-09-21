-- Citizen Science Kids — Database Schema Extension
-- Privacy-first architecture: "Collect scientific observations, not student identities"
-- Run this in Supabase SQL Editor (same project as main Citizen Science Hub)

-- ============================================================
-- ORGANISATIONS & SCHOOLS
-- ============================================================

CREATE TABLE IF NOT EXISTS organisations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  type TEXT DEFAULT 'institution' CHECK (type IN ('institution', 'ngo', 'university', 'government', 'other')),
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schools (
  id BIGSERIAL PRIMARY KEY,
  organisation_id BIGINT REFERENCES organisations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  name_en TEXT,
  city TEXT,
  region TEXT DEFAULT 'Crete',
  school_type TEXT DEFAULT 'primary' CHECK (school_type IN ('primary', 'secondary', 'lyceum', 'other')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS classes (
  id BIGSERIAL PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class_code TEXT NOT NULL UNIQUE,
  academic_year TEXT DEFAULT '2026-2027',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_code ON classes(class_code);

CREATE TABLE IF NOT EXISTS teachers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  is_coordinator BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, school_id)
);

CREATE TABLE IF NOT EXISTS teacher_classes (
  id BIGSERIAL PRIMARY KEY,
  teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, class_id)
);

-- ============================================================
-- STUDENT ALIASES (NO PII!)
-- ============================================================

CREATE TABLE IF NOT EXISTS student_aliases (
  id BIGSERIAL PRIMARY KEY,
  class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, alias)
);

CREATE INDEX IF NOT EXISTS idx_student_alias ON student_aliases(alias);

-- ============================================================
-- KIDS PROJECTS & MISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS kids_projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  image TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  category TEXT DEFAULT 'environment',
  start_date DATE,
  end_date DATE,
  data_retention_days INT DEFAULT 365,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kids_missions (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES kids_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  instructions TEXT,
  instructions_en TEXT,
  image TEXT,
  icon TEXT DEFAULT '🔬',
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points INT DEFAULT 10,
  location_precision TEXT DEFAULT 'municipality'
    CHECK (location_precision IN ('exact', 'approximate', 'municipality', 'region', 'none')),
  form_schema JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- OBSERVATIONS & MEASUREMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS kids_observations (
  id BIGSERIAL PRIMARY KEY,
  mission_id BIGINT NOT NULL REFERENCES kids_missions(id) ON DELETE CASCADE,
  student_alias_id BIGINT NOT NULL REFERENCES student_aliases(id) ON DELETE CASCADE,
  class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}',
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'needs_revision', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS kids_measurements (
  id BIGSERIAL PRIMARY KEY,
  observation_id BIGINT NOT NULL REFERENCES kids_observations(id) ON DELETE CASCADE,
  measurement_type TEXT NOT NULL,
  value DOUBLE PRECISION,
  unit TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- MEDIA
-- ============================================================

CREATE TABLE IF NOT EXISTS kids_media (
  id BIGSERIAL PRIMARY KEY,
  observation_id BIGINT NOT NULL REFERENCES kids_observations(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_type TEXT DEFAULT 'image',
  mime_type TEXT,
  file_size_bytes BIGINT,
  exif_stripped BOOLEAN DEFAULT false,
  security_scanned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- LOCATION (controlled geographic info)
-- ============================================================

CREATE TABLE IF NOT EXISTS kids_locations (
  id BIGSERIAL PRIMARY KEY,
  observation_id BIGINT NOT NULL REFERENCES kids_observations(id) ON DELETE CASCADE,
  lat_exact DOUBLE PRECISION,
  lng_exact DOUBLE PRECISION,
  lat_general DOUBLE PRECISION,
  lng_general DOUBLE PRECISION,
  municipality TEXT,
  region TEXT DEFAULT 'Crete',
  precision_level TEXT DEFAULT 'municipality'
    CHECK (precision_level IN ('exact', 'approximate', 'municipality', 'region', 'none')),
  location_geo GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_kids_location()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.lat_exact IS NOT NULL AND NEW.lng_exact IS NOT NULL THEN
    NEW.location_geo := ST_SetSRID(ST_MakePoint(NEW.lng_exact, NEW.lat_exact), 4326)::geography;
    IF NEW.precision_level = 'approximate' THEN
      NEW.lat_general := round(NEW.lat_exact::numeric, 2)::double precision;
      NEW.lng_general := round(NEW.lng_exact::numeric, 2)::double precision;
    ELSIF NEW.precision_level = 'municipality' THEN
      NEW.lat_general := round(NEW.lat_exact::numeric, 1)::double precision;
      NEW.lng_general := round(NEW.lng_exact::numeric, 1)::double precision;
    ELSIF NEW.precision_level = 'region' THEN
      NEW.lat_general := round(NEW.lat_exact::numeric, 0)::double precision;
      NEW.lng_general := round(NEW.lng_exact::numeric, 0)::double precision;
    ELSIF NEW.precision_level = 'none' THEN
      NEW.lat_general := NULL;
      NEW.lng_general := NULL;
    ELSE
      NEW.lat_general := NEW.lat_exact;
      NEW.lng_general := NEW.lng_exact;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_kids_location ON kids_locations;
CREATE TRIGGER trg_kids_location
  BEFORE INSERT OR UPDATE OF lat_exact, lng_exact, precision_level ON kids_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_kids_location();

-- ============================================================
-- VALIDATION
-- ============================================================

CREATE TABLE IF NOT EXISTS kids_validations (
  id BIGSERIAL PRIMARY KEY,
  observation_id BIGINT NOT NULL REFERENCES kids_observations(id) ON DELETE CASCADE,
  validator_id UUID NOT NULL REFERENCES profiles(id),
  validator_role TEXT CHECK (validator_role IN ('teacher', 'scientist', 'admin')),
  status TEXT NOT NULL CHECK (status IN ('approved', 'needs_revision', 'rejected')),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CONSENT RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS consent_records (
  id BIGSERIAL PRIMARY KEY,
  class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('parental', 'school', 'data_processing', 'image_use')),
  granted BOOLEAN DEFAULT false,
  granted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AUDIT EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor_type TEXT,
  actor_id TEXT,
  target_type TEXT,
  target_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_type ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);

-- ============================================================
-- DATASETS
-- ============================================================

CREATE TABLE IF NOT EXISTS kids_datasets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  project_id BIGINT REFERENCES kids_projects(id),
  export_format TEXT DEFAULT 'csv' CHECK (export_format IN ('csv', 'json', 'geojson')),
  filters JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- BADGES & GAMIFICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS kids_badges (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  icon TEXT DEFAULT '🏅',
  image_url TEXT,
  category TEXT DEFAULT 'achievement',
  criteria_type TEXT DEFAULT 'observation_count'
    CHECK (criteria_type IN ('observation_count', 'mission_complete', 'quality', 'special', 'manual')),
  criteria_value INT DEFAULT 1,
  target_type TEXT DEFAULT 'school'
    CHECK (target_type IN ('student', 'class', 'school')),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kids_badge_awards (
  id BIGSERIAL PRIMARY KEY,
  badge_id BIGINT NOT NULL REFERENCES kids_badges(id) ON DELETE CASCADE,
  student_alias_id BIGINT REFERENCES student_aliases(id) ON DELETE CASCADE,
  class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  awarded_by UUID REFERENCES profiles(id)
);

-- ============================================================
-- SCHOOL STATISTICS VIEW
-- ============================================================

CREATE OR REPLACE VIEW school_stats AS
SELECT
  s.id AS school_id,
  s.name AS school_name,
  s.city,
  s.region,
  COUNT(DISTINCT c.id) AS class_count,
  COUNT(DISTINCT sa.id) AS student_count,
  COUNT(DISTINCT ko.id) AS observation_count,
  COUNT(DISTINCT ko.id) FILTER (WHERE ko.status = 'approved') AS approved_observations,
  COUNT(DISTINCT kba.id) AS badge_count
FROM schools s
LEFT JOIN classes c ON c.school_id = s.id AND c.is_active = true
LEFT JOIN student_aliases sa ON sa.class_id = c.id AND sa.is_active = true
LEFT JOIN kids_observations ko ON ko.school_id = s.id
LEFT JOIN kids_badge_awards kba ON kba.school_id = s.id
WHERE s.is_active = true
GROUP BY s.id, s.name, s.city, s.region;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_badge_awards ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$ SELECT EXISTS (SELECT 1 FROM public.teachers WHERE user_id = auth.uid()); $$;

CREATE OR REPLACE FUNCTION public.teacher_manages_class(p_class_id bigint)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_classes tc
    JOIN public.teachers t ON t.id = tc.teacher_id
    WHERE tc.class_id = p_class_id AND t.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_school_coordinator(p_school_id bigint)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teachers
    WHERE user_id = auth.uid() AND school_id = p_school_id AND is_coordinator = true
  );
$$;

-- Public read
CREATE POLICY "Public read organisations" ON organisations FOR SELECT USING (true);
CREATE POLICY "Public read schools" ON schools FOR SELECT USING (is_active = true);
CREATE POLICY "Public read kids projects" ON kids_projects FOR SELECT USING (status = 'active');
CREATE POLICY "Public read kids missions" ON kids_missions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read kids badges" ON kids_badges FOR SELECT USING (is_active = true);
CREATE POLICY "Public read badge awards" ON kids_badge_awards FOR SELECT USING (true);

-- Teacher policies
CREATE POLICY "Teachers read own classes" ON classes FOR SELECT
  USING (public.is_admin() OR EXISTS (
    SELECT 1 FROM teacher_classes tc JOIN teachers t ON t.id = tc.teacher_id
    WHERE tc.class_id = classes.id AND t.user_id = auth.uid()
  ));

CREATE POLICY "Teachers read own record" ON teachers FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Teachers read own assignments" ON teacher_classes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM teachers t WHERE t.id = teacher_classes.teacher_id AND t.user_id = auth.uid()
  ) OR public.is_admin());

CREATE POLICY "Teachers read class students" ON student_aliases FOR SELECT
  USING (public.teacher_manages_class(class_id) OR public.is_admin());

CREATE POLICY "Teachers read class observations" ON kids_observations FOR SELECT
  USING (public.teacher_manages_class(class_id) OR public.is_admin());

CREATE POLICY "Teachers read class measurements" ON kids_measurements FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM kids_observations ko WHERE ko.id = kids_measurements.observation_id
    AND (public.teacher_manages_class(ko.class_id) OR public.is_admin())
  ));

CREATE POLICY "Teachers read class media" ON kids_media FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM kids_observations ko WHERE ko.id = kids_media.observation_id
    AND (public.teacher_manages_class(ko.class_id) OR public.is_admin())
  ));

CREATE POLICY "Teachers read class locations" ON kids_locations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM kids_observations ko WHERE ko.id = kids_locations.observation_id
    AND (public.teacher_manages_class(ko.class_id) OR public.is_admin())
  ));

CREATE POLICY "Teachers manage validations" ON kids_validations FOR ALL
  USING (validator_id = auth.uid() OR public.is_admin());

CREATE POLICY "Teachers manage consent" ON consent_records FOR ALL
  USING (recorded_by = auth.uid() OR public.is_admin());

-- Admin policies
CREATE POLICY "Admin all organisations" ON organisations FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all schools" ON schools FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all classes" ON classes FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all teachers" ON teachers FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all teacher_classes" ON teacher_classes FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all student_aliases" ON student_aliases FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_projects" ON kids_projects FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_missions" ON kids_missions FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_observations" ON kids_observations FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_measurements" ON kids_measurements FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_media" ON kids_media FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_locations" ON kids_locations FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_validations" ON kids_validations FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all consent_records" ON consent_records FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all audit_events" ON audit_events FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_datasets" ON kids_datasets FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_badges" ON kids_badges FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all kids_badge_awards" ON kids_badge_awards FOR ALL USING (public.is_admin());

-- Grants
GRANT SELECT ON organisations TO anon, authenticated;
GRANT SELECT ON schools TO anon, authenticated;
GRANT SELECT ON kids_projects TO anon, authenticated;
GRANT SELECT ON kids_missions TO anon, authenticated;
GRANT SELECT ON kids_badges TO anon, authenticated;
GRANT SELECT ON kids_badge_awards TO anon, authenticated;
GRANT SELECT ON school_stats TO anon, authenticated;

GRANT ALL ON organisations TO authenticated;
GRANT ALL ON schools TO authenticated;
GRANT ALL ON classes TO authenticated;
GRANT ALL ON teachers TO authenticated;
GRANT ALL ON teacher_classes TO authenticated;
GRANT ALL ON student_aliases TO authenticated;
GRANT ALL ON kids_projects TO authenticated;
GRANT ALL ON kids_missions TO authenticated;
GRANT ALL ON kids_observations TO authenticated;
GRANT ALL ON kids_measurements TO authenticated;
GRANT ALL ON kids_media TO authenticated;
GRANT ALL ON kids_locations TO authenticated;
GRANT ALL ON kids_validations TO authenticated;
GRANT ALL ON consent_records TO authenticated;
GRANT ALL ON audit_events TO authenticated;
GRANT ALL ON kids_datasets TO authenticated;
GRANT ALL ON kids_badges TO authenticated;
GRANT ALL ON kids_badge_awards TO authenticated;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================
-- STUDENT LOGIN RPC
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.student_login(
  p_class_code TEXT, p_alias TEXT, p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_student student_aliases%ROWTYPE;
  v_class classes%ROWTYPE;
  v_school schools%ROWTYPE;
BEGIN
  SELECT * INTO v_class FROM classes WHERE class_code = p_class_code AND is_active = true;
  IF NOT FOUND THEN
    PERFORM pg_sleep(0.5);
    RETURN jsonb_build_object('error', 'invalid_credentials');
  END IF;

  SELECT * INTO v_student FROM student_aliases
  WHERE class_id = v_class.id AND alias = p_alias AND is_active = true;
  IF NOT FOUND THEN
    PERFORM pg_sleep(0.5);
    RETURN jsonb_build_object('error', 'invalid_credentials');
  END IF;

  IF v_student.locked_until IS NOT NULL AND v_student.locked_until > now() THEN
    RETURN jsonb_build_object('error', 'account_locked', 'locked_until', v_student.locked_until);
  END IF;

  IF NOT (v_student.pin_hash = crypt(p_pin, v_student.pin_hash)) THEN
    UPDATE student_aliases
    SET login_attempts = login_attempts + 1,
        locked_until = CASE WHEN login_attempts >= 4 THEN now() + interval '5 minutes' ELSE NULL END
    WHERE id = v_student.id;
    PERFORM pg_sleep(0.5);
    RETURN jsonb_build_object('error', 'invalid_credentials');
  END IF;

  UPDATE student_aliases
  SET login_attempts = 0, locked_until = NULL, last_login_at = now()
  WHERE id = v_student.id;

  SELECT * INTO v_school FROM schools WHERE id = v_class.school_id;

  INSERT INTO audit_events (event_type, actor_type, actor_id, details)
  VALUES ('login', 'student', v_student.alias, jsonb_build_object(
    'class_code', p_class_code, 'school_id', v_school.id
  ));

  RETURN jsonb_build_object(
    'success', true,
    'student', jsonb_build_object(
      'id', v_student.id, 'alias', v_student.alias,
      'class_id', v_class.id, 'class_name', v_class.name,
      'class_code', v_class.class_code,
      'school_id', v_school.id, 'school_name', v_school.name
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.student_login(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.student_login(TEXT, TEXT, TEXT) TO anon, authenticated;

-- ============================================================
-- GENERATE STUDENT ALIASES RPC
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_student_aliases(
  p_class_id BIGINT, p_count INT DEFAULT 30
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_class classes%ROWTYPE;
  v_alias TEXT;
  v_pin TEXT;
  v_results JSONB := '[]'::jsonb;
  v_i INT;
  v_existing_count INT;
BEGIN
  IF NOT (public.is_admin() OR public.teacher_manages_class(p_class_id)) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT * INTO v_class FROM classes WHERE id = p_class_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Class not found'; END IF;

  SELECT COUNT(*) INTO v_existing_count FROM student_aliases WHERE class_id = p_class_id;

  FOR v_i IN 1..p_count LOOP
    v_alias := v_class.name || '-' || lpad((v_existing_count + v_i)::text, 4, '0');
    v_pin := lpad((floor(random() * 10000))::text, 4, '0');

    INSERT INTO student_aliases (class_id, alias, pin_hash)
    VALUES (p_class_id, v_alias, crypt(v_pin, gen_salt('bf')))
    ON CONFLICT (class_id, alias) DO NOTHING;

    v_results := v_results || jsonb_build_object('alias', v_alias, 'pin', v_pin);
  END LOOP;

  INSERT INTO audit_events (event_type, actor_type, actor_id, details)
  VALUES ('generate_aliases', 'teacher', auth.uid()::text, jsonb_build_object(
    'class_id', p_class_id, 'count', p_count
  ));

  RETURN v_results;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_student_aliases(BIGINT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_student_aliases(BIGINT, INT) TO authenticated;

-- ============================================================
-- PUBLIC KIDS OBSERVATIONS RPC (no student identity)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_public_kids_observations()
RETURNS TABLE (
  id bigint, mission_id bigint, school_id bigint, school_name text,
  municipality text, region text, lat double precision, lng double precision,
  status text, submitted_at timestamptz, data jsonb
)
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT ko.id, ko.mission_id, ko.school_id, s.name, kl.municipality, kl.region,
    kl.lat_general, kl.lng_general, ko.status, ko.submitted_at, ko.data
  FROM public.kids_observations ko
  LEFT JOIN public.kids_locations kl ON kl.observation_id = ko.id
  LEFT JOIN public.schools s ON s.id = ko.school_id
  WHERE ko.status = 'approved';
$$;

REVOKE ALL ON FUNCTION public.get_public_kids_observations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_kids_observations() TO anon, authenticated;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO kids_badges (name, name_en, description, description_en, icon, category, criteria_type, criteria_value, target_type, sort_order) VALUES
('Mediterranean Diet Explorer', 'Mediterranean Diet Explorer', 'Εξερεύνηση της μεσογειακής διατροφής', 'Exploring the Mediterranean diet', '🫒', 'science', 'mission_complete', 1, 'student', 1),
('Local Food Champion', 'Local Food Champion', 'Πρωταθλητής τοπικών τροφίμων', 'Local food champion', '🥬', 'science', 'observation_count', 10, 'student', 2),
('Seasonality Champion', 'Seasonality Champion', 'Πρωταθλητής εποχικότητας', 'Seasonality champion', '🌻', 'science', 'observation_count', 20, 'student', 3),
('Zero Waste School', 'Zero Waste School', 'Σχολείο μηδενικών αποβλήτων', 'Zero waste school', '♻️', 'sustainability', 'special', 1, 'school', 4),
('Citizen Science Excellence', 'Citizen Science Excellence', 'Αριστεία Citizen Science', 'Citizen Science excellence', '🔬', 'achievement', 'observation_count', 50, 'school', 5),
('Data Quality Champion', 'Data Quality Champion', 'Πρωταθλητής ποιότητας δεδομένων', 'Data quality champion', '⭐', 'quality', 'quality', 1, 'student', 6),
('First Discovery', 'First Discovery', 'Πρώτη ανακάλυψη!', 'First discovery!', '🦋', 'milestone', 'observation_count', 1, 'student', 7),
('Explorer 100', 'Explorer 100', '100 παρατηρήσεις!', '100 observations!', '🌍', 'milestone', 'observation_count', 100, 'school', 8),
('Photo Expert', 'Photo Expert', 'Ειδικός φωτογραφίας', 'Photography expert', '📸', 'skill', 'observation_count', 15, 'student', 9),
('Team Spirit', 'Team Spirit', 'Ομαδικό πνεύμα', 'Team spirit', '🤝', 'social', 'special', 1, 'class', 10);

INSERT INTO kids_projects (title, title_en, description, description_en, status, category)
VALUES (
  'Εξερεύνηση Μεσογειακής Διατροφής',
  'Mediterranean Diet Explorer',
  'Ανακαλύψτε τα τοπικά τρόφιμα της Κρήτης και μάθετε για τη μεσογειακή διατροφή μέσα από πρακτικές δραστηριότητες.',
  'Discover the local foods of Crete and learn about the Mediterranean diet through hands-on activities.',
  'active', 'nutrition'
);

INSERT INTO kids_missions (project_id, title, title_en, description, description_en, instructions, instructions_en, icon, difficulty, points, location_precision, form_schema)
VALUES (
  (SELECT id FROM kids_projects WHERE title = 'Εξερεύνηση Μεσογειακής Διατροφής'),
  'Τα Φρούτα της Γειτονιάς μου', 'My Neighborhood Fruits',
  'Βρες και φωτογράφισε φρουτόδεντρα στη γειτονιά σου!',
  'Find and photograph fruit trees in your neighborhood!',
  '1. Βγες στη γειτονιά σου\n2. Βρες ένα φρουτόδεντρο\n3. Βγάλε μια φωτογραφία\n4. Σημείωσε τι είδος είναι\n5. Καταγράψε αν έχει καρπούς',
  '1. Go to your neighborhood\n2. Find a fruit tree\n3. Take a photo\n4. Note what type it is\n5. Record if it has fruits',
  '🍊', 'easy', 10, 'municipality',
  '[{"name":"fruit_type","label":"Είδος φρούτου","label_en":"Fruit type","type":"select","options":["Πορτοκαλιά","Λεμονιά","Ελιά","Αμπέλι","Συκιά","Ροδιά","Άλλο"]},{"name":"has_fruits","label":"Έχει καρπούς;","label_en":"Has fruits?","type":"select","options":["Ναι","Όχι","Λίγους"]},{"name":"tree_size","label":"Μέγεθος δέντρου","label_en":"Tree size","type":"select","options":["Μικρό","Μεσαίο","Μεγάλο"]}]'
);
