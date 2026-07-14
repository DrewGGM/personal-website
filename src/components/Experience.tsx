import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import InteractiveCard from './InteractiveCard';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDate } from '../i18n/translations';
import type { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  experiences: ExperienceType[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const { t } = useLanguage();
  return (
    <section id="experience" className="section">
      <SectionTitle index={2}>{t.sections.experience}</SectionTitle>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <ScrollReveal key={`${exp.company}-${exp.startDate}`} delay={index * 0.1}>
            <InteractiveCard className="timeline-item">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-title">{exp.position}</h3>
                  <p className="timeline-subtitle">{exp.company}</p>
                </div>
                <div className="timeline-meta">
                  <span className="timeline-date">
                    {formatDate(exp.startDate, t)} — {formatDate(exp.endDate, t)}
                  </span>
                  <p className="timeline-location">{exp.location}</p>
                </div>
              </div>
              <p className="timeline-summary">{exp.summary}</p>
              {exp.highlights.length > 0 && (
                <ul className="timeline-highlights">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              )}
            </InteractiveCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
