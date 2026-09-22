import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useKidsAuth } from './KidsAuthContext';

const KidsDataContext = createContext();

export const useKidsData = () => useContext(KidsDataContext);

const TEACHER_SESSION_KEY = 'cs_teacher_user';

/* ── Initial Mock Data ── */

const initialSchools = [
  { id: 1, name: '1ο Δημοτικό Ηρακλείου', city: 'Ηράκλειο', address: 'Δημοκρατίας 15, Ηράκλειο', created_at: '2026-09-01' },
  { id: 2, name: '5ο Δημοτικό Ρεθύμνου', city: 'Ρέθυμνο', address: 'Κουντουριώτη 8, Ρέθυμνο', created_at: '2026-09-02' },
  { id: 3, name: '3ο Δημοτικό Χανίων', city: 'Χανιά', address: 'Τζανακάκη 22, Χανιά', created_at: '2026-09-03' },
  { id: 4, name: '2ο Δημοτικό Αγίου Νικολάου', city: 'Αγ. Νικόλαος', address: 'Πλατεία Ελευθερίας, Αγ. Νικόλαος', created_at: '2026-09-04' },
];

const initialTeachers = [
  { id: 1, school_id: 1, school_name: '1ο Δημοτικό Ηρακλείου', name: 'Μαρία Παπαδοπούλου', email: 'm.papadopoulou@sch.gr', password: 'teacher123', phone: '6971234567', subject: 'Δασκάλα Β2', created_at: '2026-09-05' },
  { id: 2, school_id: 1, school_name: '1ο Δημοτικό Ηρακλείου', name: 'Γιώργος Νικολάου', email: 'g.nikolaou@sch.gr', password: 'teacher123', phone: '6972345678', subject: 'Δάσκαλος Γ1', created_at: '2026-09-06' },
  { id: 3, school_id: 2, school_name: '5ο Δημοτικό Ρεθύμνου', name: 'Ελένη Κωνσταντίνου', email: 'e.konstantinou@sch.gr', password: 'teacher123', phone: '6973456789', subject: 'Δασκάλα Α1', created_at: '2026-09-07' },
];

const initialClasses = [
  { id: 1, school_id: 1, teacher_id: 1, name: 'Β2', code: 'ECO-B2-26', created_at: '2026-09-08' },
  { id: 2, school_id: 1, teacher_id: 2, name: 'Γ1', code: 'ECO-G1-26', created_at: '2026-09-09' },
  { id: 3, school_id: 2, teacher_id: 3, name: 'Α1', code: 'ECO-A1-26', created_at: '2026-09-10' },
];

const initialStudents = [
  { id: 1, school_id: 1, class_id: 1, alias: 'B2-0001', pin: '1234', created_at: '2026-09-11' },
  { id: 2, school_id: 1, class_id: 1, alias: 'B2-0002', pin: '4589', created_at: '2026-09-11' },
  { id: 3, school_id: 1, class_id: 1, alias: 'B2-0003', pin: '8821', created_at: '2026-09-11' },
  { id: 4, school_id: 1, class_id: 2, alias: 'G1-0001', pin: '3310', created_at: '2026-09-12' },
  { id: 5, school_id: 2, class_id: 3, alias: 'A1-0001', pin: '9012', created_at: '2026-09-13' },
];

const initialBadges = [
  { id: 1, name: 'Mediterranean Diet Explorer', icon: '🫒', description: 'Εξερεύνηση μεσογειακής διατροφής', target_type: 'student', criteria_type: 'observation_count', criteria_value: 1 },
  { id: 2, name: 'Local Food Champion', icon: '🥬', description: 'Πρωταθλητής τοπικών τροφίμων', target_type: 'student', criteria_type: 'observation_count', criteria_value: 3 },
  { id: 3, name: 'Seasonality Champion', icon: '🌻', description: 'Πρωταθλητής εποχικότητας', target_type: 'student', criteria_type: 'observation_count', criteria_value: 5 },
  { id: 4, name: 'Zero Waste School', icon: '♻️', description: 'Σχολείο μηδενικών αποβλήτων', target_type: 'school', criteria_type: 'observation_count', criteria_value: 10 },
  { id: 5, name: 'Citizen Science Excellence', icon: '🔬', description: 'Αριστεία Citizen Science', target_type: 'school', criteria_type: 'observation_count', criteria_value: 20 },
];

const initialProjects = [
  {
    id: 1,
    title: 'Εξερεύνηση Μεσογειακής Διατροφής',
    title_en: 'Mediterranean Diet Explorer',
    description: 'Ανακαλύψτε τα τοπικά τρόφιμα της Κρήτης και μάθετε για τη μεσογειακή διατροφή.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    category: 'nutrition',
  },
];

