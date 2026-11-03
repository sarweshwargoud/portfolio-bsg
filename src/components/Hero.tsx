import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/button';
import { Handshake, ArrowRight, Brain, Cloud, Rocket } from 'phosphor-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<HTMLDivElement>(null);
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Fade in main text
    tl.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    )
      .fromTo(splineRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        "-=0.6"
      );

    const desktopCheck = typeof window !== 'undefined' && window.innerWidth >= 768;
    setIsDesktop(desktopCheck);

    // Only load the heavy 3D Spline scene on desktop devices (eliminates 1,700ms CPU / 550KB wasm on mobile)
    let loadTimeout: NodeJS.Timeout | null = null;
    if (desktopCheck) {
      loadTimeout = setTimeout(() => {
        setShouldLoadSpline(true);
      }, 1500);
    }

    return () => {
      if (loadTimeout) clearTimeout(loadTimeout);
    };
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      {/* Overlay Gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-28 pb-12 lg:py-0 min-h-screen">

        {/* Left Side: Content */}
        <div ref={contentRef} className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-secondary animate-pulse backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            Open for Opportunities
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-2xl leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sarweshwar</span>
          </h1>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-lg font-light text-muted-foreground/80 font-mono tracking-wide">
            <span>Aspiring AI Engineer</span>
            <span className="text-primary">•</span>
            <span>GenAI Learner</span>
            <span className="text-primary">•</span>
            <span>Agentic AI Enthusiast</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto">
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

        {/* Right Side: Hero Visual */}
        <div ref={splineRef} className="lg:col-span-5 w-full h-[320px] sm:h-[420px] lg:h-[600px] relative z-0 flex items-center justify-center">
          {/* Subtle glowing ambient aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-secondary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {!isDesktop ? (
            /* Clean, zero-overhead static visual on mobile (0ms CPU/TBT, 13KB) */
            <div className="relative flex flex-col items-center justify-center p-4 select-none">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr from-primary/20 via-white/5 to-secondary/20 p-2 border border-white/15 shadow-[0_0_50px_rgba(124,58,237,0.25)] flex items-center justify-center backdrop-blur-md animate-float">
                <img
                  src="/Images/robot-hero.webp"
                  alt="Sarweshwar Portfolio Visual"
                  width="180"
                  height="180"
                  loading="eager"
                  decoding="async"
                  className="w-36 h-36 sm:w-44 sm:h-44 object-contain filter drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                />
              </div>
            </div>
          ) : (
            /* On Desktop: Deferred interactive 3D Spline scene */
            <>
              {!splineLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none transition-opacity duration-700">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-primary/15 via-secondary/10 to-transparent border border-white/10 flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(124,58,237,0.15)]">
                    <Brain size={44} className="text-primary/70 animate-bounce" weight="duotone" />
                    <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground/60 tracking-wider">Loading 3D Experience...</span>
                </div>
              )}

              {shouldLoadSpline && (
                <div className="absolute inset-y-0 w-[140%] -left-[20%] pointer-events-none">
                  <iframe
                    src="https://my.spline.design/genkubgreetingrobot-MW4W3iAFsJj5olFfT1MhN0TH/"
                    title="Interactive 3D Greeting Robot"
                    loading="lazy"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    onLoad={() => setSplineLoaded(true)}
                    className={`w-full h-full transition-opacity duration-700 ${splineLoaded ? 'opacity-80' : 'opacity-0'}`}
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>
              )}
            </>
          )}
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
