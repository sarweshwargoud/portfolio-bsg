import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/button';
import { Handshake, ArrowRight, Brain, Cloud, Rocket } from 'phosphor-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1 });

    // Fade in main text
    tl.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    )
      .fromTo(splineRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
        "-=1"
      );
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      {/* 3D Model Background - Preserving Robot */}
      <div ref={splineRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <iframe
          src="https://my.spline.design/genkubgreetingrobot-MW4W3iAFsJj5olFfT1MhN0TH/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="w-full h-full opacity-80"
          style={{ pointerEvents: 'auto' }}
        />
      </div>

      {/* Overlay Gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />

      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-32 md:mt-0">

        {/* Status Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-secondary animate-pulse backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          Open for Opportunities
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white drop-shadow-2xl">
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sarweshwar</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-2 mb-8 text-lg font-light text-muted-foreground/80 font-mono tracking-wide">
          <span>Aspiring AI Engineer</span>
          <span className="text-primary">•</span>
          <span>GenAI Learner</span>
          <span className="text-primary">•</span>
          <span>Agentic AI Enthusiast</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={scrollToContact}
            className="group relative px-8 py-6 bg-primary hover:bg-primary/90 text-white rounded-full text-lg font-medium transition-all duration-300 hover:shadow-glow-primary overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              Connect with Me <Handshake size={20} weight="fill" />
            </span>
          </Button>

          <Button
            onClick={scrollToProjects}
            variant="outline"
            className="group px-8 py-6 text-white border-white/20 hover:bg-white/10 rounded-full text-lg transition-all duration-300 backdrop-blur-md w-full sm:w-auto hover:border-white/40"
          >
            View Projects <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Floating Icons for subtle flair */}
      <div className="absolute bottom-20 left-10 hidden md:block animate-float">
        <Brain size={48} className="text-primary/10" weight="duotone" />
      </div>
      <div className="absolute top-24 right-10 hidden md:block animate-float" style={{ animationDelay: '2s' }}>
        <Cloud size={48} className="text-secondary/10" weight="duotone" />
      </div>
      <div className="absolute bottom-32 right-20 hidden md:block animate-float" style={{ animationDelay: '1.5s' }}>
        <Rocket size={48} className="text-accent/10" weight="duotone" />
      </div>

    </section>
  );
};

export default Hero;
