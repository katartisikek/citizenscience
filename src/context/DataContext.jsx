import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEFAULT_DATA_TYPES } from '../lib/dataTypes';
import { useAuth } from './AuthContext';

const DataContext = createContext();
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const MIME_BY_EXTENSION = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  pdf: 'application/pdf',
  json: 'application/json',
  geojson: 'application/geo+json',
  gpx: 'application/gpx+xml',
  csv: 'text/csv',
  txt: 'text/plain',
};
const ALLOWED_UPLOAD_TYPES = new Set([...Object.values(MIME_BY_EXTENSION), 'audio/webm']);

export const useData = () => useContext(DataContext);

const initialProjects = [
  {
    id: 1,
    title: "Mosquito Watch",
    title_en: "Mosquito Watch",
    status: "Ενεργό",
    status_en: "Active",
    image: "https://images.unsplash.com/photo-1615814041724-4fec8b74c2e6?auto=format&fit=crop&q=80&w=800",
    description: "Παρακολούθηση και καταγραφή πληθυσμών κουνουπιών στην Κρήτη για την προστασία της δημόσιας υγείας.",
    description_en: "Monitoring and recording mosquito populations in Crete to protect public health.",
    goal: "Χαρτογράφηση εστιών αναπαραγωγής",
    goal_en: "Mapping breeding grounds",
    participants: "Όλοι οι πολίτες",
    participants_en: "All citizens",
    area: "Παγκρήτια",
    area_en: "All over Crete",
    timeline: "Μάιος - Οκτώβριος 2026",
    timeline_en: "May - October 2026",
    data_types: [...DEFAULT_DATA_TYPES, 'species', 'measurements', 'temporal'],
    form_schema: [
      { name: 'species', label: 'Είδος κουνουπιού', type: 'text' },
      { name: 'water_source', label: 'Πηγή νερού κοντά', type: 'select', options: ['Λίμνη', 'Ποτάμι', 'Λούκι', 'Άλλο'] },
    ],
  },
  {
    id: 2,
    title: "Youth4Diagnostics",
    title_en: "Youth4Diagnostics",
    status: "Ολοκληρωμένο",
    status_en: "Completed",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    description: "Συλλογή δειγμάτων νερού από μαθητές για την ανάλυση της ποιότητας των υδάτινων πόρων της περιοχής.",
    description_en: "Collection of water samples by students for the analysis of the area's water resources quality.",
    goal: "Ανάλυση ποιότητας νερού",
    goal_en: "Water quality analysis",
    participants: "Μαθητές & Εκπαιδευτικοί",
    participants_en: "Students & Teachers",
    area: "Νομός Ηρακλείου",
    area_en: "Heraklion Prefecture",
    timeline: "Σεπτέμβριος 2025 - Μάιος 2026",
    timeline_en: "September 2025 - May 2026",
    data_types: [...DEFAULT_DATA_TYPES, 'measurements', 'analysis', 'education', 'evaluation'],
    form_schema: [
      { name: 'ph', label: 'pH (αν γνωστό)', type: 'number' },
      { name: 'notes', label: 'Παρατηρήσεις', type: 'textarea' },
    ],
  },
];

const initialNews = [
  {
    id: 1,
    title: "Έναρξη της νέας καμπάνιας Mosquito Watch για το καλοκαίρι του 2026",
    title_en: "Launch of the new Mosquito Watch campaign for summer 2026",
    date: "12 Μαΐου 2026",
    date_en: "May 12, 2026",
    type: "Ανακοίνωση",
    type_en: "Announcement",
    content: "Η Περιφέρεια Κρήτης σε συνεργασία με το Citizen Science Hub ανακοινώνουν την έναρξη της καλοκαιρινής δράσης για την παρακολούθηση κουνουπιών...",
    content_en: "The Region of Crete in collaboration with the Citizen Science Hub announces the launch of the summer action for mosquito monitoring...",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
  },
];

