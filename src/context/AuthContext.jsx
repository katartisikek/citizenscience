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

  const signUp = async ({
    email,
    password,
    firstName = '',
    lastName = '',
    fullName = '',
    phone = '',
    role = 'citizen',
    area = '',
  }) => {
    if (!supabase) throw new Error('Supabase not configured');
    const composedName = [firstName, lastName].filter(Boolean).join(' ').trim() || fullName;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: composedName,
          phone,
          role,
          area,
        },
      },
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').update({
        full_name: composedName,
        phone,
        area,
        role: ['citizen', 'researcher', 'entity'].includes(role) ? role : 'citizen',
      }).eq('id', data.user.id);
      const profileData = await fetchProfile(data.user.id);
      setUser(data.user);
      setProfile(profileData);
    }
    return data;
  };

  const signIn = async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profileData = data.user ? await fetchProfile(data.user.id) : null;
    setUser(data.user ?? null);
    setProfile(profileData);
    return { ...data, profile: profileData };
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
