import { Building2, Handshake, Lightbulb, PieChart, Send } from 'lucide-react';



import { useTranslation } from 'react-i18next';

const Entities = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Building2 size={26} />,
      variant: '',
      title: t('entities.feat_1_title', 'Συνεργασίες με Οργανισμούς'),
      text: t('entities.feat_1_text', 'Ερευνητικά κέντρα και πανεπιστήμια μπορούν να αξιοποιήσουν το δίκτυό μας για τη συλλογή μεγάλης κλίμακας δεδομένων με άμεση συμμετοχή της κοινωνίας.'),
    },
    {
      icon: <Handshake size={26} />,
      variant: 'earth',
      title: t('entities.feat_2_title', 'Φορείς Χάραξης Πολιτικής'),
      text: t('entities.feat_2_text', 'Δήμοι και περιφέρειες μπορούν να βασίσουν τις αποφάσεις τους σε αξιόπιστα τοπικά δεδομένα (evidence-based policy).'),
    },
    {
      icon: <Lightbulb size={26} />,
      variant: 'blue',
      title: t('entities.feat_3_title', 'Σχεδιασμός Δράσεων'),
      text: t('entities.feat_3_text', 'Υποστηρίζουμε τον από κοινού σχεδιασμό (co-creation) περιβαλλοντικών δράσεων ανάλογα με τις τοπικές ανάγκες.'),
    },
    {
      icon: <PieChart size={26} />,
      variant: '',
      title: t('entities.feat_4_title', 'Παρεχόμενη Υποστήριξη'),
      text: t('entities.feat_4_text', 'Παρέχουμε την τεχνογνωσία, τα ψηφιακά εργαλεία και τη μεθοδολογία για την υλοποίηση αξιόπιστων project.'),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="section-sm">
        <div className="container">
          <span className="overline">{t('entities.overline', 'Συνεργασίες')}</span>
          <h1 style={{ marginBottom: '1rem' }}>{t('entities.title', 'Για Φορείς & Δήμους')}</h1>
          <p className="text-lead">
            {t('entities.desc', 'Συνεργαστείτε μαζί μας για να ενισχύσουμε την περιβαλλοντική ανθεκτικότητα, βασισμένοι σε δεδομένα που συλλέγονται από τους ίδιους τους πολίτες.')}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="bento-grid" style={{ marginBottom: '3rem' }}>
            {features.map((f, i) => (
              <div key={i} className="bento-card" style={{ padding: '2rem' }}>
                <div className={`icon-box ${f.variant}`} style={{ marginBottom: '1.25rem' }}>
                  {f.icon}
                </div>
                <h3 style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '0.95rem' }}>{f.text}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div style={{
            maxWidth: 780,
            margin: '0 auto',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <span className="overline">{t('entities.contact_overline', 'Επικοινωνία')}</span>
              <h2 style={{ fontSize: '1.8rem' }}>{t('entities.form_title', 'Φόρμα Εκδήλωσης Ενδιαφέροντος')}</h2>
              <p style={{ color: 'var(--color-text)', marginTop: '0.5rem' }}>
                {t('entities.form_desc', 'Εκπροσωπείτε κάποιο Δήμο, Σχολείο ή Οργανισμό; Συμπληρώστε τη φόρμα για να επικοινωνήσουμε μαζί σας.')}
              </p>
            </div>

            <form onSubmit={e => e.preventDefault()}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('entities.f_org', 'Όνομα Φορέα / Οργανισμού *')}</label>
                  <input type="text" className="form-control" placeholder={t('entities.f_org_ph', 'π.χ. Δήμος Ηρακλείου')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('entities.f_name', 'Ονοματεπώνυμο Υπευθύνου *')}</label>
                  <input type="text" className="form-control" placeholder={t('entities.f_name_ph', 'Ονοματεπώνυμο')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('entities.f_email', 'Email Επικοινωνίας *')}</label>
                  <input type="email" className="form-control" placeholder="email@example.gr" required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('entities.f_phone', 'Τηλέφωνο')}</label>
                  <input type="tel" className="form-control" placeholder="+30 ..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('entities.f_desc', 'Σύντομη περιγραφή ενδιαφέροντος *')}</label>
                <textarea className="form-control" placeholder={t('entities.f_desc_ph', 'Περιγράψτε το ενδιαφέρον ή την προτεινόμενη συνεργασία...')} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Send size={16} /> {t('entities.f_submit', 'Αποστολή')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Entities;
