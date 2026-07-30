-- Security hardening for profiles, observations, project membership and media.
-- Run after 004_fix_project_members_rls.sql.

-- Profiles: personal data is visible only to its owner and admins.
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles readable" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin read profiles" ON public.profiles;

CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin read profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Users may edit only non-privileged profile columns. Role changes go through
-- the guarded RPC below, so a user cannot promote themselves via PostgREST.
REVOKE UPDATE ON TABLE public.profiles FROM authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name, phone, area, avatar_url)
  ON TABLE public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id uuid,
  new_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  IF new_role NOT IN ('citizen', 'researcher', 'entity', 'admin') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  IF target_user_id = auth.uid() AND new_role <> 'admin' THEN
    RAISE EXCEPTION 'Admins cannot demote themselves';
  END IF;

  IF new_role <> 'admin'
     AND (SELECT role FROM public.profiles WHERE id = target_user_id) = 'admin'
     AND (SELECT count(*) FROM public.profiles WHERE role = 'admin') <= 1 THEN
    RAISE EXCEPTION 'At least one admin is required';
  END IF;

  UPDATE public.profiles
  SET role = new_role
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_user_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(uuid, text) TO authenticated;

-- Observations: never expose the source row publicly because its JSON may
-- contain profile, consent and device metadata.
DROP POLICY IF EXISTS "Public read approved observations" ON public.observations;
DROP POLICY IF EXISTS "Approved observations public" ON public.observations;
DROP POLICY IF EXISTS "Users read own observations" ON public.observations;
DROP POLICY IF EXISTS "Auth users insert observations" ON public.observations;
DROP POLICY IF EXISTS "Auth users submit observations" ON public.observations;
DROP POLICY IF EXISTS "Users update own pending" ON public.observations;
DROP POLICY IF EXISTS "Researchers approve observations" ON public.observations;
DROP POLICY IF EXISTS "Admin all observations" ON public.observations;

CREATE POLICY "Users read own observations"
  ON public.observations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Members submit own observations"
  ON public.observations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND EXISTS (
      SELECT 1
      FROM public.project_members pm
      JOIN public.projects p ON p.id = pm.project_id
      WHERE pm.project_id = observations.project_id
        AND pm.user_id = auth.uid()
        AND p.status = 'Ενεργό'
    )
  );

CREATE POLICY "Users update own pending observations"
  ON public.observations FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admin all observations"
  ON public.observations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Safe public projection used by the map and exports. Deliberately omits
-- user_id, media paths and the original JSON payload.
CREATE OR REPLACE FUNCTION public.get_public_observations()
RETURNS TABLE (
  id bigint,
  project_id bigint,
  lat double precision,
  lng double precision,
  status text,
  created_at timestamptz,
  data jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    o.id,
    o.project_id,
    o.lat,
    o.lng,
    o.status,
    o.created_at,
    '{}'::jsonb AS data
  FROM public.observations o
  WHERE o.status = 'approved';
$$;

REVOKE ALL ON FUNCTION public.get_public_observations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_observations() TO anon, authenticated;

-- Observation media remains private. Owners and admins receive temporary
-- signed URLs through the Supabase client.
UPDATE storage.buckets
SET
  public = false,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/heic',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm',
    'application/pdf', 'application/json', 'application/geo+json',
    'application/gpx+xml', 'text/csv', 'text/plain'
  ]
WHERE id = 'observations';

DROP POLICY IF EXISTS "Public read observation photos" ON storage.objects;
DROP POLICY IF EXISTS "Users read own observation files" ON storage.objects;
DROP POLICY IF EXISTS "Admins read observation files" ON storage.objects;

CREATE POLICY "Users read own observation files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'observations'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins read observation files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'observations'
    AND public.is_admin()
  );
