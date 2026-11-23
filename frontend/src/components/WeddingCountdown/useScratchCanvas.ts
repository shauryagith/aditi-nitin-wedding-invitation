import { useRef, useEffect, useState, useCallback } from 'react';
import { COUNTDOWN_CONFIG } from './countdown.config';

interface UseScratchCanvasOptions {
  isRevealed: boolean;
  brushRadius?: number;
  autoRevealThreshold?: number;
  onProgressUpdate?: (percent: number) => void;
  onRevealComplete?: () => void;
  onStartScratching?: () => void;
  onStopScratching?: () => void;
}

export const useScratchCanvas = ({
  isRevealed,
  brushRadius = COUNTDOWN_CONFIG.brush.defaultRadius,
  autoRevealThreshold = COUNTDOWN_CONFIG.thresholds.autoReveal,
  onProgressUpdate,
  onRevealComplete,
  onStartScratching,
  onStopScratching,
}: UseScratchCanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastCheckTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const [percentScratched, setPercentScratched] = useState(0);
  const isRevealedRef = useRef(isRevealed);
  isRevealedRef.current = isRevealed;

  /**
   * Draw the opulent royal Indian Hindu golden scratch card layer
   */
  const drawGoldenSurface = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const width = canvas.width;
    const height = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    // Reset composite operation to default
    ctx.globalCompositeOperation = 'source-over';

    // 1. Rich metallic gold background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#B38728');
    gradient.addColorStop(0.18, '#FBF5B7');
    gradient.addColorStop(0.38, '#DAA520');
    gradient.addColorStop(0.55, '#AA771C');
    gradient.addColorStop(0.75, '#FCF6BA');
    gradient.addColorStop(1, '#996515');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle radial luster in the center
    const radial = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.05,
      width / 2,
      height / 2,
      width * 0.6
    );
    radial.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    radial.addColorStop(0.5, 'rgba(218, 165, 32, 0.2)');
    radial.addColorStop(1, 'rgba(110, 60, 10, 0.35)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // 3. Ornate Double Golden Border
    const pad = 12 * dpr;
    ctx.strokeStyle = '#581C2B'; // Deep maroon contrasting border
    ctx.lineWidth = 3 * dpr;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1 * dpr;
    ctx.strokeRect(pad + 4 * dpr, pad + 4 * dpr, width - (pad + 4 * dpr) * 2, height - (pad + 4 * dpr) * 2);

    // 4. Subtle Central Mandala watermark pattern
    const cx = width / 2;
    const cy = height / 2;
    const mandalaRadius = Math.min(width, height) * 0.36;

    ctx.save();
    ctx.strokeStyle = 'rgba(88, 28, 43, 0.22)';
    ctx.lineWidth = 1.5 * dpr;

    // Outer concentric circles
    ctx.beginPath();
    ctx.arc(cx, cy, mandalaRadius, 0, Math.PI * 2);
    ctx.arc(cx, cy, mandalaRadius * 0.7, 0, Math.PI * 2);
    ctx.arc(cx, cy, mandalaRadius * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    // 16 Petals / Rays
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      const x1 = cx + Math.cos(angle) * (mandalaRadius * 0.4);
      const y1 = cy + Math.sin(angle) * (mandalaRadius * 0.4);
      const x2 = cx + Math.cos(angle) * mandalaRadius;
      const y2 = cy + Math.sin(angle) * mandalaRadius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    // 5. Traditional Indian Typography & Auspicious Invocations
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sanskrit Invocation
    ctx.fillStyle = '#4A0A1C'; // Deep Royal Burgundy
    ctx.font = `bold ${Math.max(12, Math.floor(13 * dpr))}px 'Noto Sans Devanagari', 'Rozha One', serif`;
    ctx.fillText('|| श्री गणेशाय नमः ||', cx, cy - 80 * dpr);

    // Couple Names
    ctx.fillStyle = '#2A040E';
    ctx.font = `bold ${Math.max(22, Math.floor(28 * dpr))}px 'Great Vibes', 'Cinzel', cursive, serif`;
    ctx.fillText('Aditi & Nitin', cx, cy - 40 * dpr);

    // Subtitle
    ctx.fillStyle = '#581C2B';
    ctx.font = `600 ${Math.max(10, Math.floor(12 * dpr))}px 'Cormorant Garamond', serif`;
    ctx.fillText('A Special Celebration Awaits You', cx, cy - 10 * dpr);

    // Date
    ctx.fillStyle = '#2A040E';
    ctx.font = `bold ${Math.max(13, Math.floor(15 * dpr))}px 'Cinzel', serif`;
    ctx.fillText('11 December 2026', cx, cy + 18 * dpr);

    // Decorative Separator Line
    ctx.strokeStyle = '#581C2B';
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    ctx.moveTo(cx - 50 * dpr, cy + 34 * dpr);
    ctx.lineTo(cx + 50 * dpr, cy + 34 * dpr);
    ctx.stroke();

    // Call to action badge
    const badgeW = 190 * dpr;
    const badgeH = 34 * dpr;
    const badgeY = cy + 62 * dpr;

    ctx.fillStyle = 'rgba(74, 10, 28, 0.9)'; // Rich maroon badge
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(cx - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 17 * dpr)
      : ctx.rect(cx - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH);
    ctx.fill();

    ctx.strokeStyle = '#FBF5B7';
    ctx.lineWidth = 1.5 * dpr;
    ctx.stroke();

    ctx.fillStyle = '#FFF9E6';
    ctx.font = `bold ${Math.max(10, Math.floor(11 * dpr))}px 'Cinzel', sans-serif`;
    ctx.letterSpacing = '1px';
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', cx, badgeY);

    ctx.restore();
  }, []);

  /**
   * Initialize and size the canvas with High-DPI support
   */
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set display size (css pixels)
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Set actual render resolution
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (!isRevealedRef.current) {
      drawGoldenSurface(canvas, ctx);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [drawGoldenSurface]);

  /**
   * Fast, throttled pixel sampling to calculate scratch percentage
   * Subsamples every Nth pixel for 64x faster reads without blocking UI
   */
  const calculateProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    const stride = COUNTDOWN_CONFIG.performance.sampleStride;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let transparentPixels = 0;
    let totalSampled = 0;

    for (let y = 0; y < height; y += stride) {
      for (let x = 0; x < width; x += stride) {
        const index = (y * width + x) * 4;
        // In destination-out, erased portions have alpha = 0 (or < 128)
        if (data[index + 3] < 128) {
          transparentPixels++;
        }
        totalSampled++;
      }
    }

    if (totalSampled === 0) return;

    const currentPercent = Math.min(100, Math.round((transparentPixels / totalSampled) * 100));
    setPercentScratched(currentPercent);

    if (onProgressUpdate) {
      onProgressUpdate(currentPercent);
    }

    // Auto-reveal if threshold reached
    if (currentPercent >= autoRevealThreshold && !isRevealedRef.current) {
      isRevealedRef.current = true;
      if (onRevealComplete) {
        onRevealComplete();
      }
    }
  }, [autoRevealThreshold, onProgressUpdate, onRevealComplete]);

  /**
   * Scratch stroke execution at pointer coordinate
   */
  const scratchStroke = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealedRef.current) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const radius = brushRadius * dpr;

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = radius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (lastPointRef.current) {
        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.fill();
      }

      ctx.restore();
      lastPointRef.current = { x, y };

      // Throttle scratch percentage calculation
      const now = performance.now();
      if (now - lastCheckTimeRef.current > COUNTDOWN_CONFIG.performance.progressThrottleMs) {
        lastCheckTimeRef.current = now;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(calculateProgress);
      }
    },
    [brushRadius, calculateProgress]
  );

  /**
   * Pointer event coordinates helper
   */
  const getCanvasCoords = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    };
  }, []);

  /**
   * Pointer Handlers (unified mouse, touch, and stylus)
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isRevealedRef.current) return;
      isDrawingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);

      if (onStartScratching) onStartScratching();

      const coords = getCanvasCoords(e);
      lastPointRef.current = coords;
      scratchStroke(coords.x, coords.y);
    },
    [getCanvasCoords, onStartScratching, scratchStroke]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current || isRevealedRef.current) return;
      const coords = getCanvasCoords(e);
      scratchStroke(coords.x, coords.y);
    },
    [getCanvasCoords, scratchStroke]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      lastPointRef.current = null;

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignored
      }

      if (onStopScratching) onStopScratching();

      // Trigger one final check
      calculateProgress();
    },
    [calculateProgress, onStopScratching]
  );

  /**
   * Programmatic reveal all (e.g. Reveal Now button)
   */
  const revealAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isRevealedRef.current = true;
    setPercentScratched(100);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (onProgressUpdate) onProgressUpdate(100);
    if (onRevealComplete) onRevealComplete();
  }, [onProgressUpdate, onRevealComplete]);

  /**
   * Reset the scratch card back to unscratched state
   */
  const resetScratch = useCallback(() => {
    isRevealedRef.current = false;
    setPercentScratched(0);
    lastPointRef.current = null;
    initCanvas();
  }, [initCanvas]);

  // Window resize observer
  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [initCanvas]);

  return {
    canvasRef,
    percentScratched,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    revealAll,
    resetScratch,
  };
};
