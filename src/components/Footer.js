import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/i18n';
import './Footer.css';

const Footer = ({ onNavClick }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();

  const handleLinkClick = (e, page) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(page);
    }
  };

  return (
    <footer className={`footer ${isDarkMode ? 'dark' : 'light'}`}>
      <Container>
        <Row className="footer-content">
          {/* Brand Section */}
          <Col xs={12} md={4} className="footer-section brand-section">
            <h5 className="footer-title">{t('footer.brand', language)}</h5>
            <p className="footer-description">
              {t('hero.description', language)}
            </p>
          </Col>

          {/* Quick Links */}
          <Col xs={12} md={4} className="footer-section links-section">
            <h5 className="footer-title">{t('footer.quickLinks', language)}</h5>
            <ul className="footer-links">
              <li><a href="#ai" onClick={(e) => handleLinkClick(e, 'ai')} className="footer-link">{t('hero.exploreAI', language)}</a></li>
              <li><a href="#dataScience" onClick={(e) => handleLinkClick(e, 'dataScience')} className="footer-link">{t('fields.dataScience.name', language)}</a></li>
              <li><a href="#community" onClick={(e) => handleLinkClick(e, 'community')} className="footer-link">{t('community.title', language)}</a></li>
              <li><a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="footer-link">{t('header.home', language)}</a></li>
            </ul>
          </Col>

          {/* Support Section */}
          <Col xs={12} md={4} className="footer-section support-section">
            <h5 className="footer-title">{t('footer.customerSupport', language)}</h5>
            <div className="support-options">
              <a 
                href="https://www.facebook.com/codespire" 
                target="_blank" 
                rel="noopener noreferrer"
                className="support-link facebook-link"
                title={`${t('footer.support', language)} - ${t('footer.facebook', language)}`}
                aria-label={`CodeSpire ${t('footer.facebook', language)}`}
              >
                <span className="support-icon">f</span>
                <span className="support-text">{t('footer.facebook', language)}</span>
              </a>
              <div className="support-divider"></div>
              <a 
                href="mailto:support@codespire.com" 
                className="support-link email-link"
                title={`${t('footer.support', language)} - ${t('footer.email', language)}`}
                aria-label={`${t('footer.support', language)} ${t('footer.email', language)}`}
              >
                <span className="support-icon">✉</span>
                <span className="support-text">{t('footer.email', language)}</span>
              </a>
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="footer-bottom">
          <Col className="text-center">
            <p className="footer-copyright mb-0">
              {t('footer.copyright', language)}
            </p>
            <p className="footer-tagline mb-0">
              {t('footer.tagline', language)}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;