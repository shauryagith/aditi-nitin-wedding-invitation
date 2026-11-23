import React, { useEffect, useRef } from 'react';

export const GaneshaEmblem: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 64 }) => (
  <div
    className={`inline-flex items-center justify-center relative rounded-full p-0.5 bg-gradient-to-tr from-gold-600 via-royalGold to-gold-200 shadow-[0_0_15px_rgba(212,175,55,0.4)] ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="w-full h-full rounded-full overflow-hidden bg-deepBurgundy border border-royalGold/80 flex items-center justify-center">
      <picture>
        <source srcSet="/assets/wedding/decorations/lord-ganesha-gold-round.webp" type="image/webp" />
        <img
          src="/assets/wedding/decorations/lord-ganesha-gold-round.png"
          alt="Bhagwan Shree Ganesha"
          width={size}
          height={size}
          loading="lazy"
          className="w-full h-full object-cover object-center drop-shadow-sm"
        />
      </picture>
    </div>
  </div>
);

export const DiyaMotif: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
    {/* Animated Flickering Flame */}
    <div className="relative flex items-center justify-center -mb-1 z-10">
      <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 blur-[0.5px] animate-pulse shadow-[0_0_16px_#f59e0b]" />
      <div className="absolute w-2 h-4 rounded-full bg-white opacity-80 animate-ping" style={{ animationDuration: '2.5s' }} />
    </div>

    {/* Diya Base (Golden Brass Clay Lamp) */}
    <svg width={size} height={size * 0.55} viewBox="0 0 60 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 14 C12 28 48 28 54 14 C56 10 50 8 30 8 C10 8 4 10 6 14 Z"
        fill="url(#diyaGold)"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />
      <ellipse cx="30" cy="11" rx="22" ry="4" fill="#581C2B" opacity="0.5" />
      <path d="M12 26 C20 31 40 31 48 26" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="diyaGold" x1="6" y1="8" x2="54" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5E6CC" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#94751D" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const OrnamentalDivider: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#D4AF37',
}) => (
  <div className={`flex items-center justify-center my-6 gap-3 ${className}`}>
    <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-r from-transparent to-[#D4AF37]" />
    <svg width="40" height="22" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 10 C14 2 8 8 2 10 C8 12 14 18 18 10 Z"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M18 10 C22 2 28 8 34 10 C28 12 22 18 18 10 Z"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="18" cy="10" r="2.5" fill={color} />
      <circle cx="6" cy="10" r="1.2" fill={color} />
      <circle cx="30" cy="10" r="1.2" fill={color} />
    </svg>
    <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-l from-transparent to-[#D4AF37]" />
  </div>
);

export const CornerFlourish: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({
  position,
}) => {
  const getStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-2.5 left-2.5';
      case 'top-right':
        return 'top-2.5 right-2.5 rotate-90';
      case 'bottom-right':
        return 'bottom-2.5 right-2.5 rotate-180';
      case 'bottom-left':
        return 'bottom-2.5 left-2.5 -rotate-90';
    }
  };

  return (
    <div className={`absolute pointer-events-none ${getStyles()}`}>
      <svg width="32" height="32" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2 L2 22 C2 12 12 2 22 2 Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        <path d="M5 5 L5 15 C5 9 9 5 15 5 Z" fill="#D4AF37" opacity="0.3" />
        <circle cx="3" cy="3" r="2" fill="#D4AF37" />
        <circle cx="21" cy="3" r="1.2" fill="#D4AF37" />
        <circle cx="3" cy="21" r="1.2" fill="#D4AF37" />
      </svg>
    </div>
  );
};

export const KalashMotif: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Coconut and Mango Leaves */}
    <circle cx="32" cy="16" r="8" fill="#D4AF37" opacity="0.8" />
    <path d="M22 22 C22 14 30 12 32 18 C34 12 42 14 42 22 Z" fill="#800020" />
    {/* Pot (Kalash) */}
    <path
      d="M24 22 L40 22 C42 22 46 26 46 36 C46 48 38 52 32 52 C26 52 18 48 18 36 C18 26 22 22 24 22 Z"
      stroke="#D4AF37"
      strokeWidth="2"
      fill="#FFF9F0"
    />
    <path d="M30 32 L34 32 M32 30 L32 34" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
    <rect x="22" y="52" width="20" height="4" rx="2" fill="#D4AF37" />
  </svg>
);

/**
 * Floating Marigold & Rose Petals Canvas Simulation
 */
export const FloatingPetalsOverlay: React.FC<{ className?: string }> = ({ className = '' }) => {
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

    const petalColors = [
      'rgba(212, 175, 55, 0.45)', // Gold particle
      'rgba(245, 158, 11, 0.4)',  // Marigold amber
      'rgba(234, 179, 8, 0.4)',   // Bright yellow
      'rgba(183, 110, 121, 0.35)', // Rose gold / soft pink
      'rgba(128, 0, 32, 0.3)',    // Royal burgundy petal
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
    }

    const isMobile = width < 768;
    const count = isMobile ? 14 : 30;

    const petals: Petal[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radiusX: 4 + Math.random() * 6,
      radiusY: 6 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      speedY: 0.6 + Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.6,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      wobble: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.wobble += 0.02;
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.ellipse(0, 0, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
    />
  );
};
