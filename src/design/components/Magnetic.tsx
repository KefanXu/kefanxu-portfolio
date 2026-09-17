import { useEffect, useRef, type ReactNode } from 'react';
import { coarsePointer, reducedMotion } from '../lib/scroll';

/** Pulls its child a few pixels toward the pointer; springs back on leave. */
export function Magnetic({ children, strength = 0.28, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || coarsePointer() || reducedMotion()) return;
    const onMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      element.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };
    const onLeave = () => { element.style.transform = ''; };
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onLeave);
    return () => {
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return <span ref={ref} className={`magnetic ${className}`.trim()}>{children}</span>;
}
