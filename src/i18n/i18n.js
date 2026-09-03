import en from './en.json';
import ar from './ar.json';

const translations = {
  en,
  ar
};

export const t = (key, language = 'en') => {
  const keys = key.split('.');
  let value = translations[language];

  for (let i = 0; i < keys.length; i++) {
    if (value && typeof value === 'object') {
      value = value[keys[i]];
    } else {
      return key; // Return key if translation not found
    }
  }

  return value || key;
};

export const getLanguage = () => {
  return localStorage.getItem('appLanguage') || 'en';
};

export const setLanguage = (language) => {
  localStorage.setItem('appLanguage', language);
};

export default translations;
