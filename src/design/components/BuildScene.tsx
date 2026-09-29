import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Bell, Play, Square, User } from 'lucide-react';
import type { SceneFlow, SceneItem, SceneView, Side } from '../data/types';
import { Browser, Phone } from './Device';
import { useRevealRef } from './Reveal';

/*
 * The system as an illustrated scene. Everything is laid out on a fixed
 * 1200 × 640 canvas (so the composition holds) and the whole stage scales to
 * the page. Devices are the real screens in their frames, tilted; servers,
 * stores and models are drawn isometrically; ribbons carry the data between
 * them and light up when a part is chosen or a request is followed.
 */
export const SCENE_W = 1200;
export const SCENE_H = 640;

/* ── Isometric drawing kit ─────────────────────────────────────────────── */
const C = Math.cos(Math.PI / 6);
const S = 0.5;
const r1 = (n: number) => Math.round(n * 10) / 10;
/** Ground point (x along the right axis, y along the left axis, z up) → screen. */
const P = (x: number, y: number, z = 0): [number, number] => [(x - y) * C, (x + y) * S - z];
const pts = (list: [number, number][]) => list.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');

type Tone = 'paper' | 'ink' | 'accent';

/** A box with its back corner at the origin: w along x, d along y, h up. */
function IsoBox({ w, d, h, tone = 'paper', x = 0, y = 0, z = 0, children }: { w: number; d: number; h: number; tone?: Tone; x?: number; y?: number; z?: number; children?: ReactNode }) {
  const o = P(x, y, z);
  const top = [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)];
  const left = [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)];
  const right = [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)];
  return (
    <g className={`iso iso--${tone}`} transform={`translate(${r1(o[0])} ${r1(o[1])})`}>
      <polygon className="iso__left" points={pts(left)} />
      <polygon className="iso__right" points={pts(right)} />
      <polygon className="iso__top" points={pts(top)} />
      {children}
    </g>
  );
}

