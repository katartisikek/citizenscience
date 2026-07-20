import { useRef } from 'react';
import { MapPin, Camera, RefreshCw, Crosshair, Plus, Trash2, Video, Mic, FileUp } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="form-group collect-section">
    <label className="form-label">{title}</label>
    {children}
  </div>
);

export const ProfileSection = ({ value, onChange, profile }) => (
  <Section title="Προφίλ συμμετέχοντα">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <input className="form-control collect-input" placeholder="Ονοματεπώνυμο"
        value={value.full_name ?? profile?.full_name ?? ''}
        onChange={(e) => onChange({ ...value, full_name: e.target.value })} />
      <input className="form-control collect-input" placeholder="Περιοχή / Δήμος"
        value={value.area ?? profile?.area ?? ''}
        onChange={(e) => onChange({ ...value, area: e.target.value })} />
      <input className="form-control collect-input" placeholder="Τηλέφωνο (προαιρετικό)"
        value={value.phone || ''}
        onChange={(e) => onChange({ ...value, phone: e.target.value })} />
      <input className="form-control collect-input" placeholder="Ενδιαφέροντα"
        value={value.interests || ''}
        onChange={(e) => onChange({ ...value, interests: e.target.value })} />
    </div>
  </Section>
);

export const ParticipationSection = ({ value, onChange }) => (
  <Section title="Στοιχεία συμμετοχής">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <select className="form-control collect-input" value={value.role || ''}
        onChange={(e) => onChange({ ...value, role: e.target.value })}>
        <option value="">— Ρόλος —</option>
        <option value="volunteer">Εθελοντής</option>
        <option value="student">Μαθητής</option>
        <option value="researcher">Ερευνητής</option>
        <option value="coordinator">Συντονιστής</option>
      </select>
      <input className="form-control collect-input" type="number" min="0" step="0.5" placeholder="Διάρκεια (ώρες)"
        value={value.duration_hours ?? ''}
        onChange={(e) => onChange({ ...value, duration_hours: e.target.value })} />
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" checked={!!value.present}
          onChange={(e) => onChange({ ...value, present: e.target.checked })} />
        Παρουσία επιβεβαιωμένη
      </label>
      <textarea className="form-control collect-input" rows={2} placeholder="Σχόλια συμμετοχής"
        value={value.notes || ''}
        onChange={(e) => onChange({ ...value, notes: e.target.value })} />
    </div>
  </Section>
);

export const ObservationSection = ({ value, onChange }) => (
  <Section title="Παρατήρηση">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <textarea className="form-control collect-input" rows={3} placeholder="Τι παρατηρήσατε;"
        value={value.description || ''}
        onChange={(e) => onChange({ ...value, description: e.target.value })} />
      <input className="form-control collect-input" placeholder="Κατηγορία"
        value={value.category || ''}
        onChange={(e) => onChange({ ...value, category: e.target.value })} />
      <input className="form-control collect-input" type="number" min="0" placeholder="Ποσότητα"
        value={value.quantity ?? ''}
        onChange={(e) => onChange({ ...value, quantity: e.target.value })} />
      <textarea className="form-control collect-input" rows={2} placeholder="Σημειώσεις"
        value={value.notes || ''}
        onChange={(e) => onChange({ ...value, notes: e.target.value })} />
    </div>
  </Section>
);

