import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Home, Paperclip, RotateCcw, Stethoscope, Target } from 'lucide-react';
import './demos.css';

/*
 * The HomeWork framework as one assignment going round one between-session
 * cycle: created in the clinic, lived with at home, evaluated and revised at
 * the next visit. The card is the same object throughout; only its state moves.
 */
const MOMENTS = [
  { key: 'create', title: 'Create', where: 'Clinical encounter', body: 'Clinical goals become an assignment: a small bundle of management tasks, each with a cadence, assessed and assigned with the patient in the room.', ms: 3400 },
  { key: 'live', title: 'Live with it', where: 'Everyday life · two weeks', body: 'The patient completes the tasks and logs them in the app. Every entry is patient-generated data, attached to the task it came from.', ms: 4200 },
  { key: 'evaluate', title: 'Evaluate', where: 'Next encounter', body: 'Completion and the log are reviewed task by task, and the clinician attaches a note to each, with the patient.', ms: 3800 },
  { key: 'iterate', title: 'Iterate', where: 'Same encounter', body: 'Tasks are kept, revised, dropped or added. The revised assignment is assigned again, and the next between-session cycle begins.', ms: 4200 },
] as const;
type Moment = (typeof MOMENTS)[number]['key'];

/* 14 days: 1 done, 0 missed, -1 not scheduled */
const TASKS = [
  { cat: 'Exercise', title: 'Gentle movement or stretching', cadence: '3× a week', log: [1, -1, 1, -1, 0, -1, -1, 1, -1, 0, -1, 1, -1, -1], count: '4 of 6', note: 'Crashed after the third session', fate: 'revised', after: '2× a week, shorter' },
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

export function HomeWorkDemo() {
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
    const id = window.setTimeout(() => setIndex(current => (current + 1) % MOMENTS.length), MOMENTS[index].ms);
    return () => window.clearTimeout(id);
  }, [index, paused, visible, reduced]);

  const moment = MOMENTS[index];
  const state = moment.key;
  const segment = SEGMENT[state];

  return (
    <div
      ref={root}
      className={`demo hw is-${state}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hw__copy">
        <ol>
          {MOMENTS.map((item, itemIndex) => (
            <li key={item.key} className={itemIndex === index ? 'is-on' : ''}>
              <button type="button" onClick={() => setIndex(itemIndex)} aria-pressed={itemIndex === index}>
                <span className="mono">{String(itemIndex + 1).padStart(2, '0')}</span>
                <b>{item.title}</b>
                <em className="mono">{item.where}</em>
              </button>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
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
  );
}
