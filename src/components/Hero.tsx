import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { Github, Linkedin, ChevronDown } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import MagneticButton from './MagneticButton';
import CountUp from './CountUp';
import CvDownload from './CvDownload';
import { useLanguage } from '../i18n/LanguageContext';
import type { CVData } from '../types';

interface HeroProps {
  data: CVData;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Hero({ data }: HeroProps) {
  const { lang, t } = useLanguage();
  const github = data.socialNetworks.find((s) => s.network === 'GitHub');
  const linkedin = data.socialNetworks.find((s) => s.network === 'LinkedIn');

  const completedProjects = data.projects.filter((p) => p.status === 'completed').length;
  const stats = [
    { value: 3, suffix: '+', label: t.hero.stats.yearsCoding },
    { value: completedProjects, suffix: '', label: t.hero.stats.projectsShipped },
    { value: data.certifications.length, suffix: '', label: t.hero.stats.certifications },
    { value: 1, suffix: '', label: t.hero.stats.startupFounded },
  ];

  // TypeAnimation only reads its `sequence` once, so key it on `lang` to remount on switch.
  const typewriterSequence = t.hero.typewriter.flatMap((phrase) => [phrase, 2000]);

  return (
    <section id="home" className="hero">
      <ParticleBackground />
      <motion.div
        className="hero-content container"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="hero-left">
          <motion.div className="hero-badge" variants={item}>
            <span className="badge-dot" />
            {t.hero.badge}
          </motion.div>
          <motion.h1 className="hero-name" variants={item}>
            {t.hero.greeting}{' '}
            <span className="gradient-text gradient-animate">
              {data.name.split(' ')[0]}
            </span>
          </motion.h1>
          <motion.div className="hero-typewriter" variants={item}>
            <span className="hero-typewriter-prefix">&gt;_ </span>
            <TypeAnimation
              key={lang}
              sequence={typewriterSequence}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>
          <motion.p className="hero-description" variants={item}>
            {t.hero.description(data.headline, data.location)}
          </motion.p>
          <motion.div className="hero-actions" variants={item}>
            {github && (
              <MagneticButton>
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
              </MagneticButton>
            )}
            {linkedin && (
              <MagneticButton>
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </MagneticButton>
            )}
            <CvDownload />
          </motion.div>

          <motion.div className="hero-stats" variants={item}>
            {stats.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <span className="hero-stat-value">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div className="hero-code" variants={item}>
          <div className="code-block">
            <div className="code-header">
              <span className="code-dot red" />
              <span className="code-dot yellow" />
              <span className="code-dot green" />
              <span className="code-filename">developer.ts</span>
            </div>
            <pre className="code-body">
              <code>
                <span className="code-keyword">const</span>{' '}
                <span className="code-variable">developer</span>{' '}
                <span className="code-bracket">=</span>{' '}
                <span className="code-bracket">{'{'}</span>{'\n'}
                {'  '}<span className="code-variable">name</span>:{' '}
                <span className="code-string">"{data.name}"</span>,{'\n'}
                {'  '}<span className="code-variable">role</span>:{' '}
                <span className="code-string">"{t.hero.codeRole}"</span>,{'\n'}
                {'  '}<span className="code-variable">location</span>:{' '}
                <span className="code-string">"{data.location}"</span>,{'\n'}
                {'  '}<span className="code-variable">skills</span>:{' '}
                <span className="code-bracket">[</span>
                <span className="code-string">"Java"</span>,{' '}
                <span className="code-string">"Spring Boot"</span>,{'\n'}
                {'           '}
                <span className="code-string">"Python"</span>,{' '}
                <span className="code-string">"Go"</span>,{' '}
                <span className="code-string">"Angular"</span>
                <span className="code-bracket">]</span>,{'\n'}
                {'  '}<span className="code-variable">currentlyAt</span>:{' '}
                <span className="code-string">"COFINCAFE"</span>,{'\n'}
                {'  '}<span className="code-variable">available</span>:{' '}
                <span className="code-keyword">true</span>{'\n'}
                <span className="code-bracket">{'}'}</span>;{'\n'}
                <span className="code-comment">{t.hero.codeComment}</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-label={t.hero.scrollAria}
      >
        <span>{t.hero.scroll}</span>
        <ChevronDown size={24} />
      </motion.a>
    </section>
  );
}
