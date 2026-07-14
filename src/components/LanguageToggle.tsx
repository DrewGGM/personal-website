import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Fixed EN/ES toggle (top-right). Shows the language it will switch TO, so the
 * label always reads as the action the user can take.
 */
export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  const next = lang === 'en' ? 'ES' : 'EN';

  return (
    <motion.button
      type="button"
      className="lang-toggle"
      onClick={toggleLang}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
      title={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
    >
      <Languages size={16} aria-hidden="true" />
      <span className="lang-toggle-text">{next}</span>
    </motion.button>
  );
}
