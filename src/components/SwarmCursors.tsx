import { useEffect, useRef, useState, useCallback } from 'react';
import SwarmFollower from './SwarmFollower';

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
 * SwarmCursors — Manages the cursor swarm experience across the entire website:
 * 1. Ambient Swarm Follower: The multi-colored cursor flock actively follows mouse
 *    movements and scroll momentum directly on the main website.
 * 2. Toggle Controls: A persistent floating button that displays "Disable Swarm" when active,
 *    allowing users to turn it off at any moment, or "Enable Swarm" to turn it back on.
 * 3. Page Rebuild Mode: Accessible via "Rebuild" button or Alt+Shift+S.
 */
const SwarmCursors = () => {
  // Swarm follower is enabled by default so the user sees the flowing cursors immediately
  const [isSwarmOn, setIsSwarmOn] = useState<boolean>(() => {
    const saved = localStorage.getItem('swarm-follower-enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [isRebuilding, setIsRebuilding] = useState(false);
  const monitorTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleSwarmFollower = useCallback(() => {
    setIsSwarmOn((prev) => {
      const next = !prev;
      localStorage.setItem('swarm-follower-enabled', String(next));
      return next;
    });
  }, []);

  /**
   * Normalize page state before snapshotting for Rebuild
   */
  const preparePage = useCallback(async () => {
    try {
      document.body.style.overflow = 'auto';

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

      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await new Promise<void>((r) => setTimeout(r, 100));
    } catch (err) {
      console.warn('[SwarmCursors] Note during prepare:', err);
    }
  }, []);

  const startMonitoringRebuild = useCallback(() => {
    if (monitorTimer.current) clearInterval(monitorTimer.current);

    monitorTimer.current = setInterval(() => {
      if (!window.__swarmRebuild?.app) {
        if (monitorTimer.current) {
          clearInterval(monitorTimer.current);
          monitorTimer.current = null;
        }
        setIsRebuilding(false);

        import('gsap/ScrollTrigger')
          .then(({ ScrollTrigger }) => ScrollTrigger.refresh())
          .catch(() => {});
      }
    }, 800);
  }, []);

  const handleStartRebuild = useCallback(async () => {
    if (isRebuilding) {
      if (window.__swarmRebuild) {
        window.__swarmRebuild.stop(true);
      }
      setIsRebuilding(false);
      return;
    }

    setIsRebuilding(true);
    await preparePage();

    const launch = () => {
      if (window.__swarmRebuild) {
        window.__swarmRebuild.start();
        startMonitoringRebuild();
      }
    };

    if (!window.__swarmRebuild) {
      const existing = document.getElementById('swarm-rebuild-script');
      if (existing) {
        launch();
      } else {
        const script = document.createElement('script');
        script.id = 'swarm-rebuild-script';
        script.src = '/swarm.js';
        script.async = true;
        script.onload = () => setTimeout(launch, 50);
        script.onerror = () => {
          console.error('[SwarmCursors] Failed to load /swarm.js');
          setIsRebuilding(false);
        };
        document.body.appendChild(script);
      }
    } else {
      launch();
    }
  }, [isRebuilding, preparePage, startMonitoringRebuild]);

  const handleStopRebuild = useCallback(() => {
    if (window.__swarmRebuild) {
      window.__swarmRebuild.stop(true);
    }
    setIsRebuilding(false);
  }, []);

  // Listen for global custom event and keyboard shortcut (Alt+Shift+S)
  useEffect(() => {
    const onTrigger = () => handleStartRebuild();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        handleStartRebuild();
      }
    };

    window.addEventListener('start-swarm-rebuild', onTrigger);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('start-swarm-rebuild', onTrigger);
      window.removeEventListener('keydown', onKeyDown);
      if (monitorTimer.current) clearInterval(monitorTimer.current);
    };
  }, [handleStartRebuild]);

  return (
    <>
      {/* 1. Ambient Flocking Cursors that follow mouse & scroll on the main website */}
      <SwarmFollower enabled={isSwarmOn && !isRebuilding} />

      {/* 2. Persistent Floating Controls at bottom-left */}
      <aside
        aria-label="Swarm Controls"
        className="fixed bottom-6 left-6 z-[99999] flex items-center gap-2 pointer-events-auto select-none"
      >
        {isRebuilding ? (
          // When Rebuild animation is active, show prominent button to stop it
          <button
            onClick={handleStopRebuild}
            title="Stop Swarm Rebuild and return to live website"
            aria-label="Disable Swarm"
            className="group relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3
                       rounded-full cursor-pointer
                       bg-rose-600 hover:bg-rose-700
                       text-white text-xs sm:text-sm font-semibold tracking-wide
                       shadow-[0_4px_24px_rgba(244,63,94,0.55)]
                       hover:scale-105 active:scale-95
                       transition-all duration-300 ease-out
                       border border-white/20 backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>Disable Swarm</span>
          </button>
        ) : (
          // Main website controls: Toggle Swarm On/Off + Rebuild option
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSwarmFollower}
              title={
                isSwarmOn
                  ? 'Disable cursor swarm following animation'
                  : 'Enable cursor swarm following animation'
              }
              aria-label={isSwarmOn ? 'Disable Swarm' : 'Enable Swarm'}
              className={`group relative flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3
                         rounded-full cursor-pointer
                         text-white text-xs sm:text-sm font-semibold tracking-wide
                         transition-all duration-300 ease-out border backdrop-blur-md
                         hover:scale-105 active:scale-95 ${
                           isSwarmOn
                             ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 border-white/20 shadow-[0_4px_24px_rgba(99,102,241,0.45)] hover:shadow-[0_4px_32px_rgba(99,102,241,0.7)]'
                             : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-white/10 shadow-lg'
                         }`}
            >
              {/* Cursor Icon */}
              <span className="relative flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <path
                    d="M4.6 3.9C4.2 3.1 4.9 2.4 5.7 2.8L20.6 9.4C21.5 9.8 21.4 11.1 20.4 11.3L13.9 12.9C13.4 13 13 13.4 12.9 13.9L11.3 20.4C11.1 21.4 9.8 21.5 9.4 20.6Z"
                    fill={isSwarmOn ? '#38bdf8' : '#94a3b8'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                {isSwarmOn && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </span>

              <span>{isSwarmOn ? 'Disable Swarm' : 'Enable Swarm'}</span>
            </button>

            {/* Quick Rebuild Page button */}
            <button
              onClick={handleStartRebuild}
              title="Wipe & rebuild page live with swarm cursors (Alt+Shift+S)"
              aria-label="Rebuild Page"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-full
                         bg-white/5 hover:bg-white/15 text-white/80 hover:text-white
                         text-xs font-medium border border-white/10 backdrop-blur-md
                         transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Rebuild</span>
              <span className="text-[10px] font-mono text-white/50 bg-white/10 px-1 py-0.5 rounded">
                Alt+Shift+S
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default SwarmCursors;
