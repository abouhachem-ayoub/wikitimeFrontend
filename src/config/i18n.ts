import fetchLanguage from 'utils/fetchLanguage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n with empty translations first
i18n.use(initReactI18next).init({
  resources: { en: { translation: {} } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Function to initialize i18n with a specific language
export const initI18n = async (language: string): Promise<void> => {
  try {
    const translations = await fetchLanguage(language);
    
    // Update resources with fetched translations
    i18n.addResourceBundle(language, 'translation', translations, true, true);
    
    // Change language if different from current
    if (i18n.language !== language) {
      await i18n.changeLanguage(language);
    }
  } catch (error) {
    console.error(`Failed to initialize language ${language}:`, error);
    // Keep using fallback language (en) if initialization fails
  }
};

// Function to change the language dynamically
export const changeLanguage = async (language: string): Promise<void> => {
  try {
    const translations = await fetchLanguage(language);
    i18n.addResourceBundle(language, 'translation', translations, true, true);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error(`Failed to change language to ${language}:`, error);
    // Keep using current language if change fails
  }
};

export default i18n; 
