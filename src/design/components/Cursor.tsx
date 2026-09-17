import { useEffect, useRef } from 'react';
import { coarsePointer, reducedMotion } from '../lib/scroll';

/*
 * A label that trails the pointer over elements marked `data-cursor="…"`
 * (for example "View case"). The native cursor stays visible; this is an
 * augmentation, and it is skipped on touch devices and with reduced motion.
 */
export function Cursor() {
  const bubble = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (coarsePointer() || reducedMotion()) return;
    const element = bubble.current!;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let active = false;

    const tick = () => {
      x += (tx - x) * 0.17;
      y += (ty - y) * 0.17;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 || active ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      const host = (event.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      const next = Boolean(host);
      if (next !== active) {
        active = next;
        element.classList.toggle('is-on', active);
      }
      if (host && label.current) label.current.textContent = host.dataset.cursor ?? '';
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => { active = false; element.classList.remove('is-on'); };
    const onDown = () => element.classList.add('is-down');
    const onUp = () => element.classList.remove('is-down');

    // A click usually navigates; the label returns on the next pointer move.
    window.addEventListener('click', onLeave, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('click', onLeave);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    <div ref={bubble} className="cursor" aria-hidden="true">
      <div className="cursor__bubble"><span ref={label} /></div>
    </div>
  );
}