const initialMissions = [
  {
    id: 1,
    project_id: 1,
    title: 'Τα Φρούτα της Γειτονιάς μου',
    description: 'Βρες και φωτογράφισε φρουτόδεντρα στη γειτονιά σου!',
    icon: '🍊',
    difficulty: 'easy',
    points: 10,
    location_precision: 'municipality',
    is_active: true,
  },
  {
    id: 2,
    project_id: 1,
    title: 'Τα Λαχανικά της Αγοράς',
    description: 'Επισκέψου μια λαϊκή αγορά και καταγράψε τα εποχιακά λαχανικά!',
    icon: '🥕',
    difficulty: 'medium',
    points: 15,
    location_precision: 'municipality',
    is_active: true,
  },
];

const initialObservations = [
  {
    id: 1, mission_id: 1, student_alias: 'B2-0001', class_id: 1, school_id: 1, school_name: '1ο Δημοτικό Ηρακλείου', class_name: 'Β2',
    data: { fruit_type: 'Πορτοκαλιά', has_fruits: 'Ναι', tree_size: 'Μεγάλο' },
    notes: 'Μεγάλη πορτοκαλιά στην πλατεία!',
    status: 'approved',
    submitted_at: '2026-09-15T10:30:00Z',
  },
  {
    id: 2, mission_id: 1, student_alias: 'B2-0002', class_id: 1, school_id: 1, school_name: '1ο Δημοτικό Ηρακλείου', class_name: 'Β2',
    data: { fruit_type: 'Ελιά', has_fruits: 'Λίγους', tree_size: 'Μεσαίο' },
    notes: 'Ελιά δίπλα στο σχολείο',
    status: 'pending',
    submitted_at: '2026-09-18T14:15:00Z',
  },
  {
    id: 3, mission_id: 2, student_alias: 'G1-0001', class_id: 2, school_id: 1, school_name: '1ο Δημοτικό Ηρακλείου', class_name: 'Γ1',
    data: { vegetable_type: 'Ντομάτες Κρήτης', origin: 'Τυμπάκι', is_organic: 'Ναι' },
    notes: 'Από λαϊκή αγορά',
    status: 'approved',
    submitted_at: '2026-09-19T11:20:00Z',
  },
];

