import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { List, X } from "phosphor-react";
import { gsap } from "gsap";

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
        <div ref={logoRef} className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => scrollTo('hero')}>
          Sarweshwar's <span className="text-primary">Portfolio</span>
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
          <Button onClick={() => scrollTo('contact')} variant="default" className="rounded-full shadow-neon bg-primary hover:bg-primary/90 text-white">
            Hire Me
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
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
          <Button onClick={() => scrollTo('contact')} className="w-full py-6 text-lg bg-primary text-white">
            Hire Me
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;