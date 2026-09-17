import { useEffect, useMemo, useState } from 'react';
import './demos.css';

/*
 * A simplified, illustrative version of EcoCare's model: entities on three
 * ecological layers around a simulated patient, and life-changing events that
 * strain, break or re-route the connections between them.
 */
type Ring = 1 | 2 | 3;
interface EcoNode { id: string; label: string; ring: Ring; angle: number }
const RADII: Record<Ring, number> = { 1: 104, 2: 190, 3: 272 };
const C = 320;

const NODES: EcoNode[] = [
  { id: 'cgm', label: 'Glucose monitor', ring: 1, angle: -118 },
  { id: 'insulin', label: 'Insulin pen', ring: 1, angle: -58 },
  { id: 'diet', label: 'Pantry & diet', ring: 1, angle: 2 },
  { id: 'meds', label: 'Medication routine', ring: 1, angle: 62 },
  { id: 'foot', label: 'Foot care routine', ring: 1, angle: 122 },
  { id: 'work', label: 'Work schedule', ring: 1, angle: 182 },
  { id: 'educator', label: 'Diabetes educator', ring: 2, angle: -90 },
  { id: 'pharmacy', label: 'Local pharmacy', ring: 2, angle: -38 },
  { id: 'partner', label: 'Partner · caregiver', ring: 2, angle: 12 },
  { id: 'daughter', label: 'Adult daughter', ring: 2, angle: 58 },
  { id: 'podiatrist', label: 'Podiatrist', ring: 2, angle: 104 },
  { id: 'visits', label: 'Clinic visits', ring: 2, angle: 150 },
  { id: 'pcp', label: 'Primary care', ring: 2, angle: 196 },
  { id: 'plan', label: 'Treatment plan', ring: 2, angle: 242 },
  { id: 'portal', label: 'Patient portal', ring: 3, angle: -96 },
  { id: 'guidelines', label: 'Care guidelines', ring: 3, angle: -44 },
  { id: 'transport', label: 'Transportation', ring: 3, angle: 6 },
  { id: 'norms', label: 'Family norms', ring: 3, angle: 52 },
  { id: 'insurance', label: 'Health insurance', ring: 3, angle: 96 },
  { id: 'employer', label: 'Employer policy', ring: 3, angle: 176 },
  { id: 'system', label: 'Healthcare system', ring: 3, angle: 228 },
];

const LINKS: [string, string][] = [
  ['insurance', 'insulin'], ['insurance', 'pharmacy'], ['insurance', 'pcp'], ['pharmacy', 'insulin'], ['pharmacy', 'meds'],
  ['partner', 'foot'], ['partner', 'diet'], ['partner', 'transport'], ['partner', 'visits'],
  ['daughter', 'partner'], ['daughter', 'diet'], ['norms', 'daughter'], ['norms', 'diet'],
  ['educator', 'cgm'], ['educator', 'diet'], ['portal', 'cgm'], ['portal', 'pcp'], ['system', 'portal'], ['system', 'insurance'],
  ['pcp', 'plan'], ['plan', 'meds'], ['guidelines', 'pcp'], ['guidelines', 'educator'],
  ['podiatrist', 'foot'], ['visits', 'podiatrist'], ['visits', 'pcp'], ['transport', 'visits'],
  ['employer', 'work'], ['work', 'foot'], ['work', 'visits'],
];

interface Scenario {
  id: string;
  label: string;
  source?: string;
  strained: string[];
  broken: string[];
  rerouted: [string, string][];
  note: string;
}
const key = (a: string, b: string) => [a, b].sort().join('|');
const SCENARIOS: Scenario[] = [
  { id: 'baseline', label: 'Baseline', strained: [], broken: [], rerouted: [],
    note: 'A steady state. Practices sit closest to Jordan, the people who help come next, and systems such as insurance and work form the outer layer.' },
  { id: 'insurance', label: 'Insurance drops insulin coverage', source: 'insurance',
    strained: ['insulin', 'pharmacy', 'meds', 'pcp', 'plan'], broken: [key('insurance', 'insulin'), key('insurance', 'pharmacy')], rerouted: [],
    note: 'Coverage ends. The pen, the pharmacy run and the medication routine all lose their footing, and the treatment plan now needs a clinician’s attention.' },
  { id: 'surgery', label: 'Partner has hand surgery', source: 'partner',
    strained: ['foot', 'diet', 'visits', 'transport', 'podiatrist'], broken: [key('partner', 'foot'), key('partner', 'transport'), key('partner', 'visits')], rerouted: [['daughter', 'foot'], ['daughter', 'visits']],
    note: 'For weeks the partner cannot change dressings or drive. Foot care and clinic visits are exposed; the adult daughter is the likely new route.' },
  { id: 'relocation', label: 'Relocation away from family', source: 'daughter',
    strained: ['partner', 'diet', 'norms', 'transport'], broken: [key('daughter', 'partner'), key('daughter', 'diet')], rerouted: [],
    note: 'Moving removes the back-up. The partner carries more, and shared meals and rides need a new plan.' },
];

