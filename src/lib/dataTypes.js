/** Catalog of 20 citizen-science data types selectable per project */

export const DEFAULT_DATA_TYPES = [
  'geo',
  'observation',
  'photos',
  'questionnaire',
  'metadata',
  'gdpr',
];

export const DATA_TYPES = [
  {
    id: 'profile',
    label: 'Προφίλ συμμετέχοντα',
    label_en: 'Participant profile',
    category: 'identity',
    description: 'Όνομα, περιοχή, τηλέφωνο, ενδιαφέροντα',
  },
  {
    id: 'participation',
    label: 'Στοιχεία συμμετοχής',
    label_en: 'Participation details',
    category: 'identity',
    description: 'Ρόλος, διάρκεια, παρουσία',
  },
  {
    id: 'observation',
    label: 'Παρατηρήσεις',
    label_en: 'Observations',
    category: 'field',
    description: 'Περιγραφή, κατηγορία, ποσότητα, σημειώσεις',
  },
  {
    id: 'geo',
    label: 'Γεωγραφικά δεδομένα',
    label_en: 'Geographical data',
    category: 'field',
    description: 'GPS, υψόμετρο, ακρίβεια',
  },
  {
    id: 'temporal',
    label: 'Χρονικά δεδομένα',
    label_en: 'Temporal data',
    category: 'field',
    description: 'Ημερομηνία, ώρα, διάρκεια, εποχή',
  },
  {
    id: 'photos',
    label: 'Φωτογραφίες',
    label_en: 'Photos',
    category: 'media',
    description: 'Μία ή περισσότερες φωτογραφίες',
    storage: 'photos',
  },
  {
    id: 'videos',
    label: 'Βίντεο',
    label_en: 'Videos',
    category: 'media',
    description: 'Σύντομα βίντεο / time-lapse',
    storage: 'videos',
  },
  {
    id: 'audio',
    label: 'Ηχητικά αρχεία',
    label_en: 'Audio files',
    category: 'media',
    description: 'Ηχογραφήσεις περιβάλλοντος / ειδών',
    storage: 'audio',
  },
  {
    id: 'measurements',
    label: 'Μετρήσεις',
    label_en: 'Measurements',
    category: 'numeric',
    description: 'Θερμοκρασία, pH, θόρυβος κλπ.',
  },
  {
    id: 'sensors',
    label: 'Μετρήσεις αισθητήρων',
    label_en: 'Sensor measurements',
    category: 'numeric',
    description: 'Πηγή συσκευής + τιμές / CSV',
    storage: 'files',
  },
  {
    id: 'questionnaire',
    label: 'Ερωτηματολόγιο',
    label_en: 'Questionnaire',
    category: 'forms',
    description: 'Δυναμικά πεδία από form_schema',
  },
  {
    id: 'citizen_report',
    label: 'Citizen Reports',
    label_en: 'Citizen reports',
    category: 'field',
    description: 'Αναφορά προβλήματος / περιστατικού',
  },
  {
    id: 'species',
    label: 'Καταγραφή ειδών',
    label_en: 'Species records',
    category: 'field',
    description: 'Όνομα είδους, άτομα, συμπεριφορά',
  },
  {
    id: 'classification',
    label: 'Ταξινόμηση δεδομένων',
    label_en: 'Data classification',
    category: 'forms',
    description: 'Ετικέτες / tagging',
  },
  {
    id: 'files',
    label: 'Upload αρχείων',
    label_en: 'File upload',
    category: 'media',
    description: 'PDF, CSV, GeoJSON, GPX κλπ.',
    storage: 'files',
  },
  {
    id: 'analysis',
    label: 'Αποτελέσματα αναλύσεων',
    label_en: 'Analysis results',
    category: 'numeric',
    description: 'Εργαστηριακές μετρήσεις + PDF',
    storage: 'files',
  },
  {
    id: 'education',
    label: 'Εκπαιδευτικά δεδομένα',
    label_en: 'Educational data',
    category: 'system',
    description: 'Quiz, ολοκλήρωση, πιστοποιητικό',
  },
  {
    id: 'evaluation',
    label: 'Αξιολογήσεις',
    label_en: 'Evaluations',
    category: 'forms',
    description: 'Βαθμολογία και σχόλια',
  },
  {
    id: 'metadata',
    label: 'Metadata',
    label_en: 'Metadata',
    category: 'system',
    description: 'Αυτόματη καταγραφή συσκευής / GPS quality',
  },
  {
    id: 'gdpr',
    label: 'GDPR & Προστασία δεδομένων',
    label_en: 'GDPR & data protection',
    category: 'system',
    description: 'Συγκατάθεση χρήστη πριν την υποβολή',
  },
];

export const DATA_TYPE_BY_ID = Object.fromEntries(DATA_TYPES.map((t) => [t.id, t]));

export const hasDataType = (project, typeId) => {
  const types = project?.data_types;
  if (!Array.isArray(types) || types.length === 0) {
    return DEFAULT_DATA_TYPES.includes(typeId);
  }
  return types.includes(typeId);
};

export const summarizeObservationData = (data) => {
  if (!data || typeof data !== 'object') return [];
  const parts = [];
  if (data.observation?.description) parts.push(data.observation.description);
  if (data.species?.common_name || data.species?.scientific_name) {
    parts.push(data.species.common_name || data.species.scientific_name);
  }
  if (data.citizen_report?.problem_type) parts.push(data.citizen_report.problem_type);
  if (Array.isArray(data.measurements) && data.measurements.length) {
    parts.push(`${data.measurements.length} μετρήσεις`);
  }
  if (data.evaluation?.rating) parts.push(`Αξιολόγηση ${data.evaluation.rating}/5`);
  if (data.questionnaire && Object.keys(data.questionnaire).length) {
    parts.push('Ερωτηματολόγιο');
  }
  return parts.slice(0, 3);
};
