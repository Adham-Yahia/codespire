import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/i18n';
import SearchBar from './SearchBar';
import './Hero.css';

const Hero = ({ onFieldSelect, fields }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [filteredResults, setFilteredResults] = useState([]);
  const [showFilteredView, setShowFilteredView] = useState(false);

  const handleFilteredResults = (results) => {
    setFilteredResults(results);
    setShowFilteredView(results.length > 0);
  };

  const handleResultSelect = (result) => {
    if (result.type === 'field') {
      onFieldSelect(result.fieldId || result.id);
    } else if (result.type === 'career') {
      onFieldSelect(result.fieldId);
    }
  };

  return (
    <div className={`hero-section ${isDarkMode ? 'dark' : 'light'}`}>
      <Container className="py-5">
        <Row>
          <Col>
            <h1 className="display-4 fw-bold mb-4 hero-title">{t('hero.title', language)}</h1>
            <p className="lead mb-5 hero-description">
              {t('hero.description', language)}
            </p>

            {/* Search Bar Integration */}
            <div className="hero-search-section mb-4">
              <SearchBar 
                fields={fields} 
                onFilteredResults={handleFilteredResults}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Filtered Results View */}
            {showFilteredView && filteredResults.length > 0 && (
              <div className="filtered-results-container mb-4">
                <div className="filtered-results-header">
                  <h3>{t('hero.searchResults', language)} ({filteredResults.length})</h3>
                  <button 
                    className="close-results-btn"
                    onClick={() => setShowFilteredView(false)}
                    aria-label="Close search results"
                  >
                    ✕
                  </button>
                </div>
                <div className="filtered-results-grid">
                  {filteredResults.map((result, index) => (
                    <div 
                      key={index} 
                      className="result-card"
                      onClick={() => handleResultSelect(result)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="result-icon">
                        {result.type === 'field' ? '📚' : '💼'}
                      </div>
                      <div className="result-content">
                        <h4 className="result-title">{result.displayName}</h4>
                        <p className="result-description">{result.displayDescription}</p>
                      </div>
                      <div className="result-badge">
                        {result.type === 'field' ? t('searchBar.field', language) : t('searchBar.career', language)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Default Action Buttons */}
            {!showFilteredView && (
              <div className="d-flex justify-content-center gap-3 hero-buttons">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => onFieldSelect('ai')}
                  className="hero-btn"
                >
                  {t('hero.exploreAI', language)}
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  onClick={() => onFieldSelect('dataScience')}
                  className="hero-btn"
                >
                  {t('hero.exploreDataScience', language)}
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;