import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const initialSearch = typeof window !== 'undefined' ? window.location.search : '';
const initialHash = typeof window !== 'undefined' ? window.location.hash : '';
const initialHashParams = new URLSearchParams(initialHash.replace(/^#/, ''));
const isPasswordRecoveryUrl = initialHashParams.get('type') === 'recovery';

if (
  typeof window !== 'undefined'
  && isPasswordRecoveryUrl
  && window.location.pathname !== '/reset-password'
) {
  window.history.replaceState(
    window.history.state,
    '',
    `/reset-password${initialSearch}${initialHash}`,
  );
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
