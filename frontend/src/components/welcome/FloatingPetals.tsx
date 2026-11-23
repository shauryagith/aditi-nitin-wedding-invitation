import React, { useEffect, useRef } from 'react';

interface FloatingPetalsProps {
  className?: string;
  count?: number;
  sweep?: boolean; // When true, accelerates petals across the screen for cinematic transitions
}

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({
  className = '',
  count = 28,
  sweep = false,
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

    const petalPalettes = [
      'rgba(234, 179, 8, 0.75)',   // Bright Marigold Gold
      'rgba(245, 158, 11, 0.8)',   // Saffron Orange
      'rgba(180, 24, 54, 0.75)',   // Deep Crimson Rose
      'rgba(128, 0, 32, 0.8)',     // Royal Burgundy Rose
      'rgba(212, 175, 55, 0.65)',  // Gilded Petal
    ];

    interface Petal {
      x: number;
      y: number;
      radiusX: number;
      radiusY: number;
      rotation: number;
      rotationSpeed: number;
      speedY: number;
      speedX: number;
      color: string;
      wobble: number;
      wobbleSpeed: number;
    }

    const isMobile = width < 768;
    const actualCount = isMobile ? Math.min(count, 14) : count;

    const petals: Petal[] = Array.from({ length: actualCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radiusX: 5 + Math.random() * 7,
      radiusY: 8 + Math.random() * 10,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      speedY: 0.8 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.8,
      color: petalPalettes[Math.floor(Math.random() * petalPalettes.length)],
      wobble: Math.random() * Math.PI,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        const currentSpeedX = sweep ? p.speedX + 4.5 : p.speedX + Math.sin(p.wobble) * 0.8;
        const currentSpeedY = sweep ? p.speedY + 3.2 : p.speedY;

        p.x += currentSpeedX;
        p.y += currentSpeedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x > width + 30) p.x = -30;
        if (p.x < -30) p.x = width + 30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw natural teardrop petal shape
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.moveTo(0, -p.radiusY);
        ctx.bezierCurveTo(p.radiusX, -p.radiusY * 0.5, p.radiusX, p.radiusY * 0.6, 0, p.radiusY);
        ctx.bezierCurveTo(-p.radiusX, p.radiusY * 0.6, -p.radiusX, -p.radiusY * 0.5, 0, -p.radiusY);
        ctx.fill();

        // Subtle petal vein
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 249, 240, 0.25)';
        ctx.lineWidth = 0.8;
        ctx.moveTo(0, -p.radiusY * 0.7);
        ctx.lineTo(0, p.radiusY * 0.7);
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, sweep]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-15 ${className}`}
    />
  );
};

export default FloatingPetals;
