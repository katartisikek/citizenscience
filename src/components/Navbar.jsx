import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Globe, Leaf, User } from 'lucide-react';
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

  // Prevent body scroll when mobile menu is open
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
          {/* Logo */}
          <NavLink to="/" className="nav-logo" onClick={() => setIsMobileOpen(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={24} color="white" />
              </div>
              <span style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '1.05rem',
                color: 'var(--color-text-dark)',
                lineHeight: 1.15,
                display: 'none',
              }} className="nav-logo-text">
                Citizen Science<br /><span style={{ color: 'var(--primary-700)' }}>Crete</span>
              </span>
            </div>
          </NavLink>

          {/* Desktop links */}
          <div className="nav-links">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
            
            <NavLink to={user ? '/profile' : '/login'} className="btn btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', fontWeight: 600 }}>
              <User size={18} />
              {user ? t('nav.profile', 'Προφίλ') : t('nav.login', 'Είσοδος')}
            </NavLink>
            <button 
              onClick={toggleLanguage} 
              className="btn btn-ghost" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', fontWeight: 600 }}
              aria-label="Toggle language"
            >
              <Globe size={18} />
              {i18n.language.startsWith('el') ? 'EN' : 'EL'}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {isMobileOpen && (
        <div className="nav-links mobile-open">
          <button className="mobile-close-btn" onClick={() => setIsMobileOpen(false)}>
            <X size={22} />
          </button>
          {navLinks.map(link => (
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
          <button 
            onClick={() => { toggleLanguage(); setIsMobileOpen(false); }} 
            className="btn btn-outline" 
            style={{ 
              marginTop: '1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '1.1rem',
              padding: '0.75rem 1.5rem',
              alignSelf: 'flex-start',
            }}
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
