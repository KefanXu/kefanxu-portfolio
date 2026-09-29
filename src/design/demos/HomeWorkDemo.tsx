import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Home, Paperclip, RotateCcw, Stethoscope, Target } from 'lucide-react';
import { onScrollFrame, scrollToY } from '../lib/scroll';
import './demos.css';

/*
 * The HomeWork framework as one assignment going round one between-session
 * cycle: created in the clinic, lived with at home, evaluated and revised at
 * the next visit. The card is the same object throughout; only its state
 * moves, and the reader moves it by scrolling: the panel holds still while
 * the page travels through the four moments, and a click on a moment scrolls
 * the page to it.
 */
const MOMENTS = [
  { key: 'create', title: 'Create', where: 'Clinical encounter', body: 'Clinical goals become an assignment: a small bundle of management tasks, each with a cadence, assessed and assigned with the patient in the room.' },
  { key: 'live', title: 'Live with it', where: 'Everyday life · two weeks', body: 'The patient completes the tasks and logs them in the app. Every entry is patient-generated data, attached to the task it came from.' },
  { key: 'evaluate', title: 'Evaluate', where: 'Next encounter', body: 'Completion and the log are reviewed task by task, and the clinician attaches a note to each, with the patient.' },
  { key: 'iterate', title: 'Iterate', where: 'Same encounter', body: 'Tasks are kept, revised, dropped or added. The revised assignment is assigned again, and the next between-session cycle begins.' },
] as const;
const clamp = (value: number) => Math.min(1, Math.max(0, value));
type Moment = (typeof MOMENTS)[number]['key'];

/* 14 days: 1 done, 0 missed, -1 not scheduled */
const TASKS = [
  { cat: 'Exercise', title: 'Gentle movement or stretching', cadence: '3× a week', log: [1, -1, 1, -1, 0, -1, -1, 1, -1, 0, -1, 1, -1, -1], count: '4 of 6', note: 'Crashed after the third session', fate: 'revised', after: '2× a week' },
  { cat: 'Lifestyle', title: 'Log sleep and wake times', cadence: 'Daily', log: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], count: '14 of 14', note: 'Drifts later on work days', fate: 'dropped', after: 'Pattern is clear' },
  { cat: 'Self-report', title: 'Rate daily fatigue', cadence: 'Daily', log: [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], count: '12 of 14', note: 'Average 5.3, worst after shifts', fate: 'kept', after: 'Daily' },
] as const;
const ADDED = [
  { cat: 'Lifestyle', title: 'Pacing plan for work shifts', cadence: 'Daily' },
  { cat: 'Learn', title: 'Read the CDC overview on ME/CFS', cadence: 'Once' },
] as const;
const PILL: Record<Moment, string> = { create: 'New', live: 'In progress · day 14', evaluate: 'Completed', iterate: 'Revised · v2' };
const FOOT: Record<Moment, string> = { create: 'Assessed · bundled · assigned →', live: 'Tasks completed and logged in the app', evaluate: 'Reviewed together · a note on each task', iterate: 'Assigned again → next cycle' };
const SEGMENT: Record<Moment, number> = { create: 0, live: 1, evaluate: 2, iterate: 2 };

/** Where the page is inside the track, 0…1, and where it would be for a given moment. */
function progress(track: HTMLElement, panel: HTMLElement, vh: number) {
  const bounds = track.getBoundingClientRect();
  const trackStyle = getComputedStyle(track);
  // The height the track reserves for the panel (--tall in demos.css), or the tallest state seen if that is more.
  const reserved = Math.max(parseFloat(trackStyle.getPropertyValue('--tall')) || 660, parseFloat(track.style.getPropertyValue('--panel-h')) || 0);
  const top = parseFloat(getComputedStyle(panel).top) || 0;
  // The panel can only hold still if the whole of it, at its tallest, fits under the header; decided from the
  // reserved height so a state that grows mid-way never releases it.
  track.classList.toggle('is-loose', Math.max(reserved, panel.offsetHeight) > vh - top - 8);
  const stuck = getComputedStyle(panel).position === 'sticky' && bounds.height > reserved + 1;
  if (stuck) {
    const range = bounds.height - reserved;
    return { t: clamp((top - bounds.top) / range), at: (i: number, n: number) => window.scrollY + bounds.top - top + (i / (n - 1)) * range };
  }
  // No room to hold the panel still: the moments pass as the panel crosses the viewport.
  return { t: clamp((vh * 0.7 - bounds.top) / (bounds.height + vh * 0.3)), at: null };
}

