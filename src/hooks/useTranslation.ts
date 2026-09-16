import { useApp } from '../context/AppContext';
import { TRANSLATIONS, Translations, SupportedLanguage } from '../i18n/translations';

export function useTranslation() {
  const { language, setLanguage } = useApp();
  const currentLang = (language as SupportedLanguage) || 'en';
  const currentDict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
  const fallbackDict = TRANSLATIONS['en'];

  const t = (key: keyof Translations, defaultText?: string): string => {
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return defaultText || (key as string);
  };

  return {
    t,
    language: currentLang,
    setLanguage,
    dict: currentDict,
  };
}
