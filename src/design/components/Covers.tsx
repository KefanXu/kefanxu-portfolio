import type { CSSProperties } from 'react';
import { img } from '../data/img';
import type { CoverId } from '../data/types';
import { Browser, Phone } from './Device';
import './covers.css';

/*
 * Decorative compositions for the project cards and case-study heroes. They
 * read `--px` / `--py` (-1…1, pointer position) and `--sp` (0…1, scroll
 * progress) from an ancestor for parallax, and are hidden from assistive tech.
 */
const shot = (path: string) => ({ src: img(path), alt: '' });

function TrackyaCover() {
  return (
    <div className="cover cover--trackya">
      <div className="cover__capsules">
        {Array.from({ length: 42 }, (_, index) => (
          <i key={index} className={(index * 7 + 3) % 5 > 1 ? 'is-on' : ''} style={{ '--k': (index * 37) % 11 } as CSSProperties} />
        ))}
      </div>
      <Phone className="cover__phone cover__phone--back" shot={shot('trackya/records-cal.webp')} decorative />
      <Phone className="cover__phone cover__phone--front" shot={shot('trackya/app-1.webp')} decorative />
      <img className="cover__float cover__icon" src={img('trackya/icon.png')} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

function MoodloopCover() {
  return (
    <div className="cover cover--moodloop">
      <Phone className="cover__phone cover__phone--left" shot={shot('moodloop/app-10.webp')} decorative />
      <Phone className="cover__phone cover__phone--right" shot={shot('moodloop/app-11.webp')} decorative />
      <Phone className="cover__phone cover__phone--front" shot={shot('moodloop/app-08.webp')} decorative />
      <svg className="cover__float cover__mascot" viewBox="0 0 200 170" aria-hidden="true">
        <rect width="200" height="330" rx="100" fill="#f289ac" />
        <circle cx="68" cy="62" r="23" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="132" cy="62" r="23" fill="none" stroke="#fff" strokeWidth="4" />
        <path d="M91 61c6-3 12-3 18 0" fill="none" stroke="#fff" strokeWidth="4" />
        <path d="M58 64c3-7 17-7 20 0M122 64c3-7 17-7 20 0" fill="none" stroke="#343d49" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 116c11 0 20-8 22-19 0-2-1-4-4-4H82c-3 0-4 2-4 4 2 11 11 19 22 19Z" fill="#343d49" />
      </svg>
    </div>
  );
}

function CareworkCover() {
  return (
    <div className="cover cover--carework">
      <Browser className="cover__browser" url="carework" shot={shot('carework/shot-04.webp')} decorative />
      <div className="cover__float cover__chip cover__chip--ai">
        <span className="mono"><b>✦</b> AI draft</span>
        <p>23/31 days adherent; skipped only when too wiped out, resumed next day.</p>
        <div><i>Retry</i><i className="is-solid">Accept</i></div>
      </div>
      <div className="cover__float cover__chip cover__chip--log">
        <span className="mono">31-day log</span>
        <div className="cover__dots">{Array.from({ length: 31 }, (_, index) => <i key={index} className={[6, 13, 14, 20, 21, 27, 28, 29].includes(index) ? 'is-off' : ''} />)}</div>
      </div>
    </div>
  );
}

function PlanneregyCover() {
  return (
    <div className="cover cover--planneregy">
      <svg className="cover__ringtext" viewBox="0 0 400 400" aria-hidden="true">
        <defs><path id="pl-ring" d="M200 200m-172 0a172 172 0 1 1 344 0a172 172 0 1 1-344 0" /></defs>
        <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeOpacity=".16" />
        <circle cx="200" cy="200" r="148" fill="none" stroke="currentColor" strokeOpacity=".16" />
        <text><textPath href="#pl-ring" startOffset="0">PLAN · NAME · TRACK · REFLECT · ITERATE · PLAN · NAME · TRACK · REFLECT · ITERATE ·</textPath></text>
      </svg>
      <Phone className="cover__phone cover__phone--back" shot={shot('planneregy/app-strategy-detail.webp')} decorative />
      <Phone className="cover__phone cover__phone--front" shot={shot('planneregy/app-mock-1.webp')} decorative />
    </div>
  );
}

function EcocareCover() {
  return (
    <div className="cover cover--ecocare">
      {/* One SVG per orbit: each spins as a whole layer on the compositor, so the
          rotation never repaints (an animated <g> inside one SVG would). */}
      <div className="cover__orbits" aria-hidden="true">
        {[70, 120, 170].map((radius, index) => (
          <svg key={radius} className={`cover__orbit cover__orbit--${index + 1}`} viewBox="0 0 400 400">
            <circle cx="200" cy="200" r={radius} fill="none" stroke="currentColor" strokeOpacity=".28" strokeDasharray={index === 2 ? '3 7' : undefined} />
            <circle cx={200 + radius} cy="200" r={index === 0 ? 5 : 7} fill="currentColor" />
            <circle cx={200 - radius * 0.62} cy={200 - radius * 0.785} r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ))}
        <svg className="cover__orbit cover__orbit--core" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="32" fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <Browser className="cover__browser" url="ecocare" shot={shot('ecocare/ui-event.webp')} decorative />
    </div>
  );
}

function PhysicifyCover() {
  const blocks = ['g', 'x', 'r', 'g', 'x', 'g', 'r', 'x', 'g', 'g', 'x', 'r', 'g', 'x', 'g', 'x', 'r', 'g', 'g', 'x', 'g'];
  return (
    <div className="cover cover--physicify">
      <div className="cover__blocks">{blocks.map((kind, index) => <i key={index} className={`is-${kind}`} style={{ '--k': index % 7 } as CSSProperties} />)}</div>
      <Phone className="cover__phone cover__phone--back" shot={shot('physicify/final-history-summary.webp')} decorative />
      <Phone className="cover__phone cover__phone--front" shot={shot('physicify/final-calendar-planning.webp')} decorative />
    </div>
  );
}

const COVERS: Record<CoverId, () => JSX.Element> = {
  trackya: TrackyaCover,
  moodloop: MoodloopCover,
  carework: CareworkCover,
  planneregy: PlanneregyCover,
  ecocare: EcocareCover,
  physicify: PhysicifyCover,
};

export function Cover({ id }: { id: CoverId }) {
  const Component = COVERS[id];
  return <div className="cover-box" aria-hidden="true"><Component /></div>;
}
