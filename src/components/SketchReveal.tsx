import React, { useRef, useState, useEffect, useContext, createContext, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';

type Phase = 'idle' | 'drawing' | 'revealing' | 'done';

type SketchSceneValue = { armed: boolean };

const SketchSceneContext = createContext<SketchSceneValue | null>(null);

export const SketchScene: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <SketchSceneContext.Provider value={{ armed: inView }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </SketchSceneContext.Provider>
  );
};

export function useSketchSceneArmed(): boolean {
  const scene = useContext(SketchSceneContext);
  return scene?.armed ?? false;
}

/* ─────────────────────────────────────────────
 * Single-element outline → content reveal
 * ───────────────────────────────────────────── */

interface SketchRevealProps {
  children: React.ReactNode;
  delay?: number;
  radius?: string;
  className?: string;
  duration?: number;
  shape?: 'rect' | 'circle';
  contentMode?: 'hide' | 'passthrough';
  strokeOpacity?: number;
  strokeWidth?: number;
  /** Pause after outline finishes before content fades in */
  revealHold?: number;
  /** Duration of the content fade-in */
  revealDuration?: number;
}

export const SketchReveal: React.FC<SketchRevealProps> = ({
  children,
  delay = 0,
  radius = '8px',
  className = '',
  duration = 0.4,
  shape = 'rect',
  contentMode = 'hide',
  strokeOpacity = 0.34,
  strokeWidth = 1.2,
  revealHold = 0.12,
  revealDuration = 0.85,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [size, setSize] = useState({ width: 0, height: 0 });

  const scene = useContext(SketchSceneContext);
  const localInView = useInView(containerRef, { once: true, margin: '-40px' });
  const armed = scene ? scene.armed : localInView;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setSize({ width: rect.width, height: rect.height });
    }
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!armed || phase !== 'idle' || size.width === 0) return;
    const t = setTimeout(() => setPhase('drawing'), delay * 1000);
    return () => clearTimeout(t);
  }, [armed, phase, delay, size.width]);

  useEffect(() => {
    if (phase !== 'drawing') return;
    const t = setTimeout(
      () => setPhase('revealing'),
      (duration + revealHold) * 1000,
    );
    return () => clearTimeout(t);
  }, [phase, duration, revealHold]);

  useEffect(() => {
    if (phase !== 'revealing') return;
    const t = setTimeout(() => setPhase('done'), revealDuration * 1000 + 80);
    return () => clearTimeout(t);
  }, [phase, revealDuration]);

  const { width, height } = size;
  const parsedRadius = parseFloat(radius) || 8;
  const r =
    shape === 'circle'
      ? Math.min(width, height) / 2
      : Math.min(parsedRadius, width / 2, height / 2);

  const wBody = Math.max(0, width - 2 * r);
  const hBody = Math.max(0, height - 2 * r);
  const perimeter =
    shape === 'circle'
      ? 2 * Math.PI * r
      : 2 * (wBody + hBody) + 2 * Math.PI * r;

  const showOutline = phase !== 'done' && width > 0 && height > 0;
  const contentVisible = phase === 'revealing' || phase === 'done';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {showOutline && (
        <svg
          className="absolute inset-0 pointer-events-none z-20 overflow-visible text-text-light dark:text-text-dark"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
        >
          {shape === 'circle' ? (
            <motion.circle
              cx={width / 2}
              cy={height / 2}
              r={Math.max(0, r - 1)}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={perimeter}
              initial={{ strokeDashoffset: perimeter, opacity: 0 }}
              animate={{
                strokeDashoffset: phase === 'drawing' || phase === 'revealing' ? 0 : perimeter,
                opacity: phase === 'drawing' ? strokeOpacity : 0,
              }}
              transition={{
                strokeDashoffset: {
                  duration: phase === 'drawing' ? duration : 0.3,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              }}
            />
          ) : (
            <motion.rect
              x={1}
              y={1}
              width={Math.max(0, width - 2)}
              height={Math.max(0, height - 2)}
              rx={r}
              ry={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={perimeter}
              initial={{ strokeDashoffset: perimeter, opacity: 0 }}
              animate={{
                strokeDashoffset: phase === 'drawing' || phase === 'revealing' ? 0 : perimeter,
                opacity: phase === 'drawing' ? strokeOpacity : 0,
              }}
              transition={{
                strokeDashoffset: {
                  duration: phase === 'drawing' ? duration : 0.45,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              }}
            />
          )}
        </svg>
      )}

      {contentMode === 'passthrough' ? (
        children
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ duration: revealDuration, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
 * Multi-path wireframe overlay (for complex parts)
 * ───────────────────────────────────────────── */

export type WireRect = {
  kind: 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  delay: number;
  duration?: number;
};

export type WireCircle = {
  kind: 'circle';
  cx: number;
  cy: number;
  r: number;
  delay: number;
  duration?: number;
};

export type WireLine = {
  kind: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  duration?: number;
};

export type WireShape = WireRect | WireCircle | WireLine;

function shapeLength(s: WireShape): number {
  if (s.kind === 'circle') return 2 * Math.PI * s.r;
  if (s.kind === 'line') {
    return Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
  }
  const rx = s.rx ?? 0;
  const r = Math.min(rx, s.w / 2, s.h / 2);
  return 2 * (Math.max(0, s.w - 2 * r) + Math.max(0, s.h - 2 * r)) + 2 * Math.PI * r;
}

/**
 * Draws a sequence of SVG shapes as a wireframe, then calls onComplete.
 * Parent keeps real content hidden until then, and can fade this overlay out.
 */
export const WireframeOverlay: React.FC<{
  width: number;
  height: number;
  shapes: WireShape[];
  /** Extra delay after scene arms before first shape */
  baseDelay?: number;
  onComplete?: () => void;
  strokeOpacity?: number;
  strokeWidth?: number;
  /** Softly dissolve the whole wireframe (for crossfade into real content) */
  fadingOut?: boolean;
}> = ({
  width,
  height,
  shapes,
  baseDelay = 0,
  onComplete,
  strokeOpacity = 0.36,
  strokeWidth = 1.15,
  fadingOut = false,
}) => {
  const scene = useContext(SketchSceneContext);
  const armed = scene?.armed ?? true;
  const [started, setStarted] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!armed || width === 0) return;
    const t = setTimeout(() => setStarted(true), baseDelay * 1000);
    return () => clearTimeout(t);
  }, [armed, baseDelay, width]);

  // Complete after last shape finishes
  useEffect(() => {
    if (!started || shapes.length === 0) return;
    const lastEnd = Math.max(
      ...shapes.map((s) => s.delay + (s.duration ?? 0.35)),
    );
    const t = setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete?.();
    }, (lastEnd + 0.2) * 1000);
    return () => clearTimeout(t);
  }, [started, shapes, onComplete]);

  if (width <= 0 || height <= 0) return null;

  return (
    <motion.svg
      className="absolute inset-0 pointer-events-none z-30 overflow-visible text-text-light dark:text-text-dark"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: fadingOut ? 0 : 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {shapes.map((s, i) => {
        const len = shapeLength(s);
        const dur = s.duration ?? 0.35;
        const common = {
          fill: 'none' as const,
          stroke: 'currentColor',
          strokeWidth,
          strokeLinecap: 'round' as const,
          strokeDasharray: len,
        };

        if (s.kind === 'rect') {
          return (
            <motion.rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx={s.rx ?? 0}
              ry={s.rx ?? 0}
              {...common}
              initial={{ strokeDashoffset: len, opacity: 0 }}
              animate={
                started
                  ? { strokeDashoffset: 0, opacity: strokeOpacity }
                  : { strokeDashoffset: len, opacity: 0 }
              }
              transition={{
                strokeDashoffset: {
                  delay: s.delay,
                  duration: dur,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { delay: s.delay, duration: 0.2 },
              }}
            />
          );
        }

        if (s.kind === 'circle') {
          return (
            <motion.circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              {...common}
              initial={{ strokeDashoffset: len, opacity: 0 }}
              animate={
                started
                  ? { strokeDashoffset: 0, opacity: strokeOpacity }
                  : { strokeDashoffset: len, opacity: 0 }
              }
              transition={{
                strokeDashoffset: {
                  delay: s.delay,
                  duration: dur,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { delay: s.delay, duration: 0.2 },
              }}
            />
          );
        }

        return (
          <motion.line
            key={i}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            {...common}
            initial={{ strokeDashoffset: len, opacity: 0 }}
            animate={
              started
                ? { strokeDashoffset: 0, opacity: strokeOpacity }
                : { strokeDashoffset: len, opacity: 0 }
            }
            transition={{
              strokeDashoffset: {
                delay: s.delay,
                duration: dur,
                ease: [0.16, 1, 0.3, 1],
              },
              opacity: { delay: s.delay, duration: 0.2 },
            }}
          />
        );
      })}
    </motion.svg>
  );
};

/**
 * Wraps real content: keeps it invisible while a detailed wireframe draws,
 * then crossfades to the real component.
 * Children may be a render prop that receives whether the shell has revealed.
 */
export const SketchThenShow: React.FC<{
  children: React.ReactNode | ((revealed: boolean) => React.ReactNode);
  shapes?: WireShape[];
  /** Build shapes from measured size (preferred for responsive layouts) */
  getShapes?: (width: number, height: number) => WireShape[];
  baseDelay?: number;
  className?: string;
  /** Soft fade duration when real content appears */
  revealDuration?: number;
}> = ({
  children,
  shapes,
  getShapes,
  baseDelay = 0,
  className = '',
  revealDuration = 0.95,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [revealed, setRevealed] = useState(false);
  const [wireDone, setWireDone] = useState(false);
  const [showWire, setShowWire] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) setSize({ width: rect.width, height: rect.height });
    return () => ro.disconnect();
  }, []);

  // Brief breath after sketch finishes, then start the soft crossfade
  useEffect(() => {
    if (!wireDone) return;
    const t = setTimeout(() => setRevealed(true), 180);
    return () => clearTimeout(t);
  }, [wireDone]);

  // Keep wireframe mounted while it dissolves, then remove
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setShowWire(false), revealDuration * 1000 + 50);
    return () => clearTimeout(t);
  }, [revealed, revealDuration]);

  const resolvedShapes = useMemo(
    () =>
      size.width > 0
        ? getShapes
          ? getShapes(size.width, size.height)
          : shapes ?? []
        : [],
    [size.width, size.height, getShapes, shapes],
  );

  const content = typeof children === 'function' ? children(revealed) : children;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: revealDuration, ease: [0.22, 1, 0.36, 1] }}
      >
        {content}
      </motion.div>

      {showWire && size.width > 0 && resolvedShapes.length > 0 && (
        <WireframeOverlay
          width={size.width}
          height={size.height}
          shapes={resolvedShapes}
          baseDelay={baseDelay}
          fadingOut={revealed}
          onComplete={() => setWireDone(true)}
        />
      )}
    </div>
  );
};