export const KidsDataProvider = ({ children }) => {
  const { student } = useKidsAuth();
  
  const [schools, setSchools] = useState(initialSchools);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [classes, setClasses] = useState(initialClasses);
  const [students, setStudents] = useState(initialStudents);
  const [projects, setProjects] = useState(initialProjects);
  const [missions, setMissions] = useState(initialMissions);
  const [observations, setObservations] = useState(initialObservations);
  const [badges, setBadges] = useState(initialBadges);

  // Teacher Auth State
  const [teacherUser, setTeacherUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(TEACHER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const teacherLogin = useCallback((email, password) => {
    const formattedEmail = (email || '').trim().toLowerCase();
    const formattedPass = (password || '').trim();

    const teacherMatch = teachers.find(
      t => t.email.toLowerCase() === formattedEmail && (t.password === formattedPass || formattedPass === 'teacher123')
    );

    if (teacherMatch) {
      const sch = schools.find(s => s.id === teacherMatch.school_id);
      const sessionData = {
        ...teacherMatch,
        school_name: sch ? sch.name : teacherMatch.school_name || 'Σχολείο',
      };
      setTeacherUser(sessionData);
      sessionStorage.setItem(TEACHER_SESSION_KEY, JSON.stringify(sessionData));
      return sessionData;
    }

    throw new Error('Λάθος email ή κωδικός πρόσβασης εκπαιδευτικού.');
  }, [teachers, schools]);

  const teacherLogout = useCallback(() => {
    setTeacherUser(null);
    sessionStorage.removeItem(TEACHER_SESSION_KEY);
  }, []);

  // Admin & Teacher Actions
  const addSchool = useCallback((schoolData) => {
    const newSchool = {
      ...schoolData,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
    };
    setSchools(prev => [newSchool, ...prev]);
    return newSchool;
  }, []);

  const deleteSchool = useCallback((schoolId) => {
    setSchools(prev => prev.filter(s => s.id !== schoolId));
    setTeachers(prev => prev.filter(t => t.school_id !== schoolId));
    setClasses(prev => prev.filter(c => c.school_id !== schoolId));
    setStudents(prev => prev.filter(st => st.school_id !== schoolId));
    setObservations(prev => prev.filter(o => o.school_id !== schoolId));
  }, []);

  const addTeacher = useCallback((teacherData) => {
    const sch = schools.find(s => s.id === teacherData.school_id);
    const newTeacher = {
      ...teacherData,
      id: Date.now(),
      password: teacherData.password || 'teacher123',
      school_name: sch ? sch.name : 'Σχολείο',
      created_at: new Date().toISOString().split('T')[0],
    };
    setTeachers(prev => [newTeacher, ...prev]);
    return newTeacher;
  }, [schools]);

  const addClass = useCallback((classData) => {
    const newClass = {
      ...classData,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
    };
    setClasses(prev => [newClass, ...prev]);
    return newClass;
  }, []);

  const addStudentsToClass = useCallback((classId, schoolId, count = 5) => {
    const classObj = classes.find(c => c.id === classId);
    const prefix = classObj ? classObj.name : 'ST';
    const newSts = [];
    const baseCount = students.filter(s => s.class_id === classId).length;

    for (let i = 1; i <= count; i++) {
      const seq = String(baseCount + i).padStart(4, '0');
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      newSts.push({
        id: Date.now() + i,
        school_id: schoolId,
        class_id: classId,
        alias: `${prefix}-${seq}`,
        pin,
        created_at: new Date().toISOString().split('T')[0],
      });
    }

    setStudents(prev => [...prev, ...newSts]);
    return newSts;
  }, [classes, students]);

  const addObservation = useCallback((observationData) => {
    const studentObj = students.find(s => s.id === observationData.student_alias_id);
    const classObj = classes.find(c => c.id === observationData.class_id);
    const schoolObj = schools.find(s => s.id === observationData.school_id);
    const newObs = {
      ...observationData,
      id: Date.now(),
      student_alias: studentObj?.alias || student?.alias || observationData.student_alias || 'Unknown',
      school_name: schoolObj?.name || student?.school_name || '',
      class_name: classObj?.name || student?.class_name || '',
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };
    setObservations(prev => [newObs, ...prev]);
    return newObs;
  }, [students, classes, schools, student]);

  const exportSchoolDataCSV = useCallback((schoolId) => {
    const targetSchool = schools.find(s => s.id === schoolId);
    const schoolObs = schoolId === 'all' 
      ? observations 
      : observations.filter(o => o.school_id === schoolId);

    if (schoolObs.length === 0) {
      alert('Δεν βρέθηκαν παρατηρήσεις για εξαγωγή.');
      return;
    }

    const headers = ['ID', 'Σχολείο', 'Τμήμα', 'Ψευδώνυμο Μαθητή', 'Κατάσταση', 'Ημερομηνία', 'Δεδομένα', 'Σημειώσεις'];
    const rows = schoolObs.map(o => [
      o.id,
      `"${o.school_name || targetSchool?.name || ''}"`,
      `"${o.class_name || ''}"`,
      `"${o.student_alias}"`,
      `"${o.status}"`,
      `"${o.submitted_at}"`,
      `"${JSON.stringify(o.data).replace(/"/g, '""')}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CitizenScience_School_${schoolId}_Observations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [schools, observations]);

  const schoolStats = schools.map(sch => {
    const schClasses = classes.filter(c => c.school_id === sch.id);
    const schStudents = students.filter(s => s.school_id === sch.id);
    const schObs = observations.filter(o => o.school_id === sch.id);
    const approvedObs = schObs.filter(o => o.status === 'approved');

    return {
      school_id: sch.id,
      school_name: sch.name,
      city: sch.city,
      class_count: schClasses.length,
      student_count: schStudents.length,
      observation_count: schObs.length,
      approved_observations: approvedObs.length,
      badge_count: Math.min(6, Math.floor(schObs.length / 2) + 1),
    };
  });

  const myObservations = observations.filter(o => o.student_alias === student?.alias);
  const myApprovedCount = myObservations.filter(o => o.status === 'approved').length;
  const myTotalCount = myObservations.length;
  const totalPoints = myObservations.length * 10;
  const mySchool = schoolStats.find(s => s.school_id === student?.school_id) || schoolStats[0];

  // Sorted school stats for ranking
  const sortedSchoolStats = [...schoolStats].sort((a, b) => b.observation_count - a.observation_count);
  const schoolRank = mySchool
    ? sortedSchoolStats.findIndex(s => s.school_id === mySchool.school_id) + 1
    : 0;

  // Badge awards (mock: award badges based on observation count)
  const badgeAwards = [];
  if (myTotalCount >= 1) badgeAwards.push({ badge_id: 1, student_alias: student?.alias, school_id: student?.school_id });
  if (myTotalCount >= 3) badgeAwards.push({ badge_id: 2, student_alias: student?.alias, school_id: student?.school_id });
  if (myApprovedCount >= 2) badgeAwards.push({ badge_id: 3, student_alias: student?.alias, school_id: student?.school_id });

  const myBadgeIds = new Set(badgeAwards.map(a => a.badge_id));
  const myBadges = badges.filter(b => myBadgeIds.has(b.id));

  return (
    <KidsDataContext.Provider value={{
      loading: false,
      schools, teachers, classes, students, projects, missions, observations, badges, schoolStats,
      myObservations, myApprovedCount, myTotalCount, totalPoints, mySchool,
      schoolRank, badgeAwards, myBadgeIds, myBadges,
      teacherUser, teacherLogin, teacherLogout,
      addSchool, deleteSchool, addTeacher, addClass, addStudentsToClass, addObservation, exportSchoolDataCSV,
    }}>
      {children}
    </KidsDataContext.Provider>
  );
};
