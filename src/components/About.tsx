import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import Highlights from './Highlights';
import { useLanguage } from '../i18n/LanguageContext';
import type { CVData } from '../types';

interface AboutProps {
  data: CVData;
}

export default function About({ data }: AboutProps) {
  const { t } = useLanguage();
  return (
    <section id="about" className="section">
      <SectionTitle index={1}>{t.sections.about}</SectionTitle>
      <div className="about-content">
        <ScrollReveal delay={0.1}>
          <div className="about-photo-wrapper">
            <img src="/profile.jpg" alt={data.name} className="about-photo" />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="about-text">
            <p>{data.summary}</p>
            <div className="about-languages">
              {data.languages.map((lang) => (
                <span key={lang.label} className="language-badge">
                  {lang.label} — {lang.details}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <p className="highlights-eyebrow">{t.about.workingOn}</p>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <Highlights />
      </ScrollReveal>
    </section>
  );
}
