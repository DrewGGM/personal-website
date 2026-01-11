import type { Skill } from '../types';

interface LanguagesProps {
  languages: Skill[];
}

export default function Languages({ languages }: LanguagesProps) {
  return (
    <section className="section">
      <h2 className="section-title">Languages</h2>
      <div className="languages-grid">
        {languages.map((lang, index) => (
          <div key={index} className="language-item">
            <span className="language-name">{lang.label}</span>
            <span className="language-level">{lang.details}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
