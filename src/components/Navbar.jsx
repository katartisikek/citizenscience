import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Globe, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.participate'), path: '/participate' },
    { name: t('nav.entities'), path: '/entities' },
    { name: t('nav.data'), path: '/open-data' },
    { name: t('nav.propose'), path: '/propose' },
    { name: t('nav.news'), path: '/news' },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('el') ? 'en' : 'el';
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <NavLink to="/" className="nav-logo" onClick={() => setIsMobileOpen(false)}>
            <img
              src="/logoCitizen3.png"
              alt="Citizen Science Crete"
              className="nav-logo-img"
            />
          </NavLink>

          <div className="nav-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            <NavLink
              to={user ? '/profile' : '/login'}
              className="nav-action"
              title={user ? t('nav.profile', 'Προφίλ') : t('nav.login', 'Είσοδος')}
            >
              <User size={20} />
              <span>{t('nav.account', 'Λογαριασμός')}</span>
            </NavLink>
            <button
              type="button"
              onClick={toggleLanguage}
              className="nav-action"
              aria-label="Toggle language"
            >
              <Globe size={20} />
              <span>{i18n.language.startsWith('el') ? 'EN' : 'EL'}</span>
            </button>
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileOpen && (
        <div className="nav-links mobile-open">
          <button type="button" className="mobile-close-btn" onClick={() => setIsMobileOpen(false)}>
            <X size={22} />
          </button>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to={user ? '/profile' : '/login'}
            className="nav-link"
            onClick={() => setIsMobileOpen(false)}
          >
            {t('nav.account', 'Λογαριασμός')}
          </NavLink>
          <button
            type="button"
            onClick={() => { toggleLanguage(); setIsMobileOpen(false); }}
            className="btn btn-outline nav-mobile-lang"
            aria-label="Toggle language"
          >
            <Globe size={20} />
            {i18n.language.startsWith('el') ? 'English' : 'Ελληνικά'}
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
