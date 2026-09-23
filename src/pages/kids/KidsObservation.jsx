import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKidsAuth } from '../../context/KidsAuthContext';
import { useKidsData } from '../../context/KidsDataContext';

const steps = [
  { label: 'Πληροφορίες', icon: '📋' },
  { label: 'Φωτογραφία', icon: '📸' },
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
        <div className="kids-card kids-animate-pop" style={{ maxWidth: 450, margin: '40px auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--kids-space-md)' }}>❓</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.6rem', marginBottom: 'var(--kids-space-sm)', color: 'var(--kids-purple)' }}>
            Αποστολή δεν βρέθηκε
          </h2>
          <p style={{ color: 'var(--kids-text-light)', marginBottom: 'var(--kids-space-xl)' }}>
            Η αποστολή που ζήτησες δεν υπάρχει ή έχει αφαιρεθεί.
          </p>
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
        student_alias_id: student?.id,
        class_id: student?.class_id,
        school_id: student?.school_id,
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
      <div className="kids-container" style={{ padding: 'var(--kids-space-2xl) var(--kids-space-md)', textAlign: 'center' }}>
        <div className="kids-card kids-animate-in" style={{ maxWidth: 520, margin: '40px auto', padding: '40px 30px' }}>
          <div className="kids-animate-pop" style={{ fontSize: '5.5rem', marginBottom: 'var(--kids-space-md)' }}>🎉</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '2rem', color: '#2ECC71', margin: '0 0 10px 0' }}>
            Μπράβο, Εξερευνητή!
          </h2>
          <p style={{ color: 'var(--kids-text-light)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 'var(--kids-space-xl)' }}>
            Η παρατήρησή σου υποβλήθηκε με επιτυχία! Ο εκπαιδευτικός σου θα την ελέγξει σύντομα για να επιβεβαιώσει τους πόντους σου.
          </p>
          <div style={{ display: 'flex', gap: 'var(--kids-space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="kids-btn kids-btn-primary" onClick={() => { setSubmitted(false); setStep(0); setFormData({}); setNotes(''); setPhoto(null); setPhotoPreview(''); }}>
              🔬 Νέα Παρατήρηση
            </button>
            <button className="kids-btn kids-btn-outline" onClick={() => navigate('/kids')}>
              ← Πίσω στις Αποστολές
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercent = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)', maxWidth: 720 }}>
      {/* Top Navigation & Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kids-space-md)', marginBottom: 'var(--kids-space-lg)' }}>
        <button className="kids-btn kids-btn-outline kids-btn-sm" onClick={() => navigate('/kids')}>
          ← Πίσω
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem' }}>{mission.icon}</span>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", margin: 0, fontSize: '1.4rem', color: 'var(--kids-purple)' }}>
              {mission.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Main Playful Wizard Card */}
      <div className="kids-wizard">
        {/* Wizard Steps Header & Progress Bar */}
        <div className="kids-wizard-steps-header">
          <div className="kids-wizard-progress-track">
            <div className="kids-wizard-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="kids-wizard-steps">
            {steps.map((s, i) => (
              <button
                key={i}
                type="button"
                className={`kids-wizard-step ${i === step ? 'active' : i < step ? 'completed' : ''}`}
                onClick={() => i < step && setStep(i)}
                style={{ cursor: i < step ? 'pointer' : 'default' }}
              >
                <span className="kids-wizard-step-num">
                  {i < step ? '✓' : s.icon}
                </span>
                <span className="kids-wizard-step-label">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content Area */}
        <div className="kids-wizard-body">
          {/* Step 0: Form Fields & Notes */}
          {step === 0 && (
            <div className="kids-animate-in">
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginTop: 0, marginBottom: 'var(--kids-space-lg)', color: 'var(--kids-purple)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem' }}>
                <span>📋</span> Καταγράψε τα στοιχεία
              </h3>

              {/* Instructions Box */}
              {mission.instructions && (
                <div style={{
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                  border: '2px solid #C7D2FE',
                  borderRadius: 'var(--kids-radius-md)',
                  padding: 'var(--kids-space-md)',
                  marginBottom: 'var(--kids-space-lg)',
                  fontSize: '0.95rem',
                  color: '#3730A3',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5
                }}>
                  💡 <strong>Οδηγός Αποστολής:</strong> {mission.instructions}
                </div>
              )}

              {/* Dynamic Form Schema Fields */}
              {schema.map(field => (
                <div key={field.name} className="kids-input-group">
                  <label className="kids-input-label">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className="kids-input"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    >
                      <option value="">Επέλεξε επιλογή...</option>
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

              {/* General Notes Field */}
              <div className="kids-input-group">
                <label className="kids-input-label">📝 Σημειώσεις (προαιρετικό)</label>
                <textarea
                  className="kids-input"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Γράψε ό,τι περίεργο ή ενδιαφέρον παρατήρησες..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* Step 1: Photo Upload */}
          {step === 1 && (
            <div className="kids-animate-in">
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginTop: 0, marginBottom: 'var(--kids-space-lg)', color: 'var(--kids-purple)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem' }}>
                <span>📸</span> Βγάλε μια φωτογραφία
              </h3>

              <label htmlFor="kids-photo-input">
                <div className={`kids-photo-upload ${photoPreview ? 'has-photo' : ''}`}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="kids-photo-preview" />
                  ) : (
                    <>
                      <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>📷</div>
                      <p style={{ fontWeight: 700, color: 'var(--kids-purple)', margin: 0, fontSize: '1.2rem', fontFamily: "'Fredoka', sans-serif" }}>
                        Πάτα εδώ για φωτογραφία!
                      </p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--kids-text-light)', margin: '6px 0 0 0' }}>
                        ή επίλεξε αρχείο από τη συσκευή σου
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
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button
                    type="button"
                    className="kids-btn kids-btn-outline kids-btn-sm"
                    onClick={() => { setPhoto(null); setPhotoPreview(''); }}
                  >
                    🗑️ Αφαίρεση φωτογραφίας
                  </button>
                </div>
              )}

              <div style={{
                marginTop: '24px',
                padding: '12px 16px',
                background: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.3rem' }}>🔒</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--kids-text-light)', lineHeight: 1.4 }}>
                  <strong>Ασφάλεια:</strong> Τα μεταδεδομένα (EXIF) αφαιρούνται αυτόματα για την προστασία των προσωπικών σου δεδομένων.
                </span>
              </div>
            </div>
          )}

          {/* Step 2: Review & Final Submit */}
          {step === 2 && (
            <div className="kids-animate-in">
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginTop: 0, marginBottom: 'var(--kids-space-lg)', color: 'var(--kids-purple)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem' }}>
                <span>🚀</span> Επισκόπηση & Υποβολή
              </h3>

              <div className="kids-card" style={{ marginBottom: 'var(--kids-space-lg)', background: '#FAFAFA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px dashed #E2E8F0' }}>
                  <span style={{ fontSize: '2rem' }}>{mission.icon}</span>
                  <div>
                    <h4 style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontSize: '1.2rem', color: 'var(--kids-purple)' }}>
                      {mission.title}
                    </h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--kids-text-light)' }}>
                      Έτοιμη για αποστολή!
                    </span>
                  </div>
                </div>

                {/* Show Form Data Summary */}
                {schema.map(field => (
                  <div key={field.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: 'var(--kids-text-light)', fontSize: '0.9rem', fontWeight: 600 }}>{field.label}:</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--kids-text)' }}>{formData[field.name] || '—'}</span>
                  </div>
                ))}

                {/* Show Notes */}
                {notes && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--kids-purple)' }}>📝 Σημειώσεις:</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--kids-text)' }}>{notes}</p>
                  </div>
                )}

                {/* Show Photo Preview if attached */}
                {photoPreview && (
                  <div style={{ marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--kids-purple)', display: 'block', marginBottom: '6px' }}>📸 Φωτογραφία:</span>
                    <img src={photoPreview} alt="Preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: '14px', border: '2px solid #E2E8F0' }} />
                  </div>
                )}
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                border: '2px solid #81C784',
                borderRadius: 'var(--kids-radius-md)',
                padding: '16px',
                textAlign: 'center',
                fontSize: '1.05rem',
                color: '#2E7D32',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span>⭐</span> Θα κερδίσεις <strong>+{mission.points} πόντους</strong> με αυτή την υποβολή!
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation Buttons */}
        <div className="kids-wizard-footer">
          <button
            type="button"
            className="kids-btn kids-btn-outline"
            onClick={() => step > 0 ? setStep(step - 1) : navigate('/kids')}
          >
            ← {step > 0 ? 'Πίσω' : 'Ακύρωση'}
          </button>

          {step < 2 ? (
            <button
              type="button"
              className="kids-btn kids-btn-primary"
              onClick={() => setStep(step + 1)}
            >
              Επόμενο →
            </button>
          ) : (
            <button
              type="button"
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

