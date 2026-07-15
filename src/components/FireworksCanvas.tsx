/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: { x: number; y: number }[];
}

export default function FireworksCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    const colors = [
      '#ff2a5f', // pink-red
      '#ffd000', // gold
      '#05c1ff', // sky blue
      '#26ff5c', // bright green
      '#e040fb', // purple
      '#ff8f00', // orange
      '#ffffff', // silver
    ];

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    const createExplosion = (x: number, y: number, color: string) => {
      const particleCount = 80 + Math.floor(Math.random() * 40);
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1.0,
          size: Math.random() * 2.5 + 1,
          decay: Math.random() * 0.015 + 0.012,
        });
      }
    };

    const spawnRocket = () => {
      const startX = Math.random() * (width * 0.8) + width * 0.1;
      const startY = height;
      const targetY = Math.random() * (height * 0.5) + height * 0.1;
      const angle = -Math.PI / 2 + (Math.random() * 0.2 - 0.1);
      const speed = Math.random() * 4 + 8;
      const color = colors[Math.floor(Math.random() * colors.length)];

      rockets.push({
        x: startX,
        y: startY,
        targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        trail: [],
      });
    };

    // Spawn initial rocket
    spawnRocket();

    // Spawn timer
    let spawnTimer = 0;
    const spawnInterval = 120; // frames between auto rockets (approx 2s)

    // Interaction click to spawn firework
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Spawn rocket target at clicked coordinates
      const startX = Math.random() * (width * 0.8) + width * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Calculate speed and angle to hit clicked spot
      const dy = clickY - height;
      const dx = clickX - startX;
      const travelTime = 40; // frames
      
      rockets.push({
        x: startX,
        y: height,
        targetY: clickY,
        vx: dx / travelTime,
        vy: dy / travelTime,
        color,
        trail: [],
      });
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Animation Loop
    let animationFrameId: number;
    const gravity = 0.06;

    const animate = () => {
      // Clear with slight trailing effect for glowing particles
      ctx.fillStyle = 'rgba(11, 15, 25, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // 1. Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        
        // Add current spot to trail
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 8) {
          rocket.trail.shift();
        }

        // Draw trail
        ctx.beginPath();
        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = 2.5;
        if (rocket.trail.length > 1) {
          ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y);
          for (let t = 1; t < rocket.trail.length; t++) {
            ctx.lineTo(rocket.trail[t].x, rocket.trail[t].y);
          }
          ctx.stroke();
        }

        // Check if rocket reached peak
        if (rocket.vy >= 0 || rocket.y <= rocket.targetY) {
          createExplosion(rocket.x, rocket.y, rocket.color);
          rockets.splice(i, 1);
        }
      }

      // 2. Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity; // Gravity pull
        p.vx *= 0.98; // Friction
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
        ctx.globalAlpha = 1.0; // reset alpha
      }

      // 3. Auto spawn rockets
      spawnTimer++;
      if (spawnTimer >= spawnInterval) {
        spawnRocket();
        spawnTimer = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-auto">
      <canvas
        ref={canvasRef}
        id="fireworks-canvas"
        className="block w-full h-full cursor-crosshair"
        title="Klik di mana saja untuk menyalakan kembang api!"
      />
    </div>
  );
}
