import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
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
            <img 
              src="/logoCitizen3.png" 
              alt="Citizen Science Crete Logo" 
              style={{ 
                height: 150, 
                width: 'auto', 
                objectFit: 'contain'
              }} 
            />
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
        </div>
      )}
    </>
  );
};

export default Navbar;