const position = (node: EcoNode) => {
  const radians = (node.angle * Math.PI) / 180;
  return { x: C + Math.cos(radians) * RADII[node.ring], y: C + Math.sin(radians) * RADII[node.ring] };
};
const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  // Pull the control point toward the centre so links read as orbits, not wires.
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${(mx + (C - mx) * 0.32).toFixed(1)} ${(my + (C - my) * 0.32).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

export function EcologyDemo() {
  const [scenarioId, setScenarioId] = useState('baseline');
  const [hovered, setHovered] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const scenario = SCENARIOS.find(item => item.id === scenarioId)!;
  const points = useMemo(() => Object.fromEntries(NODES.map(node => [node.id, position(node)])), []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setTyped(scenario.note); return; }
    setTyped('');
    let count = 0;
    const id = window.setInterval(() => {
      count += 2;
      setTyped(scenario.note.slice(0, count));
      if (count >= scenario.note.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [scenario]);

  const active = scenario.id !== 'baseline';
  const touched = new Set<string>([...(scenario.source ? [scenario.source] : []), ...scenario.strained, ...scenario.rerouted.flat()]);

  return (
    <div className={`demo eco${active ? ' is-event' : ''}`}>
      <div className="eco__map">
        <svg viewBox="-86 0 812 640" role="img" aria-label={`Care ecology map. Scenario: ${scenario.label}. ${scenario.note}`}>
          <circle cx={C} cy={C} r={RADII[3] + 26} className="eco__layer eco__layer--3" />
          <circle cx={C} cy={C} r={RADII[2] + 30} className="eco__layer eco__layer--2" />
          <circle cx={C} cy={C} r={RADII[1] + 34} className="eco__layer eco__layer--1" />
          {[1, 2, 3].map(ring => <circle key={ring} cx={C} cy={C} r={RADII[ring as Ring]} className="eco__orbit" />)}

          <g className="eco__links">
            {LINKS.map(([a, b]) => {
              const id = key(a, b);
              const broken = scenario.broken.includes(id);
              const lit = hovered ? a === hovered || b === hovered : false;
              return <path key={id} d={curve(points[a], points[b])} className={`eco__link${broken ? ' is-broken' : ''}${lit ? ' is-lit' : ''}`} />;
            })}
            {scenario.rerouted.map(([a, b]) => <path key={`r-${a}-${b}`} d={curve(points[a], points[b])} className="eco__link is-rerouted" />)}
          </g>

          <g className="eco__patient">
            <circle cx={C} cy={C} r="30" />
            <text x={C} y={C + 4} textAnchor="middle">Jordan</text>
          </g>

          {NODES.map(node => {
            const point = points[node.id];
            const isSource = scenario.source === node.id;
            const isStrained = scenario.strained.includes(node.id);
            const isRerouted = scenario.rerouted.some(pair => pair.includes(node.id)) && !isSource;
            const dim = active && !touched.has(node.id);
            const right = Math.cos((node.angle * Math.PI) / 180) >= -0.2;
            return (
              <g
                key={node.id}
                className={`eco__node eco__node--r${node.ring}${isSource ? ' is-source' : ''}${isStrained ? ' is-strained' : ''}${isRerouted ? ' is-rerouted' : ''}${dim ? ' is-dim' : ''}`}
                transform={`translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`}
                onPointerEnter={() => setHovered(node.id)}
                onPointerLeave={() => setHovered(null)}
              >
                {isSource ? <circle className="eco__ripple" r="9" /> : null}
                {isSource ? <circle className="eco__ripple eco__ripple--late" r="9" /> : null}
                <circle className="eco__hit" r="18" />
                <circle className="eco__dot" r={node.ring === 1 ? 6 : 7} />
                <text x={right ? 13 : -13} y="4" textAnchor={right ? 'start' : 'end'}>{node.label}</text>
              </g>
            );
          })}
        </svg>
        <ul className="eco__layers mono" aria-label="Ecological layers, from the centre outwards">
          <li><i className="eco__swatch--1" />Practices & tools</li>
          <li><i className="eco__swatch--2" />People & care</li>
          <li><i className="eco__swatch--3" />Systems</li>
        </ul>
      </div>

      <div className="eco__panel">
        <span className="mono">Life-changing event</span>
        <div className="eco__chips" role="group" aria-label="Life-changing event">
          {SCENARIOS.map(item => (
            <button key={item.id} type="button" className={item.id === scenarioId ? 'is-on' : ''} aria-pressed={item.id === scenarioId} onClick={() => setScenarioId(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="eco__assistant">
          <span className="mono"><i aria-hidden="true" />Sense-making assistant</span>
          <p aria-hidden="true">{typed}<b className="eco__caret" /></p>
          <p className="sr-only" aria-live="polite">{scenario.note}</p>
        </div>
        <ul className="eco__legend mono">
          <li><i className="is-source" />Event source</li>
          <li><i className="is-strained" />Strained</li>
          <li><i className="is-broken" />Broken flow</li>
          <li><i className="is-rerouted" />Re-routed</li>
        </ul>
        <p className="eco__fine">Illustrative model of a simulated case, simplified from the prototype.</p>
      </div>
    </div>
  );
}