/** Soft shadow on the ground under an object. */
function Shadow({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse className="iso__shadow" cx={r1(cx)} cy={r1(cy)} rx={rx} ry={ry} />;
}

/** Matrix that maps a flat drawing (u right, v down) onto the top face of a box whose top-back corner is at (ox, oy). */
const onTop = (ox: number, oy: number) => `matrix(${C} ${S} ${-C} ${S} ${r1(ox)} ${r1(oy)})`;
/** …onto the front-left face (u along x, v down the face). */
const onLeft = (ox: number, oy: number) => `matrix(${C} ${S} 0 1 ${r1(ox)} ${r1(oy)})`;

const Server = () => {
  // three units, stacked; each with a slot and two lights on the front-left face
  const w = 96; const d = 60; const h = 13; const gap = 4;
  const units = [0, 1, 2];
  return (
    <svg className="iso-art" viewBox="-90 -70 180 150" aria-hidden="true">
      <Shadow cx={0} cy={45} rx={78} ry={22} />
      {units.map(i => {
        const z = i * (h + gap);
        const faceOrigin = P(0, d, z + h); // top-left corner of the front-left face
        return (
          <g key={i}>
            <IsoBox w={w} d={d} h={h} z={z} />
            <g transform={onLeft(faceOrigin[0], faceOrigin[1])}>
              <rect x="10" y="4" width="46" height="5" rx="2.5" className="iso__slot" />
              <circle cx="74" cy="6.5" r="2.2" className="iso__led iso__led--on" />
              <circle cx="84" cy="6.5" r="2.2" className="iso__led" />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

const Database = () => {
  const r = 40; const rx = r * Math.SQRT2 * C; const ry = r * Math.SQRT2 * S; const h = 16; const n = 3;
  return (
    <svg className="iso-art" viewBox="-90 -100 180 150" aria-hidden="true">
      <Shadow cx={0} cy={38} rx={70} ry={20} />
      {[0, 1, 2].map(i => {
        const top = -i * (h + 3);
        const bottom = top + h;
        return (
          <g key={i} className="iso iso--paper">
            <path className="iso__body" d={`M ${-rx} ${top} L ${-rx} ${bottom} A ${rx} ${ry} 0 0 0 ${rx} ${bottom} L ${rx} ${top} Z`} />
            <ellipse className="iso__top" cx="0" cy={top} rx={rx} ry={ry} />
            {i === n - 1 ? <ellipse className="iso__ring" cx="0" cy={top} rx={rx * 0.62} ry={ry * 0.62} /> : null}
          </g>
        );
      })}
    </svg>
  );
};

const Chip = () => {
  const w = 70; const d = 70; const h = 22;
  const topC = P(w / 2, d / 2, h);
  return (
    <svg className="iso-art" viewBox="-90 -80 180 150" aria-hidden="true">
      <Shadow cx={0} cy={40} rx={62} ry={18} />
      {/* pins along the two front edges */}
      {[0.2, 0.4, 0.6, 0.8].map(t => {
        const a = P(w * t, d, 4); const b = P(w * t, d + 10, 4);
        const c = P(w, d * t, 4); const e = P(w + 10, d * t, 4);
        return <g key={t} className="iso__pins"><line x1={r1(a[0])} y1={r1(a[1])} x2={r1(b[0])} y2={r1(b[1])} /><line x1={r1(c[0])} y1={r1(c[1])} x2={r1(e[0])} y2={r1(e[1])} /></g>;
      })}
      <IsoBox w={w} d={d} h={h} tone="ink">
        <g transform={onTop(0, -h)}>
          <rect x="10" y="10" width="50" height="50" rx="6" className="iso__die" />
        </g>
        <circle className="iso__glow" cx={r1(topC[0])} cy={r1(topC[1])} r="22" />
        <path className="iso__spark" d={`M ${r1(topC[0])} ${r1(topC[1]) - 9} l 2.4 6.6 6.6 2.4 -6.6 2.4 -2.4 6.6 -2.4 -6.6 -6.6 -2.4 6.6 -2.4 z`} />
      </IsoBox>
    </svg>
  );
};

/** A low platform other parts sit on, with a faint dot grid on top. */
const Slab = ({ w, d }: { w: number; d: number }) => {
  const h = 9;
  const dots: [number, number][] = [];
  for (let x = 14; x < w; x += 18) for (let y = 14; y < d; y += 18) dots.push(P(x, y, h));
  const width = (w + d) * C + 20; const height = (w + d) * S + h + 30;
  return (
    <svg className="iso-art iso-art--slab" viewBox={`${-(d * C) - 10} -10 ${width} ${height}`} aria-hidden="true" style={{ width, height }}>
      <Shadow cx={(w - d) * C / 2} cy={(w + d) * S / 2 + 10} rx={width * 0.42} ry={height * 0.22} />
      <IsoBox w={w} d={d} h={h}>
        {dots.map(([x, y], i) => <circle key={i} className="iso__dot" cx={r1(x)} cy={r1(y)} r="1.1" />)}
      </IsoBox>
    </svg>
  );
};

/** A tile with a flat glyph drawn on its top. */
const Tile = ({ glyph }: { glyph: 'lock' | 'calendar' | 'bell' }) => {
  const w = 64; const d = 64; const h = 9;
  const o = P(0, 0, h);
  return (
    <svg className="iso-art" viewBox="-90 -70 180 150" aria-hidden="true">
      <Shadow cx={0} cy={40} rx={58} ry={17} />
      <IsoBox w={w} d={d} h={h}>
        <g transform={onTop(o[0], o[1])} className="iso__glyph">
          {glyph === 'calendar' ? (
            <>
              <rect x="12" y="14" width="40" height="38" rx="4" />
              <path d="M12 24h40M22 10v8M42 10v8" />
              {[20, 32, 44].map(x => [32, 42].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" className={x === 32 && y === 32 ? 'is-acc' : ''} />))}
            </>
          ) : null}
          {glyph === 'lock' ? (
            <>
              <rect x="16" y="28" width="32" height="26" rx="5" />
              <path d="M22 28v-6a10 10 0 0 1 20 0v6" />
              <circle cx="32" cy="40" r="3" className="is-acc" />
              <path d="M32 43v5" className="is-acc" />
            </>
          ) : null}
          {glyph === 'bell' ? (
            <>
              <path d="M20 44h24l-3-6v-10a9 9 0 0 0-18 0v10z" />
              <path d="M28 48a4 4 0 0 0 8 0" />
              <circle cx="44" cy="22" r="4" className="is-acc" />
            </>
          ) : null}
        </g>
      </IsoBox>
    </svg>
  );
};

/** A small glowing sphere for weather, floating over its shadow. */
const Sun = () => (
  <svg className="iso-art" viewBox="-90 -84 180 150" aria-hidden="true">
    <Shadow cx={0} cy={46} rx={38} ry={11} />
    <circle className="iso__halo" cx="0" cy="-4" r="43" />
    <circle className="iso__sun" cx="0" cy="-4" r="25" />
    <circle className="iso__sun-hi" cx="-9" cy="-13" r="7.5" />
  </svg>
);

/* ── Items ─────────────────────────────────────────────────────────────── */
const ART: Record<string, () => JSX.Element> = {
  server: Server, database: Database, chip: Chip, sun: Sun,
  lock: () => <Tile glyph="lock" />, calendar: () => <Tile glyph="calendar" />, bell: () => <Tile glyph="bell" />,
};
/** Where the drawn body sits inside each piece of art, as fractions of its box; ribbons attach to this. */
const BODY: Record<string, [number, number, number, number]> = {
  server: [0.22, 0.16, 0.73, 0.8], database: [0.23, 0.25, 0.54, 0.68], chip: [0.13, 0.4, 0.74, 0.56], sun: [0.36, 0.37, 0.28, 0.33],
  lock: [0.2, 0.41, 0.6, 0.54], calendar: [0.2, 0.41, 0.6, 0.54], bell: [0.2, 0.41, 0.6, 0.54],
};

function Item({ item, hot, dim, onHot }: { item: SceneItem; hot: boolean; dim: boolean; onHot: (id: string | null) => void }) {
  const base: CSSProperties = { left: item.x, top: item.y };
  const cls = `scene__item scene__item--${item.type}${hot ? ' is-hot' : ''}${dim ? ' is-dim' : ''}`;
  const handlers = item.type === 'zone' || item.type === 'stat' ? {} : {
    onMouseEnter: () => onHot(item.id), onMouseLeave: () => onHot(null), onFocus: () => onHot(item.id), onBlur: () => onHot(null),
    onClick: () => onHot(hot ? null : item.id), tabIndex: 0, role: 'button' as const, 'aria-label': item.label ?? item.id,
  };
  const caption = item.label ? (
    <span className="scene__label">
      {item.kicker ? <span className="mono scene__kicker">{item.kicker}</span> : null}
      <b>{item.label}</b>
    </span>
  ) : null;

  if (item.type === 'zone') {
    return (
      <div className={cls} style={{ ...base, width: item.w, height: item.h }} data-item={item.id} aria-hidden="true">
        {item.label ? <span className="mono scene__zone-label">{item.label}</span> : null}
      </div>
    );
  }
  if (item.type === 'stat') {
    return (
      <div className={cls} style={base} data-item={item.id}>
        <span className="scene__stat-value">{item.value}</span>
        <span className="mono scene__stat-unit">{item.unit}</span>
      </div>
    );
  }
  if (item.type === 'phone') {
    return (
      <div className={cls} style={base} data-item={item.id} {...handlers}>
        <div className="scene__device" data-anchor style={{ '--tilt': `${item.tilt ?? -12}deg` } as CSSProperties}>
          <Phone shot={item.shot} decorative style={{ '--phone-w': `${item.w ?? 190}px` } as CSSProperties} />
        </div>
        {caption}
      </div>
    );
  }
  if (item.type === 'browser') {
    return (
      <div className={cls} style={base} data-item={item.id} {...handlers}>
        <div className="scene__device" data-anchor style={{ '--tilt': `${item.tilt ?? 10}deg` } as CSSProperties}>
          <Browser shot={item.shot} url={item.url} decorative style={{ width: item.w ?? 420 }} />
        </div>
        {caption}
      </div>
    );
  }
  if (item.type === 'slab') {
    return (
      <div className={cls} style={base} data-item={item.id} aria-hidden="true">
        <Slab w={item.w} d={item.d} />
        {item.label ? <span className="mono scene__slab-label">{item.label}</span> : null}
      </div>
    );
  }
  if (item.type === 'toast') {
    return (
      <div className={cls} style={base} data-item={item.id} {...handlers}>
        <div className="scene__toast" data-anchor>
          <span className="scene__toast-icon"><Bell size={14} strokeWidth={2} aria-hidden="true" /></span>
          <span className="scene__toast-text"><b>{item.app}</b><span>{item.title}</span><span className="scene__toast-body">{item.text}</span></span>
          <span className="mono scene__toast-when">now</span>
        </div>
        {caption}
      </div>
    );
  }
  if (item.type === 'role') {
    return (
      <div className={cls} style={base} data-item={item.id} {...handlers}>
        <div className="scene__role">
          <span className="scene__avatar"><User size={18} strokeWidth={1.75} aria-hidden="true" /></span>
          <span className="scene__role-text"><b>{item.title}</b><span>{item.role}</span>{item.tool ? <span className="mono scene__tool">{item.tool}</span> : null}</span>
        </div>
      </div>
    );
  }
  const Art = ART[item.type];
  const [bx, by, bw, bh] = BODY[item.type] ?? [0, 0, 1, 1];
  return (
    <div className={cls} style={{ ...base, '--s': item.scale ?? 1 } as CSSProperties} data-item={item.id} {...handlers}>
      <div className="scene__art">
        <Art />
        <span className="scene__anchor" data-anchor style={{ left: `${bx * 100}%`, top: `${by * 100}%`, width: `${bw * 100}%`, height: `${bh * 100}%` }} />
      </div>
      {caption}
    </div>
  );
}

/* ── Flows: ribbons between items, measured from the laid-out scene ────── */
interface Ribbon { id: string; d: string; head: string; mid: { x: number; y: number }; label?: string; from: string; to: string; quiet?: boolean }

function measureFlows(stage: HTMLElement, flows: SceneFlow[]): Ribbon[] {
  const box = (id: string) => {
    const item = stage.querySelector<HTMLElement>(`[data-item="${id}"]`);
    const el = item?.querySelector<HTMLElement>('[data-anchor]') ?? item;
    if (!el) return null;
    let x = 0; let y = 0; let node: HTMLElement | null = el;
    while (node && node !== stage) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 };
  };
  const anchor = (b: NonNullable<ReturnType<typeof box>>, side: Side, at = 0.5) =>
    side === 'left' ? { x: b.x, y: b.y + b.h * at } : side === 'right' ? { x: b.x + b.w, y: b.y + b.h * at } : side === 'top' ? { x: b.x + b.w * at, y: b.y } : { x: b.x + b.w * at, y: b.y + b.h };
  const dir = (side: Side) => (side === 'left' ? [-1, 0] : side === 'right' ? [1, 0] : side === 'top' ? [0, -1] : [0, 1]);
  return flows.flatMap(flow => {
    const a = box(flow.from); const b = box(flow.to);
    if (!a || !b) return [];
    const dx = b.cx - a.cx; const dy = b.cy - a.cy;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const fs: Side = flow.fromSide ?? (horizontal ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'bottom' : 'top');
    const ts: Side = flow.toSide ?? (horizontal ? (dx > 0 ? 'left' : 'right') : dy > 0 ? 'top' : 'bottom');
    const p = anchor(a, fs, flow.fromAt); const q = anchor(b, ts, flow.toAt);
    const dist = Math.hypot(q.x - p.x, q.y - p.y);
    const k = Math.min(160, Math.max(48, dist * 0.45)) * (flow.bend ?? 1);
    const [fdx, fdy] = dir(fs); const [tdx, tdy] = dir(ts);
    const c1 = { x: p.x + fdx * k, y: p.y + fdy * k };
    const c2 = { x: q.x + tdx * k, y: q.y + tdy * k };
    const at = (t: number, a0: number, b0: number, c0: number, d0: number) => (1 - t) ** 3 * a0 + 3 * (1 - t) ** 2 * t * b0 + 3 * (1 - t) * t ** 2 * c0 + t ** 3 * d0;
    const tl = flow.labelAt ?? 0.5;
    const mid = { x: at(tl, p.x, c1.x, c2.x, q.x), y: at(tl, p.y, c1.y, c2.y, q.y) };
    // arrowhead pointing into the target along the arriving side
    const ax = -tdx; const ay = -tdy; // direction of travel at the end
    const nx = -ay; const ny = ax;
    const head = `M ${r1(q.x - ax * 7 + nx * 4.5)} ${r1(q.y - ay * 7 + ny * 4.5)} L ${r1(q.x)} ${r1(q.y)} L ${r1(q.x - ax * 7 - nx * 4.5)} ${r1(q.y - ay * 7 - ny * 4.5)}`;
    const d = `M ${r1(p.x)} ${r1(p.y)} C ${r1(c1.x)} ${r1(c1.y)}, ${r1(c2.x)} ${r1(c2.y)}, ${r1(q.x)} ${r1(q.y)}`;
    return [{ id: flow.id, d, head, mid, label: flow.label, from: flow.from, to: flow.to, quiet: flow.quiet }];
  });
}

const STEP_MS = 1500;

export function Scene({ scene }: { scene: SceneView }) {
  const ref = useRevealRef<HTMLDivElement>(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [ribbons, setRibbons] = useState<Ribbon[]>([]);
  const [live, setLive] = useState(false);
  const [motion, setMotion] = useState(true);
  const [hot, setHot] = useState<string | null>(null);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const root = ref.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const fit = () => {
      const w = root.clientWidth;
      setScale(w >= 820 ? w / SCENE_W : Math.max(w / SCENE_W, 0.68));
      setRibbons(measureFlows(stage, scene.flows));
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(root);
    stage.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', fit, { once: true }); });
    document.fonts?.ready.then(fit).catch(() => undefined);
    const classes = new MutationObserver(() => { if (root.classList.contains('is-in')) setLive(true); });
    classes.observe(root, { attributes: true, attributeFilter: ['class'] });
    if (root.classList.contains('is-in')) setLive(true);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setMotion(!query.matches);
    onMotion();
    query.addEventListener('change', onMotion);
    return () => { resize.disconnect(); classes.disconnect(); query.removeEventListener('change', onMotion); };
  }, [ref, scene]);

  const path = scene.path ?? [];
  useEffect(() => {
    if (step < 0) return;
    if (step >= path.length) { const t = window.setTimeout(() => setStep(-1), STEP_MS); return () => window.clearTimeout(t); }
    const t = window.setTimeout(() => setStep(step + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [step, path.length]);

  const following = step >= 0;
  const currentFlow = step >= 0 && step < path.length ? scene.flows.find(f => f.id === path[step]) ?? null : null;
  const focusId = currentFlow ? currentFlow.to : hot;
  const anyHot = currentFlow !== null || hot !== null;
  const isHotFlow = (f: { id: string; from: string; to: string }) => (currentFlow ? f.id === currentFlow.id : hot !== null && (f.from === hot || f.to === hot));
  const isHotItem = (id: string) => (currentFlow ? id === currentFlow.from || id === currentFlow.to : hot === id);
  const shown = scene.items.find(i => i.id === focusId) ?? null;
  const nameOf = (id: string) => scene.items.find(i => i.id === id)?.label ?? id;
  const links = shown ? scene.flows.filter(f => f.from === shown.id || f.to === shown.id).map(f => (f.from === shown.id ? `→ ${nameOf(f.to)}${f.label ? ` · ${f.label}` : ''}` : `← ${nameOf(f.from)}${f.label ? ` · ${f.label}` : ''}`)) : [];
  const scrolls = scale * SCENE_W > (ref.current?.clientWidth ?? SCENE_W) + 1;

  return (
    // className stays constant here: the reveal system adds `is-in` to this element itself
    <div ref={ref} data-reveal="fade" className="scene">
      <svg className="scene__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="scene-shadow"><stop offset="0" className="st-shadow" stopOpacity="0.22" /><stop offset="1" className="st-shadow" stopOpacity="0" /></radialGradient>
          <linearGradient id="scene-cyl" x1="0" x2="1"><stop offset="0" stopColor="#e6e4de" /><stop offset="0.42" stopColor="#f7f6f2" /><stop offset="1" stopColor="#d2cfc7" /></linearGradient>
          <radialGradient id="scene-glow"><stop offset="0" className="st-acc" stopOpacity="0.55" /><stop offset="1" className="st-acc" stopOpacity="0" /></radialGradient>
          <radialGradient id="scene-sun" cx="0.36" cy="0.32" r="0.8"><stop offset="0" className="st-acc-light" /><stop offset="1" className="st-acc" /></radialGradient>
        </defs>
      </svg>
      <div className={`scene__viewport${scrolls ? ' is-scrolling' : ''}`} data-lenis-prevent-touch style={{ height: SCENE_H * scale }}>
        <div ref={stageRef} className={`scene__stage${live ? ' is-live' : ''}${following ? ' is-following' : ''}`} style={{ width: SCENE_W, height: SCENE_H, transform: `scale(${scale})` }}>
          {scene.items.map(item => <Item key={item.id} item={item} hot={isHotItem(item.id)} dim={anyHot && !isHotItem(item.id) && item.type !== 'zone' && item.type !== 'slab' && item.type !== 'stat'} onHot={setHot} />)}
          <svg key={live ? 'live' : 'idle'} className="scene__flows" width={SCENE_W} height={SCENE_H} aria-hidden="true">
            {ribbons.map((rb, i) => (
              <g key={rb.id} className={`flow${rb.quiet ? ' flow--quiet' : ''}${isHotFlow(rb) ? ' is-hot' : ''}${anyHot && !isHotFlow(rb) ? ' is-dim' : ''}`} style={{ '--i': i } as CSSProperties}>
                <path className="flow__core" d={rb.d} pathLength={1} />
                <path className="flow__head" d={rb.head} />
                {live && motion && !rb.quiet ? (
                  <circle className="flow__dot" r="3.4" fillOpacity="0">
                    <animateMotion path={rb.d} dur="3.8s" begin={`${1.2 + (i % 4) * 0.7}s`} repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" values="0;1;1;0" keyTimes="0;0.07;0.9;1" dur="3.8s" begin={`${1.2 + (i % 4) * 0.7}s`} repeatCount="indefinite" />
                  </circle>
                ) : null}
                {rb.label ? <text className="flow__label" x={rb.mid.x} y={rb.mid.y - 9} textAnchor="middle">{rb.label}</text> : null}
              </g>
            ))}
          </svg>
        </div>
      </div>
      {scrolls ? <p className="mono scene__swipe">Swipe to see the whole system →</p> : null}
      <div className="scene__foot">
        <div className="scene__caption" aria-live="polite">
          {shown ? (
            <>
              <p><b>{shown.label}</b> {shown.body}</p>
              {links.length ? <ul className="scene__links">{links.map(link => <li key={link}>{link}</li>)}</ul> : null}
            </>
          ) : (
            <p className="muted">{scene.hint ?? 'Select a part to see what it does and what moves between it and the rest, or follow one request through the system.'}</p>
          )}
        </div>
        {path.length ? (
          <button type="button" className={`scene__play${following ? ' is-on' : ''}`} onClick={() => setStep(following ? -1 : 0)} aria-pressed={following}>
            {following ? <Square size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
            {following ? 'Stop' : 'Follow a request'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
