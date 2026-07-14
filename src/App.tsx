import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import AuroraBackground from './components/AuroraBackground';
import CursorGlow from './components/CursorGlow';
import LanguageToggle from './components/LanguageToggle';
import { useLanguage } from './i18n/LanguageContext';

function App() {
  const { cv } = useLanguage();

  return (
    <>
      <AuroraBackground />
      <CursorGlow />
      <ScrollProgress />
      <LanguageToggle />
      <Navbar />
      <Hero data={cv} />
      <div className="container">
        <About data={cv} />
        <Experience experiences={cv.experience} />
        <Education education={cv.education} />
        <Skills skills={cv.skills} />
        <Projects projects={cv.projects} />
        <Certifications certifications={cv.certifications} />
        <Contact data={cv} />
      </div>
      <Footer />
    </>
  );
}

export default App;
