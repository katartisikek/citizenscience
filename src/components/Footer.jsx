import { Mail, Phone, MapPin, Leaf, Globe, Share2, ExternalLink } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const quickLinks = [
  { nameKey: 'nav.home', path: '/' },
  { nameKey: 'nav.projects', path: '/projects' },
  { nameKey: 'nav.participate', path: '/participate' },
  { nameKey: 'nav.data', path: '/open-data' },
  { nameKey: 'nav.news', path: '/news' },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', textDecoration: 'none' }}>
              <div className="icon-container" style={{
                width: 38, height: 38, borderRadius: 8, padding: 0,
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={20} />
              </div>
              <span style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: '1.1rem',
                color: 'white',
                lineHeight: 1.2,
              }}>
                Citizen Science<br />
                <span style={{ color: 'var(--primary-300)' }}>Crete</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280, marginBottom: '1.5rem' }}>
              {t('footer.desc')}
            </p>

            {/* Socials */}
            <div className="footer-socials">
              {[
                { icon: <Globe size={18} />, href: '#', label: 'Ιστότοπος' },
                { icon: <Share2 size={18} />, href: '#', label: 'Κοινωνικά Δίκτυα' },
                { icon: <ExternalLink size={18} />, href: '#', label: 'LinkedIn' },
              ].map(s => (
                <a key={s.label} href={s.href} className="footer-social-icon" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 style={{ color: 'var(--white)', marginBottom: '1.5rem', fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', fontWeight: 400 }}>
              {t('footer.quick_links')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {quickLinks.map(link => (
                <NavLink key={link.path} to={link.path} className="footer-link" end={link.path === '/'}>
                  {t(link.nameKey)}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3>{t('footer.contact')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: <Mail size={16} />, text: 'info@citizensciencecrete.gr', href: 'mailto:info@citizensciencecrete.gr' },
                { icon: <Phone size={16} />, text: '+30 2810 123456', href: 'tel:+302810123456' },
                { icon: <MapPin size={16} />, text: t('footer.address'), href: null },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--primary-300)', marginTop: '0.15rem', flexShrink: 0 }}>{c.icon}</span>
                  {c.href
                    ? <a href={c.href} style={{ color: 'rgba(255,255,255,0.7)' }}>{c.text}</a>
                    : <span style={{ color: 'rgba(255,255,255,0.7)' }}>{c.text}</span>
                  }
                </div>
              ))}
            </div>

            {/* Newsletter inline */}
            <div style={{ marginTop: '1.75rem' }}>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
                {t('footer.newsletter')}
              </p>
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder={t('footer.email_placeholder')}
                  required
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 0.875rem',
                    color: 'white', fontSize: '0.875rem',
                    outline: 'none', fontFamily: 'inherit',
                    minWidth: 0,
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-400)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.875rem', flexShrink: 0 }}>
                  OK
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="footer-bottom">
          <span>{t('footer.rights')}</span>
          <span style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('footer.privacy', 'Πολιτική Απορρήτου')}</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('footer.terms', 'Όροι Χρήσης')}</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
