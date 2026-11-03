import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(logoRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.35,
      ease: "power2.out"
    })
      .to(progressBarRef.current, {
        width: "100%",
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          if (percentRef.current) percentRef.current.textContent = "100%";
        }
      }, "-=0.1")
      .to(preloaderRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete();
        }
      }, "+=0.1");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-50 flex items-center justify-center bg-background pointer-events-none">
      <div className="text-center">
        <div ref={logoRef} className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest uppercase shadow-glow-primary">
            Sarweshwar's Portfolio
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Loading Portfolio...</p>
        </div>

        <div className="w-80 max-w-md mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
            <div ref={progressBarRef} className="h-full bg-gradient-to-r from-primary to-secondary w-0 rounded-full shadow-neon" />
          </div>

          <div ref={percentRef} className="text-lg font-mono text-primary">
            0%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;