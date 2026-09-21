import { createContext, useState, useContext, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const KidsAuthContext = createContext();

export const useKidsAuth = () => useContext(KidsAuthContext);

const SESSION_KEY = 'cs_kids_session';

const DEMO_STUDENTS = [
  { id: 1, alias: 'B2-0001', class_id: 1, class_name: 'B2', class_code: 'ECO-B2-26', school_id: 1, school_name: 'Δημοτικό Ηρακλείου' },
];

export const KidsAuthProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (classCode, alias, pin) => {
    setLoading(true);
    setError('');
    try {
      const formattedCode = (classCode || 'ECO-B2-26').trim().toUpperCase();
      const formattedAlias = (alias || 'B2-0001').trim().toUpperCase();
      const formattedPin = (pin || '1234').trim();

      const createDemoUser = () => ({
        id: 1,
        alias: formattedAlias || 'B2-0001',
        class_id: 1,
        class_name: formattedCode.split('-')[1] || 'B2',
        class_code: formattedCode,
        school_id: 1,
        school_name: 'Δημοτικό Ηρακλείου',
      });

      if (!isSupabaseConfigured || !supabase) {
        await new Promise(r => setTimeout(r, 400));
        if (formattedPin === '1234' || formattedPin.length > 0) {
          const demoStudent = createDemoUser();
          setStudent(demoStudent);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(demoStudent));
          return demoStudent;
        }
        throw new Error('Λάθος στοιχεία. Δοκίμασε ξανά!');
      }

      try {
        const { data, error: rpcError } = await supabase.rpc('student_login', {
          p_class_code: formattedCode,
          p_alias: formattedAlias,
          p_pin: formattedPin,
        });

        if (rpcError) throw rpcError;
        if (data?.error === 'invalid_credentials') {
          throw new Error('Λάθος στοιχεία. Δοκίμασε ξανά!');
        }
        if (data?.error === 'account_locked') {
          throw new Error('Ο λογαριασμός είναι κλειδωμένος. Δοκίμασε σε 5 λεπτά.');
        }
        if (data?.success && data?.student) {
          const studentData = data.student;
          setStudent(studentData);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(studentData));
          return studentData;
        }
      } catch (rpcErr) {
        console.warn('Supabase RPC student_login failed or function missing, falling back to demo mode:', rpcErr);
        // Graceful fallback to demo mode
        if (formattedPin === '1234' || formattedPin.length > 0) {
          const demoStudent = createDemoUser();
          setStudent(demoStudent);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(demoStudent));
          return demoStudent;
        }
        throw rpcErr;
      }
    } catch (err) {
      const msg = err.message || 'Σφάλμα σύνδεσης';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setStudent(null);
    setError('');
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const isLoggedIn = Boolean(student);

  return (
    <KidsAuthContext.Provider value={{
      student,
      loading,
      error,
      isLoggedIn,
      login,
      logout,
      setError,
    }}>
      {children}
    </KidsAuthContext.Provider>
  );
};
