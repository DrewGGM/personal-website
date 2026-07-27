import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import InteractiveCard from './InteractiveCard';
import { useLanguage } from '../i18n/LanguageContext';
import { formatRange, groupExperience, isFuture } from '../i18n/translations';
import type { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  experiences: ExperienceType[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const { t } = useLanguage();
  // Ordering and grouping are derived from the dates, not from the array order,
  // so adding a role to cvData puts it in the right place automatically.
  const groups = groupExperience(experiences);

  return (
    <section id="experience" className="section">
      <SectionTitle index={2}>{t.sections.experience}</SectionTitle>
      <div className="timeline">
        {groups.map((group, index) => (
          <ScrollReveal key={group.company} delay={index * 0.1}>
            <InteractiveCard className="timeline-item">
              <p className="timeline-company">{group.company}</p>

              {group.roles.map((role, i) => (
                <div
                  key={`${role.position}-${role.startDate}`}
                  className={`timeline-role${i > 0 ? ' is-previous' : ''}`}
                >
                  <div className="timeline-header">
                    <h3 className="timeline-title">{role.position}</h3>
                    <div className="timeline-meta">
                      <span
                        className={`timeline-date${isFuture(role.startDate) ? ' is-upcoming' : ''}`}
                      >
                        {formatRange(role.startDate, role.endDate, t)}
                      </span>
                      <p className="timeline-location">{role.location}</p>
                    </div>
                  </div>
                  <p className="timeline-summary">{role.summary}</p>
                  {role.highlights.length > 0 && (
                    <ul className="timeline-highlights">
                      {role.highlights.map((highlight, h) => (
                        <li key={h}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </InteractiveCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
