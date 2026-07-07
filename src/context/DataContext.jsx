import { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialProjects = [
  {
    id: 1,
    title: "Mosquito Watch",
    status: "Ενεργό",
    image: "https://images.unsplash.com/photo-1615814041724-4fec8b74c2e6?auto=format&fit=crop&q=80&w=800",
    description: "Παρακολούθηση και καταγραφή πληθυσμών κουνουπιών στην Κρήτη για την προστασία της δημόσιας υγείας.",
    goal: "Χαρτογράφηση εστιών αναπαραγωγής",
    participants: "Όλοι οι πολίτες",
    area: "Παγκρήτια",
    timeline: "Μάιος - Οκτώβριος 2026",
  },
  {
    id: 2,
    title: "Youth4Diagnostics",
    status: "Ολοκληρωμένο",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    description: "Συλλογή δειγμάτων νερού από μαθητές για την ανάλυση της ποιότητας των υδάτινων πόρων της περιοχής.",
    goal: "Ανάλυση ποιότητας νερού",
    participants: "Μαθητές & Εκπαιδευτικοί",
    area: "Νομός Ηρακλείου",
    timeline: "Σεπτέμβριος 2025 - Μάιος 2026",
  }
];

const initialNews = [
  {
    id: 1,
    title: "Έναρξη της νέας καμπάνιας Mosquito Watch για το καλοκαίρι του 2026",
    date: "12 Μαΐου 2026",
    type: "Ανακοίνωση",
    content: "Η Περιφέρεια Κρήτης σε συνεργασία με το Citizen Science Hub ανακοινώνουν την έναρξη της καλοκαιρινής δράσης για την παρακολούθηση κουνουπιών...",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Αποτελέσματα Δειγματοληψίας Νερού Youth4Diagnostics",
    date: "10 Απριλίου 2026",
    type: "Αποτελέσματα",
    content: "Δημοσιεύθηκαν σήμερα τα αποτελέσματα από την ανάλυση 500 δειγμάτων νερού που συλλέχθηκαν από μαθητές...",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800"
  }
];

const initialSettings = {
  heroTitle: "Citizen Science Hub of Crete",
  heroSubtitle: "Όταν οι πολίτες συμμετέχουν στην έρευνα, γίνονται μέρος της λύσης. Ελάτε να κατανοήσουμε και να προστατεύσουμε το περιβάλλον της Κρήτης μαζί.",
  aboutText: "Ένα δίκτυο πολιτών, επιστημόνων και φορέων της Κρήτης που συνεργάζονται για τη συλλογή κρίσιμων περιβαλλοντικών δεδομένων με σύγχρονες μεθόδους."
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('cs_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('cs_news');
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cs_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('cs_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('cs_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('cs_settings', JSON.stringify(settings));
  }, [settings]);

  // Actions
  const addProject = (project) => setProjects([...projects, { ...project, id: Date.now() }]);
  const updateProject = (id, updatedProject) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };
  const deleteProject = (id) => setProjects(projects.filter(p => p.id !== id));

  const addNews = (item) => setNews([...news, { ...item, id: Date.now() }]);
  const updateNews = (id, updatedNews) => {
    setNews(news.map(n => n.id === id ? { ...n, ...updatedNews } : n));
  };
  const deleteNews = (id) => setNews(news.filter(n => n.id !== id));

  const updateSettings = (newSettings) => setSettings({ ...settings, ...newSettings });

  return (
    <DataContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      news, addNews, updateNews, deleteNews,
      settings, updateSettings
    }}>
      {children}
    </DataContext.Provider>
  );
};