export function HomeWorkDemo() {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const n = MOMENTS.length;

  useEffect(() => {
    const trackEl = track.current;
    const panelEl = panel.current;
    if (!trackEl || !panelEl) return;
    // The card grows and shrinks with its state; the track keeps the tallest height seen so the page below never shifts back.
    let tallest = 0;
    const size = () => { tallest = Math.max(tallest, panelEl.offsetHeight); trackEl.style.setProperty('--panel-h', `${tallest}px`); };
    size();
    const resize = new ResizeObserver(size);
    resize.observe(panelEl);
    const off = onScrollFrame(({ vh }) => setIndex(Math.round(progress(trackEl, panelEl, vh).t * (n - 1))));
    return () => { resize.disconnect(); off(); };
  }, [n]);

  const go = (i: number) => {
    const trackEl = track.current;
    const panelEl = panel.current;
    const target = trackEl && panelEl ? progress(trackEl, panelEl, window.innerHeight).at : null;
    if (target) scrollToY(target(i, n));
    else setIndex(i);
  };

  const moment = MOMENTS[index];
  const state = moment.key;
  const segment = SEGMENT[state];

  return (
    <div ref={track} className="hw-track" style={{ '--n': n } as CSSProperties}>
    <div ref={panel} className="hw-stick">
    <div className={`demo hw is-${state}`}>
      <div className="hw__copy">
        <ol>
          {MOMENTS.map((item, itemIndex) => (
            <li key={item.key} className={itemIndex === index ? 'is-on' : ''}>
              <button type="button" onClick={() => go(itemIndex)} aria-pressed={itemIndex === index}>
                <span className="mono">{String(itemIndex + 1).padStart(2, '0')}</span>
                <b>{item.title}</b>
                <em className="mono">{item.where}</em>
              </button>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
        <p className="hw__lead" key={state}>{moment.body}</p>
      </div>

      <div className="hw__stage">
        {/* where we are: two settings, and the way back */}
        <div className="hw__strip" aria-hidden="true">
          <ol className="hw__segments">
            {[
              { icon: Stethoscope, label: 'Clinical encounter' },
              { icon: Home, label: 'Everyday life' },
              { icon: Stethoscope, label: 'Next encounter' },
            ].map((item, i) => (
              <li key={item.label} className={`hw__seg${i === segment ? ' is-on' : ''}${i < segment ? ' is-done' : ''}`}>
                <item.icon size={13} strokeWidth={1.75} />
                <span className="mono">{item.label}</span>
              </li>
            ))}
          </ol>
          <div className="hw__return"><span className="mono"><RotateCcw size={11} strokeWidth={2} /> next cycle</span></div>
        </div>

        {/* the assignment, in its current state */}
        <div className="hw__card" aria-live="polite">
          <header className="hw__head">
            <span className="mono">Assignment</span>
            <span key={state} className="hw__pill mono">{PILL[state]}</span>
          </header>
          <div className="hw__goal">
            <Target size={15} strokeWidth={1.75} aria-hidden="true" />
            <b>Fewer post-exertional crashes</b>
            <span className="mono">goal</span>
          </div>
          <ol className="hw__tasks">
            {TASKS.map((task, t) => (
              <li key={task.title} className={`hw__task is-${task.fate}`} style={{ '--t': t } as CSSProperties}>
                <span className="mono hw__cat">{task.cat}</span>
                <div className="hw__main">
                  <b className="hw__title">{task.title}</b>
                  <span className="hw__log" aria-hidden="true">
                    {task.log.map((day, d) => <i key={d} className={day === 1 ? 'is-done' : day === 0 ? 'is-missed' : 'is-off'} style={{ '--i': d } as CSSProperties} />)}
                  </span>
                  <span className="hw__meter" aria-hidden="true"><i style={{ '--w': `${(task.log.filter(v => v === 1).length / task.log.filter(v => v !== -1).length) * 100}%` } as CSSProperties} /></span>
                  <span className="hw__note"><Paperclip size={11} strokeWidth={2} aria-hidden="true" />{task.note}</span>
                </div>
                <span className="hw__side">
                  <span className="mono hw__cadence">{task.cadence}</span>
                  <span className="mono hw__count">{task.count}</span>
                  <span className="mono hw__fate">{task.fate}{task.fate === 'revised' ? ` · ${task.after}` : ''}</span>
                </span>
              </li>
            ))}
            {ADDED.map((task, t) => (
              <li key={task.title} className="hw__task hw__task--added" style={{ '--t': TASKS.length + t } as CSSProperties}>
                <div className="hw__task-inner">
                  <span className="mono hw__cat">{task.cat}</span>
                  <div className="hw__main"><b className="hw__title">{task.title}</b></div>
                  <span className="hw__side"><span className="mono hw__cadence">{task.cadence}</span><span className="mono hw__fate">new</span></span>
                </div>
              </li>
            ))}
          </ol>
          <footer className="hw__foot mono" key={`foot-${state}`}>{FOOT[state]}</footer>
        </div>
      </div>
    </div>
    <span className="demo-hint mono" aria-hidden="true"><i />Live · Scroll through one cycle.</span>
    </div>
    </div>
  );
}
