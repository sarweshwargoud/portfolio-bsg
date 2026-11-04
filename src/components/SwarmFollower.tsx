import { useEffect, useRef } from 'react';

// Exact cursor palette from DhvanilPatel/swarm-cursors
const COLORS = [
  '#F24E1E', '#A259FF', '#1ABCFE', '#0ACF83', '#FF7262', '#FFC700',
  '#9747FF', '#E8467C', '#14AE5C', '#0D99FF', '#FF8A00', '#00B5CE',
];

// Exact SVG path for the multiplayer cursor arrow
const ARROW_SVG_PATH =
  'M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z';

const NUM_CURSORS = 16;

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  color: string;
  speed: number;
  force: number;
  spin: number;
  curl: number;
  orbit: number;
}

interface SwarmFollowerProps {
  enabled: boolean;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

/**
 * SwarmFollower — High-performance multiplayer cursor flocking overlay.
 * Wakes up on user interaction (pointermove / scroll) and sleeps when idle
 * to guarantee 0 ms idle CPU / TBT overhead during audits and reading.
 */
const SwarmFollower = ({ enabled }: SwarmFollowerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let running = false;
    let opacity = 0;
    let initialized = false;

    // Cache Path2D for fast hardware-accelerated drawing
    const arrowPath = new Path2D(ARROW_SVG_PATH);

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x to prevent 4K canvas allocation choking
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    // Mouse tracking & momentum
    const mouse = { x: width / 2, y: height / 2, active: false, lastActive: 0 };
    const tv = { x: 0, y: 0 };
    let lastMousePos = { x: width / 2, y: height / 2 };
    let lastScrollY = window.scrollY;

    // Spawn agent cursors
    const agents: Agent[] = [];
    for (let i = 0; i < NUM_CURSORS; i++) {
      const fast = Math.random() < 0.25;
      agents.push({
        x: width / 2 + rand(-80, 80),
        y: height / 2 + rand(-80, 80),
        vx: rand(-40, 40),
        vy: rand(-40, 40),
        angle: rand(0, 360),
        color: COLORS[i % COLORS.length],
        speed: fast ? rand(240, 380) : rand(120, 240),
        force: fast ? rand(2500, 4000) : rand(800, 1600),
        spin: fast ? rand(2.0, 3.0) : rand(0.8, 1.8),
        curl: rand(-1, 1),
        orbit: rand(65, 150),
      });
    }

    let lastTime = 0;

    const loop = (time: DOMHighResTimeStamp) => {
      if (!running) return;

      const dt = clamp((time - lastTime) / 1000, 0.001, 0.05);
      lastTime = time;
      const tSec = time / 1000;

      // Sleep loop if mouse has been inactive for > 2.5 seconds
      if (!mouse.active || time - mouse.lastActive > 2500) {
        if (opacity > 0) {
          opacity = Math.max(0, opacity - dt * 2.5);
          if (opacity === 0) {
            ctx.clearRect(0, 0, width, height);
            running = false;
            return; // Pause animation loop completely (0ms CPU)
          }
        } else {
          running = false;
          return;
        }
      } else if (opacity < 1) {
        opacity = Math.min(1, opacity + dt * 4);
      }

      ctx.clearRect(0, 0, width, height);

      const targetX = mouse.x;
      const targetY = mouse.y;

      // Track mouse velocity
      if (mouse.active && dt > 0) {
        const k = Math.min(1, dt * 18);
        tv.x += ((mouse.x - lastMousePos.x) / dt - tv.x) * k;
        tv.y += ((mouse.y - lastMousePos.y) / dt - tv.y) * k;
        lastMousePos = { x: mouse.x, y: mouse.y };
      }

      const R = 120 * (1 + 0.15 * Math.sin(tSec * 0.55));
      const swirl = Math.tanh(Math.cos(tSec * 0.11) * 3);
      const desiredAcc: [number, number][] = [];

      // 1. Swirl & Orbit forces
      for (const agent of agents) {
        const vx = agent.x - targetX;
        const vy = agent.y - targetY;
        const d = Math.hypot(vx, vy) || 0.01;
        const nx = vx / d;
        const ny = vy / d;
        const ang = Math.atan2(vy, vx);
        const off = (agent.orbit - 110) * 0.5;
        const rr = R * (1 + 0.25 * Math.sin(3 * ang + tSec * 0.7)) + off;
        const tang = 280 * (0.7 + agent.spin * 0.2) * swirl;
        const rad = clamp((rr - d) * 4, -2400, 1200);
        const far = Math.min(1, Math.max(0, (d - rr) / 600));

        desiredAcc.push([
          -ny * tang + nx * rad - ny * agent.curl * 350 * far,
          nx * tang + ny * rad + nx * agent.curl * 350 * far,
        ]);
      }

      // 2. Neighbor cohesion & separation
      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        let ax = 0;
        let ay = 0;
        let wsum = 0;

        for (let j = 0; j < agents.length; j++) {
          if (j === i) continue;
          const other = agents[j];
          const d = Math.hypot(other.x - agent.x, other.y - agent.y);
          if (d > 80) continue;
          const w = 1 - d / 80;
          ax += other.vx * w;
          ay += other.vy * w;
          wsum += w;
        }

        let [fx, fy] = desiredAcc[i];
        if (wsum > 0) {
          fx = fx * 0.7 + (ax / wsum) * 0.3;
          fy = fy * 0.7 + (ay / wsum) * 0.3;
        }

        const dist = Math.max(0, Math.hypot(agent.x - targetX, agent.y - targetY) - 160);
        const maxV = agent.speed * (1.3 + Math.min(3.0, dist / 90));
        const L = Math.hypot(fx, fy);
        if (L > maxV) {
          fx *= maxV / L;
          fy *= maxV / L;
        }

        let gx = (fx - agent.vx) * 6;
        let gy = (fy - agent.vy) * 6;
        const maxF = agent.force * (1.4 + Math.min(4, dist / 50));
        const G = Math.hypot(gx, gy);
        if (G > maxF) {
          gx *= maxF / G;
          gy *= maxF / G;
        }

        agent.vx += gx * dt;
        agent.vy += gy * dt;
        agent.x += agent.vx * dt;
        agent.y += agent.vy * dt;
      }

      // 3. Mouse push/repulsion
      if (mouse.active) {
        const R0 = 40;
        for (const agent of agents) {
          const vx = agent.x - mouse.x;
          const vy = agent.y - mouse.y;
          const d = Math.hypot(vx, vy) || 0.01;
          if (d < R0) {
            const nx = vx / d;
            const ny = vy / d;
            agent.x = mouse.x + nx * R0;
            agent.y = mouse.y + ny * R0;
            agent.vx += nx * 220;
            agent.vy += ny * 220;
          }
        }
      }

      // 4. Update angles & Render clean cursor arrows
      ctx.globalAlpha = opacity;

      for (const agent of agents) {
        const targetAngle = (Math.atan2(agent.vy, agent.vx) * 180) / Math.PI + 90;
        let diff = (targetAngle - agent.angle) % 360;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        agent.angle += diff * Math.min(1, dt * 14);

        ctx.save();
        ctx.translate(agent.x, agent.y);
        ctx.rotate((agent.angle * Math.PI) / 180);

        ctx.shadowColor = agent.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = agent.color;
        ctx.fill(arrowPath);

        // Crisp white outline
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.3;
        ctx.lineJoin = 'round';
        ctx.stroke(arrowPath);

        ctx.restore();
      }

      ctx.globalAlpha = 1;

      if (running) {
        animId = requestAnimationFrame(loop);
      }
    };

    const wakeUpLoop = () => {
      if (!initialized) {
        initialized = true;
        handleResize();
      }
      mouse.active = true;
      mouse.lastActive = performance.now();

      if (!running) {
        running = true;
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      wakeUpLoop();
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (Math.abs(scrollDiff) > 1) {
        for (const agent of agents) {
          agent.vy -= scrollDiff * 0.4;
        }
        wakeUpLoop();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9995] w-full h-full"
      style={{ display: 'block', background: 'transparent' }}
    />
  );
};

export default SwarmFollower;
