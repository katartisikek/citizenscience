-- Add phone to profiles for signup
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

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
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.profiles.phone),
    area = COALESCE(NULLIF(EXCLUDED.area, ''), public.profiles.area),
    role = CASE
      WHEN EXCLUDED.role IN ('citizen', 'researcher', 'entity') THEN EXCLUDED.role
      ELSE public.profiles.role
    END;
  RETURN NEW;
END;
$$;
