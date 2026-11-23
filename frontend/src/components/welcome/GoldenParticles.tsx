import React, { useEffect, useRef } from 'react';

interface GoldenParticlesProps {
  className?: string;
  count?: number;
  burst?: boolean;
}

export const GoldenParticles: React.FC<GoldenParticlesProps> = ({
  className = '',
  count = 45,
  burst = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      alphaSpeed: number;
      speedY: number;
      speedX: number;
      color: string;
    }

    const goldHues = [
      '#D4AF37', // Royal Gold
      '#F5E6CC', // Champagne
      '#FFF9F0', // Ivory Glow
      '#EBD2A4', // Light Gold
      '#E0BC6C', // Warm Amber
    ];

    const isMobile = width < 768;
    const actualCount = isMobile ? Math.min(count, 18) : count;

    const particles: Particle[] = Array.from({ length: actualCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.7,
      alphaSpeed: (Math.random() - 0.5) * 0.015,
      speedY: -0.3 - Math.random() * 0.8, // Gently float upwards like golden embers
      speedX: (Math.random() - 0.5) * 0.5,
      color: goldHues[Math.floor(Math.random() * goldHues.length)],
    }));

    // If burst requested, create burst particles originating from center
    const burstParticles: Particle[] = burst
      ? Array.from({ length: 35 }, () => {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          return {
            x: width / 2,
            y: height / 2,
            radius: 1.5 + Math.random() * 3,
            alpha: 1,
            alphaSpeed: -0.02 - Math.random() * 0.02,
            speedY: Math.sin(angle) * speed,
            speedX: Math.cos(angle) * speed,
            color: goldHues[Math.floor(Math.random() * goldHues.length)],
          };
        })
      : [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render regular ambient particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += p.alphaSpeed;

        if (p.alpha > 0.9 || p.alpha < 0.2) p.alphaSpeed = -p.alphaSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowColor = '#D4AF37';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      // Render burst particles if any
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.speedX;
        bp.y += bp.speedY;
        bp.speedX *= 0.96;
        bp.speedY *= 0.96;
        bp.alpha += bp.alphaSpeed;

        if (bp.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
        ctx.fillStyle = bp.color;
        ctx.globalAlpha = Math.max(0, bp.alpha);
        ctx.shadowColor = '#FFF9F0';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, burst]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
    />
  );
};

export default GoldenParticles;
