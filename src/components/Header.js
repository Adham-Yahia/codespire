import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import ThemeToggle    from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { useAuth }     from '../context/AuthContext';
import { useTheme }    from '../context/ThemeContext';
import { t } from '../i18n/i18n';
import './Header.css';

const Header = ({ onNavClick }) => {
  const { language }   = useLanguage();
  const { isDarkMode } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavClick('home');
  };

  return (
    <Navbar
      bg={isDarkMode ? 'dark' : 'light'}
      variant={isDarkMode ? 'dark' : 'light'}
      expand="lg"
      className="mb-4 codespire-navbar"
    >
      <Container>
        <Navbar.Brand href="#" onClick={() => onNavClick('home')}>
          <strong>{t('header.logo', language)}</strong>
        </Navbar.Brand>

        {/* Hamburger Menu (Menu Toggle) */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className={`menu-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left nav links */}
          <Nav className="me-auto">
            <Nav.Link href="#" onClick={() => onNavClick('home')}>
              {t('header.home', language)}
            </Nav.Link>
            <Nav.Link href="#" onClick={() => onNavClick('ai')}>AI</Nav.Link>
            <Nav.Link href="#" onClick={() => onNavClick('dataScience')}>
              {t('fields.dataScience.name', language)}
            </Nav.Link>
            <Nav.Link href="#" onClick={() => onNavClick('community')}>
              {t('community.title', language)}
            </Nav.Link>
          </Nav>

          {/* Right controls */}
          <Nav className="ms-auto">
            <div className="d-flex align-items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />

              {isAuthenticated ? (
                /* ── Logged-in state ── */
                <>
                  {/* Clickable avatar chip → Profile page */}
                  <button
                    id="header-profile-btn"
                    className="nav-profile-btn"
                    onClick={() => onNavClick('profile')}
                  >
                    👤 {user?.name?.split(' ')[0]}
                  </button>
                  <button
                    id="header-logout-btn"
                    className={`nav-ghost-btn nav-ghost-btn--danger ${isDarkMode ? 'dark' : 'light'}`}
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                /* ── Guest state ── */
                <>
                  <button
                    id="header-login-btn"
                    className={`nav-ghost-btn ${isDarkMode ? 'dark' : 'light'}`}
                    onClick={() => onNavClick('login')}
                  >
                    Sign in
                  </button>
                  <button
                    id="header-register-btn"
                    className={`nav-primary-btn ${isDarkMode ? 'dark' : 'light'}`}
                    onClick={() => onNavClick('register')}
                  >
                    Get started
                  </button>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;