import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKidsAuth } from '../../context/KidsAuthContext';
import { useKidsData } from '../../context/KidsDataContext';

const steps = [
  { label: 'Πληροφορίες', icon: '📋' },
  { label: 'Φωτογραφία', icon: '📸' },
  { label: 'Τοποθεσία', icon: '📍' },
  { label: 'Υποβολή', icon: '🚀' },
];

const KidsObservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student } = useKidsAuth();
  const { missions, addObservation } = useKidsData();
  const mission = missions.find(m => String(m.id) === String(id));

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!mission) {
    return (
      <div className="kids-container" style={{ padding: 'var(--kids-space-2xl)', textAlign: 'center' }}>
        <div className="kids-empty">
          <div className="kids-empty-icon">❓</div>
          <div className="kids-empty-title">Αποστολή δεν βρέθηκε</div>
          <button className="kids-btn kids-btn-primary" onClick={() => navigate('/kids')}>
            ← Πίσω στις Αποστολές
          </button>
        </div>
      </div>
    );
  }

  const schema = Array.isArray(mission.form_schema) ? mission.form_schema : [];

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await addObservation({
        mission_id: mission.id,
        student_alias_id: student.id,
        class_id: student.class_id,
        school_id: student.school_id,
        data: formData,
        notes,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting observation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="kids-container" style={{ padding: 'var(--kids-space-2xl)', textAlign: 'center' }}>
        <div className="kids-animate-pop">
          <div style={{ fontSize: '5rem', marginBottom: 'var(--kids-space-md)' }}>🎉</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.5rem', marginBottom: 'var(--kids-space-sm)' }}>
            Μπράβο!
          </h2>
          <p style={{ color: 'var(--kids-text-light)', marginBottom: 'var(--kids-space-xl)' }}>
            Η παρατήρησή σου υποβλήθηκε! Ο εκπαιδευτικός θα την ελέγξει σύντομα.
          </p>
          <div style={{ display: 'flex', gap: 'var(--kids-space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="kids-btn kids-btn-primary" onClick={() => { setSubmitted(false); setStep(0); setFormData({}); setNotes(''); setPhoto(null); setPhotoPreview(''); }}>
              🔬 Νέα Παρατήρηση
            </button>
            <button className="kids-btn kids-btn-outline" onClick={() => navigate('/kids')}>
              ← Αποστολές
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)' }}>
      {/* Mission Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kids-space-md)', marginBottom: 'var(--kids-space-lg)' }}>
        <button className="kids-btn kids-btn-ghost kids-btn-sm" onClick={() => navigate('/kids')}>
          ← Πίσω
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", margin: 0, fontSize: '1.2rem' }}>
            {mission.icon} {mission.title}
          </h2>
        </div>
      </div>

      {/* Wizard */}
      <div className="kids-wizard kids-animate-in">
        {/* Steps indicator */}
        <div className="kids-wizard-steps">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`kids-wizard-step ${i === step ? 'active' : i < step ? 'completed' : ''}`}
              onClick={() => i < step && setStep(i)}
              style={{ cursor: i < step ? 'pointer' : 'default' }}
            >
              <span className="kids-wizard-step-num">
                {i < step ? '✓' : s.icon}
              </span>
              <span style={{ display: 'none' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="kids-wizard-body">
          {/* Step 0: Form Fields */}
          {step === 0 && (
            <div className="kids-animate-in">
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginTop: 0, marginBottom: 'var(--kids-space-lg)' }}>
                📋 Καταγράψε τα στοιχεία
              </h3>

              {/* Instructions */}
              {mission.instructions && (
                <div style={{
                  background: 'rgba(108, 99, 255, 0.04)',
                  borderRadius: 'var(--kids-radius-md)',
                  padding: 'var(--kids-space-md)',
                  marginBottom: 'var(--kids-space-lg)',
                  fontSize: '0.85rem',
                  color: 'var(--kids-text-light)',
                  whiteSpace: 'pre-line',
                }}>
                  💡 {mission.instructions}
                </div>
              )}

              {schema.map(field => (
                <div key={field.name} className="kids-input-group">
                  <label className="kids-input-label">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className="kids-input kids-select"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    >
                      <option value="">Επέλεξε...</option>
                      {(field.options || []).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="kids-input"
                      rows={3}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      className="kids-input"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <div className="kids-input-group">
                <label className="kids-input-label">📝 Σημειώσεις (προαιρετικό)</label>
                <textarea
                  className="kids-input"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Γράψε ό,τι παρατήρησες..."
                  style={{ minHeight: '60px', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* Step 1: Photo */}
          {step === 1 && (
            <div className="kids-animate-in">
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginTop: 0, marginBottom: 'var(--kids-space-lg)' }}>
                📸 Βγάλε μια φωτογραφία
              </h3>
              <label htmlFor="kids-photo-input">
                <div className={`kids-photo-upload ${photoPreview ? 'has-photo' : ''}`}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="kids-photo-preview" />
                  ) : (
                    <>
                      <div style={{ fontSize: '3rem', marginBottom: 'var(--kids-space-sm)' }}>📷</div>
                      <p style={{ fontWeight: 600, color: 'var(--kids-text)', margin: 0 }}>Πάτα εδώ για φωτογραφία</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--kids-text-muted)', margin: 'var(--kids-space-xs) 0 0' }}>
                        ή σύρε μια εικόνα
                      </p>
                    </>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="kids-photo-input"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              {photoPreview && (
                <button
                  className="kids-btn kids-btn-ghost kids-btn-sm"
                  onClick={() => { setPhoto(null); setPhotoPreview(''); }}
                  style={{ marginTop: 'var(--kids-space-sm)' }}
                >
                  🗑️ Αφαίρεση
                </button>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--kids-text-muted)', marginTop: 'var(--kids-space-md)' }}>
                🔒 Τα μεταδεδομένα τοποθεσίας (EXIF) αφαιρούνται αυτόματα για την προστασία σου.
              </p>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="kids-animate-in">
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginTop: 0, marginBottom: 'var(--kids-space-lg)' }}>
                📍 Τοποθεσία
              </h3>
              {mission.location_precision === 'none' ? (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--kids-space-xl)',
                  background: 'rgba(46, 204, 113, 0.06)',
                  borderRadius: 'var(--kids-radius-md)',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--kids-space-sm)' }}>🏠</div>
                  <p style={{ fontWeight: 600, margin: 0 }}>Αυτή η αποστολή δεν χρειάζεται τοποθεσία!</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--kids-text-light)', margin: 'var(--kids-space-xs) 0 0' }}>
                    Πάτα &quot;Επόμενο&quot; για να συνεχίσεις
                  </p>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--kids-space-xl)',
                  background: 'rgba(108, 99, 255, 0.04)',
                  borderRadius: 'var(--kids-radius-md)',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--kids-space-sm)' }}>🗺️</div>
                  <p style={{ fontWeight: 600, margin: '0 0 var(--kids-space-sm)' }}>
                    Η τοποθεσία θα καταγραφεί σε επίπεδο: {mission.location_precision === 'municipality' ? 'Δήμος' : mission.location_precision === 'region' ? 'Περιφέρεια' : 'Περίπου'}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--kids-text-light)', margin: 0 }}>
                    🔒 Η ακριβής τοποθεσία δεν εμφανίζεται δημόσια
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="kids-animate-in">
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginTop: 0, marginBottom: 'var(--kids-space-lg)' }}>
                🚀 Έτοιμο για υποβολή!
              </h3>

              <div className="kids-card" style={{ marginBottom: 'var(--kids-space-lg)' }}>
                <h4 style={{ margin: '0 0 var(--kids-space-md)', fontFamily: "'Fredoka', sans-serif" }}>
                  {mission.icon} {mission.title}
                </h4>
                {schema.map(field => (
                  <div key={field.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--kids-border)' }}>
                    <span style={{ color: 'var(--kids-text-light)', fontSize: '0.85rem' }}>{field.label}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{formData[field.name] || '—'}</span>
                  </div>
                ))}
                {notes && (
                  <div style={{ marginTop: 'var(--kids-space-sm)', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--kids-text-light)' }}>📝 </span>{notes}
                  </div>
                )}
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 'var(--kids-radius-sm)', marginTop: 'var(--kids-space-sm)' }} />
                )}
              </div>

              <div style={{
                background: 'rgba(46, 204, 113, 0.06)',
                borderRadius: 'var(--kids-radius-md)',
                padding: 'var(--kids-space-md)',
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'var(--kids-green)',
                fontWeight: 600,
              }}>
                ⭐ Θα κερδίσεις {mission.points} πόντους!
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="kids-wizard-footer">
          <button
            className="kids-btn kids-btn-outline"
            onClick={() => step > 0 ? setStep(step - 1) : navigate('/kids')}
          >
            ← {step > 0 ? 'Πίσω' : 'Ακύρωση'}
          </button>

          {step < 3 ? (
            <button
              className="kids-btn kids-btn-primary"
              onClick={() => setStep(step + 1)}
            >
              Επόμενο →
            </button>
          ) : (
            <button
              className="kids-btn kids-btn-success kids-btn-lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? '⏳ Υποβολή...' : '🚀 Υποβολή!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KidsObservation;