export const GeoSection = ({ location, locLoading, locError, onRefresh }) => (
  <Section title={<><MapPin size={14} /> Τοποθεσία (GPS)</>}>
    <div className="collect-gps">
      {locLoading ? (
        <p className="collect-gps-status">Λήψη θέσης…</p>
      ) : location ? (
        <div>
          <p className="collect-gps-coords">
            <Crosshair size={14} /> {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </p>
          {location.accuracy != null && (
            <p className="collect-gps-accuracy">Ακρίβεια ±{Math.round(location.accuracy)} m</p>
          )}
          {location.altitude != null && (
            <p className="collect-gps-accuracy">Υψόμετρο {Math.round(location.altitude)} m</p>
          )}
        </div>
      ) : (
        <p className="collect-gps-error">{locError}</p>
      )}
      <button type="button" className="btn btn-outline collect-gps-btn" onClick={onRefresh} disabled={locLoading}>
        <RefreshCw size={14} /> {locLoading ? 'Αναζήτηση…' : 'Ανανέωση GPS'}
      </button>
    </div>
  </Section>
);

export const TemporalSection = ({ value, onChange }) => (
  <Section title="Χρονικά δεδομένα">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <input className="form-control collect-input" type="datetime-local"
        value={value.observed_at || ''}
        onChange={(e) => onChange({ ...value, observed_at: e.target.value })} />
      <input className="form-control collect-input" type="number" min="0" placeholder="Διάρκεια (λεπτά)"
        value={value.duration_minutes ?? ''}
        onChange={(e) => onChange({ ...value, duration_minutes: e.target.value })} />
      <select className="form-control collect-input" value={value.season || ''}
        onChange={(e) => onChange({ ...value, season: e.target.value })}>
        <option value="">— Εποχή —</option>
        <option value="spring">Άνοιξη</option>
        <option value="summer">Καλοκαίρι</option>
        <option value="autumn">Φθινόπωρο</option>
        <option value="winter">Χειμώνας</option>
      </select>
    </div>
  </Section>
);

export const PhotosSection = ({ files, previews, onChange }) => {
  const inputRef = useRef(null);
  return (
    <Section title={<><Camera size={14} /> Φωτογραφίες</>}>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" multiple
        className="collect-file-input" onChange={(e) => onChange(Array.from(e.target.files || []))} />
      <button type="button" className="collect-photo-zone" onClick={() => inputRef.current?.click()}>
        {previews?.length ? (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem', width: '100%' }}>
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <span className="collect-photo-placeholder">
            <Camera size={28} />
            <span>Πατήστε για κάμερα ή αρχεία</span>
          </span>
        )}
      </button>
      {files?.length > 0 && (
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
          {files.length} φωτογραφία(ες) επιλεγμένες
        </p>
      )}
    </Section>
  );
};

export const VideosSection = ({ files, onChange }) => (
  <Section title={<><Video size={14} /> Βίντεο</>}>
    <input type="file" accept="video/*" capture="environment" className="form-control collect-input"
      onChange={(e) => onChange(Array.from(e.target.files || []))} />
    {files?.length > 0 && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{files.length} αρχείο(α)</p>}
  </Section>
);

export const AudioSection = ({ files, onChange }) => (
  <Section title={<><Mic size={14} /> Ηχητικά</>}>
    <input type="file" accept="audio/*" capture className="form-control collect-input"
      onChange={(e) => onChange(Array.from(e.target.files || []))} />
    {files?.length > 0 && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{files.length} αρχείο(α)</p>}
  </Section>
);

export const MeasurementsSection = ({ value, onChange }) => {
  const rows = value?.length ? value : [{ name: '', value: '', unit: '' }];
  const update = (i, patch) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    onChange(next);
  };
  return (
    <Section title="Μετρήσεις">
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input className="form-control collect-input" placeholder="Μέγεθος" value={row.name}
            onChange={(e) => update(i, { name: e.target.value })} />
          <input className="form-control collect-input" type="number" step="any" placeholder="Τιμή" value={row.value}
            onChange={(e) => update(i, { value: e.target.value })} />
          <input className="form-control collect-input" placeholder="Μονάδα" value={row.unit}
            onChange={(e) => update(i, { unit: e.target.value })} />
          <button type="button" className="btn btn-outline" style={{ minHeight: 48, padding: '0 0.75rem' }}
            onClick={() => onChange(rows.filter((_, idx) => idx !== i))} disabled={rows.length === 1}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline" onClick={() => onChange([...rows, { name: '', value: '', unit: '' }])}>
        <Plus size={14} /> Προσθήκη μέτρησης
      </button>
    </Section>
  );
};

