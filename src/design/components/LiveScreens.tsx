import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BookOpen, Camera, Check, ChevronDown, ChevronLeft, FolderOpen, Footprints, Hash, Home, Mic, PenLine, Settings, Sparkles, X } from 'lucide-react';
import { EcoMap, SCENARIOS } from '../demos/EcologyDemo';
import { reducedMotion } from '../lib/scroll';
import './live-screens.css';

/*
 * Small working versions of three products, drawn in code for the cover:
 * Trackya's day of hourly capsules, Moodloop's report screen and EcoCare's
 * care ecology. Each runs on its own while `live` and stops advancing once
 * someone touches it. Everything inside is sized in container units of the
 * screen, so the same layout holds at any device width.
 */

export interface ScreenProps { live: boolean; onTouch: () => void }

/* ── Trackya: a day, hour by hour ──────────────────────────────────────── */
const ACTIVE_AT = 1000;
const TRACKYA_DAYS = [
  { label: 'Thu', date: 26, long: 'Feb 26', steps: [1180, 240, 190, 1620, 330, 1240, 410] },
  { label: 'Fri', date: 27, long: 'Feb 27', steps: [253, 3285, 167, 1574, 3545, 820, 1205] },
  { label: 'Sat', date: 28, long: 'Feb 28', steps: [2945, 1231, 388, 601, 175, 1480, 2210] },
  { label: 'Sun', date: 1, long: 'Mar 1', steps: [420, 1310, 2240, 640, 180, 960, 1530] },
  { label: 'Mon', date: 2, long: 'Mar 2', steps: [1002, 1223, 230, 1323, 231, 1323, 640] },
];
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

