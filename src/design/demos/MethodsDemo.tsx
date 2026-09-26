import { useState, type CSSProperties } from 'react';
import './demos.css';

/*
 * Physicify's study design, as it was decided: the same 28 days laid out two
 * ways. Between groups, half the people never see their history; within
 * person, everyone plans without it first and with it after. The second is
 * what ran. Each design is drawn as calendars, the way the app itself shows
 * time: one per group, tinted by the build in use.
 */
type Tone = 'a' | 'b';
interface Phase { tone: Tone; label: string; loop: string }
interface Design {
  key: 'between' | 'within';
  label: string;
  title: string;
  ran?: boolean;
  body: string;
  compare: string;
  facts: [string, string][];
}

const NO_HISTORY: Phase = { tone: 'a', label: 'Build 1 · plan, do, report', loop: 'plan → do → report' };
const HISTORY: Phase = { tone: 'b', label: 'Build 2 · look back, then plan', loop: 'look back → plan → do → report' };

const DESIGNS: Design[] = [
  {
    key: 'between',
    label: 'Two groups',
    title: 'Between groups',
    body: 'Half the participants plan without their history for four weeks, the other half with it from day one. The comparison is between different people, so it needs twice the recruits and inherits whatever else differs between the two groups.',
    compare: 'Compare group A with group B, then interview everyone',
    facts: [['Recruits', '34, in two groups'], ['Compares', 'different people'], ['Confound', 'who landed in which group']],
  },
  {
    key: 'within',
    label: 'One group, two phases',
    title: 'Within person',
    ran: true,
    body: 'Everyone plans without history for two weeks, then receives the second build with the calendar and the summaries. Each person is their own control: the comparison is before against after, inside the same lives and routines.',
    compare: 'Compare weeks 1–2 with weeks 3–4, then interview everyone',
    facts: [['Recruits', '17, one group'], ['Compares', 'the same people, before and after'], ['Confound', 'order: history always comes second']],
  },
];

function People({ who, n, at }: { who: string; n: number; at: '1' | '2' | 'all' }) {
  return (
    <div className={`mt__who mt__who--${at}`}>
      <span className="mt__people" aria-hidden="true">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span>
      <b>{who}</b>
      <span className="mono">{n} people</span>
    </div>
  );
}

/** Four weeks as a calendar, each week tinted by the build in use. */
function Calendar({ weeks, at }: { weeks: Tone[]; at: '1' | '2' | 'all' }) {
  return (
    <ol className={`mt__cal mt__cal--${at}`} aria-hidden="true">
      {weeks.flatMap((tone, w) => Array.from({ length: 7 }, (_, d) => {
        const day = w * 7 + d;
        return <li key={day} className={`is-${tone}${d === 0 && w > 0 && weeks[w - 1] !== tone ? ' is-first' : ''}`} style={{ '--i': day } as CSSProperties} />;
      }))}
    </ol>
  );
}

function Card({ phase, when, at }: { phase: Phase; when: string; at: '1' | '2' }) {
  return (
    <div className={`mt__card mt__card--${at} is-${phase.tone}`}>
      <span className="mono mt__when">{when}</span>
      <b>{phase.label}</b>
      <span className="mono mt__loop">{phase.loop}</span>
    </div>
  );
}

export function MethodsDemo() {
  const [key, setKey] = useState<Design['key']>('within');
  const design = DESIGNS.find(d => d.key === key) ?? DESIGNS[1];

  return (
    <div className="demo mt">
      <div className="mt__copy">
        <div className="demo-toggle mt__toggle" role="tablist" aria-label="Study design">
          {DESIGNS.map(d => (
            <button key={d.key} type="button" role="tab" aria-selected={d.key === key} className={d.key === key ? 'is-on' : ''} onClick={() => setKey(d.key)}>
              {d.label}
            </button>
          ))}
        </div>
        <div key={design.key} className="mt__text">
          <h3>
            <span className="mono">{design.ran ? 'What ran' : 'Considered first'}</span>
            {design.title}
          </h3>
          <p>{design.body}</p>
          <dl className="mt__facts">
            {design.facts.map(([label, value]) => (
              <div key={label}><dt className="mono">{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
      </div>

      <div key={design.key} className={`mt__stage is-${design.key}`} role="img" aria-label={`${design.title}: ${design.compare}.`}>
        <div className="mt__grid">
          {design.key === 'within' ? (
            <>
              <People who="Everyone" n={17} at="all" />
              <Calendar weeks={['a', 'a', 'b', 'b']} at="all" />
              <Card phase={NO_HISTORY} when="Weeks 1–2 · days 1–14" at="1" />
              <Card phase={HISTORY} when="Weeks 3–4 · from day 15" at="2" />
            </>
          ) : (
            <>
              <People who="Group A" n={17} at="1" />
              <Calendar weeks={['a', 'a', 'a', 'a']} at="1" />
              <Card phase={NO_HISTORY} when="Weeks 1–4 · all 28 days" at="1" />
              <People who="Group B" n={17} at="2" />
              <Calendar weeks={['b', 'b', 'b', 'b']} at="2" />
              <Card phase={HISTORY} when="Weeks 1–4 · all 28 days" at="2" />
            </>
          )}
          <i className="mt__bracket" aria-hidden="true" />
          <p className="mono mt__compare">{design.compare}</p>
        </div>
        <ul className="mono mt__key" aria-hidden="true">
          <li><i className="is-a" />Without history</li>
          <li><i className="is-b" />With the history views</li>
          <li><i className="is-p" />One participant</li>
        </ul>
      </div>
    </div>
  );
}
