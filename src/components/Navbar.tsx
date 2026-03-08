import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Home, User, Briefcase, FolderGit2, Mail } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'about', icon: User, label: 'About' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'projects', icon: FolderGit2, label: 'Projects' },
  { id: 'contact', icon: Mail, label: 'Contact' },
];

export default function Navbar() {
  const [active, setActive] = useState('home');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) sectionRefs.current.set(item.id, el);
    });
  }, []);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY + window.innerHeight / 2;

    for (let i = navItems.length - 1; i >= 0; i--) {
      const el = sectionRefs.current.get(navItems[i].id);
      if (el && el.offsetTop <= scrollY) {
        setActive(navItems[i].id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current.get(id) || document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      aria-label="Main navigation"
    >
      {navItems.map((navItem) => (
        <button
          key={navItem.id}
          className={`nav-item ${active === navItem.id ? 'active' : ''}`}
          onClick={() => scrollTo(navItem.id)}
          aria-label={navItem.label}
          aria-current={active === navItem.id ? 'true' : undefined}
          title={navItem.label}
        >
          <navItem.icon size={20} aria-hidden="true" />
        </button>
      ))}
    </motion.nav>
  );
}
