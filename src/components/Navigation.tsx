import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { List, X } from "phosphor-react";
import { gsap } from "gsap";
import { triggerSwarm } from "./SwarmCursors";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Wait for preloader transition
    tl.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 2.5 }
    )
      .fromTo(logoRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(menuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.3"
      );
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const links = [
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Education", id: "education" }, // Added Education
    { name: "Projects", id: "projects" },
    { name: "Experience", id: "experience" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav ref={navRef} className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <div
          ref={logoRef}
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => scrollTo('hero')}
        >
          <img
            src="/favicon.png"
            alt="Sarweshwar Logo"
            width="36"
            height="36"
            loading="eager"
            decoding="async"
            className="w-9 h-9 rounded-xl object-contain shadow-[0_0_20px_rgba(59,130,246,0.45)] border border-white/20 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all duration-300"
          />
          <div className="text-xl sm:text-2xl font-bold tracking-tighter text-white">
            Sarweshwar's <span className="text-primary">Portfolio</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div ref={menuRef} className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              {link.name}
            </button>
          ))}
          <Button
            onClick={triggerSwarm}
            variant="outline"
            className="rounded-full border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:text-white transition-all duration-300 gap-2 font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.6 3.9C4.2 3.1 4.9 2.4 5.7 2.8L20.6 9.4C21.5 9.8 21.4 11.1 20.4 11.3L13.9 12.9C13.4 13 13 13.4 12.9 13.9L11.3 20.4C11.1 21.4 9.8 21.5 9.4 20.6Z" />
            </svg>
            Swarm Rebuild
          </Button>
          <Button onClick={() => scrollTo('contact')} variant="default" className="rounded-full shadow-neon bg-primary hover:bg-primary/90 text-white">
            Hire Me
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          aria-label="Toggle mobile navigation menu"
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full h-screen bg-background border-t border-white/10 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-10 fade-in duration-300">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.id)}
              className="text-2xl font-bold text-left text-white hover:text-primary transition-colors"
            >
              {link.name}
            </button>
          ))}
          <Button
            onClick={() => {
              setIsOpen(false);
              triggerSwarm();
            }}
            variant="outline"
            className="w-full py-5 text-base border-sky-400/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.6 3.9C4.2 3.1 4.9 2.4 5.7 2.8L20.6 9.4C21.5 9.8 21.4 11.1 20.4 11.3L13.9 12.9C13.4 13 13 13.4 12.9 13.9L11.3 20.4C11.1 21.4 9.8 21.5 9.4 20.6Z" />
            </svg>
            Swarm Rebuild
          </Button>
          <Button onClick={() => scrollTo('contact')} className="w-full py-6 text-lg bg-primary text-white">
            Hire Me
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;