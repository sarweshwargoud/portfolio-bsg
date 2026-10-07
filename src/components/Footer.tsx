import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GithubLogo, LinkedinLogo, ArrowUp, ShieldCheck, FileText } from 'phosphor-react';

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
          <h3 className="text-2xl font-bold text-white mb-1">Sarweshwar Buddolla</h3>
          <p className="text-muted-foreground text-sm">
            Building intelligent systems for a better tomorrow.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <ShieldCheck size={14} /> Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-primary transition-colors flex items-center gap-1">
              <FileText size={14} /> Terms of Service
            </Link>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <a
            href="https://github.com/sarweshwargoud"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 hover:text-primary transition-all"
            aria-label="GitHub Profile"
          >
            <GithubLogo size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/sarweshwar-buddolla-25673b312/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 hover:text-secondary transition-all"
            aria-label="LinkedIn Profile"
          >
            <LinkedinLogo size={22} />
          </a>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <button onClick={scrollToTop} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
            Back to Top <ArrowUp size={16} />
          </button>
          <span className="text-[11px] text-white/40 font-mono">
            © {new Date().getFullYear()} sarweshwarr.com
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;