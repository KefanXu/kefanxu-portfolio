import type { CSSProperties } from 'react';

/*
 * The cover illustration, drawn in code: an abstract poster for a field
 * issue. A sky in motion (a gradient, light streaks and a faint grid, softened
 * with a blur), a sun that wears EcoCare's ecology layers as thin rings, a pale
 * disc crossing it, capsule-shaped clouds from Trackya, and three soft bands
 * of very large circles for the ground. Printed with a halftone screen and a
 * little grain. After dark the sun becomes a moon.
 *
 * It is built as a stack of separate layers rather than one SVG, so that the
 * blur, the pointer parallax and the slow drifts are each a compositor-only
 * transform, filter or opacity on a whole layer. Nothing animates inside a
 * blurred layer; WebKit would re-run the blur on every frame. The palette,
 * and everything the night changes, live in --pz-* variables on the plate.
 */
const v = (name: string) => `var(--pz-${name})`;
const SUN = { x: 300, y: 318, r: 112 };

export function Poster({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`poster ${className}`.trim()} style={style} aria-hidden="true">
      {/* sky: gradient, grid, streaks and stars, blurred as one layer */}
      <div className="poster__layer poster__par poster__par--sky">
      <svg className="poster__sky" viewBox="0 0 528 560" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="pz-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: v('sky0') }} /><stop offset=".48" style={{ stopColor: v('sky1') }} /><stop offset="1" style={{ stopColor: v('sky2') }} />
          </linearGradient>
          <pattern id="pz-grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" style={{ stroke: v('grid') }} strokeWidth="1" /></pattern>
          <linearGradient id="pz-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".18" stopColor="#fff" /><stop offset=".82" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <mask id="pz-streak-mask"><rect x="-80" y="-40" width="700" height="640" fill="url(#pz-streak)" /></mask>
        </defs>
        <rect x="-80" y="-40" width="700" height="640" fill="url(#pz-sky)" />
        <rect x="-80" y="-40" width="700" height="480" fill="url(#pz-grid)" />
        <g mask="url(#pz-streak-mask)">
          <g style={{ fill: v('paper') }}>
            <rect x="-80" y="72" width="360" height="18" rx="9" opacity=".36" /><rect x="120" y="128" width="500" height="12" rx="6" opacity=".24" />
            <rect x="-60" y="186" width="280" height="24" rx="12" opacity=".28" /><rect x="250" y="226" width="400" height="10" rx="5" opacity=".22" />
            <rect x="10" y="296" width="230" height="14" rx="7" opacity=".2" /><rect x="310" y="404" width="340" height="20" rx="10" opacity=".16" />
          </g>
          <g style={{ fill: v('sun1') }}>
            <rect x="170" y="160" width="460" height="8" rx="4" opacity=".3" /><rect x="-60" y="248" width="330" height="9" rx="4.5" opacity=".24" /><rect x="200" y="362" width="420" height="7" rx="3.5" opacity=".26" />
          </g>
        </g>
        <g style={{ fill: v('paper'), opacity: v('star') }}>
          <circle cx="58" cy="60" r="1.4" /><circle cx="130" cy="34" r="1" /><circle cx="212" cy="112" r="1.6" /><circle cx="84" cy="150" r="1.1" /><circle cx="168" cy="196" r="1.2" /><circle cx="26" cy="106" r="1" />
          <circle cx="246" cy="52" r="1.1" /><circle cx="486" cy="38" r="1.4" /><circle cx="506" cy="118" r="1" /><circle cx="118" cy="256" r="1.1" /><circle cx="300" cy="24" r=".9" /><circle cx="440" cy="300" r="1.1" />
        </g>
      </svg>
      </div>

      <div className="poster__layer poster__par poster__par--sun">
      {/* the sun's glow, breathing */}
      <div className="poster__glow" />

      {/* the ecology, as rings around the sun; the whole layer turns */}
      <svg className="poster__rings" viewBox="-240 -240 480 480" focusable="false" style={{ stroke: v('ring') }}>
        <circle r="236" fill="none" strokeOpacity=".2" strokeDasharray="2 7" />
        <circle r="186" fill="none" strokeOpacity=".28" />
        <circle r="146" fill="none" strokeOpacity=".36" />
        <g fill="none" strokeOpacity=".4" strokeWidth="1"><path d="M-144 26 L-84 -120" /><path d="M-84 -120 L96 -170" /><path d="M132 62 L178 78" /><path d="M-186 -46 L-144 26" /><path d="M-34 -232 L-84 -120" /></g>
        <g style={{ fill: v('node'), stroke: v('ink') }} strokeWidth="1.2">
          <circle cx="-144" cy="26" r="4.5" /><circle cx="-84" cy="-120" r="4.5" /><circle cx="132" cy="62" r="4.5" /><circle cx="-186" cy="-46" r="4.5" /><circle cx="96" cy="-170" r="4.5" /><circle cx="178" cy="78" r="4.5" /><circle cx="-232" cy="80" r="4.5" /><circle cx="-34" cy="-232" r="4.5" />
        </g>
      </svg>

      {/* the sun (a moon after dark) and a far pale disc */}
      <svg className="poster__sun" viewBox="0 0 528 560" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="pz-sunfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: v('sun0') }} /><stop offset=".55" style={{ stopColor: v('sun1') }} /><stop offset="1" style={{ stopColor: v('sun2') }} />
          </linearGradient>
          <pattern id="pz-ht2" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".6" style={{ fill: v('paper') }} opacity=".26" /></pattern>
          <mask id="pz-moon"><rect width="528" height="560" fill="#fff" /><circle cx={SUN.x + 34} cy={SUN.y - 30} r="90" fill="#000" style={{ opacity: v('moon') }} /></mask>
        </defs>
        <circle cx="452" cy="118" r="118" style={{ fill: v('paper') }} opacity=".14" />
        <g mask="url(#pz-moon)"><circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="url(#pz-sunfill)" /><circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="url(#pz-ht2)" /></g>
      </svg>

      {/* the pale disc that crosses the sun, drifting */}
      <div className="poster__disc" />
      </div>

      {/* clouds, as capsules */}
      <div className="poster__layer poster__par poster__par--caps">
        <i className="poster__cap" style={{ left: '6.4%', top: '26.8%', width: '16.7%', height: '4.3%', background: '#47d5b3', opacity: 0.92 }} />
        <i className="poster__cap" style={{ left: '18.2%', top: '34.6%', width: '11%', height: '3.2%', background: '#f078b5', opacity: 0.92 }} />
        <i className="poster__cap" style={{ left: '4.2%', top: '42.1%', width: '21.2%', height: '4.3%', background: v('paper'), opacity: 0.9 }} />
        <i className="poster__cap" style={{ left: '79.2%', top: '20%', width: '13.3%', height: '3.6%', background: '#47d5b3', opacity: 0.7 }} />
      </div>

      {/* the ground: three soft bands and a sunset line */}
      <div className="poster__layer poster__par poster__par--hills">
      <svg className="poster__hills" viewBox="0 0 528 560" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="pz-band1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: v('ink'), stopOpacity: 0.05 }} /><stop offset="1" style={{ stopColor: v('ink'), stopOpacity: 0.36 }} /></linearGradient>
          <linearGradient id="pz-band2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: v('ink'), stopOpacity: 0.28 }} /><stop offset="1" style={{ stopColor: v('ink'), stopOpacity: 0.64 }} /></linearGradient>
          <linearGradient id="pz-band3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: v('band3'), stopOpacity: 0.85 }} /><stop offset=".5" style={{ stopColor: v('band3') }} /></linearGradient>
        </defs>
        <circle cx="70" cy="836" r="420" fill="url(#pz-band1)" />
        <circle cx="610" cy="906" r="466" fill="url(#pz-band2)" />
        <circle cx="210" cy="1020" r="530" fill="url(#pz-band3)" />
        <rect x="-40" y="452" width="620" height="7" rx="3.5" style={{ fill: v('sun1') }} opacity=".5" />
        <rect x="120" y="474" width="480" height="4" rx="2" style={{ fill: v('paper') }} opacity=".3" />
      </svg>
      </div>

      {/* the issue numeral, printed into the ground */}
      <span className="poster__issue">N°01</span>

      {/* the print: halftone screen and grain */}
      <div className="poster__layer poster__screen" />
      <div className="poster__layer poster__grain" />
    </div>
  );
}
