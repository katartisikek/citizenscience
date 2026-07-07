import { useEffect, useRef } from 'react';
import { Users, Target, Globe, BookOpen, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

/* Scroll-reveal hook */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const RevealSection = ({ children, style }) => {
  const ref = useReveal();
  return <div ref={ref} className="reveal" style={style}>{children}</div>;
};

const principles = [
  "Ενεργή Συμμετοχή — Οι πολίτες έχουν ουσιαστικό ρόλο.",
  "Γνήσιο Επιστημονικό Αποτέλεσμα — Τα projects απαντούν σε πραγματικά ερωτήματα.",
  "Αμοιβαίο Όφελος — Επιστήμονες και πολίτες κερδίζουν γνώση και αξία.",
  "Συμμετοχή σε Πολλαπλά Στάδια — Από τον σχεδιασμό έως την ανάλυση.",
  "Ανατροφοδότηση — Οι συμμετέχοντες λαμβάνουν τα αποτελέσματα.",
  "Αναγνώριση Περιορισμών — Ξεκάθαρα όρια και διαχείριση σφαλμάτων.",
  "Ανοικτά Δεδομένα — Πρόσβαση σε όλους στα αποτελέσματα.",
  "Αναγνώριση Συμμετεχόντων — Απόδοση credit στους πολίτες.",
  "Αξιολόγηση — Συνεχής βελτίωση της εμπειρίας και της ποιότητας.",
  "Ηθική & Νομιμότητα — Σεβασμός στα προσωπικά δεδομένα.",
];

const features = [
  {
    icon: <Users size={26} />,
    variant: '',
    title: 'Ποιοι Είμαστε',
    text: 'Μια ανοιχτή κοινότητα επιστημόνων, πολιτών και φορέων που συνεργάζονται για να κατανοήσουν και να προστατεύσουν το περιβάλλον της Κρήτης.',
  },
  {
    icon: <Target size={26} />,
    variant: 'earth',
    title: 'Αποστολή & Όραμα',
    text: 'Να κάνουμε την επιστήμη προσβάσιμη σε όλους, χτίζοντας εμπιστοσύνη και δημιουργώντας λύσεις για την τοπική ανθεκτικότητα και τη δημόσια υγεία.',
  },
  {
    icon: <Globe size={26} />,
    variant: 'blue',
    title: 'Τι είναι το Citizen Science',
    text: 'Η ενεργή συμμετοχή του κοινού στην επιστημονική έρευνα. Δεν αντικαθιστά τους επιστήμονες, αλλά δημιουργεί ένα ισχυρό συνεργατικό πλαίσιο.',
  },
];

const stats = [
  { number: '12+', label: 'Ενεργά Projects' },
  { number: '800+', label: 'Συμμετέχοντες Πολίτες' },
  { number: '5', label: 'Ερευνητικοί Φορείς' },
  { number: '3', label: 'Περιοχές Κρήτης' },
];

const Home = () => {
  const { settings } = useData();
  const { t, i18n } = useTranslation();

  const tData = (obj, key) => i18n.language.startsWith('en') && obj[`${key}_en`] ? obj[`${key}_en`] : obj[key];

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="hero animate-fade-in">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="overline">{t('home.hero_overline', 'Η επιστήμη ανήκει σε όλους')}</span>
          <h1 style={{ marginBottom: '1.25rem' }}>
            {tData(settings, 'heroTitle')}
          </h1>
          <p className="text-lead animate-fade-in delay-100" style={{ margin: '0 auto 2.5rem' }}>
            {tData(settings, 'heroSubtitle')}
          </p>
          <div className="animate-fade-in delay-200" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/participate" className="btn btn-primary">
              {t('home.btn_participate')} <ChevronRight size={18} />
            </Link>
            <Link to="/projects" className="btn btn-outline">
              {t('home.btn_projects', 'Δες τα Projects')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────── */}
      <RevealSection>
        <div className="container section-sm">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
            padding: '2.5rem 3rem',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div className="stat-number">{s.number}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── INFO CARDS ─────────────────────────────────── */}
      <RevealSection>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header">
              <span className="overline">{t('home.platform_overline', 'Η πλατφόρμα')}</span>
              <h2>{t('home.platform_title', 'Επιστήμη, ανοιχτή σε όλους')}</h2>
            </div>
            <div className="bento-grid">
              {features.map((f, i) => (
                <div key={i} className="bento-card" style={{ padding: '2rem' }}>
                  <div className={`icon-box ${f.variant}`} style={{ marginBottom: '1.25rem' }}>
                    {f.icon}
                  </div>
                  <h3 style={{ marginBottom: '0.75rem' }}>{t(`home.feature_${i}_title`, f.title)}</h3>
                  <p style={{ color: 'var(--color-text)', margin: 0 }}>{t(`home.feature_${i}_text`, f.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── 10 PRINCIPLES ──────────────────────────────── */}
      <RevealSection>
        <section className="section" style={{ background: 'var(--cream-dark)', paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-24)' }}>
          <div className="container">
            <div className="section-header centered">
              <span className="overline">{t('home.principles_overline', 'ECSA Framework')}</span>
              <h2>{t('home.principles_title', 'Οι 10 Αρχές του Citizen Science')}</h2>
              <p className="text-lead" style={{ color: 'var(--color-text)', margin: '1rem auto 0' }}>
                {t('home.principles_desc', 'Βασικές αρχές που διέπουν κάθε project της πλατφόρμας μας')}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}>
              {principles.map((principle, index) => {
                const [title, rest] = principle.split(' — ');
                return (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '1rem',
                    background: 'var(--white)',
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: '1.6rem',
                      color: 'var(--primary-300)',
                      lineHeight: 1,
                      flexShrink: 0,
                      marginTop: '0.1rem',
                      minWidth: '2rem',
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--color-text-dark)', margin: 0, fontSize: '0.95rem' }}>{title}</p>
                      {rest && <p style={{ color: 'var(--color-text)', margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{rest}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── CTA BANNER ─────────────────────────────────── */}
      <RevealSection>
        <section className="section-sm">
          <div className="container">
            <div style={{
              background: 'var(--primary-700)',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
            }}>
              <div>
                <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>{t('home.cta_title', 'Έτοιμος να συμμετέχεις;')}</h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                  {t('home.cta_desc', 'Ξεκίνα το ταξίδι σου στην επιστήμη των πολιτών σήμερα.')}
                </p>
              </div>
              <Link to="/participate" className="btn" style={{
                background: 'white',
                color: 'var(--primary-700)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {t('home.cta_btn', 'Ξεκίνα τώρα')} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── PARTNERS ───────────────────────────────────── */}
      <RevealSection>
        <section className="section text-center">
          <div className="container">
            <span className="overline">{t('home.partners_overline', 'Δίκτυο')}</span>
            <h2 className="mb-4">{t('home.partners_title', 'Οι Συνεργάτες μας')}</h2>
            <p className="text-lead" style={{ margin: '0 auto var(--space-12)' }}>
              {t('home.partners_desc', 'Υποστηρίζεται από κορυφαίους ερευνητικούς οργανισμούς και φορείς της Κρήτης.')}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
            }}>
              {['ΙΤΕ', 'ΤΕΙ Κρήτης', 'Δήμος Ηρακλείου', 'ΕΛΚΕΘΕ'].map(name => (
                <div key={name} style={{
                  padding: '1.25rem 2rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.05rem',
                  color: 'var(--color-text-dark)',
                  transition: 'all var(--t-base)',
                  cursor: 'default',
                  boxShadow: 'var(--shadow-xs)',
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
};

export default Home;
