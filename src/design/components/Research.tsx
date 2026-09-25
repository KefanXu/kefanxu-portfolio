import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDownRight, ArrowUpRight, Ear, GraduationCap, HeartHandshake, Smile, Stethoscope, Utensils } from 'lucide-react';
import { sizeOf } from '../data/img';
import { moodloopRecord } from '../data/studies/moodloop';
import { planneregyRecord } from '../data/studies/planneregy';
import type { Scale } from '../data/studies/types';
import type { Block, Evidence, RecordSpec, Timeline } from '../data/types';
import { CountUp } from './CountUp';
import { Zoom } from './Lightbox';
import { Reveal, SplitText } from './Reveal';
import './research.css';

/*
 * A user study, presented the way research is presented: headline numbers and
 * the study's rhythm, the participants' record drawn live from the paper's
 * data, insights with their evidence, and the method kept short.
 */
type ResearchBlock = Extract<Block, { type: 'research' }>;

const pad = (n: number) => String(n).padStart(2, '0');
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/* ── Floating detail card (a portal, so scrollers and reveals never clip it) ── */
interface Tip { x: number; y: number; above: boolean; content: ReactNode }
function useTip() {
  const [tip, setTip] = useState<Tip | null>(null);
  const show = useCallback((element: HTMLElement, content: ReactNode) => {
    const r = element.getBoundingClientRect();
    const above = r.top > 200;
    setTip({ x: r.left + r.width / 2, y: above ? r.top - 10 : r.bottom + 10, above, content });
  }, []);
  const hide = useCallback(() => setTip(null), []);
  useEffect(() => {
    if (!tip) return;
    const off = () => setTip(null);
    window.addEventListener('scroll', off, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', off, { capture: true } as EventListenerOptions);
  }, [tip]);
  const node = tip
    ? createPortal(
        <div className={`rtip${tip.above ? ' rtip--above' : ''}`} role="tooltip" style={{ left: tip.x, top: tip.y }}>{tip.content}</div>,
        document.body,
      )
    : null;
  return { show, hide, node };
}

/* ── Headline numbers ──────────────────────────────────────────────────── */
function Numbers({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="rnums">
      {items.map((item, index) => (
        <Reveal as="div" key={item.label} delay={index * 90}>
          <dt><CountUp value={item.value} /></dt>
          <dd>{item.label}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

/* ── The study's rhythm: a strip of days, or one session as a bar ──────── */
function TimelineGraphic({ spec }: { spec: Timeline }) {
  if (spec.kind === 'days') {
    const cells = Array.from({ length: spec.days }, (_, i) => i + 1);
    const toneOf = (day: number) => spec.phases.find(p => day >= p.from && day <= p.to)?.tone ?? 'a';
    return (
      <Reveal className="rdays" style={{ '--n': spec.days } as CSSProperties} aria-label={`${spec.days} days`}>
        <ol className="rdays__marks" aria-hidden="true">
          {spec.marks.map(mark => (
            <li key={mark.label} className={`mono${mark.day >= spec.days ? ' is-end' : ''}`} style={{ gridColumn: `${Math.min(spec.days, Math.max(1, mark.day || 1))} / span 1` }}>
              <i /> {mark.label}
            </li>
          ))}
        </ol>
        <ol className="rdays__cells">
          {cells.map(day => (
            <li
              key={day}
              className={`is-${toneOf(day)}${spec.ticks && day % spec.ticks.every === 0 ? ' is-tick' : ''}`}
              style={{ '--i': day } as CSSProperties}
              title={`Day ${day}`}
            />
          ))}
        </ol>
        <ul className="rdays__key mono">
          {spec.phases.map(phase => <li key={phase.label}><i className={`is-${phase.tone}`} />{phase.label} <span>d{phase.from}–{phase.to}</span></li>)}
          {spec.ticks ? <li><i className="is-tick" />{spec.ticks.label}</li> : null}
          <li className="rdays__key-marks"><i className="is-mark" />{spec.marks.map(m => m.label).join(' · ')}</li>
        </ul>
      </Reveal>
    );
  }
  return (
    <Reveal className="rsession" aria-label={`One session, about ${spec.minutes}`}>
      <div className="rsession__head mono"><span>One session</span><span>{spec.minutes}</span></div>
      <ol className="rsession__bar">
        {spec.segments.map((segment, index) => (
          <li key={segment.label} className={`is-${segment.tone}${segment.interview ? ' has-interview' : ''}`} style={{ flexGrow: segment.share, '--i': index } as CSSProperties}>
            <span>{segment.label}</span>
          </li>
        ))}
      </ol>
      <ul className="rsession__key mono">
        <li><i className="is-interview" />Interview after the stage</li>
        {spec.note ? <li>{spec.note}</li> : null}
      </ul>
    </Reveal>
  );
}

/* ── Planneregy: sixteen people, week by week ──────────────────────────── */
const PLAN_NAMES: Record<string, string> = { g: 'completed as planned', o: 'completed differently', b: 'not completed', w: 'not reported' };
const KEY_NAMES: Record<string, string> = { g: 'helpful', o: 'unhelpful', b: 'not rated' };
const count = (s: string, c: string) => s.split('').filter(ch => ch === c).length;
const describe = (s: string, names: Record<string, string>) => Object.keys(names).map(c => [count(s, c), names[c]] as const).filter(([n]) => n > 0).map(([n, name]) => `${n} ${name}`).join(', ');

type StrategyFocus = 'all' | 'disruption' | 'up' | 'experiment' | 'held';
const STRATEGY_FOCI: { id: StrategyFocus; label: string; test: (p: (typeof planneregyRecord)[number]) => boolean }[] = [
  { id: 'disruption', label: 'met a life change or disruption', test: p => !!p.disruption },
  { id: 'up', label: 'more active by the end', test: p => p.trend === 'up' },
  { id: 'experiment', label: 'started by experimenting', test: p => p.started === 'experiment' },
  { id: 'held', label: 'held one strategy for five weeks', test: p => p.weeks.reduce<[number, number, number]>(([best, run, last], w) => { const next = w.strategy === last ? run + 1 : 1; return [Math.max(best, next), next, w.strategy]; }, [0, 0, 0])[0] >= 5 },
];

function StrategiesRecord() {
  const [focus, setFocus] = useState<StrategyFocus>('all');
  const { show, hide, node } = useTip();
  const active = STRATEGY_FOCI.find(f => f.id === focus);
  const maxWeeks = Math.max(...planneregyRecord.map(p => p.weeks.length));
  return (
    <div className="rec rec--strategies">
      <ul className="rec__foci" aria-label="Highlight participants">
        <li><button type="button" className={focus === 'all' ? 'is-on' : ''} onClick={() => setFocus('all')}>All 16</button></li>
        {STRATEGY_FOCI.map(f => {
          const n = planneregyRecord.filter(f.test).length;
          return <li key={f.id}><button type="button" className={focus === f.id ? 'is-on' : ''} onClick={() => setFocus(focus === f.id ? 'all' : f.id)}><b>{n}</b> {f.label}</button></li>;
        })}
      </ul>
      <div className="rec__scroll" data-lenis-prevent-touch>
        <ol className="strat" style={{ '--weeks': maxWeeks } as CSSProperties}>
          <li className="strat__head mono" aria-hidden="true">
            <span />
            {Array.from({ length: maxWeeks }, (_, i) => <span key={i}>W{i + 1}</span>)}
          </li>
          {planneregyRecord.map((person, row) => {
            const dim = active ? !active.test(person) : false;
            return (
              <li key={person.id} className={`strat__row${dim ? ' is-dim' : ''}`} style={{ '--r': row } as CSSProperties}>
                <div className="strat__who">
                  <span className={`strat__chip is-${person.started}`} title={person.started === 'experiment' ? 'Started by experimenting with a new routine' : 'Started from the current routine'}>
                    <b>{person.id}</b>
                    <i className={`strat__sex is-${person.gender}`} aria-label={person.gender === 'f' ? 'woman' : 'man'}>{person.gender === 'f' ? '♀' : '♂'}</i>
                    {person.trend ? <i className={`strat__trend is-${person.trend}`} aria-label={person.trend === 'up' ? 'more active by the end' : 'less active by the end'}>{person.trend === 'up' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}</i> : null}
                  </span>
                  {person.disruption ? <span className="strat__event">{person.disruption}</span> : null}
                </div>
                {person.weeks.map((week, index) => {
                  const label = `${person.id}, week ${index + 1}: strategy ${week.strategy}${week.ongoing ? ' (still running at the exit interview)' : ''}. ${plural(week.plans.length, 'plan')}${week.plans ? `: ${describe(week.plans, PLAN_NAMES)}` : ''}. ${week.keywords ? `Keywords: ${describe(week.keywords, KEY_NAMES)}. ` : ''}${week.minutes} minutes.`;
                  const content = (
                    <>
                      <span className="mono">{person.id} · week {index + 1} · strategy {week.strategy}{week.ongoing ? ' · ongoing' : ''}</span>
                      <b>{week.minutes} min</b>
                      <span>{plural(week.plans.length, 'plan')}{week.plans ? `: ${describe(week.plans, PLAN_NAMES)}` : ''}</span>
                      {week.keywords ? <span>Keywords: {describe(week.keywords, KEY_NAMES)}</span> : null}
                    </>
                  );
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`strat__week is-s${week.strategy}${week.ongoing ? ' is-ongoing' : ''}`}
                      style={{ '--c': index } as CSSProperties}
                      aria-label={label}
                      onMouseEnter={event => show(event.currentTarget, content)}
                      onMouseLeave={hide}
                      onFocus={event => show(event.currentTarget, content)}
                      onBlur={hide}
                    >
                      <i className="strat__bar" style={{ width: `${Math.min(100, (week.minutes / 300) * 100)}%` }} />
                      {week.minutes > 300 ? <span className="strat__over mono">{week.minutes}</span> : null}
                      <span className="strat__plans">{week.plans.split('').map((c, i) => <i key={i} className={`is-${c}`} />)}</span>
                      <span className="strat__keys">{week.keywords.split('').filter(Boolean).map((c, i) => <i key={i} className={`is-${c}`} />)}</span>
                    </button>
                  );
                })}
              </li>
            );
          })}
        </ol>
      </div>
      <ul className="rec__key mono">
        <li><i className="k-strategy" />One colour per strategy, in the order it was created</li>
        <li><i className="k-bar" />Minutes that week, full width = 300</li>
        <li><i className="k-pill is-g" />Plan done as planned</li>
        <li><i className="k-pill is-o" />Done differently</li>
        <li><i className="k-pill is-b" />Not done</li>
        <li><i className="k-pill is-w" />Not reported</li>
        <li><i className="k-dot is-g" />Keyword rated helpful</li>
        <li><i className="k-dot is-o" />Unhelpful</li>
        <li><i className="k-dot is-b" />Not rated</li>
        <li><i className="k-ongoing" />Still running at the exit interview</li>
        <li><i className="k-chip" />Dark chip: started by experimenting · light: from the current routine</li>
      </ul>
      {node}
    </div>
  );
}

/* ── Moodloop: fifteen people, six weeks of numbers ────────────────────── */
const SCALE_LABEL: Record<Scale, string> = { '1-5': '1 – 5', '1-10': '1 – 10', '1-20': '1 – 20', '1-50': '1 – 50', '1-100': '1 – 100', '1-100/2': '1 – 100, step 2' };
const SCALE_MAX: Record<Scale, number> = { '1-5': 5, '1-10': 10, '1-20': 20, '1-50': 50, '1-100': 100, '1-100/2': 100 };
const SCALE_ORDER: Scale[] = ['1-5', '1-10', '1-20', '1-50', '1-100', '1-100/2'];
const DAYS = 42;

function ScalesRecord() {
  const [focus, setFocus] = useState<Scale | 'switched' | 'all'>('all');
  const { show, hide, node } = useTip();
  const used = (scale: Scale) => moodloopRecord.filter(p => p.periods.some(x => x.scale === scale)).length;
  const switched = moodloopRecord.filter(p => new Set(p.periods.map(x => x.scale)).size > 1).length;
  return (
    <div className="rec rec--scales">
      <ul className="rec__foci" aria-label="Highlight">
        <li><button type="button" className={focus === 'all' ? 'is-on' : ''} onClick={() => setFocus('all')}>All 15</button></li>
        <li><button type="button" className={focus === 'switched' ? 'is-on' : ''} onClick={() => setFocus(focus === 'switched' ? 'all' : 'switched')}><b>{switched}</b> switched scale at least once</button></li>
        {SCALE_ORDER.filter(s => s !== '1-100/2').map(scale => (
          <li key={scale}><button type="button" className={`is-scale-${scale.replace('/', '-')}${focus === scale ? ' is-on' : ''}`} onClick={() => setFocus(focus === scale ? 'all' : scale)}><i className={`k-scale is-${scale.replace('/', '-')}`} /><b>{used(scale)}</b> used {SCALE_LABEL[scale]}</button></li>
        ))}
      </ul>
      <div className="rec__scroll" data-lenis-prevent-touch>
        <ol className="scales" style={{ '--days': DAYS } as CSSProperties}>
          <li className="scales__head mono" aria-hidden="true">
            <span />
            <span className="scales__axis">
              {[1, 2, 3, 4, 5, 6].map(w => <b key={w} style={{ left: `${((w - 1) / 6) * 100}%` }}>Week {w}</b>)}
              <em style={{ left: '50%' }}>Annotations switched on</em>
            </span>
          </li>
          {moodloopRecord.map((person, row) => {
            const scalesUsed = new Set(person.periods.map(x => x.scale));
            const dim = focus === 'all' ? false : focus === 'switched' ? scalesUsed.size < 2 : !scalesUsed.has(focus) && !(focus === '1-100' && scalesUsed.has('1-100/2'));
            let offset = 0;
            return (
              <li key={person.id} className={`scales__row${dim ? ' is-dim' : ''}`} style={{ '--r': row } as CSSProperties}>
                <span className="scales__who mono">{person.id}</span>
                <span className="scales__track">
                  <i className="scales__phase" aria-hidden="true" />
                  {person.periods.map((period, index) => {
                    const left = (offset / DAYS) * 100;
                    const width = (period.days / DAYS) * 100;
                    offset += period.days;
                    const faded = focus !== 'all' && focus !== 'switched' && !(period.scale === focus || (focus === '1-100' && period.scale === '1-100/2'));
                    const label = `${person.id}, period ${index + 1}: scale ${SCALE_LABEL[period.scale]} for ${plural(period.days, 'day')}. ${plural(period.reports, 'report')}${period.avg !== null ? `, average ${period.avg} of ${SCALE_MAX[period.scale]}` : ''}, ${plural(period.annotations, 'annotation')}.`;
                    const content = (
                      <>
                        <span className="mono">{person.id} · period {index + 1} · {plural(period.days, 'day')}</span>
                        <b>Scale {SCALE_LABEL[period.scale]}</b>
                        <span>{plural(period.reports, 'report')}{period.avg !== null ? `, average ${period.avg} / ${SCALE_MAX[period.scale]}` : ''}</span>
                        <span>{period.annotations ? `${plural(period.annotations, 'annotation')}` : 'No annotations'}</span>
                      </>
                    );
                    return (
                      <button
                        key={index}
                        type="button"
                        className={`scales__period is-${period.scale.replace('/', '-')}${faded ? ' is-faded' : ''}`}
                        style={{ left: `${left}%`, width: `calc(${width}% - 2px)`, '--c': index } as CSSProperties}
                        aria-label={label}
                        onMouseEnter={event => show(event.currentTarget, content)}
                        onMouseLeave={hide}
                        onFocus={event => show(event.currentTarget, content)}
                        onBlur={hide}
                      >
                        <span className="scales__dots" aria-hidden="true">
                          {Array.from({ length: period.reports }, (_, i) => <i key={i} className={i < period.annotations ? 'is-noted' : ''} />)}
                        </span>
                        {period.avg !== null ? <i className="scales__avg" style={{ left: `${(period.avg / SCALE_MAX[period.scale]) * 100}%` }} aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <ul className="rec__key mono">
        <li><i className="k-scale is-1-10" />1 – 10</li>
        <li><i className="k-scale is-1-5" />1 – 5</li>
        <li><i className="k-scale is-1-100" />1 – 100</li>
        <li><i className="k-scale is-1-100-2" />1 – 100 in steps of 2</li>
        <li><i className="k-scale is-1-20" />1 – 20</li>
        <li><i className="k-scale is-1-50" />1 – 50</li>
        <li><i className="k-report" />One report</li>
        <li><i className="k-report is-noted" />Annotated report</li>
        <li><i className="k-avg" />Average score, left to right across the scale</li>
        <li><i className="k-phase" />Weeks 4–6: annotations available</li>
      </ul>
      {node}
    </div>
  );
}

/* ── Physicify: what people weighed, what broke plans, what history taught ── */
function Share({ n, of, label }: { n: number; of: number; label?: string }) {
  return (
    <span className="share" aria-label={`${n} of ${of}${label ? ` ${label}` : ''}`}>
      <span className="share__marks" aria-hidden="true">
        {Array.from({ length: of }, (_, i) => <i key={i} className={i < n ? 'is-on' : ''} style={{ '--i': i } as CSSProperties} />)}
      </span>
      <span className="share__label mono">{n} <em>of</em> {of}{label ? ` ${label}` : ''}</span>
    </span>
  );
}

function PlanningRecord({ spec }: { spec: Extract<RecordSpec, { kind: 'planning' }> }) {
  return (
    <div className="rec rec--planning">
      <ol className="plan">
        {spec.columns.map((column, ci) => (
          <Reveal as="li" key={column.label} delay={ci * 140} className="plan__col">
            <span className="mono plan__label"><b>{pad(ci + 1)}</b> {column.label}</span>
            <ul>
              {column.items.map(item => (
                <li key={item.title}>
                  <span className="plan__title">{item.title}</span>
                  <Share n={item.n} of={item.of} />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

/* ── CareWork: who took part, and what they said ───────────────────────── */
const GLYPHS = { physician: Stethoscope, dietitian: Utensils, dentist: Smile, speech: Ear, nurse: HeartHandshake, educator: GraduationCap };
function RosterRecord({ spec }: { spec: Extract<RecordSpec, { kind: 'roster' }> }) {
  const maxYears = Math.max(...spec.people.map(p => p.years));
  return (
    <div className="rec rec--roster">
      <ol className="roster">
        {spec.people.map((person, index) => {
          const Glyph = GLYPHS[person.glyph];
          return (
            <Reveal as="li" key={person.id} delay={index * 45} className="roster__card">
              <span className="roster__glyph" aria-hidden="true"><Glyph size={18} /></span>
              <span className="roster__id mono">{person.id} · {person.studies}</span>
              <b className="roster__role">{person.role}</b>
              <span className="roster__field">{person.field}</span>
              <span className="roster__years" title={`${person.years} years of experience`}><i style={{ width: `${(person.years / maxYears) * 100}%` }} /><span className="mono">{person.years} yr</span></span>
              {person.case ? <span className="roster__case mono">{person.case}</span> : null}
            </Reveal>
          );
        })}
      </ol>
      <div className="themes">
        {spec.themes.map((theme, index) => (
          <Reveal key={theme.label} delay={index * 120} className="themes__col">
            <span className="mono themes__label">{theme.label}</span>
            <ul>{theme.items.map(item => <li key={item}>{item}</li>)}</ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ── EcoCare: the decision, twice ──────────────────────────────────────── */
function DecisionsRecord({ spec }: { spec: Extract<RecordSpec, { kind: 'decisions' }> }) {
  return (
    <div className="rec rec--decisions">
      <div className="decide">
        <Reveal className="decide__people">
          {spec.groups.map(group => (
            <span key={group.label}>
              <span className="share__marks" aria-hidden="true">{Array.from({ length: group.n }, (_, i) => <i key={i} className="is-on" />)}</span>
              <span className="mono">{group.n} {group.label}</span>
            </span>
          ))}
        </Reveal>
        <ol className="decide__steps">
          {spec.steps.map((step, index) => (
            <Reveal as="li" key={step.label} delay={index * 120} className={`is-${step.tone}`}>
              <span className="mono">{pad(index + 1)}</span>
              <b>{step.label}</b>
              <p>{step.body}</p>
            </Reveal>
          ))}
        </ol>
        <ul className="decide__scenarios">
          {spec.scenarios.map((scenario, index) => (
            <Reveal as="li" key={scenario.title} delay={index * 100}>
              <span className="mono">Scenario {String.fromCharCode(65 + index)}</span>
              <b>{scenario.title}</b>
              <p>{scenario.body}</p>
            </Reveal>
          ))}
        </ul>
        {spec.figure ? (
          <Reveal kind="clip" className="decide__figure">
            <Zoom shot={spec.figure}><img src={spec.figure.src} alt={spec.figure.alt} {...sizeOf(spec.figure.src)} loading="lazy" decoding="async" /></Zoom>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}

/* ── Insights with evidence ────────────────────────────────────────────── */
function EvidenceView({ evidence }: { evidence: Evidence }) {
  if (evidence.kind === 'share') return <Share n={evidence.n} of={evidence.of} label={evidence.label} />;
  if (evidence.kind === 'quote') {
    return (
      <blockquote className="rquote">
        <p>“{evidence.text}”</p>
        <footer className="mono">{evidence.who}</footer>
      </blockquote>
    );
  }
  return (
    <figure className="rshot">
      <Zoom shot={evidence.shot}><img src={evidence.shot.src} alt={evidence.shot.alt} {...sizeOf(evidence.shot.src)} loading="lazy" decoding="async" /></Zoom>
      {evidence.shot.caption ? <figcaption className="mono">{evidence.shot.caption}</figcaption> : null}
    </figure>
  );
}

/* ── The block ─────────────────────────────────────────────────────────── */
export function Research({ block, soft }: { block: ResearchBlock; soft: string }) {
  const record = block.record;
  return (
    <section className="block block--research shell" style={{ '--soft': soft } as CSSProperties}>
      <div className="block__head">
        <Reveal kind="fade" className="mono block__eyebrow">{block.eyebrow}{block.planned ? <span className="rbadge">Planned · no results yet</span> : null}</Reveal>
        <SplitText as="h2" className="h2 block__title" text={block.title} />
        {block.intro ? <Reveal delay={160}><p className="body-l muted block__intro">{block.intro}</p></Reveal> : null}
      </div>

      <div className="rglance">
        <Numbers items={block.numbers} />
        <TimelineGraphic spec={block.timeline} />
      </div>

      {record ? (
        <div className="rrecord">
          <div className="rrecord__head">
            <SplitText as="h3" className="h3" text={record.title} />
            <Reveal delay={120}><p className="muted">{record.body}</p></Reveal>
          </div>
          <Reveal kind="clip" className="rrecord__panel">
            {record.kind === 'strategies' ? <StrategiesRecord /> : null}
            {record.kind === 'scales' ? <ScalesRecord /> : null}
            {record.kind === 'planning' ? <PlanningRecord spec={record} /> : null}
            {record.kind === 'roster' ? <RosterRecord spec={record} /> : null}
            {record.kind === 'decisions' ? <DecisionsRecord spec={record} /> : null}
          </Reveal>
          {record.caption ? <Reveal kind="fade"><p className="rrecord__caption muted">{record.caption}</p></Reveal> : null}
        </div>
      ) : null}

      <div className="rinsights">
        <Reveal kind="fade" className="mono rinsights__label">{block.insightsLabel ?? (block.planned ? 'What it will tell us' : 'What we learned')}</Reveal>
        <ol className="rinsights__grid">
          {block.insights.map((insight, index) => (
            <Reveal as="li" key={insight.title} delay={(index % 2) * 120} className={`rinsight${insight.evidence ? ` rinsight--${insight.evidence.kind}` : ''}`}>
              <span className="mono rinsight__index">{pad(index + 1)}</span>
              <h3>{insight.title}</h3>
              <p>{insight.body}</p>
              {insight.evidence ? <div className="rinsight__evidence"><EvidenceView evidence={insight.evidence} /></div> : null}
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="rmethod">
        <Reveal kind="fade" className="mono rmethod__label">How it was run</Reveal>
        <dl className="rmethod__grid">
          {block.method.map((item, index) => (
            <Reveal as="div" key={item.label} delay={index * 50}>
              <dt className="mono">{item.label}</dt>
              <dd>{item.value}</dd>
            </Reveal>
          ))}
        </dl>
        {block.note || block.source ? (
          <Reveal kind="fade" className="rmethod__foot">
            {block.note ? <p className="block__note muted">{block.note}</p> : null}
            {block.source ? <a className="btn btn--ghost" href={block.source.href} target="_blank" rel="noopener noreferrer">{block.source.label} <ArrowUpRight size={18} aria-hidden="true" /></a> : null}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
