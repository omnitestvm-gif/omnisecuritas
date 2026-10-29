'use client';

import createGlobe, { type COBEOptions, type Globe as CobeInstance } from 'cobe';
import { useEffect, useRef, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

// Globe-only configuration from the supplied component. The surrounding demo is not mounted.
export const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

interface GlobeProps {
  className?: string;
  config?: COBEOptions;
}

export function Globe({ className, config = GLOBE_CONFIG }: GlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ pointerId: number; startX: number; startOffset: number } | null>(null);
  const rotation = useRef({ phi: config.phi, offset: 0 });
  const drawNow = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    const visual = host?.closest('.hero-visual');
    if (!canvas || !host || !visual) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let globe: CobeInstance | undefined;
    let frame = 0;
    let lastTime = 0;
    let visible = true;
    let contextLost = false;
    let textureTimer = 0;
    const contextOptions: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    };

    const draw = () => {
      if (!contextLost) globe?.update({ phi: rotation.current.phi + rotation.current.offset });
    };
    drawNow.current = draw;

    const tick = (time: number) => {
      frame = 0;
      if (!visible || document.hidden || preference.matches || contextLost) return;
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      // Same rotation as 0.005 radians per frame at 60fps, without refresh-rate dependence.
      if (!drag.current) rotation.current.phi += delta * 0.3;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const synchronize = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      const active = visible && !document.hidden && !preference.matches && !contextLost;
      host.dataset.animationState = contextLost
        ? 'fallback'
        : preference.matches
          ? 'reduced'
          : active
            ? 'running'
            : 'paused';
      if (active) frame = requestAnimationFrame(tick);
      else draw();
    };

    const resize = () => {
      const width = Math.round(host.getBoundingClientRect().width);
      if (width > 0 && !contextLost)
        globe?.update({
          width,
          height: width,
          phi: rotation.current.phi + rotation.current.offset,
        });
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      visual.classList.remove('ready');
      synchronize();
    };

    let resizeObserver: ResizeObserver | undefined;
    let visibilityObserver: IntersectionObserver | undefined;
    try {
      const context =
        canvas.getContext('webgl2', contextOptions) || canvas.getContext('webgl', contextOptions);
      if (!context) throw new Error('WebGL unavailable');
      const width = Math.max(1, Math.round(host.getBoundingClientRect().width));
      globe = createGlobe(canvas, {
        ...config,
        width,
        height: width,
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, config.devicePixelRatio),
        context: contextOptions,
      });
      draw();
      visual.classList.add('ready');
      // COBE embeds its map texture; redraw after decoding even for a static reduced-motion view.
      textureTimer = window.setTimeout(draw, 120);
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          synchronize();
        },
        { threshold: 0 },
      );
      visibilityObserver.observe(visual);
      preference.addEventListener('change', synchronize);
      document.addEventListener('visibilitychange', synchronize);
      canvas.addEventListener('webglcontextlost', handleContextLost);
      synchronize();
    } catch {
      contextLost = true;
      visual.classList.remove('ready');
      host.dataset.animationState = 'fallback';
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(textureTimer);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      preference.removeEventListener('change', synchronize);
      document.removeEventListener('visibilitychange', synchronize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      globe?.destroy();
      drawNow.current = null;
      visual.classList.remove('ready');
      // COBE v2 adds a wrapper for bindable markers; restore React's original canvas parent.
      const wrapper = canvas.parentElement;
      if (wrapper && wrapper !== host && wrapper.parentElement === host) {
        host.append(canvas);
        wrapper.remove();
      }
    };
  }, [config]);

  const pointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: rotation.current.offset,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.cursor = 'grabbing';
  };
  const pointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current || event.pointerId !== drag.current.pointerId) return;
    rotation.current.offset =
      drag.current.startOffset + (event.clientX - drag.current.startX) / 200;
    drawNow.current?.();
  };
  const pointerEnd = (event: PointerEvent<HTMLCanvasElement>) => {
    drag.current = null;
    event.currentTarget.style.cursor = 'grab';
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div ref={hostRef} className={cn('cobe-globe', className)}>
      <canvas
        id="security-globe"
        ref={canvasRef}
        width={800}
        height={800}
        aria-hidden="true"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onLostPointerCapture={pointerEnd}
      />
    </div>
  );
}

export default Globe;
