import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, MotionValue } from 'framer-motion';
import { 
  User, Briefcase, Smartphone, Footprints, Pill, Activity, 
  Globe, Syringe, Clock, Apple, FlaskConical, HeartHandshake, 
  Stethoscope, Tv, Building2, DollarSign, Home, HeartPulse, 
  RefreshCcw, LucideIcon
} from 'lucide-react';

interface DiagramElement {
  icon: LucideIcon;
  label: string;
  angle: number; 
  radius: number;
  size?: number;
  // Extra spacing between the icon and the text label (along the arc), in px.
  // Used to prevent long labels from overlapping their icons.
  labelGapPx?: number;
}

interface Layer {
  name: string;
  radius: number;
  width: number;
  elements: DiagramElement[];
}

const cx = 600;
const cy = 600;

// Helper to get coordinates
const getPos = (angle: number, r: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
};

const RingLayer: React.FC<{ 
  layer: Layer; 
  index: number; 
  svgRef: React.RefObject<SVGSVGElement>;
  svgSize: number;
  activeSystems?: Set<string>;
  spinRotation?: MotionValue<number>;
}> = ({ layer, index, svgRef, svgSize, activeSystems = new Set(), spinRotation }) => {
  // During drag we update rotation directly (no spring) for Safari performance.
  // On release we animate back to 0 with a spring.
  const rotation = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const lastAngle = useRef(0);
  const isDraggingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const groupRef = useRef<SVGGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRotationRef = useRef(0);
  const centerXRef = useRef<number | null>(null);
  const centerYRef = useRef<number | null>(null);
  const springAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const isRaisedRing = layer.name === 'MICROSYSTEM';

  // PERF (Safari): avoid React re-render on every frame while dragging.
  // We update the SVG transform attribute directly in rAF.
  useEffect(() => {
    const apply = () => {
      rafRef.current = null;
      if (!groupRef.current) return;
      const s = !isRaisedRing && spinRotation ? spinRotation.get() : 0;
      groupRef.current.setAttribute('transform', `rotate(${pendingRotationRef.current + s} ${cx} ${cy})`);
    };

    const unsubscribe = rotation.on('change', (v) => {
      pendingRotationRef.current = v;
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(apply);
    });

    // Subscribe to scroll spin changes too
    let spinUnsub: VoidFunction | undefined;
    if (!isRaisedRing && spinRotation) {
      spinUnsub = spinRotation.on('change', () => {
        if (rafRef.current != null) return;
        rafRef.current = requestAnimationFrame(apply);
      });
    }

    // Set initial transform
    pendingRotationRef.current = rotation.get();
    if (groupRef.current) {
      const s = !isRaisedRing && spinRotation ? spinRotation.get() : 0;
      groupRef.current.setAttribute('transform', `rotate(${pendingRotationRef.current + s} ${cx} ${cy})`);
    }

    return () => {
      unsubscribe();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (spinUnsub) spinUnsub();
    };
  }, [rotation, isRaisedRing, spinRotation]);

  // Angular Drag Logic
  const getAngle = (event: MouseEvent | TouchEvent | PointerEvent) => {
    // Use cached center during drag (Safari perf)
    let centerX = centerXRef.current;
    let centerY = centerYRef.current;
    if (centerX == null || centerY == null) {
      if (!svgRef.current) return 0;
      const rect = svgRef.current.getBoundingClientRect();
      // Map SVG user-space center (cx, cy) into screen coordinates
      centerX = rect.left + (cx / svgSize) * rect.width;
      centerY = rect.top + (cy / svgSize) * rect.height;
    }
    
    const clientX = (event as any).clientX || (event as any).touches?.[0].clientX;
    const clientY = (event as any).clientY || (event as any).touches?.[0].clientY;
    
    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    return angleRad * (180 / Math.PI);
  };

  const handlePointerDown: React.PointerEventHandler<SVGGElement> = (e) => {
    // Prevent scroll/drag image behaviors (esp. on touch devices)
    e.preventDefault();
    e.stopPropagation();

    // Capture pointer so we keep receiving move/up even if pointer leaves shape
    (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    activePointerIdRef.current = e.pointerId;

    // Stop any spring-back animation currently running
    springAnimRef.current?.stop?.();
    springAnimRef.current = null;

    // Cache center point for duration of drag
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      centerXRef.current = rect.left + (cx / svgSize) * rect.width;
      centerYRef.current = rect.top + (cy / svgSize) * rect.height;
    }

    lastAngle.current = getAngle(e.nativeEvent);
  };

  const handlePointerMove: React.PointerEventHandler<SVGGElement> = (e) => {
    if (!isDraggingRef.current) return;
    if (activePointerIdRef.current !== e.pointerId) return;

    const currentAngle = getAngle(e.nativeEvent);
    let delta = currentAngle - lastAngle.current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastAngle.current = currentAngle;
    rotation.set(rotation.get() + delta);
  };

  const endDrag = (pointerId: number) => {
    if (activePointerIdRef.current !== pointerId) return;
    isDraggingRef.current = false;
    activePointerIdRef.current = null;
    centerXRef.current = null;
    centerYRef.current = null;
    springAnimRef.current = animate(rotation, 0, { type: 'spring', ...springConfig });
  };

  const handlePointerUp: React.PointerEventHandler<SVGGElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    endDrag(e.pointerId);
  };

  const handlePointerCancel: React.PointerEventHandler<SVGGElement> = (e) => {
    endDrag(e.pointerId);
  };

  const microDividers = [162.5, 277.5, 17.5];


  const renderScaleTexture = () => {
    // “Complicated but elegant” = layered ticks + dot index + subtle dashed arc
    const baseOpacityMinor = 'text-text-light/10 dark:text-text-dark/10';
    const baseOpacityMajor = 'text-text-light/20 dark:text-text-dark/20';
    const accentOpacity = 'text-text-light/15 dark:text-text-dark/15';

    const isMicro = layer.name === 'MICROSYSTEM';
    const isMeso = layer.name === 'MESOSYSTEM';
    const isMacro = layer.name === 'MACROSYSTEM';
    const isChrono = layer.name === 'CHRONOSYSTEM';
    const shouldAvoidTopLabel = isMeso || isMacro || isChrono;
    // Small per-ring phase offsets so scale textures don't align perfectly
    // (keeps icons/labels stable; only the texture phase shifts).
    const scalePhaseDeg = isMicro ? 0 : isMeso ? 11 : isMacro ? -7 : 17; // chrono

    // Per-ring density
    const tickCount = isMicro ? 72 : isMeso ? 60 : isMacro ? 72 : 84; // chrono densest
    const majorEvery = isMicro ? 6 : isMeso ? 5 : isMacro ? 6 : 7;

    const step = 360 / tickCount;
    const rOuter = layer.radius + layer.width / 2 - (isMicro ? 10 : 8);
    const rDots = rOuter + (isMicro ? 8 : 10);
    const avoidCenterDeg = 270; // top of circle (matches label placement at startOffset 50%)
    const avoidWindowDeg = 22; // removes marks that would overlap system label

    // Secondary micro ticks (very subtle)
    const microTickCount = isMicro ? 120 : isChrono ? 120 : 0;
    const microStep = microTickCount ? 360 / microTickCount : 0;
    const rMicroOuter = layer.radius - layer.width / 2 + (isMicro ? 22 : 18);
    const rMicroInner = rMicroOuter - (isMicro ? 6 : 5);

    // Dashed arc engraving
    const arcR = layer.radius - (isMicro ? 6 : 8);

    return (
      <g pointerEvents="none">
        {/* Primary ticks + dot indices */}
        {Array.from({ length: tickCount }).map((_, i) => {
          const a = i * step + scalePhaseDeg;
          if (shouldAvoidTopLabel) {
            const diff = ((a - avoidCenterDeg + 540) % 360) - 180;
            if (Math.abs(diff) < avoidWindowDeg) return null;
          }
          const isMajor = i % majorEvery === 0;
          const len = isMajor ? (isMicro ? 14 : 12) : (isMicro ? 8 : 7);
          const start = getPos(a, rOuter - len);
          const end = getPos(a, rOuter);
          const dotPos = getPos(a, rDots);
          return (
            <g key={`scale-${layer.name}-${i}`}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                strokeWidth={isMajor ? 2 : 1}
                strokeLinecap="round"
                className={isMajor ? baseOpacityMajor : baseOpacityMinor}
              />
              <circle
                cx={dotPos.x}
                cy={dotPos.y}
                r={isMajor ? 2.0 : 1.1}
                fill="currentColor"
                className={isMajor ? baseOpacityMajor : baseOpacityMinor}
              />
            </g>
          );
        })}

        {/* Secondary micro ticks (extra detail) */}
        {microTickCount > 0 &&
          Array.from({ length: microTickCount }).map((_, i) => {
            const a = i * microStep + scalePhaseDeg;
            if (shouldAvoidTopLabel) {
              const diff = ((a - avoidCenterDeg + 540) % 360) - 180;
              if (Math.abs(diff) < avoidWindowDeg) return null;
            }
            const start = getPos(a, rMicroInner);
            const end = getPos(a, rMicroOuter);
            return (
              <line
                key={`microtick-${layer.name}-${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                className={accentOpacity}
                opacity={0.55}
              />
            );
          })}

        {/* Subtle dashed engraving arc */}
        <circle
          cx={cx}
          cy={cy}
          r={arcR}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={isMicro ? '2 10' : '2 14'}
          className="text-text-light/10 dark:text-text-dark/10"
        />
      </g>
    );
  };

  return (
    <g
      ref={groupRef}
      transform={`rotate(0 ${cx} ${cy})`}
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className="cursor-grab active:cursor-grabbing"
    >
      {renderScaleTexture()}

      {/* Wide transparent hit ring to reliably capture drags */}
      <circle
        cx={cx}
        cy={cy}
        r={layer.radius}
        fill="transparent"
        stroke="transparent"
        strokeWidth={layer.width + 24}
      />
      {/* Ring Body */}
      <circle
        cx={cx}
        cy={cy}
        r={layer.radius}
        fill="none"
        strokeWidth={layer.width}
        className={`transition-colors ${
          isRaisedRing
            ? 'stroke-bg-light dark:stroke-bg-dark'
            : 'stroke-text-light/5 dark:stroke-text-dark/5'
        }`}
        filter={isRaisedRing ? 'url(#ring-raised-shadow)' : undefined}
      />

      {/* Flat rings: add subtle engraved boundaries (vault-dial feel) */}
      {!isRaisedRing && (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={layer.radius - layer.width / 2}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-text-light/10 dark:text-text-dark/10"
          />
          <circle
            cx={cx}
            cy={cy}
            r={layer.radius + layer.width / 2}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-text-light/10 dark:text-text-dark/10"
          />
        </>
      )}
      
      {/* Guide Line (System Boundary) */}
      <circle
        cx={cx}
        cy={cy}
        r={layer.radius + layer.width/2}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-text-light/10 dark:text-text-dark/10"
      />


      {/* Layer Label - System Name */}
      {layer.name === 'MICROSYSTEM' && (
        // Inner boundary line to align MICROSYSTEM label on the inside edge
        <circle
          cx={cx}
          cy={cy}
          r={layer.radius - layer.width / 2 + 14}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-text-light/10 dark:text-text-dark/10"
        />
      )}

      {(() => {
        const isMicroLabel = layer.name === 'MICROSYSTEM';

        // MICROSYSTEM stays on the inner edge.
        // Other system labels should sit just inside the OUTER boundary line.
        const labelRadius = isMicroLabel
          ? layer.radius - layer.width / 2 + 14
          : layer.radius + layer.width / 2 - 34;

        return (
          <>
            <path
              id={`curve-text-${index}`}
              d={`M ${cx - labelRadius},${cy} A ${labelRadius},${labelRadius} 0 0,0 ${cx + labelRadius},${cy}`}
              fill="none"
            />
            <text
              className="text-[12px] uppercase font-bold tracking-[0.4em] fill-text-light/30 dark:fill-text-dark/30 pointer-events-none select-none"
              dy={isMicroLabel ? 10 : 10}
            >
              <textPath href={`#curve-text-${index}`} startOffset="50%" textAnchor="middle">
                {layer.name}
              </textPath>
            </text>
          </>
        );
      })()}

      {/* Dividers (Microsystem only) */}
      {layer.name === 'MICROSYSTEM' && microDividers.map((angle, i) => {
          const rCenter = layer.radius;
          const h = 24; 
          const start = getPos(angle, rCenter - h);
          const end = getPos(angle, rCenter + h);
          return (
            <line 
              key={`div-${i}`}
              x1={start.x} y1={start.y} 
              x2={end.x} y2={end.y} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
              className="text-text-light/10 dark:text-text-dark/10"
            />
          );
      })}

      {/* Elements */}
      {layer.elements.map((el, j) => {
        const { x, y } = getPos(el.angle, el.radius);
        const isMicrosystem = layer.name === 'MICROSYSTEM';
        
        // Normalize angle 0-360 for flip check
        let normalizedAngle = el.angle % 360;
        if (normalizedAngle < 0) normalizedAngle += 360;
        
        // Flip Logic: Flip text on the bottom half (0 to 180) to be readable
        // 0-90 (Bottom Right) and 90-180 (Bottom Left)
        const isBottomHalf = normalizedAngle > 0 && normalizedAngle < 180;

        // Radii for text path
        const pathRadius = isMicrosystem ? (layer.radius + layer.width/2 - 5) : layer.radius;
        
        // Angular offset for text (Gap between icon and text)
        // Increased to avoid overlap
        // Default is 55px; can be overridden per element for long labels.
        const gapPx = isMicrosystem ? 0 : (el.labelGapPx ?? 55);
        const angleGap = isMicrosystem ? 0 : (gapPx / layer.radius) * (180 / Math.PI);
        
        const layerNameTitleCase = layer.name.charAt(0) + layer.name.slice(1).toLowerCase();
        const isActiveSystem = activeSystems.has(layerNameTitleCase);
        
        return (
          <g key={`${layer.name}-${j}`} className="group">
              {/* Text Label */}
              {isBottomHalf ? (
                // Bottom Half: Reversed Path (CCW)
                <g>
                  <path 
                    id={`label-path-${layer.name}-${j}-rev`}
                    d={`M ${cx + pathRadius},${cy} A ${pathRadius},${pathRadius} 0 0,0 ${cx - pathRadius},${cy} A ${pathRadius},${pathRadius} 0 0,0 ${cx + pathRadius},${cy}`}
                    fill="none"
                  />
                  <text 
                    className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 pointer-events-none select-none
                      ${isMicrosystem 
                        ? 'opacity-0 group-hover:opacity-100 fill-text-light dark:fill-text-dark' 
                        : isActiveSystem 
                          ? 'opacity-100 fill-text-light dark:fill-text-dark' 
                          : 'opacity-60 group-hover:opacity-100 fill-text-light dark:fill-text-dark'}`} 
                    dy={isMicrosystem ? -10 : 4} 
                  >
                    <textPath 
                      href={`#label-path-${layer.name}-${j}-rev`} 
                      // For reversed path (0->360 CCW), angle A becomes 100 - (A/3.6)
                      startOffset={`${(1 - ((el.angle + (isMicrosystem ? 0 : -angleGap)) / 360)) * 100}%`} 
                      textAnchor="middle"
                    >
                      {el.label}
                    </textPath>
                  </text>
                </g>
              ) : (
                // Top Half: Standard Path (CW)
                <g>
                  <path 
                    id={`label-path-${layer.name}-${j}`}
                    d={`M ${cx + pathRadius},${cy} A ${pathRadius},${pathRadius} 0 0,1 ${cx - pathRadius},${cy} A ${pathRadius},${pathRadius} 0 0,1 ${cx + pathRadius},${cy}`}
                    fill="none"
                  />
                  <text 
                    className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 pointer-events-none select-none
                      ${isMicrosystem 
                        ? 'opacity-0 group-hover:opacity-100 fill-text-light dark:fill-text-dark' 
                        : isActiveSystem 
                          ? 'opacity-100 fill-text-light dark:fill-text-dark' 
                          : 'opacity-60 group-hover:opacity-100 fill-text-light dark:fill-text-dark'}`} 
                    dy={isMicrosystem ? 12 : 4} 
                  >
                    <textPath 
                      href={`#label-path-${layer.name}-${j}`} 
                      startOffset={`${((el.angle + (isMicrosystem ? 0 : angleGap)) / 360) * 100}%`} 
                      textAnchor="middle"
                    >
                      {el.label}
                    </textPath>
                  </text>
                </g>
              )}

              {/* Icon (Safari-safe: avoid foreignObject inside transformed SVG) */}
              <g transform={`translate(${x - 12}, ${y - 12})`} className="pointer-events-none">
                <el.icon
                  width={24}
                  height={24}
                  strokeWidth={2.5}
                  className={`transition-all duration-300 drop-shadow-[1px_1px_0px_rgba(255,255,255,0.8)] dark:drop-shadow-none
                    ${isActiveSystem 
                      ? 'text-blue-500 dark:text-blue-400 opacity-100' 
                      : 'text-text-light dark:text-text-dark opacity-50 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:opacity-100'}`}
                />
              </g>
              
              {/* Hit Area - Transparent Circle for Hover */}
              <circle cx={x} cy={y} r={35} fill="transparent" className="pointer-events-auto cursor-pointer" />
          </g>
        );
      })}
    </g>
  );
};

export const EcologicalDiagram: React.FC<{ activeSystems?: Set<string>; spinRotation?: MotionValue<number> }> = ({ activeSystems = new Set(), spinRotation }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgSize = 1200;
  
  const centerElements = [
    { icon: User, label: 'Patient', x: 0, y: 0, size: 50 }
  ];

  const rMicro = 190;
  const rMeso = 330;
  const rMacro = 430;
  const rChrono = 530;

  const layers: Layer[] = [
    {
      name: 'MICROSYSTEM',
      radius: rMicro,
      width: 180,
      elements: [
        { icon: Smartphone, label: 'Digital devices', angle: 260, radius: rMicro },
        { icon: Footprints, label: 'Open shoes', angle: 235, radius: rMicro },
        { icon: Pill, label: 'Medicines', angle: 210, radius: rMicro },
        { icon: Activity, label: 'Medical equipment', angle: 185, radius: rMicro },
        
        { icon: Syringe, label: 'Insulin injection', angle: 140, radius: rMicro },
        { icon: Footprints, label: 'Footcare', angle: 115, radius: rMicro },
        { icon: Clock, label: 'Routine', angle: 90, radius: rMicro },
        { icon: Apple, label: 'Diet', angle: 65, radius: rMicro },
        { icon: FlaskConical, label: 'Tests', angle: 40, radius: rMicro },
        
        { icon: HeartHandshake, label: 'Caregiver', angle: 295, radius: rMicro },
        { icon: Stethoscope, label: 'Medical Providers', angle: 325, radius: rMicro },
        { icon: Footprints, label: 'Podiatrist', angle: 355, radius: rMicro },
      ]
    },
    {
      name: 'MESOSYSTEM',
      radius: rMeso,
      width: 100,
      elements: [
        // Evenly spaced (120° apart) to keep balance on the ring
        { icon: Globe, label: 'Internet', angle: 90, radius: rMeso },
        { icon: Tv, label: 'Media', angle: 210, radius: rMeso },
        { icon: Building2, label: 'Healthcare System', angle: 330, radius: rMeso, labelGapPx: 110 },
      ]
    },
    {
      name: 'MACROSYSTEM',
      radius: rMacro,
      width: 100,
      elements: [
        { icon: DollarSign, label: 'Economic Status', angle: 225, radius: rMacro, labelGapPx: 110 },
        { icon: Briefcase, label: "Caregiver's Workspace", angle: 315, radius: rMacro, labelGapPx: 120 },
        { icon: Home, label: 'Relocation', angle: 45, radius: rMacro },
      ]
    },
    {
      name: 'CHRONOSYSTEM',
      radius: rChrono,
      width: 100,
      elements: [
        { icon: RefreshCcw, label: 'Changes in treatment', angle: 270, radius: rChrono, labelGapPx: 120 },
        { icon: HeartPulse, label: 'Changes in health condition', angle: 135, radius: rChrono, labelGapPx: 140 },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1 }}
      className="w-full flex justify-center lg:justify-end items-center py-12"
    >
      <div 
        className="relative flex-none scale-75 md:scale-90 lg:scale-100 origin-center lg:origin-right" 
        style={{ width: 1000, height: 1000 }}
      >
        {/* Safari can clip SVG content outside the viewBox unless overflow is set via SVG attribute. */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          overflow="visible"
          className="w-full h-full font-sans select-none overflow-visible"
        >
          <defs>
            <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-text-light/5 dark:text-text-dark/5" />
            </pattern>

            {/* Raised ring shadow (Safari-safe replacement for CSS drop-shadow) */}
            <filter id="ring-raised-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="blur" />
              <feOffset in="blur" dx="0" dy="6" result="offsetBlur" />
              <feColorMatrix
                in="offsetBlur"
                type="matrix"
                values="
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0.18 0
                "
                result="shadow"
              />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width={svgSize} height={svgSize} fill="url(#grid-pattern)" className="opacity-50" />

          {/* Render Layers Outer to Inner for Pyramid Stacking */}
          {layers.slice().reverse().map((layer, i) => (
             <RingLayer key={layer.name} layer={layer} index={i} svgRef={svgRef} svgSize={svgSize} activeSystems={activeSystems} spinRotation={spinRotation} />
          ))}

          {/* Center Group (Patient) */}
          <g>
            {/* Center surface (restored neumorphism). Safari-safe by using XHTML namespace. */}
            <foreignObject x={cx - 100} y={cy - 100} width={200} height={200}>
              <div
                {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as any)}
                className="w-full h-full rounded-full flex items-center justify-center
                   bg-bg-light dark:bg-bg-dark
                   shadow-[inset_6px_6px_12px_rgba(163,177,198,0.3),inset_-6px_-6px_12px_rgba(255,255,255,0.8)]
                   dark:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.05)]
                   border border-text-light/5 dark:border-text-dark/5"
              />
            </foreignObject>

            {centerElements.map((el, i) => (
              <g key={i} transform={`translate(${cx + el.x}, ${cy + el.y})`}>
                 <g transform={`translate(${-((el.size * 0.7) / 2)}, ${-((el.size * 0.7) / 2)})`} className="pointer-events-none">
                   <el.icon
                     width={el.size * 0.7}
                     height={el.size * 0.7}
                     strokeWidth={2.5}
                     className="text-text-light dark:text-text-dark opacity-50 drop-shadow-[1px_1px_0px_rgba(255,255,255,0.8)] dark:drop-shadow-none"
                   />
                 </g>
                 <text y={el.size/2 + 18} textAnchor="middle" className="text-[11px] font-bold fill-text-light dark:fill-text-dark uppercase tracking-wider opacity-80" style={{ textShadow: 'var(--text-drop-shadow)' }}>
                   {el.label}
                 </text>
              </g>
            ))}
          </g>

        </svg>
      </div>
    </motion.div>
  );
};
