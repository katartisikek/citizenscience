import { createContext, useState, useEffect, useContext } from 'react';
import { supabase, isSupabaseConfigured, passwordRecoverySession } from '../lib/supabase';

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

    const initializeSession = async () => {
      if (passwordRecoverySession) {
        await passwordRecoverySession;
        window.history.replaceState(
          window.history.state,
          '',
          `${window.location.pathname}${window.location.search}`,
        );
      }
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        setProfile(await fetchProfile(session.user.id));
      }
      setLoading(false);
    };

    initializeSession().catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY' && window.location.pathname !== '/reset-password') {
        window.location.replace('/reset-password');
        return;
      }

      if (session?.user) {
        // Supabase calls inside onAuthStateChange can deadlock its internal auth lock.
        setTimeout(() => {
          fetchProfile(session.user.id).then(setProfile);
        }, 0);
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
    if (data.session?.user) {
      const profileData = await fetchProfile(data.session.user.id);
      setUser(data.session.user);
      setProfile(profileData);
    } else {
      setUser(null);
      setProfile(null);
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

  const requestPasswordReset = async (email) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const isAdmin = profile?.role === 'admin'
    || (!isSupabaseConfigured && sessionStorage.getItem('admin_auth') === 'true');

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
      requestPasswordReset,
      updatePassword,
      refreshProfile: () => user && fetchProfile(user.id).then(setProfile),
    }}>
      {children}
    </AuthContext.Provider>
  );
};
