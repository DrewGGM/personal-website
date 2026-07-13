import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import type { CVData } from '../types';

interface AboutProps {
  data: CVData;
}

export default function About({ data }: AboutProps) {
  return (
    <section id="about" className="section">
      <SectionTitle index={1}>About Me</SectionTitle>
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
    </section>
  );
}
