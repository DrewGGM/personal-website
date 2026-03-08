import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { Github, Linkedin, Download, ChevronDown } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
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
  const github = data.socialNetworks.find((s) => s.network === 'GitHub');
  const linkedin = data.socialNetworks.find((s) => s.network === 'LinkedIn');

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
            Available for opportunities
          </motion.div>
          <motion.h1 className="hero-name" variants={item}>
            Hi, I'm{' '}
            <span className="gradient-text">{data.name.split(' ')[0]}</span>
          </motion.h1>
          <motion.div className="hero-typewriter" variants={item}>
            <TypeAnimation
              sequence={[
                'Backend Developer',
                2000,
                'Software Engineer',
                2000,
                'QA Engineer',
                2000,
                'Problem Solver',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>
          <motion.p className="hero-description" variants={item}>
            {data.location}
          </motion.p>
          <motion.div className="hero-actions" variants={item}>
            {github && (
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
            <a
              href="/Andrew_Garcia_Mosquera_CV.pdf"
              download
              className="btn-primary"
            >
              <Download size={18} />
              Download CV
            </a>
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
                <span className="code-string">"Software Engineer"</span>,{'\n'}
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
                <span className="code-comment">{'// Open to new challenges!'}</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
