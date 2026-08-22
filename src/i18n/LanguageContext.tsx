import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CVData } from '../types';
import { cvData } from '../data/cvData';
import { cvDataES } from '../data/cvData.es';
import { translations, type Language, type Translation } from './translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  /** Current language's UI dictionary. */
  t: Translation;
  /** CV data for the current language. */
  cv: CVData;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'site-lang';

/** Resolves the initial language: saved choice → browser preference → English. */
function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'es') return saved;
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);

  // Keep <html lang>, the document metadata and the stored preference in sync.
  // Title and description also live in index.html for the crawlers and social
  // scrapers that read the served HTML; these overwrite them so what a visitor
  // bookmarks or shares matches the language they are actually reading.
  useEffect(() => {
    const meta = translations[lang].meta;
    document.documentElement.lang = lang;
    document.title = meta.title;

    const setMeta = (selector: string, content: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = content;
    };
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:locale"]', lang === 'es' ? 'es_CO' : 'en_US');
    setMeta('meta[property="og:locale:alternate"]', lang === 'es' ? 'en_US' : 'es_CO');
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);

    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Language) => setLangState(next), []);
  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === 'en' ? 'es' : 'en')),
    [],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: translations[lang],
      cv: lang === 'es' ? cvDataES : cvData,
    }),
    [lang, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
