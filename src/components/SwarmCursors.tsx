import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
 * Helper to detect mobile devices based on screen width, touch capability, or user-agent
 */
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  return (hasTouch && isSmallScreen) || isMobileUA || isSmallScreen;
};

/**
 * SwarmCursors — Manages the cursor swarm experience across the entire website:
 * 1. Ambient Swarm Follower: The multi-colored cursor flock actively follows mouse
 *    movements and scroll momentum on desktop. On mobile, it is DISABLED by default.
 * 2. Toggle Controls: A persistent floating button that displays "Disable Swarm" when active,
 *    allowing users to turn it off at any moment, or "Enable Swarm" to turn it back on.
 * 3. Page Rebuild Mode: Accessible via "Rebuild" button (visible on both mobile & desktop) or Alt+Shift+S.
 * 4. Rendered via React Portal at document.body with max z-index so it is ALWAYS on top and clickable.
 */
const SwarmCursors = () => {
  // Default: Disabled on mobile devices, enabled on desktop!
  const [isSwarmOn, setIsSwarmOn] = useState<boolean>(() => {
    const isMobile = isMobileDevice();
    const saved = localStorage.getItem('swarm-follower-enabled');

    if (saved !== null) {
      // Ensure existing mobile visitors start with disabled by default
      const mobileInit = localStorage.getItem('swarm-mobile-init-v1');
      if (isMobile && !mobileInit) {
        localStorage.setItem('swarm-mobile-init-v1', 'true');
        localStorage.setItem('swarm-follower-enabled', 'false');
        return false;
      }
      return saved === 'true';
    }

    if (isMobile) {
      localStorage.setItem('swarm-mobile-init-v1', 'true');
      localStorage.setItem('swarm-follower-enabled', 'false');
      return false;
    }

    return true;
  });

  const [isRebuilding, setIsRebuilding] = useState(false);
  const monitorTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleSwarmFollower = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

  const handleStartRebuild = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isRebuilding) {
      if (window.__swarmRebuild) {
        window.__swarmRebuild.stop(false);
      }
      document.querySelectorAll('swarm-rebuild').forEach((el) => el.remove());
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

  const handleStopRebuild = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.__swarmRebuild) {
      window.__swarmRebuild.stop(false);
    }
    document.querySelectorAll('swarm-rebuild').forEach((el) => el.remove());
    setIsRebuilding(false);
    setIsSwarmOn(false);
    localStorage.setItem('swarm-follower-enabled', 'false');
  }, []);

  // Listen for events from HUD and global triggers
  useEffect(() => {
    const onTrigger = () => handleStartRebuild();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        handleStartRebuild();
      }
    };

    const onSwarmDisabledByUser = () => {
      setIsRebuilding(false);
      setIsSwarmOn(false);
      localStorage.setItem('swarm-follower-enabled', 'false');
    };

    const onSwarmLiveByUser = () => {
      setIsRebuilding(false);
    };

    window.addEventListener('start-swarm-rebuild', onTrigger);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('swarm-disabled-by-user', onSwarmDisabledByUser);
    window.addEventListener('swarm-live-by-user', onSwarmLiveByUser);

    return () => {
      window.removeEventListener('start-swarm-rebuild', onTrigger);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('swarm-disabled-by-user', onSwarmDisabledByUser);
      window.removeEventListener('swarm-live-by-user', onSwarmLiveByUser);
      if (monitorTimer.current) clearInterval(monitorTimer.current);
    };
  }, [handleStartRebuild]);

  const controls = (
    <aside
      aria-label="Swarm Controls"
      style={{ zIndex: 2147483647, position: 'fixed' }}
      className="bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 pointer-events-auto select-none"
    >
      {isRebuilding ? (
        // When Rebuild animation is active, show prominent button to stop it immediately
        <button
          type="button"
          onClick={handleStopRebuild}
          title="Stop Swarm Rebuild and return to live website"
          aria-label="Disable Swarm"
          className="group relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3
                     rounded-full cursor-pointer
                     bg-rose-600 hover:bg-rose-700
                     text-white text-xs sm:text-sm font-semibold tracking-wide
                     shadow-[0_4px_24px_rgba(244,63,94,0.7)]
                     hover:scale-105 active:scale-95
                     transition-all duration-300 ease-out
                     border border-white/30 backdrop-blur-md"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span>Disable Swarm</span>
        </button>
      ) : (
        // Main website controls: Toggle Swarm On/Off + Rebuild button (visible on mobile & desktop)
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleSwarmFollower}
            title={
              isSwarmOn
                ? 'Disable cursor swarm following animation'
                : 'Enable cursor swarm following animation'
            }
            aria-label={isSwarmOn ? 'Disable Swarm' : 'Enable Swarm'}
            className={`group relative flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-3
                       rounded-full cursor-pointer
                       text-white text-xs sm:text-sm font-semibold tracking-wide
                       transition-all duration-300 ease-out border backdrop-blur-md
                       hover:scale-105 active:scale-95 ${
                         isSwarmOn
                           ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 border-white/20 shadow-[0_4px_24px_rgba(99,102,241,0.5)] hover:shadow-[0_4px_32px_rgba(99,102,241,0.75)]'
                           : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-white/10 shadow-lg'
                       }`}
          >
            {/* Cursor Icon */}
            <span className="relative flex items-center justify-center">
              <svg
                width="15"
                height="15"
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

          {/* Rebuild Page button — now visible on both mobile and desktop! */}
          <button
            type="button"
            onClick={handleStartRebuild}
            title="Wipe & rebuild page live with swarm cursors (Alt+Shift+S)"
            aria-label="Rebuild Page"
            className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full
                       bg-white/10 hover:bg-white/20 text-white/90 hover:text-white
                       text-xs font-medium border border-white/15 backdrop-blur-md
                       shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Rebuild icon */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-sky-300"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Rebuild</span>
            <span className="hidden md:inline-block text-[10px] font-mono text-white/50 bg-white/10 px-1 py-0.5 rounded">
              Alt+Shift+S
            </span>
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* 1. Ambient Flocking Cursors that follow mouse & scroll on the main website (clean arrows, no names) */}
      <SwarmFollower enabled={isSwarmOn && !isRebuilding} />

      {/* 2. Persistent Floating Controls portaled directly to document.body */}
      {typeof document !== 'undefined' ? createPortal(controls, document.body) : controls}
    </>
  );
};

export default SwarmCursors;
