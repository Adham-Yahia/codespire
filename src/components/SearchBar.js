import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/i18n';
import './SearchBar.css';

const SearchBar = ({ fields, onFilteredResults }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFields, setFilteredFields] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Flatten field data to include all searchable content
  const getAllSearchableFields = () => {
    const searchableData = [];
    fields.forEach(field => {
      searchableData.push({
        id: field.id,
        name: field.name,
        description: field.description,
        type: 'field',
        displayName: field.name,
        displayDescription: field.description.substring(0, 100) + '...'
      });

      // Add career opportunities
      if (field.careerOpportunities) {
        field.careerOpportunities.forEach(career => {
          searchableData.push({
            id: `${field.id}-${career.title}`,
            name: career.title,
            description: career.description,
            type: 'career',
            fieldId: field.id,
            fieldName: field.name,
            displayName: `${career.title} (${field.name})`,
            displayDescription: career.description
          });
        });
      }
    });
    return searchableData;
  };

  const searchableFields = getAllSearchableFields();

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredFields([]);
      setShowSuggestions(false);
      onFilteredResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = searchableFields.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );

    setFilteredFields(results.slice(0, 8)); // Limit to 8 suggestions
    setShowSuggestions(true);
    onFilteredResults(results);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.displayName);
    setShowSuggestions(false);
    onFilteredResults([suggestion]);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilteredFields([]);
    setShowSuggestions(false);
    onFilteredResults([]);
  };

  return (
    <div className={`search-bar-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="search-bar-wrapper">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className={`search-input ${isDarkMode ? 'dark' : 'light'}`}
            placeholder={t('searchBar.placeholder', language)}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery && setShowSuggestions(true)}
          />
          {searchQuery && (
            <button 
              className="clear-button"
              onClick={handleClear}
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && filteredFields.length > 0 && (
          <div className={`search-suggestions ${isDarkMode ? 'dark' : 'light'}`}>
            {filteredFields.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                role="button"
                tabIndex={0}
              >
                <div className="suggestion-icon">
                  {suggestion.type === 'field' ? '📚' : '💼'}
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-name">{suggestion.displayName}</div>
                  <div className="suggestion-description">{suggestion.displayDescription}</div>
                </div>
                <div className="suggestion-type">
                  {suggestion.type === 'field' ? t('searchBar.field', language) : t('searchBar.career', language)}
                </div>
              </div>
            ))}
            {filteredFields.length === 0 && searchQuery && (
              <div className="no-results">
                <span className="no-results-icon">🔎</span>
                <span className="no-results-text">{t('hero.noResults', language)} "{searchQuery}"</span>
              </div>
            )}
          </div>
        )}

        {/* No Results Message */}
        {showSuggestions && searchQuery && filteredFields.length === 0 && (
          <div className={`search-suggestions ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="no-results">
              <span className="no-results-icon">🔎</span>
              <span className="no-results-text">{t('hero.noResults', language)} "{searchQuery}"</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className={`search-tips ${isDarkMode ? 'dark' : 'light'}`}>
        <span className="tips-label">💡 {t('common.loading', language).split('...')[0]}:</span>
        <span className="tips-text">{t('searchBar.tips', language)}</span>
      </div>
    </div>
  );
};

export default SearchBar;
