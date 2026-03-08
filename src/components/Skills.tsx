import ScrollReveal from './ScrollReveal';
import { Code2, Layers, GitBranch, Cpu, Compass } from 'lucide-react';
import type { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

const skillIcons: Record<string, typeof Code2> = {
  Languages: Code2,
  'Frameworks & Libraries': Layers,
  'DevOps & Tools': GitBranch,
  'Software Engineering': Cpu,
  'Areas of Expertise': Compass,
};

export default function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="section">
      <ScrollReveal>
        <h2 className="section-title">Skills</h2>
      </ScrollReveal>
      <div className="skills-grid">
        {skills.map((skill, index) => {
          const Icon = skillIcons[skill.label] || Code2;
          return (
            <ScrollReveal key={skill.label} delay={index * 0.08}>
              <div className="skill-card">
                <div className="skill-icon">
                  <Icon size={24} />
                </div>
                <h3 className="skill-label">{skill.label}</h3>
                <p className="skill-details">{skill.details}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
