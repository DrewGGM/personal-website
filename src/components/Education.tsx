import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import InteractiveCard from './InteractiveCard';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDate } from '../i18n/translations';
import type { Education as EducationType } from '../types';

interface EducationProps {
  education: EducationType[];
}

export default function Education({ education }: EducationProps) {
  const { t } = useLanguage();
  return (
    <section id="education" className="section">
      <SectionTitle index={3}>{t.sections.education}</SectionTitle>
      <div className="timeline">
        {education.map((edu, index) => (
          <ScrollReveal key={`${edu.institution}-${edu.startDate}`} delay={index * 0.1}>
            <InteractiveCard className="timeline-item">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-title">{edu.degree} — {edu.area}</h3>
                  <p className="timeline-subtitle">{edu.institution}</p>
                </div>
                <div className="timeline-meta">
                  <span className="timeline-date">
                    {formatDate(edu.startDate, t)} — {formatDate(edu.endDate, t)}
                  </span>
                  <p className="timeline-location">{edu.location}</p>
                </div>
              </div>
              {edu.summary && <p className="timeline-summary">{edu.summary}</p>}
            </InteractiveCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
