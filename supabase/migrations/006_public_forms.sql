-- Working entity-contact and newsletter forms.
-- Run after 005_security_hardening.sql.

CREATE TABLE IF NOT EXISTS public.entity_inquiries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization text NOT NULL CHECK (char_length(organization) BETWEEN 2 AND 200),
  contact_name text NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 150),
  email text NOT NULL CHECK (char_length(email) <= 320),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 50),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'closed')),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL CHECK (char_length(email) <= 320),
  locale text NOT NULL DEFAULT 'el' CHECK (locale IN ('el', 'en')),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'unsubscribed')),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_lower_idx
  ON public.newsletter_subscribers (lower(email));

ALTER TABLE public.entity_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone submits entity inquiry" ON public.entity_inquiries;
DROP POLICY IF EXISTS "Admin manages entity inquiries" ON public.entity_inquiries;
DROP POLICY IF EXISTS "Anyone subscribes newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admin manages newsletter subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Anyone submits entity inquiry"
  ON public.entity_inquiries FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND (user_id IS NULL OR user_id = auth.uid())
  );

CREATE POLICY "Admin manages entity inquiries"
  ON public.entity_inquiries FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Anyone subscribes newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (
    status = 'active'
    AND (user_id IS NULL OR user_id = auth.uid())
  );

CREATE POLICY "Admin manages newsletter subscribers"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT INSERT ON TABLE public.entity_inquiries TO anon, authenticated;
GRANT INSERT ON TABLE public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.entity_inquiries TO authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.newsletter_subscribers TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.entity_inquiries_id_seq TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.newsletter_subscribers_id_seq TO anon, authenticated;
