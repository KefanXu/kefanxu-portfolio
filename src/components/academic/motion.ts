import { useEffect, useRef } from 'react';
import { coarsePointer, reducedMotion } from '../../design/lib/scroll';

/**
 * Pulls a link a few pixels toward the pointer and lets it spring back
 * (transition in src/styles/motion.css via [data-magnetic]). Mouse only.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || coarsePointer() || reducedMotion()) return;
    element.setAttribute('data-magnetic', '');
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = element.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      element.style.transform = `translate3d(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px, 0)`;
    };
    const onLeave = () => { element.style.transform = ''; };
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onLeave);
    return () => {
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
      element.removeAttribute('data-magnetic');
      element.style.transform = '';
    };
  }, [strength]);
  return ref;
}
