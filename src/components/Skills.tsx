import type { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <section className="section">
      <h2 className="section-title">Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item">
            <h3 className="skill-label">{skill.label}</h3>
            <p className="skill-details">{skill.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