const initialSettings = {
  heroTitle: "Citizen Science Hub of Crete",
  heroTitle_en: "Citizen Science Hub of Crete",
  heroSubtitle: "Όταν οι πολίτες συμμετέχουν στην έρευνα, γίνονται μέρος της λύσης. Ελάτε να κατανοήσουμε και να προστατεύσουμε το περιβάλλον της Κρήτης μαζί.",
  heroSubtitle_en: "When citizens participate in research, they become part of the solution. Come understand and protect the environment of Crete with us.",
  aboutText: "Ένα δίκτυο πολιτών, επιστημόνων και φορέων της Κρήτης που συνεργάζονται για τη συλλογή κρίσιμων περιβαλλοντικών δεδομένων με σύγχρονες μεθόδους.",
  aboutText_en: "A network of citizens, scientists, and entities of Crete collaborating to collect critical environmental data with modern methods.",
};

const mapProjectFromDb = (p) => ({
  id: p.id,
  title: p.title,
  title_en: p.title_en,
  status: p.status,
  status_en: p.status_en,
  description: p.description,
  description_en: p.description_en,
  goal: p.goal,
  goal_en: p.goal_en,
  participants: p.participants,
  participants_en: p.participants_en,
  area: p.area,
  area_en: p.area_en,
  timeline: p.timeline,
  timeline_en: p.timeline_en,
  image: p.image,
  form_schema: p.form_schema || [],
  data_types: Array.isArray(p.data_types) && p.data_types.length
    ? p.data_types
    : [...DEFAULT_DATA_TYPES],
});

const mapSettingsFromDb = (s) => ({
  heroTitle: s.hero_title,
  heroTitle_en: s.hero_title_en,
  heroSubtitle: s.hero_subtitle,
  heroSubtitle_en: s.hero_subtitle_en,
  aboutText: s.about_text,
  aboutText_en: s.about_text_en,
});

const mapSettingsToDb = (s) => ({
  hero_title: s.heroTitle,
  hero_title_en: s.heroTitle_en,
  hero_subtitle: s.heroSubtitle,
  hero_subtitle_en: s.heroSubtitle_en,
  about_text: s.aboutText,
  about_text_en: s.aboutText_en,
});

