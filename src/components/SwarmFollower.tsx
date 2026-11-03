import { useEffect, useRef } from 'react';

// Exact cursor palette from DhvanilPatel/swarm-cursors
const COLORS = [
  '#F24E1E', '#A259FF', '#1ABCFE', '#0ACF83', '#FF7262', '#FFC700',
  '#9747FF', '#E8467C', '#14AE5C', '#0D99FF', '#FF8A00', '#00B5CE',
];

const NAMES = [
  'Ada', 'Linus', 'Grace', 'Alan', 'Margaret', 'Ken', 'Barbara', 'Dennis',
  'Radia', 'Guido', 'Frances', 'Bjarne', 'Hedy', 'Tim', 'Katherine', 'Edsger',
  'Joan', 'Donald', 'Sophie', 'Niklaus', 'Anita', 'Brian', 'Mary', 'Rob',
  'Ida', 'Yukihiro', 'Shafi', 'Leslie', 'Jean', 'Vint', 'Lynn', 'Bram',
];

// Exact SVG path for the multiplayer cursor arrow
const ARROW_SVG_PATH =
  'M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z';

const NUM_CURSORS = 24;

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  color: string;
  name: string;
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
 * SwarmFollower — An ambient multiplayer cursor flocking overlay that
 * follows the mouse and reacts dynamically when the user moves or scrolls.
 * Completely click-through (pointer-events: none) and optimized with HTML5 Canvas.
 */
