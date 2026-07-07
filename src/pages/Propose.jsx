import { useState } from 'react';
import { Send, CheckCircle, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Propose = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h1 style={{ color: 'var(--color-primary)' }}>{t('propose.title', 'Προτείνετε Νέο Project')}</h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
              {t('propose.desc', 'Έχετε μια ιδέα για ένα νέο έργο Citizen Science; Μοιραστείτε την μαζί μας και εμείς θα σας βοηθήσουμε να τη σχεδιάσετε και να την υλοποιήσετε.')}
            </p>
          </div>

          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>{t('propose.success_title', 'Η Πρότασή σας Υποβλήθηκε!')}</h2>
                <p style={{ color: 'var(--color-text-light)' }}>
                  {t('propose.success_desc', 'Ευχαριστούμε για την ιδέα σας. Η επιστημονική μας ομάδα θα τη μελετήσει και θα επικοινωνήσει μαζί σας το συντομότερο δυνατό.')}
                </p>
                <button className="btn btn-primary mt-4" onClick={() => setSubmitted(false)}>
                  {t('propose.btn_new', 'Υποβολή Νέας Πρότασης')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('propose.f_name', 'Όνομα / Οργανισμός *')}</label>
                    <input type="text" className="form-control" required placeholder={t('propose.f_name_ph', 'π.χ. Δήμος Φαιστού ή Γιάννης Παπαδόπουλος')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('propose.f_email', 'Email *')}</label>
                    <input type="email" className="form-control" required placeholder={t('propose.f_email_ph', 'Το email σας')} />
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">{t('propose.f_title', 'Τίτλος Ιδέας / Project *')}</label>
                  <input type="text" className="form-control" required placeholder={t('propose.f_title_ph', 'Δώστε έναν σύντομο τίτλο')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }} className="mt-2">
                  <div className="form-group">
                    <label className="form-label">{t('propose.f_category', 'Θεματική Κατηγορία')}</label>
                    <select className="form-control">
                      <option>{t('propose.cat_bio', 'Βιοποικιλότητα')}</option>
                      <option>{t('propose.cat_health', 'Δημόσια Υγεία')}</option>
                      <option>{t('propose.cat_water', 'Ποιότητα Νερού')}</option>
                      <option>{t('propose.cat_air', 'Ποιότητα Αέρα')}</option>
                      <option>{t('propose.cat_climate', 'Κλιματική Αλλαγή')}</option>
                      <option>{t('propose.cat_other', 'Άλλο')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('propose.f_area', 'Περιοχή Εφαρμογής')}</label>
                    <input type="text" className="form-control" placeholder={t('propose.f_area_ph', 'π.χ. Ηράκλειο, Χανιά, όλη η Κρήτη')} />
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">{t('propose.f_desc', 'Περιγραφή *')}</label>
                  <textarea 
                    className="form-control" 
                    required 
                    placeholder={t('propose.f_desc_ph', 'Περιγράψτε την ιδέα σας, το πρόβλημα που επιλύει, και πώς μπορούν να συμμετέχουν οι πολίτες.')}
                    style={{ minHeight: '150px' }}
                  ></textarea>
                </div>

                <div className="form-group mt-3">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={18} /> {t('propose.f_file', 'Επισύναψη Αρχείου (προαιρετικά)')}
                  </label>
                  <input type="file" className="form-control" style={{ border: '1px dashed var(--color-border)', padding: '1rem' }} />
                  <small style={{ color: 'var(--color-text-light)', display: 'block', marginTop: '0.5rem' }}>
                    {t('propose.f_file_hint', 'Επιτρεπτά αρχεία: PDF, DOCX, JPG (Μέγιστο μέγεθος: 5MB)')}
                  </small>
                </div>

                <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    <Send size={18} /> {t('propose.btn_submit', 'Υποβολή Πρότασης')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Propose;
