import { createContext, useState, useEffect, useContext } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    if (!supabase) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return data;
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setProfile(await fetchProfile(session.user.id));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setProfile(await fetchProfile(session.user.id));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, fullName, role = 'citizen', area = '' }) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (error) throw error;
    if (data.user && area) {
      await supabase.from('profiles').update({ area }).eq('id', data.user.id);
    }
    return data;
  };

  const signIn = async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    sessionStorage.removeItem('admin_auth');
  };

  const isAdmin = profile?.role === 'admin' || sessionStorage.getItem('admin_auth') === 'true';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAdmin,
      isSupabaseConfigured,
      signUp,
      signIn,
      signOut,
      refreshProfile: () => user && fetchProfile(user.id).then(setProfile),
    }}>
      {children}
    </AuthContext.Provider>
  );
};
