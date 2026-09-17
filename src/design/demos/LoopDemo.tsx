import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './demos.css';

/* Planneregy's weekly loop as a ring that plays through one iteration. */
const STEPS = [
  { key: 'plan', day: 'Day 0', title: 'Plan', body: 'Lay out seven days of activity by type, date and time, next to your calendar and the weather.' },
  { key: 'name', day: 'Day 0', title: 'Name the strategy', body: 'Describe the logic in your own keywords, such as “morning” or “light exercise”, and give the bundle a name.' },
  { key: 'track', day: 'Days 1–7', title: 'Track', body: 'Report each activity as done, done differently or not done, with a reason. Unplanned activity counts too.' },
  { key: 'reflect', day: 'Day 7', title: 'Reflect', body: 'Mark every keyword helpful or unhelpful and rate the whole strategy from one to seven.' },
  { key: 'iterate', day: 'Day 7', title: 'Iterate', body: 'Continue the strategy, return to one that worked before, or start a new one. Then the ring turns again.' },
];
const DURATION = 3600;
const RADIUS = 150;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LoopDemo() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    io.observe(element);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible || reduced) return;
    const id = window.setTimeout(() => setIndex(current => (current + 1) % STEPS.length), DURATION);
    return () => window.clearTimeout(id);
  }, [index, paused, visible, reduced]);

  const step = STEPS[index];
  const progress = (index + 1) / STEPS.length;

  return (
    <div
      ref={root}
      className="demo loop"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="loop__ring">
        <svg viewBox="0 0 360 360" aria-hidden="true">
          <circle cx="180" cy="180" r={RADIUS} className="loop__track" />
          <circle
            cx="180"
            cy="180"
            r={RADIUS}
            className="loop__progress"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            transform="rotate(-90 180 180)"
          />
          {Array.from({ length: 28 }, (_, tick) => {
            const angle = (tick / 28) * Math.PI * 2 - Math.PI / 2;
            const inner = RADIUS - (tick % 4 === 0 ? 16 : 9);
            return (
              <line
                key={tick}
                x1={180 + Math.cos(angle) * inner}
                y1={180 + Math.sin(angle) * inner}
                x2={180 + Math.cos(angle) * (RADIUS - 4)}
                y2={180 + Math.sin(angle) * (RADIUS - 4)}
                className="loop__tick"
              />
            );
          })}
        </svg>
        {STEPS.map((item, itemIndex) => {
          const angle = (itemIndex / STEPS.length) * 360 - 90 + 360 / STEPS.length;
          return (
            <button
              key={item.key}
              type="button"
              className={`loop__node${itemIndex === index ? ' is-on' : ''}${itemIndex < index ? ' is-done' : ''}`}
              style={{ '--angle': `${angle}deg` } as CSSProperties}
              onClick={() => setIndex(itemIndex)}
              aria-pressed={itemIndex === index}
              aria-label={`${item.title}, ${item.day}`}
            >
              <span>{String(itemIndex + 1).padStart(2, '0')}</span>
            </button>
          );
        })}
        <div className="loop__center" aria-live="polite">
          <span className="mono">{step.day}</span>
          <strong key={step.key}>{step.title}</strong>
        </div>
      </div>

      <div className="loop__copy">
        <ol>
          {STEPS.map((item, itemIndex) => (
            <li key={item.key} className={itemIndex === index ? 'is-on' : ''}>
              <button type="button" onClick={() => setIndex(itemIndex)}>
                <span className="mono">{String(itemIndex + 1).padStart(2, '0')}</span>
                <b>{item.title}</b>
              </button>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
        <div className={`loop__verdict${index === STEPS.length - 1 ? ' is-on' : ''}`} aria-hidden="true">
          <span>Continue</span><span>Revisit</span><span>Replace</span>
        </div>
      </div>
    </div>
  );
}
