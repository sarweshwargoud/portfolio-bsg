import { useState, useEffect } from 'react';
import Preloader from './Preloader';
import Navigation from './Navigation';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Education from './Education';
import Projects from './Projects';
import Certifications from './Certifications';
import Experience from './Experience';
import CodingProfiles from './CodingProfiles';
import Contact from './Contact';
import Footer from './Footer';
import Chatbot from './Chatbot';

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }, 100);
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen">
      {isLoading && <Preloader onComplete={handleLoadingComplete} />}

      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navigation />
        <main className="flex flex-col">
          <Hero />
          <About />
          <Skills />
          <Education />
          <Projects />
          <Experience />
          <Certifications />
          <CodingProfiles />
          <Contact />
          <Chatbot />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Portfolio;