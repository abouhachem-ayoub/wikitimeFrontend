type LanguageTranslations = Record<string, string>;

/**
 * Fetches language translations from a Google Apps Script deployment
 * @param language - The language code to fetch translations for
 * @returns Promise containing an object with translations or an empty object on error
 */
const fetchLanguage = async (language: string): Promise<LanguageTranslations> => {
  const deploymentID =
    'AKfycbyEDhrb1KmtRzgk6eRNxV0RBBafhn7S9_iU1XS_d0C2xfULWQaSIx3BT-SsIHaW9rpG';

  try {
    const response = await fetch(
      'https://script.google.com/macros/s/' +
        deploymentID +
        '/exec?lang=' +
        language,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${language} language file`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      'language: ' + language + ' - Error fetching language:',
      error,
    );
    return {}; // Return an empty object on error
  }
};

export default fetchLanguage; 
