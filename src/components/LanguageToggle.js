import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();

  const handleToggle = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
  };

  return (
    <button
      className="language-toggle"
      onClick={handleToggle}
      aria-label={`Switch language to ${language === 'en' ? 'Arabic' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'العربية' : 'English'}`}
    >
      <span className="language-icon">🌐</span>
      <span className="language-text">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;