const SwarmFollower = ({ enabled }: SwarmFollowerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let running = true;
    let opacity = enabled ? 1 : 0;
    const targetOpacity = enabled ? 1 : 0;

    // Cache Path2D for fast hardware-accelerated drawing
    const arrowPath = new Path2D(ARROW_SVG_PATH);

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse tracking & scroll momentum
    const mouse = { x: width / 2, y: height / 2, active: false, lastActive: performance.now() };
    const tv = { x: 0, y: 0 };
    let lastMousePos = { x: width / 2, y: height / 2 };
    let lastScrollY = window.scrollY;

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.lastActive = performance.now();
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // When user scrolls, cursors experience smooth scroll momentum
      if (Math.abs(scrollDiff) > 1) {
        for (const agent of agents) {
          agent.vy -= scrollDiff * 0.45;
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Spawn agent cursors
    const agents: Agent[] = [];
    for (let i = 0; i < NUM_CURSORS; i++) {
      const fast = Math.random() < 0.25;
      agents.push({
        x: width / 2 + rand(-100, 100),
        y: height / 2 + rand(-100, 100),
        vx: rand(-50, 50),
        vy: rand(-50, 50),
        angle: rand(0, 360),
        color: COLORS[i % COLORS.length],
        name: NAMES[i % NAMES.length],
        speed: fast ? rand(260, 420) : rand(120, 260),
        force: fast ? rand(3000, 5000) : rand(800, 1800),
        spin: fast ? rand(2.2, 3.4) : rand(0.8, 1.8),
        curl: rand(-1, 1),
        orbit: rand(65, 160),
      });
    }

    let lastTime = performance.now();

    const loop = (time: DOMHighResTimeStamp) => {
      if (!running) return;

      const dt = clamp((time - lastTime) / 1000, 0.001, 0.05);
      lastTime = time;
      const tSec = time / 1000;

      // Handle smooth fade in / fade out when toggled
      if (enabled && opacity < 1) {
        opacity = Math.min(1, opacity + dt * 3);
      } else if (!enabled && opacity > 0) {
        opacity = Math.max(0, opacity - dt * 3);
      }

      ctx.clearRect(0, 0, width, height);

      if (opacity > 0.01) {
        // Target calculation (mouse position, or ambient figure-8 swirl if mouse idle)
        let targetX = mouse.x;
        let targetY = mouse.y;

        if (!mouse.active || time - mouse.lastActive > 4000) {
          targetX = width * (0.5 + 0.28 * Math.sin(tSec * 0.45));
          targetY = height * (0.5 + 0.22 * Math.sin(tSec * 0.65 + 1));
        }

        // Track mouse velocity
        if (mouse.active && dt > 0) {
          const k = Math.min(1, dt * 18);
          tv.x += ((mouse.x - lastMousePos.x) / dt - tv.x) * k;
          tv.y += ((mouse.y - lastMousePos.y) / dt - tv.y) * k;
          lastMousePos = { x: mouse.x, y: mouse.y };
        }

        const R = 125 * (1 + 0.18 * Math.sin(tSec * 0.55));
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
          const off = (agent.orbit - 120) * 0.55;
          const rr = R * (1 + 0.3 * Math.sin(3 * ang + tSec * 0.7)) + off;
          const tang = 300 * (0.7 + agent.spin * 0.2) * swirl;
          const rad = clamp((rr - d) * 4, -2600, 1400);
          const far = Math.min(1, Math.max(0, (d - rr) / 600));

          desiredAcc.push([
            -ny * tang + nx * rad - ny * agent.curl * 400 * far,
            nx * tang + ny * rad + nx * agent.curl * 400 * far,
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
            if (d > 85) continue;
            const w = 1 - d / 85;
            ax += other.vx * w;
            ay += other.vy * w;
            wsum += w;
          }

          let [fx, fy] = desiredAcc[i];
          if (wsum > 0) {
            fx = fx * 0.7 + (ax / wsum) * 0.3;
            fy = fy * 0.7 + (ay / wsum) * 0.3;
          }

          const dist = Math.max(0, Math.hypot(agent.x - targetX, agent.y - targetY) - 180);
          const maxV = agent.speed * (1.3 + Math.min(3.2, dist / 90));
          const L = Math.hypot(fx, fy);
          if (L > maxV) {
            fx *= maxV / L;
            fy *= maxV / L;
          }

          let gx = (fx - agent.vx) * 6;
          let gy = (fy - agent.vy) * 6;
          const maxF = agent.force * (1.4 + Math.min(5, dist / 50));
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

        // 3. Mouse push/repulsion (touch effect)
        if (mouse.active) {
          const R0 = 42;
          for (const agent of agents) {
            const vx = agent.x - mouse.x;
            const vy = agent.y - mouse.y;
            const d = Math.hypot(vx, vy) || 0.01;
            if (d < R0) {
              const nx = vx / d;
              const ny = vy / d;
              agent.x = mouse.x + nx * R0;
              agent.y = mouse.y + ny * R0;
              agent.vx += nx * 240;
              agent.vy += ny * 240;
            }
          }
        }

        // 4. Update angles & Render cursors
        ctx.globalAlpha = opacity;

        for (const agent of agents) {
          if (Math.hypot(agent.vx, agent.vy) >= 20) {
            const targetAngle = (((Math.atan2(agent.vy, agent.vx) * 180) / Math.PI + 128) % 360 + 360) % 360;
            const dAng = ((((targetAngle - agent.angle + 540) % 360) + 360) % 360) - 180;
            agent.angle += dAng * Math.min(1, dt * 9);
          }

          // Draw Cursor
          ctx.save();
          ctx.translate(agent.x, agent.y);
          ctx.rotate((agent.angle * Math.PI) / 180);

          // Subtle shadow for depth
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 2;

          // Fill cursor arrow
          ctx.fillStyle = agent.color;
          ctx.fill(arrowPath);

          // Crisp white outline
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.4;
          ctx.lineJoin = 'round';
          ctx.stroke(arrowPath);

          ctx.restore();

          // Draw tiny name tag (multiplayer style)
          ctx.save();
          ctx.font = '600 10px system-ui, -apple-system, sans-serif';
          const tagText = agent.name;
          const textMetrics = ctx.measureText(tagText);
          const tagW = textMetrics.width + 8;
          const tagH = 15;
          const tagX = agent.x + 12;
          const tagY = agent.y + 12;

          // Background pill
          ctx.fillStyle = agent.color;
          ctx.beginPath();
          ctx.roundRect(tagX, tagY, tagW, tagH, 4);
          ctx.fill();

          // Name label
          ctx.fillStyle = '#ffffff';
          ctx.fillText(tagText, tagX + 4, tagY + 11);
          ctx.restore();
        }

        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

export default SwarmFollower;
