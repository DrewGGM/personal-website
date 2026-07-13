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
import { cvData } from './data/cvData';

function App() {
  return (
    <>
      <AuroraBackground />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <Hero data={cvData} />
      <div className="container">
        <About data={cvData} />
        <Experience experiences={cvData.experience} />
        <Education education={cvData.education} />
        <Skills skills={cvData.skills} />
        <Projects projects={cvData.projects} />
        <Certifications certifications={cvData.certifications} />
        <Contact data={cvData} />
      </div>
      <Footer />
    </>
  );
}

export default App;
