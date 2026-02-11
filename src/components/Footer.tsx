import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GithubLogo, LinkedinLogo, ArrowUp } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="relative py-12 px-6 border-t border-white/5 bg-background">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">Sarweshwar</h3>
          <p className="text-muted-foreground text-sm">
            Building intelligent systems for a better tomorrow.
          </p>
        </div>

        <div className="flex gap-4">
          <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-primary transition-all">
            <GithubLogo size={24} />
          </a>
          <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-secondary transition-all">
            <LinkedinLogo size={24} />
          </a>
        </div>

        <button onClick={scrollToTop} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          Back to Top <ArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;