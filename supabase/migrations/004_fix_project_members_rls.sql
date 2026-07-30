-- Fix RLS so authenticated users can join projects
-- Run in Supabase SQL Editor

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users join projects" ON public.project_members;
DROP POLICY IF EXISTS "Users read own membership" ON public.project_members;
DROP POLICY IF EXISTS "Users update own membership" ON public.project_members;
DROP POLICY IF EXISTS "Members public read" ON public.project_members;
DROP POLICY IF EXISTS "Admin manage members" ON public.project_members;

CREATE POLICY "Users read own membership"
  ON public.project_members FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users join projects"
  ON public.project_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own membership"
  ON public.project_members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin manage members"
  ON public.project_members FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT, INSERT, UPDATE ON TABLE public.project_members TO authenticated;