export const SensorsSection = ({ value, onChange, onCsv }) => (
  <Section title="Μετρήσεις αισθητήρων">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <input className="form-control collect-input" placeholder="Πηγή / συσκευή (π.χ. IoT, Bluetooth)"
        value={value.device || ''}
        onChange={(e) => onChange({ ...value, device: e.target.value })} />
      <textarea className="form-control collect-input" rows={2} placeholder="Τιμές (ελεύθερο κείμενο ή JSON)"
        value={value.readings || ''}
        onChange={(e) => onChange({ ...value, readings: e.target.value })} />
      <label className="form-label" style={{ marginBottom: 0 }}>CSV από αισθητήρα</label>
      <input type="file" accept=".csv,text/csv" className="form-control collect-input"
        onChange={(e) => onCsv(e.target.files?.[0] || null)} />
    </div>
  </Section>
);

export const QuestionnaireSection = ({ schema, value, onChange }) => (
  <Section title="Ερωτηματολόγιο">
    {(schema || []).map((field) => (
      <div key={field.name} className="form-group" style={{ marginBottom: '0.75rem' }}>
        <label className="form-label">{field.label}</label>
        {field.type === 'select' ? (
          <select className="form-control collect-input" value={value[field.name] || ''}
            onChange={(e) => onChange({ ...value, [field.name]: e.target.value })}>
            <option value="">— Επιλέξτε —</option>
            {(field.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea className="form-control collect-input" rows={3} value={value[field.name] || ''}
            onChange={(e) => onChange({ ...value, [field.name]: e.target.value })} />
        ) : (
          <input type={field.type || 'text'} className="form-control collect-input" value={value[field.name] || ''}
            onChange={(e) => onChange({ ...value, [field.name]: e.target.value })}
            inputMode={field.type === 'number' ? 'decimal' : undefined} />
        )}
      </div>
    ))}
    {(!schema || schema.length === 0) && (
      <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
        Δεν έχουν οριστεί πεδία ερωτηματολογίου για αυτό το project.
      </p>
    )}
  </Section>
);

export const CitizenReportSection = ({ value, onChange }) => (
  <Section title="Citizen Report">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <select className="form-control collect-input" value={value.problem_type || ''}
        onChange={(e) => onChange({ ...value, problem_type: e.target.value })}>
        <option value="">— Τύπος προβλήματος —</option>
        <option value="pollution">Ρύπανση</option>
        <option value="trash">Απορρίμματα</option>
        <option value="illegal">Παράνομη δραστηριότητα</option>
        <option value="flood">Πλημμύρα</option>
        <option value="fire">Πυρκαγιά</option>
        <option value="landslide">Κατολίσθηση</option>
        <option value="infrastructure">Υποδομές</option>
        <option value="other">Άλλο</option>
      </select>
      <select className="form-control collect-input" value={value.severity || ''}
        onChange={(e) => onChange({ ...value, severity: e.target.value })}>
        <option value="">— Σοβαρότητα —</option>
        <option value="low">Χαμηλή</option>
        <option value="medium">Μέτρια</option>
        <option value="high">Υψηλή</option>
      </select>
      <textarea className="form-control collect-input" rows={3} placeholder="Περιγραφή"
        value={value.description || ''}
        onChange={(e) => onChange({ ...value, description: e.target.value })} />
    </div>
  </Section>
);

export const SpeciesSection = ({ value, onChange }) => (
  <Section title="Καταγραφή ειδών">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <input className="form-control collect-input" placeholder="Κοινό όνομα"
        value={value.common_name || ''}
        onChange={(e) => onChange({ ...value, common_name: e.target.value })} />
      <input className="form-control collect-input" placeholder="Επιστημονικό όνομα"
        value={value.scientific_name || ''}
        onChange={(e) => onChange({ ...value, scientific_name: e.target.value })} />
      <input className="form-control collect-input" type="number" min="0" placeholder="Αριθμός ατόμων"
        value={value.count ?? ''}
        onChange={(e) => onChange({ ...value, count: e.target.value })} />
      <select className="form-control collect-input" value={value.sex || ''}
        onChange={(e) => onChange({ ...value, sex: e.target.value })}>
        <option value="">— Φύλο —</option>
        <option value="unknown">Άγνωστο</option>
        <option value="male">Αρσενικό</option>
        <option value="female">Θηλυκό</option>
        <option value="mixed">Μικτό</option>
      </select>
      <input className="form-control collect-input" placeholder="Συμπεριφορά"
        value={value.behavior || ''}
        onChange={(e) => onChange({ ...value, behavior: e.target.value })} />
    </div>
  </Section>
);

export const ClassificationSection = ({ value, onChange }) => (
  <Section title="Ταξινόμηση / ετικέτες">
    <input className="form-control collect-input" placeholder="Ετικέτες χωρισμένες με κόμμα"
      value={value.tags || ''}
      onChange={(e) => onChange({ ...value, tags: e.target.value })} />
    <textarea className="form-control collect-input" rows={2} placeholder="Σχόλια ταξινόμησης" style={{ marginTop: '0.75rem' }}
      value={value.notes || ''}
      onChange={(e) => onChange({ ...value, notes: e.target.value })} />
  </Section>
);

export const FilesSection = ({ files, onChange }) => (
  <Section title={<><FileUp size={14} /> Upload αρχείων</>}>
    <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.geojson,.json,.gpx,.zip"
      className="form-control collect-input"
      onChange={(e) => onChange(Array.from(e.target.files || []))} />
    {files?.length > 0 && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{files.length} αρχείο(α)</p>}
  </Section>
);

export const AnalysisSection = ({ value, onChange, onPdf }) => (
  <Section title="Αποτελέσματα αναλύσεων">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <select className="form-control collect-input" value={value.sample_type || ''}
        onChange={(e) => onChange({ ...value, sample_type: e.target.value })}>
        <option value="">— Τύπος δείγματος —</option>
        <option value="water">Νερό</option>
        <option value="soil">Έδαφος</option>
        <option value="air">Αέρας</option>
        <option value="other">Άλλο</option>
      </select>
      <textarea className="form-control collect-input" rows={2} placeholder="Αποτελέσματα εργαστηρίου"
        value={value.results || ''}
        onChange={(e) => onChange({ ...value, results: e.target.value })} />
      <input type="file" accept=".pdf,application/pdf" className="form-control collect-input"
        onChange={(e) => onPdf(e.target.files?.[0] || null)} />
    </div>
  </Section>
);

export const EducationSection = ({ value, onChange }) => (
  <Section title="Εκπαιδευτικά δεδομένα">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <input className="form-control collect-input" placeholder="Δραστηριότητα / μάθημα"
        value={value.activity || ''}
        onChange={(e) => onChange({ ...value, activity: e.target.value })} />
      <input className="form-control collect-input" type="number" min="0" max="100" placeholder="Βαθμολογία quiz (%)"
        value={value.quiz_score ?? ''}
        onChange={(e) => onChange({ ...value, quiz_score: e.target.value })} />
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" checked={!!value.completed}
          onChange={(e) => onChange({ ...value, completed: e.target.checked })} />
        Ολοκληρώθηκε
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" checked={!!value.certificate}
          onChange={(e) => onChange({ ...value, certificate: e.target.checked })} />
        Έκδοση πιστοποιητικού
      </label>
    </div>
  </Section>
);

export const EvaluationSection = ({ value, onChange }) => (
  <Section title="Αξιολόγηση">
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <select className="form-control collect-input" value={value.rating || ''}
        onChange={(e) => onChange({ ...value, rating: e.target.value })}>
        <option value="">— Βαθμολογία 1–5 —</option>
        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <textarea className="form-control collect-input" rows={2} placeholder="Σχόλια / προτάσεις"
        value={value.feedback || ''}
        onChange={(e) => onChange({ ...value, feedback: e.target.value })} />
    </div>
  </Section>
);

export const GdprSection = ({ checked, onChange }) => (
  <Section title="GDPR & Προστασία δεδομένων">
    <label style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', lineHeight: 1.45 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ marginTop: 4 }} />
      <span style={{ fontSize: '0.92rem' }}>
        Συναινώ στη συλλογή και επεξεργασία των δεδομένων μου για τους σκοπούς του Citizen Science Hub,
        σύμφωνα με την πολιτική προστασίας δεδομένων. Γνωρίζω ότι μπορώ να ζητήσω πρόσβαση, διόρθωση ή διαγραφή.
      </span>
    </label>
  </Section>
);