/** Eases a number toward its target, for figures that should count rather than jump. */
function useTween(target: number, ms = 700) {
  const [value, setValue] = useState(target);
  const latest = useRef(target);
  useEffect(() => {
    if (reducedMotion()) { latest.current = target; setValue(target); return; }
    const start = performance.now();
    const begin = latest.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const next = begin + (target - begin) * (1 - Math.pow(1 - t, 3));
      latest.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

export function TrackyaScreen({ live, onTouch }: ScreenProps) {
  const [dayIndex, setDayIndex] = useState(2);
  const [touched, setTouched] = useState(false);
  const day = TRACKYA_DAYS[dayIndex];
  const share = Math.round((day.steps.filter(s => s < ACTIVE_AT).length / day.steps.length) * 100);
  const shown = useTween(share);
  const max = 3600;

  // The days advance on their own until someone picks one.
  useEffect(() => {
    if (!live || touched || reducedMotion()) return;
    const id = window.setTimeout(() => setDayIndex(i => (i + 1) % TRACKYA_DAYS.length), 5200);
    return () => window.clearTimeout(id);
  }, [dayIndex, live, touched]);

  const pick = (i: number) => { setTouched(true); onTouch(); setDayIndex(i); };

  return (
    <div className="hs-screen hs-trackya" aria-label="Trackya, a day of hourly activity">
      <div className="hs-status"><span>16:57</span><span className="hs-status__batt"><i />38</span></div>
      <div className="hs-trackya__top">
        <i className="hs-trackya__bar" aria-hidden="true" />
        <div><b>{Math.round(shown)}<small>%</small></b><span>Sedentary</span></div>
        <div className="hs-trackya__date"><b>{day.long}</b><span>Date</span></div>
        <ChevronDown size={12} strokeWidth={2} aria-hidden="true" />
      </div>
      <ol className="hs-trackya__days" aria-label="Day">
        {TRACKYA_DAYS.map((item, i) => (
          <li key={item.label}>
            <button type="button" className={i === dayIndex ? 'is-on' : ''} aria-pressed={i === dayIndex} onClick={() => pick(i)}>
              <span>{item.label}</span><b>{item.date}</b>
            </button>
          </li>
        ))}
      </ol>
      <ol className="hs-trackya__hours" key={dayIndex}>
        {day.steps.map((steps, i) => (
          <li key={HOURS[i]} className={steps >= ACTIVE_AT ? 'is-active' : ''} style={{ '--i': i, '--w': `${Math.min(100, (steps / max) * 100)}%` } as CSSProperties}>
            <span className="hs-trackya__time">{HOURS[i]}</span>
            <span className="hs-trackya__track" aria-hidden="true"><i /></span>
            <div className="hs-trackya__capsule">
              <Footprints size={12} strokeWidth={2} aria-hidden="true" />
              <b>{steps.toLocaleString()}</b>
              <small>Steps</small>
            </div>
          </li>
        ))}
      </ol>
      <div className="hs-trackya__tabs" aria-hidden="true">
        <span className="is-on"><Home size={13} />Home</span>
        <span><FolderOpen size={13} /><i>38</i>Records</span>
        <span><BookOpen size={13} />Tutorial</span>
        <span><Settings size={13} />Settings</span>
      </div>
    </div>
  );
}

/* ── Moodloop: one report, on a scale of 30 ────────────────────────────── */
export function MoodloopScreen({ live, onTouch }: ScreenProps) {
  const [value, setValue] = useState(22);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef(0);

  // Until someone takes the slider, the score wanders a little, as a live thing would.
  useEffect(() => {
    if (!live || touched || reducedMotion()) return;
    const id = window.setTimeout(() => setValue(v => Math.max(6, Math.min(29, v + [-3, -2, 2, 3, 4][Math.floor(Math.random() * 5)]))), 3600);
    return () => window.clearTimeout(id);
  }, [value, live, touched]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const touch = () => { if (!touched) { setTouched(true); onTouch(); } };
  const record = () => {
    touch();
    setSaved(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="hs-screen hs-mood" style={{ '--t': (value - 1) / 29 } as CSSProperties} aria-label="Moodloop, a mood report on a scale of 30">
      <div className="hs-status"><span>08:57</span><span className="hs-status__batt"><i />13</span></div>
      <div className="hs-mood__nav" aria-hidden="true"><ChevronLeft size={14} strokeWidth={2} /><span><Sparkles size={10} strokeWidth={2} /> Reflection</span><X size={13} strokeWidth={2} /></div>
      <p className="hs-mood__q">How are you feeling right now?</p>
      <label className="hs-mood__slider">
        <span className="sr-only">Mood, 1 to 30</span>
        <input type="range" min={1} max={30} value={value} onChange={event => { touch(); setValue(Number(event.target.value)); }} onPointerDown={touch} />
        <span className="hs-mood__ends" aria-hidden="true"><span>1</span><span>30</span></span>
      </label>
      <div className="hs-mood__wheel" aria-hidden="true">
        <span>{value > 2 ? value - 2 : ''}</span>
        <b key={value}>{value}</b>
        <span>{value < 29 ? value + 2 : ''}</span>
      </div>
      <p className="hs-mood__of" aria-live="polite">{value} out of 30</p>
      {/* the story behind the score: the annotations a report can carry, and the scale it is given on */}
      <div className="hs-mood__annot" aria-hidden="true">
        <span><Camera /> Photo</span><span><Mic /> Voice</span><span><PenLine /> Draw</span><span><Hash /> Tags</span>
      </div>
      <p className="hs-mood__scale" aria-hidden="true"><span>Your scale · 1 to 30, step 1</span><span>Review in 3 days</span></p>
      <div className="hs-mood__actions">
        <button type="button" onClick={touch}>Enter manually</button>
        <button type="button" className={`is-primary${saved ? ' is-saved' : ''}`} onClick={record}>{saved ? <><Check size={13} strokeWidth={2.5} /> Recorded</> : 'Record mood'}</button>
      </div>
    </div>
  );
}

/* ── EcoCare: the ecology, with an event running through it ───────────── */
const SHORT: Record<string, string> = { baseline: 'Baseline', insurance: 'Insurance drops coverage', surgery: 'Partner’s surgery', relocation: 'Relocation' };
const TINY: Record<string, string> = { baseline: 'Baseline', insurance: 'Insurance', surgery: 'Surgery', relocation: 'Relocation' };

export function EcoCareWindow({ live, onTouch }: ScreenProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [typed, setTyped] = useState('');
  const scenario = SCENARIOS[index];

  useEffect(() => {
    if (!live || touched || reducedMotion()) return;
    const id = window.setTimeout(() => setIndex(i => (i + 1) % SCENARIOS.length), 6800);
    return () => window.clearTimeout(id);
  }, [index, live, touched]);

  useEffect(() => {
    if (reducedMotion() || !live) { setTyped(scenario.note); return; }
    setTyped('');
    let count = 0;
    const id = window.setInterval(() => {
      count += 3;
      setTyped(scenario.note.slice(0, count));
      if (count >= scenario.note.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [scenario, live]);

  const pick = (i: number) => { setTouched(true); onTouch(); setIndex(i); };

  return (
    <div className="hs-eco" aria-label="EcoCare, a care ecology with a life-changing event running through it">
      <div className="hs-eco__bar">
        <span className="hs-eco__brand"><b>EcoCare</b><span>Jordan · Type 2 diabetes</span></span>
        <div className="hs-eco__chips" role="group" aria-label="Life-changing event">
          {SCENARIOS.map((item, i) => (
            <button key={item.id} type="button" className={i === index ? 'is-on' : ''} aria-pressed={i === index} onClick={() => pick(i)}>
              <span className="hs-eco__long">{SHORT[item.id] ?? item.label}</span><span className="hs-eco__tiny" aria-hidden="true">{TINY[item.id] ?? item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="hs-eco__body">
        <div className={`hs-eco__map${scenario.id !== 'baseline' ? ' is-event' : ''}`}>
          <EcoMap scenario={scenario} hovered={hovered} onHover={setHovered} viewBox="-70 16 780 608" />
        </div>
        <aside className="hs-eco__aside">
          <span className="mono"><i aria-hidden="true" />Sense-making assistant</span>
          <p aria-hidden="true">{typed}<b className="hs-eco__caret" /></p>
        </aside>
      </div>
    </div>
  );
}
