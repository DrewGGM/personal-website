import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Andrew Garcia Mosquera. {t.footer.rights}
      </p>
    </footer>
  );
}
