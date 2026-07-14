import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import InteractiveCard from './InteractiveCard';
import TechLogos from './TechLogos';
import { Code2, Layers, GitBranch, Cpu, Compass } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

// Keyed by the skill's position (stable across languages), not its label.
const skillIcons = [Code2, Layers, GitBranch, Cpu, Compass];

export default function Skills({ skills }: SkillsProps) {
  const { t } = useLanguage();
  return (
    <section id="skills" className="section">
      <SectionTitle index={4}>{t.sections.skills}</SectionTitle>

      <TechLogos />

      <div className="skills-grid">
        {skills.map((skill, index) => {
          const Icon = skillIcons[index] || Code2;
          return (
            <ScrollReveal key={skill.label} delay={index * 0.08}>
              <InteractiveCard className="skill-card" tilt>
                <div className="skill-icon">
                  <Icon size={24} />
                </div>
                <h3 className="skill-label">{skill.label}</h3>
                <p className="skill-details">{skill.details}</p>
              </InteractiveCard>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
