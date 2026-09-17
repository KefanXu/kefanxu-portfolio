import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './demos.css';

/*
 * The early Moodloop concept, rebuilt from the Figma explorations: a seven-step
 * scale whose character changes colour and expression with the score.
 * Face geometry comes from the original vector frames.
 */
interface Mood {
  label: string;
  bg: string;
  body: string;
  eyes: [string, string];
  mouth: string;
  extra?: 'tear' | 'sparkle';
}
const MOODS: Mood[] = [
  { label: 'Rough', bg: '#b8c9fd', body: '#8b83f5', extra: 'tear',
    eyes: ['M73.4 111.4C77.8 100.3 96.1 95.9 104.3 105.9', 'M147 104.7C155.8 94.9 176.5 97.3 181.1 110.8'],
    mouth: 'M129.8 124C142.6 124 152.4 124.2 153.8 139C154 141.2 152.2 143 150 143H108C105.8 143 104 141.2 104.2 139C105.9 124.2 117.1 124 129.8 124Z' },
  { label: 'Low', bg: '#d7eee7', body: '#73cfcb',
    eyes: ['M61 102C68.8 89.4 92.2 88 100 102', 'M158 102C165.8 89.4 189.2 88 197 102'],
    mouth: 'M128.4 124C123.7 124 111.9 124.1 108.8 131.1C107.9 133.1 109.8 135 112 135H146C148.2 135 150.1 133.1 149.4 131.1C146.9 124.1 137.4 124 128.4 124Z' },
  { label: 'Meh', bg: '#fff8e3', body: '#f1c959',
    eyes: ['M61 102C68.8 89.4 92.2 88 100 102', 'M158 102C165.8 89.4 189.2 88 197 102'],
    mouth: 'M132 120.9C139.5 120.5 145.7 120.3 148.7 122.7C150.7 124.3 148.3 126.7 145.8 126.4C134.8 125.4 124.6 126.9 113.2 129.6C110.7 130.2 108.5 128.1 110.4 126.4C114.4 122.7 124.1 121.3 132 120.9Z' },
  { label: 'Okay', bg: '#ffefe3', body: '#f2b489',
    eyes: ['M74.8 102C82.6 83.9 105.8 82 113.5 102', 'M144.5 102C152.2 83.9 175.4 82 183.2 102'],
    mouth: 'M128.5 139C136.1 139 142.6 137.5 145.9 135.2C147.7 133.9 146.2 132 144 132H113C110.8 132 109.3 133.9 111.1 135.2C114.4 137.5 120.9 139 128.5 139Z' },
  { label: 'Good', bg: '#fddaed', body: '#f289b4',
    eyes: ['M66.8 94C74.6 75.9 97.8 74 105.5 94', 'M152.5 94C160.2 75.9 183.4 74 191.2 94'],
    mouth: 'M129 149C140.3 149 149.8 140.8 151.7 130C152 127.8 150.2 126 148 126H110C107.8 126 106 127.8 106.3 130C108.2 140.8 117.7 149 129 149Z' },
  { label: 'Great', bg: '#ffd9d9', body: '#f07670',
    eyes: ['M68.4 97.3C72.8 78.1 95.4 72.2 106.5 90.5', 'M151.5 90.5C162.3 74.1 185.5 76.2 189.6 97.3'],
    mouth: 'M129 157C145.9 157 159.8 144.3 161.8 128C162 125.8 160.2 124 158 124H100C97.8 124 96 125.8 96.2 128C98.2 144.3 112.1 157 129 157Z' },
  { label: 'Glowing', bg: '#ffb3b4', body: '#ef6668', extra: 'sparkle',
    eyes: ['', ''],
    mouth: 'M129 163C148.6 163 164.8 148.1 166.8 129C167 126.8 165.2 125 163 125H95C92.8 125 91 126.8 91.2 129C93.2 148.1 109.4 163 129 163Z' },
];
const SPARKLE = 'M0 -17C2 -6 6 -2 17 0C6 2 2 6 0 17C-2 6 -6 2 -17 0C-6 -2 -2 -6 0 -17Z';

export function MoodDemo() {
  const [value, setValue] = useState(4);
  const [saved, setSaved] = useState(false);
  const [bump, setBump] = useState(0);
  const timer = useRef(0);
  const blob = useRef<SVGSVGElement>(null);
  const mood = MOODS[value - 1];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A small squash-and-stretch every time the score changes or is recorded.
  useEffect(() => {
    if (!bump || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    blob.current?.animate(
      [
        { transform: 'translateY(0) scale(1, 1)' },
        { transform: 'translateY(3%) scale(1.06, 0.94)', offset: 0.3 },
        { transform: 'translateY(-5%) scale(0.97, 1.05)', offset: 0.62 },
        { transform: 'translateY(0) scale(1, 1)' },
      ],
      { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  }, [bump]);

  const record = () => {
    setSaved(true);
    setBump(count => count + 1);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="demo mood" style={{ '--mood-bg': mood.bg, '--mood-body': mood.body } as CSSProperties}>
      <div className="mood__copy">
        <span className="mono">Reflection · concept</span>
        <p className="mood__question">How are you feeling today?</p>
        <div className="mood__slider">
          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={value}
            onChange={event => { setValue(Number(event.target.value)); setBump(count => count + 1); }}
            aria-label="Mood, from 1 to 7"
            aria-valuetext={`${value} of 7, ${mood.label}`}
          />
          <div className="mood__ticks" aria-hidden="true">
            {MOODS.map((_, index) => <i key={index} className={index + 1 === value ? 'is-on' : ''} />)}
          </div>
        </div>
        <div className="mood__readout" aria-live="polite">
          <strong>{value}</strong>
          <span>/ 7 · {mood.label}</span>
        </div>
        <button type="button" className="mood__record" onClick={record}>
          {saved ? 'Recorded' : 'Record mood'}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            {saved
              ? <path d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              : <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
        </button>
      </div>

      <div className="mood__stage" aria-hidden="true">
        <svg ref={blob} className="mood__blob" viewBox="0 0 258 300" width="258" height="300">
          <rect className="mood__body" width="258" height="420" rx="129" />
          {MOODS.map((item, index) => (
            <g key={item.label} className={`mood__face${index + 1 === value ? ' is-on' : ''}`}>
              {item.eyes[0] ? <path d={item.eyes[0]} stroke="#343d49" strokeWidth="5" strokeLinecap="round" fill="none" /> : null}
              {item.eyes[1] ? <path d={item.eyes[1]} stroke="#343d49" strokeWidth="5" strokeLinecap="round" fill="none" /> : null}
              <path d={item.mouth} fill="#343d49" />
              {item.extra === 'tear' ? <ellipse className="mood__tear" cx="205" cy="118" rx="8" ry="14" fill="#63b4ff" /> : null}
              {item.extra === 'sparkle' ? (
                <>
                  <path className="mood__sparkle" d={SPARKLE} transform="translate(92 96)" fill="#ffd27a" />
                  <path className="mood__sparkle mood__sparkle--late" d={SPARKLE} transform="translate(166 96)" fill="#ffd27a" />
                </>
              ) : null}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
