import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/i18n';

const Header = ({ onNavClick }) => {
  const { language } = useLanguage();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#" onClick={() => onNavClick('home')}>
          <strong>{t('header.logo', language)}</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" onClick={() => onNavClick('home')}>{t('header.home', language)}</Nav.Link>
            <Nav.Link href="#" onClick={() => onNavClick('ai')}>AI</Nav.Link>
            <Nav.Link href="#" onClick={() => onNavClick('dataScience')}>{t('fields.dataScience.name', language)}</Nav.Link>
            <Nav.Link href="#" onClick={() => onNavClick('community')}>{t('community.title', language)}</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <div className="d-flex align-items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;