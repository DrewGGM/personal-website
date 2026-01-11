import Header from './components/Header';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Languages from './components/Languages';
import { cvData } from './data/cvData';

function App() {
  return (
    <>
      <Header data={cvData} />
      <div className="container">
        <About summary={cvData.summary} />
        <Experience experiences={cvData.experience} />
        <Education education={cvData.education} />
        <Skills skills={cvData.skills} />
        <Certifications certifications={cvData.certifications} />
        <Languages languages={cvData.languages} />
      </div>
    </>
  );
}

export default App;
