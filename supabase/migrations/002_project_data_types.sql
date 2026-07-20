-- Project data types + admin can update profile roles
-- Run in Supabase SQL Editor after 001 / schema.sql

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS data_types JSONB DEFAULT '[]'::jsonb;

UPDATE projects
SET data_types = '["geo","observation","photos","questionnaire","metadata","gdpr"]'::jsonb
WHERE data_types IS NULL
   OR data_types = '[]'::jsonb
   OR data_types = 'null'::jsonb;

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

DROP POLICY IF EXISTS "Admin update profiles" ON profiles;
CREATE POLICY "Admin update profiles"
  ON profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users join projects" ON project_members;
CREATE POLICY "Users join projects"
  ON project_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users read own membership" ON project_members;
CREATE POLICY "Users read own membership"
  ON project_members FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT ON TABLE public.project_members TO authenticated;
