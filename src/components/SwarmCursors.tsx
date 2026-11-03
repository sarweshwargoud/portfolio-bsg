import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Trigger Swarm Rebuild from anywhere in the application (navbar, hero, footer, etc.)
 */
export const triggerSwarm = () => {
  window.dispatchEvent(new CustomEvent('start-swarm-rebuild'));
};

declare global {
  interface Window {
    __swarmRebuild?: {
      toggle: () => void;
      start: () => void;
      stop: (reveal?: boolean) => void;
      app: unknown;
    };
  }
}

/**
 * SwarmCursors — A global component rendered in App.tsx so it works across
 * ALL routes (Home, Privacy Policy, Terms of Service, 404, etc.).
 *
 * It provides:
 * 1. A floating action button in the bottom-left corner with cursor icon & label
 * 2. Global keyboard shortcut: Alt + Shift + S
 * 3. Pre-capture normalization (ensures all elements are unhidden and laid out)
 * 4. Full interactive Swarm Rebuild experience (speed toggles, tour auto-scroll,
 *    sound synthesis, Go Live button, replay, Esc exit)
 */
const SwarmCursors = () => {
  const [isRunning, setIsRunning] = useState(false);
  const monitorTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Normalize page state before snapshotting:
   * - Restores body overflow
   * - Forces GSAP animations to complete so all cards & sections are visible
   */
  const preparePage = useCallback(async () => {
    try {
      // Ensure body is scrollable
      document.body.style.overflow = 'auto';

      // Check if GSAP is loaded on the current page
      const gsapModule = await import('gsap').catch(() => null);
      if (gsapModule) {
        const gsap = gsapModule.gsap || gsapModule.default;
        if (gsap && gsap.globalTimeline) {
          gsap.globalTimeline.getChildren(true, true, true).forEach((tween: any) => {
            if (typeof tween.progress === 'function') {
              try {
                tween.progress(1);
              } catch (_) {}
            }
          });
        }
      }

      // Check if ScrollTrigger is loaded
      const stModule = await import('gsap/ScrollTrigger').catch(() => null);
      if (stModule && stModule.ScrollTrigger) {
        stModule.ScrollTrigger.getAll().forEach((trigger: any) => {
          if (trigger.animation && typeof trigger.animation.progress === 'function') {
            try {
              trigger.animation.progress(1);
            } catch (_) {}
          }
        });
      }

      // Let the browser paint any freshly revealed elements
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await new Promise<void>((r) => setTimeout(r, 100));
    } catch (err) {
      console.warn('[SwarmCursors] Note during prepare:', err);
    }
  }, []);

  /**
   * Monitor the Swarm Rebuild session to restore the button when it finishes
   */
  const startMonitoring = useCallback(() => {
    if (monitorTimer.current) clearInterval(monitorTimer.current);

    monitorTimer.current = setInterval(() => {
      if (!window.__swarmRebuild?.app) {
        if (monitorTimer.current) {
          clearInterval(monitorTimer.current);
          monitorTimer.current = null;
        }
        setIsRunning(false);

        // Refresh ScrollTrigger so live page scroll animations still work
        import('gsap/ScrollTrigger')
          .then(({ ScrollTrigger }) => ScrollTrigger.refresh())
          .catch(() => {});
      }
    }, 800);
  }, []);

  /**
   * Main function to start or toggle the Swarm Rebuild
   */
  const handleStart = useCallback(async () => {
    if (isRunning) {
      if (window.__swarmRebuild) {
        window.__swarmRebuild.stop(true);
      }
      return;
    }

    setIsRunning(true);
    await preparePage();

    const launch = () => {
      if (window.__swarmRebuild) {
        window.__swarmRebuild.start();
        startMonitoring();
      }
    };

    if (!window.__swarmRebuild) {
      // Inject swarm.js script if not yet loaded
      const existing = document.getElementById('swarm-rebuild-script');
      if (existing) {
        launch();
      } else {
        const script = document.createElement('script');
        script.id = 'swarm-rebuild-script';
        script.src = '/swarm.js';
        script.async = true;
        script.onload = () => {
          setTimeout(launch, 50);
        };
        script.onerror = () => {
          console.error('[SwarmCursors] Failed to load /swarm.js');
          setIsRunning(false);
        };
        document.body.appendChild(script);
      }
    } else {
      launch();
    }
  }, [isRunning, preparePage, startMonitoring]);

  // Listen for global custom event and keyboard shortcut (Alt+Shift+S)
  useEffect(() => {
    const onTrigger = () => handleStart();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        handleStart();
      }
    };

    window.addEventListener('start-swarm-rebuild', onTrigger);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('start-swarm-rebuild', onTrigger);
      window.removeEventListener('keydown', onKeyDown);
      if (monitorTimer.current) clearInterval(monitorTimer.current);
    };
  }, [handleStart]);

  // While the swarm is actively rebuilding, its own full-screen HUD is displayed
  if (isRunning) return null;

  return (
    <aside
      aria-label="Swarm Rebuild Controls"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 pointer-events-auto"
    >
      <button
        onClick={handleStart}
        title="Wipe and rebuild this page live with a swarm of multiplayer cursors (Alt+Shift+S)"
        aria-label="Start Swarm Rebuild"
        className="group relative flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3
                   rounded-full cursor-pointer select-none
                   bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600
                   text-white text-xs sm:text-sm font-semibold tracking-wide
                   shadow-[0_4px_24px_rgba(99,102,241,0.45)]
                   hover:shadow-[0_4px_32px_rgba(99,102,241,0.7)]
                   hover:scale-105 active:scale-95
                   transition-all duration-300 ease-out
                   border border-white/20 backdrop-blur-md"
      >
        {/* Animated Multiplayer Cursor Icon */}
        <span className="relative flex items-center justify-center">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
          >
            <path
              d="M4.6 3.9C4.2 3.1 4.9 2.4 5.7 2.8L20.6 9.4C21.5 9.8 21.4 11.1 20.4 11.3L13.9 12.9C13.4 13 13 13.4 12.9 13.9L11.3 20.4C11.1 21.4 9.8 21.5 9.4 20.6Z"
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </span>

        <span className="flex items-center gap-1.5">
          <span>Swarm Rebuild</span>
          <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/20 text-white/90">
            Alt+Shift+S
          </span>
        </span>
      </button>
    </aside>
  );
};

export default SwarmCursors;