export const DataProvider = ({ children }) => {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [settings, setSettings] = useState(initialSettings);
  const [registrations, setRegistrations] = useState([]);
  const [entityInquiries, setEntityInquiries] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [observations, setObservations] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingLocal, setUsingLocal] = useState(!isSupabaseConfigured);
  const [loadError, setLoadError] = useState('');

  const loadLocal = useCallback(() => {
    setProjects(JSON.parse(localStorage.getItem('cs_projects') || JSON.stringify(initialProjects)));
    setNews(JSON.parse(localStorage.getItem('cs_news') || JSON.stringify(initialNews)));
    setSettings(JSON.parse(localStorage.getItem('cs_settings') || JSON.stringify(initialSettings)));
    setRegistrations(JSON.parse(localStorage.getItem('cs_registrations') || '[]'));
    setEntityInquiries(JSON.parse(localStorage.getItem('cs_entity_inquiries') || '[]'));
    setNewsletterSubscribers(JSON.parse(localStorage.getItem('cs_newsletter_subscribers') || '[]'));
    setProposals(JSON.parse(localStorage.getItem('cs_proposals') || '[]'));
    setObservations(JSON.parse(localStorage.getItem('cs_observations') || '[]'));
    setProfiles(JSON.parse(localStorage.getItem('cs_profiles') || '[]'));
    setMemberships(JSON.parse(localStorage.getItem('cs_memberships') || '[]'));
    setUsingLocal(true);
  }, []);

  const loadMemberships = useCallback(async (userId) => {
    if (!userId) {
      setMemberships([]);
      return;
    }
    if (!supabase || usingLocal) {
      const all = JSON.parse(localStorage.getItem('cs_memberships') || '[]');
      setMemberships(all.filter((m) => m.user_id === userId));
      return;
    }
    const { data, error } = await supabase
      .from('project_members')
      .select('*')
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });
    if (!error) setMemberships(data || []);
  }, [usingLocal]);

  const loadFromSupabase = useCallback(async () => {
    if (!supabase) { loadLocal(); return; }
    setLoadError('');
    try {
      const [projRes, newsRes, settingsRes, publicObsRes] = await Promise.all([
        supabase.from('projects').select('*').order('id'),
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*').eq('id', 1).single(),
        supabase.rpc('get_public_observations'),
      ]);

      if (projRes.error) throw projRes.error;
      if (newsRes.error) throw newsRes.error;
      if (settingsRes.error) throw settingsRes.error;
      if (publicObsRes.error) throw publicObsRes.error;

      let nextRegistrations = [];
      let nextEntityInquiries = [];
      let nextNewsletterSubscribers = [];
      let nextProposals = [];
      let nextProfiles = [];
      let privateObservations = [];

      if (user?.id) {
        const ownObsRes = await supabase
          .from('observations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (ownObsRes.error) throw ownObsRes.error;
        privateObservations = ownObsRes.data || [];
      }

      if (profile?.role === 'admin') {
        const [regRes, inquiryRes, newsletterRes, propRes, obsRes, profilesRes] = await Promise.all([
          supabase.from('registrations').select('*').order('created_at', { ascending: false }),
          supabase.from('entity_inquiries').select('*').order('created_at', { ascending: false }),
          supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
          supabase.from('proposals').select('*').order('created_at', { ascending: false }),
          supabase.from('observations').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        ]);
        const adminError = regRes.error || inquiryRes.error || newsletterRes.error
          || propRes.error || obsRes.error || profilesRes.error;
        if (adminError) throw adminError;
        nextRegistrations = regRes.data || [];
        nextEntityInquiries = inquiryRes.data || [];
        nextNewsletterSubscribers = newsletterRes.data || [];
        nextProposals = propRes.data || [];
        nextProfiles = profilesRes.data || [];
        privateObservations = obsRes.data || [];
      }

      const observationMap = new Map();
      [...(publicObsRes.data || []), ...privateObservations].forEach((row) => {
        observationMap.set(String(row.id), row);
      });

      setProjects((projRes.data || []).map(mapProjectFromDb));
      setNews(newsRes.data || []);
      if (settingsRes.data) setSettings(mapSettingsFromDb(settingsRes.data));
      setRegistrations(nextRegistrations);
      setEntityInquiries(nextEntityInquiries);
      setNewsletterSubscribers(nextNewsletterSubscribers);
      setProposals(nextProposals);
      setObservations([...observationMap.values()]);
      setProfiles(nextProfiles);
      setUsingLocal(false);
    } catch (error) {
      loadLocal();
      setLoadError(error.message || 'Αποτυχία σύνδεσης με το Supabase');
    }
  }, [loadLocal, profile?.role, user?.id]);

  useEffect(() => {
    loadFromSupabase().finally(() => setLoading(false));
  }, [loadFromSupabase]);

  useEffect(() => {
    loadMemberships(user?.id);
  }, [user?.id, loadMemberships, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_projects', JSON.stringify(projects));
  }, [projects, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_news', JSON.stringify(news));
  }, [news, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_settings', JSON.stringify(settings));
  }, [settings, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_registrations', JSON.stringify(registrations));
  }, [registrations, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_entity_inquiries', JSON.stringify(entityInquiries));
  }, [entityInquiries, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_newsletter_subscribers', JSON.stringify(newsletterSubscribers));
  }, [newsletterSubscribers, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_proposals', JSON.stringify(proposals));
  }, [proposals, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_observations', JSON.stringify(observations));
  }, [observations, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    localStorage.setItem('cs_profiles', JSON.stringify(profiles));
  }, [profiles, usingLocal]);

  useEffect(() => {
    if (!usingLocal) return;
    const others = JSON.parse(localStorage.getItem('cs_memberships') || '[]')
      .filter((m) => m.user_id !== user?.id);
    localStorage.setItem('cs_memberships', JSON.stringify([...others, ...memberships]));
  }, [memberships, usingLocal, user?.id]);

  const addProject = async (project) => {
    const payload = {
      ...project,
      data_types: project.data_types?.length ? project.data_types : [...DEFAULT_DATA_TYPES],
      form_schema: project.form_schema || [],
    };
    if (usingLocal) {
      setProjects(prev => [...prev, { ...payload, id: Date.now() }]);
      return;
    }
    const { data, error } = await supabase.from('projects').insert(payload).select().single();
    if (error) throw error;
    setProjects(prev => [...prev, mapProjectFromDb(data)]);
  };

  const updateProject = async (id, updated) => {
    if (usingLocal) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
      return;
    }
    const { error } = await supabase.from('projects').update(updated).eq('id', id);
    if (error) throw error;
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProject = async (id) => {
    if (usingLocal) {
      setProjects(prev => prev.filter(p => p.id !== id));
      return;
    }
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addNews = async (item) => {
    if (usingLocal) {
      setNews(prev => [...prev, { ...item, id: Date.now() }]);
      return;
    }
    const { data, error } = await supabase.from('news').insert(item).select().single();
    if (error) throw error;
    setNews(prev => [data, ...prev]);
  };

  const updateNews = async (id, updated) => {
    if (usingLocal) {
      setNews(prev => prev.map(n => n.id === id ? { ...n, ...updated } : n));
      return;
    }
    const { error } = await supabase.from('news').update(updated).eq('id', id);
    if (error) throw error;
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...updated } : n));
  };

  const deleteNews = async (id) => {
    if (usingLocal) {
      setNews(prev => prev.filter(n => n.id !== id));
      return;
    }
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = async (newSettings) => {
    if (usingLocal) {
      setSettings(prev => ({ ...prev, ...newSettings }));
      return;
    }
    const { error } = await supabase.from('site_settings').update(mapSettingsToDb(newSettings)).eq('id', 1);
    if (error) throw error;
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addRegistration = async (data) => {
    if (usingLocal) {
      const item = { ...data, id: Date.now(), created_at: new Date().toISOString() };
      setRegistrations(prev => [item, ...prev]);
      return item;
    }
    const { error } = await supabase.from('registrations').insert(data);
    if (error) throw error;
    return data;
  };

  const addEntityInquiry = async (data) => {
    const payload = {
      organization: data.organization.trim(),
      contact_name: data.contact_name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      message: data.message.trim(),
      user_id: data.user_id || null,
    };
    if (usingLocal) {
      const item = { ...payload, id: Date.now(), status: 'pending', created_at: new Date().toISOString() };
      setEntityInquiries(prev => [item, ...prev]);
      return item;
    }
    const { error } = await supabase
      .from('entity_inquiries')
      .insert(payload);
    if (error) throw error;
    return payload;
  };

  const updateEntityInquiryStatus = async (id, status) => {
    if (usingLocal) {
      setEntityInquiries(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      return;
    }
    const { error } = await supabase.from('entity_inquiries').update({ status }).eq('id', id);
    if (error) throw error;
    setEntityInquiries(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const subscribeNewsletter = async ({ email, locale = 'el', user_id = null }) => {
    const payload = { email: email.trim().toLowerCase(), locale, user_id };
    if (usingLocal) {
      const exists = newsletterSubscribers.some(item => item.email.toLowerCase() === payload.email);
      if (exists) return { alreadySubscribed: true };
      const item = { ...payload, id: Date.now(), status: 'active', subscribed_at: new Date().toISOString() };
      setNewsletterSubscribers(prev => [item, ...prev]);
      return item;
    }
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert(payload);
    if (error?.code === '23505') return { alreadySubscribed: true };
    if (error) throw error;
    return payload;
  };

  const addProposal = async (data) => {
    if (usingLocal) {
      const item = { ...data, id: Date.now(), status: 'pending', created_at: new Date().toISOString() };
      setProposals(prev => [item, ...prev]);
      return item;
    }
    const { error } = await supabase.from('proposals').insert(data);
    if (error) throw error;
    return data;
  };

  const updateProposalStatus = async (id, status) => {
    if (usingLocal) {
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      return;
    }
    const { error } = await supabase.from('proposals').update({ status }).eq('id', id);
    if (error) throw error;
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const addObservation = async (data) => {
    if (usingLocal) {
      const item = { ...data, id: Date.now(), status: 'pending', created_at: new Date().toISOString() };
      setObservations(prev => [item, ...prev]);
      return item;
    }
    const { data: row, error } = await supabase.from('observations').insert(data).select().single();
    if (error) throw error;
    setObservations(prev => [row, ...prev]);
    return row;
  };

  const updateObservationStatus = async (id, status) => {
    if (usingLocal) {
      setObservations(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      return;
    }
    const { error } = await supabase.from('observations').update({ status }).eq('id', id);
    if (error) throw error;
    setObservations(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const uploadFile = async (file, userId, folder = 'photos') => {
    if (usingLocal || !supabase) {
      return URL.createObjectURL(file);
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error('Το αρχείο υπερβαίνει το μέγιστο μέγεθος των 25 MB.');
    }
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
    const contentType = file.type || MIME_BY_EXTENSION[ext];
    if (!contentType || !ALLOWED_UPLOAD_TYPES.has(contentType)) {
      throw new Error('Ο τύπος αρχείου δεν επιτρέπεται.');
    }
    const path = `${userId}/${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('observations').upload(path, file, {
      contentType,
      upsert: false,
    });
    if (error) throw error;
    return path;
  };

  const uploadPhoto = async (file, userId) => uploadFile(file, userId, 'photos');

  const getFileUrl = async (storedValue, expiresIn = 3600) => {
    if (!storedValue || usingLocal || !supabase) return storedValue || '';
    if (storedValue.startsWith('blob:') || storedValue.startsWith('data:')) return storedValue;

    let path = storedValue;
    const publicMarker = '/storage/v1/object/public/observations/';
    if (storedValue.includes(publicMarker)) {
      path = decodeURIComponent(storedValue.split(publicMarker)[1]);
    } else if (/^https?:\/\//i.test(storedValue)) {
      return storedValue;
    }

    const { data, error } = await supabase.storage
      .from('observations')
      .createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  };

  const joinProject = async (projectId, userId) => {
    if (!userId) throw new Error('Απαιτείται σύνδεση');
    const row = {
      project_id: projectId,
      user_id: userId,
      joined_at: new Date().toISOString(),
    };
    if (usingLocal || !supabase) {
      setMemberships((prev) => {
        if (prev.some((m) => String(m.project_id) === String(projectId) && m.user_id === userId)) return prev;
        return [row, ...prev];
      });
      return row;
    }

    const { data, error } = await supabase
      .from('project_members')
      .insert({ project_id: projectId, user_id: userId })
      .select()
      .single();

    if (error) {
      // already a member
      if (error.code === '23505') {
        await loadMemberships(userId);
        return row;
      }
      throw error;
    }

    setMemberships((prev) => {
      const without = prev.filter((m) => !(String(m.project_id) === String(projectId) && m.user_id === userId));
      return [data || row, ...without];
    });
    return data || row;
  };

  const isMemberOf = (projectId, userId = user?.id) =>
    Boolean(userId && memberships.some((m) => String(m.project_id) === String(projectId) && m.user_id === userId));

  const myProjects = projects.filter((p) =>
    memberships.some((m) => String(m.project_id) === String(p.id) && m.user_id === user?.id)
  );

  const updateUserRole = async (userId, role) => {
    if (usingLocal) {
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role } : p));
      return;
    }
    const { error } = await supabase.rpc('admin_update_user_role', {
      target_user_id: userId,
      new_role: role,
    });
    if (error) throw error;
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role } : p));
  };

  const updateProfileFields = async (userId, fields) => {
    if (usingLocal) {
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, ...fields } : p));
      return;
    }
    const { error } = await supabase.from('profiles').update(fields).eq('id', userId);
    if (error) throw error;
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, ...fields } : p));
  };

  const refresh = () => loadFromSupabase();

  return (
    <DataContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      news, addNews, updateNews, deleteNews,
      settings, updateSettings,
      registrations, addRegistration,
      entityInquiries, addEntityInquiry, updateEntityInquiryStatus,
      newsletterSubscribers, subscribeNewsletter,
      proposals, addProposal, updateProposalStatus,
      observations, addObservation, updateObservationStatus,
      profiles, updateUserRole, updateProfileFields,
      memberships, myProjects, joinProject, isMemberOf, loadMemberships,
      uploadPhoto, uploadFile, getFileUrl,
      loading, usingLocal, loadError, refresh,
    }}>
      {children}
    </DataContext.Provider>
  );
};
