import { useEffect, useRef, useState } from 'react';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/* A number that counts up from zero the first time it scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [text, setText] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    const element = ref.current;
    if (!element || !match) return;
    const target = Number(match[2]);
    const decimals = (match[2].split('.')[1] ?? '').length;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setText(value); return; }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const t = clamp((now - start) / duration);
        const eased = 1 - Math.pow(2, -10 * t);
        setText(`${match[1]}${(target * (t === 1 ? 1 : eased)).toFixed(decimals)}${match[3]}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(element);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref} aria-label={value}><span aria-hidden="true">{text}</span></span>;
}
