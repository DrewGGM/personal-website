import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import InteractiveCard from './InteractiveCard';
import TechLogos from './TechLogos';
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
      <SectionTitle index={4}>Skills</SectionTitle>

      <TechLogos />

      <div className="skills-grid">
        {skills.map((skill, index) => {
          const Icon = skillIcons[skill.label] || Code2;
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
