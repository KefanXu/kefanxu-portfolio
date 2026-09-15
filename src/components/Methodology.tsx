import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { LCDBezel } from './LCDBezel';
import {
  Palette,
  Code2,
  Rocket,
  Search,
  Wrench,
  Activity,
  Radio,
  Waves,
  Box,
  Link2,
  Mic,
  Eye,
  Users,
  Network,
  Map,
  PenTool,
  MousePointer2,
  ClipboardCheck,
  Figma,
  Database,
  Smartphone,
  Terminal,
  Gamepad2,
  GitBranch,
  Send,
  BarChart3,
  Sigma,
  LucideIcon,
} from 'lucide-react';
import { methodology, projects, MethodologyStage } from '../data/portfolio';

const stageIcons: LucideIcon[] = [Palette, Code2, Rocket];

const OUTPUT_CODES: Record<string, string> = {
  pecss: 'PCS',
  'historical-planning': 'PHY',
  'reflective-iteration': 'PLN',
};

const ITEM_ICONS: Record<string, LucideIcon> = {
  // methods
  'Interviews': Mic,
  'Contextual Inquiry': Eye,
  'Co-Design': Users,
  'Thematic Analysis': Network,
  'Affinity Mapping': Map,
  'Prototyping': PenTool,
  'Interaction Design': MousePointer2,
  'Usability Evaluation': ClipboardCheck,
  // tools
  'Figma': Figma,
  'NVivo': Database,
  'Swift': Code2,
  'React Native': Smartphone,
  'Python': Terminal,
  'Unity': Gamepad2,
  'Git': GitBranch,
  'TestFlight': Send,
  'Tableau': BarChart3,
  'R': Sigma,
  'MySQL': Database,
};

const MintDot = ({ active = false }: { active?: boolean }) => (
  <span
    className={`shrink-0 w-1.5 h-1.5 rounded-full ${
      active
        ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.75)]'
        : 'bg-[#1a2f23]/15'
    }`}
    aria-hidden
  />
);

const LcdTexture = () => (
  <>
    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.12)] pointer-events-none z-10 rounded-full" />
    <div
      className="absolute inset-0 opacity-[0.12] pointer-events-none rounded-full"
      style={{
        backgroundImage:
          'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
        backgroundSize: '4px 4px',
      }}
    />
  </>
);

/* ================================================================
 *  Idle pixel demo — design → develop → deploy
 * ================================================================ */

const PIX_COLS = 38;
const PIX_ROWS = 7;
const PIX_SIZE = 3;

type PixelPoint = readonly [number, number];

const mergePixels = (...groups: PixelPoint[][]): PixelPoint[] => groups.flat();

const rectOutline = (x: number, y: number, w: number, h: number): PixelPoint[] => {
  const pts: PixelPoint[] = [];
  for (let i = 0; i < w; i++) pts.push([x + i, y], [x + i, y + h - 1]);
  for (let j = 1; j < h - 1; j++) pts.push([x, y + j], [x + w - 1, y + j]);
  return pts;
};

const rectFill = (x: number, y: number, w: number, h: number): PixelPoint[] => {
  const pts: PixelPoint[] = [];
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) pts.push([x + i, y + j]);
  }
  return pts;
};

const hLine = (x: number, y: number, len: number): PixelPoint[] =>
  Array.from({ length: len }, (_, i) => [x + i, y] as PixelPoint);

const personIcon = (x: number, y: number): PixelPoint[] =>
  mergePixels([[x, y], [x, y + 1], [x, y + 2], [x - 1, y + 3], [x + 1, y + 3]]);

const rocketIcon = (x: number, y: number): PixelPoint[] =>
  mergePixels(
    [[x, y], [x - 1, y + 1], [x + 1, y + 1], [x - 1, y + 2], [x, y + 2], [x + 1, y + 2], [x, y + 3]],
    hLine(x - 2, y + 4, 5),
  );

const IDLE_PHASES = [
  {
    label: 'DESIGN',
    tagline: 'Discover needs',
    frames: [
      [[5, 3], [6, 4], [9, 2], [28, 3], [31, 5], [32, 2]],
      mergePixels(personIcon(7, 2), personIcon(30, 2), [[19, 3], [20, 3]]),
      mergePixels(personIcon(7, 2), personIcon(30, 2), hLine(11, 3, 16)),
      mergePixels(personIcon(7, 2), personIcon(30, 2), rectOutline(14, 2, 10, 4)),
      mergePixels(personIcon(7, 2), personIcon(30, 2), rectOutline(14, 2, 10, 4), [[16, 3], [18, 3], [20, 3], [22, 3]]),
      mergePixels(personIcon(7, 2), personIcon(30, 2), rectFill(15, 3, 8, 2), [[17, 4], [19, 4], [21, 4]]),
    ],
  },
  {
    label: 'DEVELOP',
    tagline: 'Build systems',
    frames: [
      rectOutline(14, 2, 10, 4),
      mergePixels(rectOutline(14, 2, 10, 4), [[12, 3], [12, 4]], [[25, 3], [25, 4]]),
      mergePixels(rectOutline(14, 2, 10, 4), hLine(15, 4, 8), [[12, 3], [25, 3]]),
      mergePixels(rectOutline(14, 2, 10, 4), rectFill(15, 3, 8, 2), [[12, 3], [25, 3]]),
      mergePixels(rectFill(14, 2, 10, 4), [[12, 2], [12, 5]], [[25, 2], [25, 5]], hLine(15, 3, 8)),
      mergePixels(rectFill(14, 1, 10, 5), [[12, 2], [12, 4]], [[25, 2], [25, 4]], [[17, 3], [19, 3], [21, 3]]),
    ],
  },
  {
    label: 'DEPLOY',
    tagline: 'Ship to the world',
    frames: [
      mergePixels(rectFill(15, 4, 8, 2), [[17, 3], [21, 3]]),
      mergePixels(rectFill(15, 4, 8, 2), rocketIcon(19, 1)),
      mergePixels(rectFill(15, 5, 8, 1), rocketIcon(19, 0), [[18, 5], [19, 5], [20, 5]]),
      mergePixels(rectFill(15, 5, 8, 1), rocketIcon(19, -1), hLine(17, 4, 5)),
      mergePixels([[15, 5], [22, 5]], rocketIcon(19, -2), hLine(16, 3, 7), [[10, 1], [27, 0], [30, 2]]),
      mergePixels(rocketIcon(19, -3), hLine(17, 2, 5), [[9, 0], [11, 1], [26, 0], [28, 1], [31, 0]]),
    ],
  },
] as const;

const IDLE_FRAME_COUNT = IDLE_PHASES.reduce((sum, phase) => sum + phase.frames.length, 0);

/** Matches active LCD body (readout + descriptors + menu) so idle ↔ live does not resize */
const LCD_BODY_MIN_H = 'min-h-[188px] md:min-h-[204px]';

const LcdIdleAnimation: React.FC = () => {
  const [tick, setTick] = useState(0);

  const { phaseIndex, phase, frame } = useMemo(() => {
    const wrapped = tick % IDLE_FRAME_COUNT;
    let cursor = 0;
    for (let i = 0; i < IDLE_PHASES.length; i++) {
      const frames = IDLE_PHASES[i].frames.length;
      if (wrapped < cursor + frames) {
        return {
          phaseIndex: i,
          phase: IDLE_PHASES[i],
          frame: IDLE_PHASES[i].frames[wrapped - cursor] ?? [],
        };
      }
      cursor += frames;
    }
    return { phaseIndex: 0, phase: IDLE_PHASES[0], frame: IDLE_PHASES[0].frames[0] };
  }, [tick]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 140);
    return () => window.clearInterval(timer);
  }, []);

  const lit = useMemo(() => new Set(frame.map(([x, y]) => `${x},${y}`)), [frame]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${PIX_COLS}, ${PIX_SIZE}px)` }}
        aria-hidden
      >
        {Array.from({ length: PIX_ROWS * PIX_COLS }, (_, i) => {
          const x = i % PIX_COLS;
          const y = Math.floor(i / PIX_COLS);
          const on = lit.has(`${x},${y}`);
          return (
            <div
              key={`${x}-${y}`}
              className={`rounded-[1px] transition-colors duration-75 ${
                on ? 'bg-[#1a2f23] opacity-100' : 'bg-[#1a2f23]/10 opacity-35'
              }`}
              style={{ width: PIX_SIZE, height: PIX_SIZE }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-5 mt-4">
        {IDLE_PHASES.map((p, i) => (
          <span
            key={p.label}
            className={`text-[8px] font-mono uppercase tracking-[0.2em] transition-opacity duration-300 ${
              i === phaseIndex ? 'text-[#1a2f23] opacity-100' : 'text-[#1a2f23]/35'
            }`}
          >
            {p.label}
          </span>
        ))}
      </div>

      <motion.p
        key={phase.tagline}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[9px] font-display text-[#1a2f23]/60 mt-1.5"
      >
        {phase.tagline}
      </motion.p>

      <p className="text-[7px] font-mono uppercase tracking-[0.25em] text-[#1a2f23]/40 mt-3 animate-pulse">
        Select a stage to begin
      </p>
    </div>
  );
};

/* ================================================================
 *  LCD rows
 * ================================================================ */

const LcdModeRow: React.FC<{
  activeIndex: number;
  onSelect: (i: number) => void;
}> = ({ activeIndex, onSelect }) => (
  <div className="grid grid-cols-3">
    {methodology.map((stage, i) => {
      const Icon = stageIcons[i];
      const isActive = activeIndex === i;
      return (
        <button
          key={stage.id}
          type="button"
          onClick={() => onSelect(i)}
          className={`flex items-center justify-center gap-2 py-2 px-2 rounded-full transition-colors ${
            isActive ? 'bg-[#1a2f23]/6' : 'hover:bg-[#1a2f23]/4'
          }`}
        >
          <MintDot active={isActive} />
          <Icon size={14} className={isActive ? 'text-[#1a2f23]' : 'text-[#1a2f23]/45'} />
          <span
            className={`text-[11px] font-display ${
              isActive ? 'text-[#1a2f23] font-medium' : 'text-[#1a2f23]/45'
            }`}
          >
            {stage.label}
          </span>
        </button>
      );
    })}
  </div>
);

const LcdReadoutRow: React.FC<{ stage: MethodologyStage; index: number }> = ({
  stage,
  index,
}) => {
  const stageNum = String(index + 1).padStart(2, '0');
  const Icon = stageIcons[index];
  const outputCode = OUTPUT_CODES[stage.exampleProjectId] ?? 'OUT';

  const cells = [
    { value: stageNum, label: 'STAGE' },
    { value: String(stage.methods.length).padStart(2, '0'), label: 'METHODS' },
    { value: String(stage.tools.length).padStart(2, '0'), label: 'TOOLS' },
    { value: outputCode, label: 'OUTPUT' },
  ];

  return (
    <div className="grid grid-cols-4 pt-1">
      {cells.map((cell) => (
        <div key={cell.label} className="flex flex-col items-center justify-center py-2 px-2 relative">
          <Icon size={12} className="absolute top-1 left-2 text-[#1a2f23]/40" />
          <span className="text-3xl md:text-4xl font-mono font-bold tracking-tighter text-[#1a2f23] leading-none">
            {cell.value}
          </span>
          <span className="text-[8px] font-mono uppercase tracking-widest text-[#1a2f23]/60 mt-2">
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const LcdDescriptorRow: React.FC<{ stage: MethodologyStage; index: number }> = ({
  stage,
  index,
}) => {
  const stageNum = String(index + 1).padStart(2, '0');
  const project = projects.find((p) => p.id === stage.exampleProjectId);
  const shortTitle =
    project?.title.split(' ').slice(0, 2).join(' ') ??
    stage.exampleProjectId.slice(0, 12);

  const descriptors: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Activity, label: 'PHASE', value: `${stageNum}/03` },
    { icon: Radio, label: 'CAPTURE', value: 'Active' },
    { icon: Waves, label: 'STREAM', value: 'Live' },
    { icon: Box, label: 'OUTPUT', value: shortTitle },
    { icon: Link2, label: 'LINK', value: 'Projects' },
  ];

  return (
    <div className="grid grid-cols-5 pt-1">
      {descriptors.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-center"
        >
          <Icon size={11} className="text-[#1a2f23]/45" />
          <span className="text-[7px] font-mono uppercase tracking-widest text-[#1a2f23]/50">
            {label}
          </span>
          <span className="text-[9px] font-display text-[#1a2f23]/75 leading-tight line-clamp-2">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ================================================================
 *  Menu grid
 * ================================================================ */

const MenuGrid: React.FC<{ stage: MethodologyStage }> = ({ stage }) => {
  const items = [
    ...stage.methods.map((m) => ({ label: m, type: 'method' as const })),
    ...stage.tools.map((t) => ({ label: t, type: 'tool' as const })),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 pt-2 pb-0.5 border-t border-dashed border-[#1a2f23]/15">
      {items.map((item) => {
        const isFirstOfType =
          item.type === 'method'
            ? stage.methods[0] === item.label
            : stage.tools[0] === item.label;
        const Icon =
          ITEM_ICONS[item.label] ?? (item.type === 'method' ? Search : Wrench);
        return (
          <div key={`${item.type}-${item.label}`} className="flex items-center gap-2 min-w-0">
            <span
              className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                isFirstOfType ? 'bg-[#1a2f23]' : 'bg-[#1a2f23]/20'
              }`}
              aria-hidden
            />
            <Icon size={12} className="shrink-0 text-[#1a2f23]/50" />
            <span className="text-[10px] font-display text-[#1a2f23]/75 truncate">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ================================================================
 *  Bottom controls — carved neumorphic pills (IONIC-style)
 * ================================================================ */

const PillButton = ({
  label,
  icon: Icon,
  onClick,
  ariaLabel,
  active = false,
}: {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  ariaLabel?: string;
  active?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel ?? label}
    aria-pressed={active}
    className="w-full flex items-center justify-center min-[1190px]:justify-between rounded-[10px] bg-bg-light dark:bg-bg-dark
      border border-text-light/25 dark:border-text-dark/25
      shadow-[inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-1px_0_rgba(0,0,0,0.04)]
      dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_0_rgba(0,0,0,0.35)]
      active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.10)] dark:active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.45)]
      transition-colors py-2.5 min-[1190px]:py-3 px-2 min-[1190px]:pl-5 min-[1190px]:pr-4"
  >
    {/* Dot — hidden below 1190px */}
    <span
      className={`hidden min-[1190px]:block shrink-0 w-2 h-2 rounded-full transition-all duration-300 ${
        active
          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85),inset_0_1px_2px_rgba(0,0,0,0.25)]'
          : 'bg-text-light/15 dark:bg-text-dark/20 shadow-none'
      }`}
      aria-hidden
    />
    <span className="text-center min-[1190px]:flex-1 text-sm md:text-[15px] font-mono font-bold uppercase tracking-[0.22em] text-[#b0b8c6] dark:text-[#4a4f58]">
      {label}
    </span>
    {/* Divider — hidden below 1190px */}
    <span
      className="hidden min-[1190px]:block shrink-0 w-px h-9 mx-3
        bg-[#c5ccd8]/60 dark:bg-[#3d4149]
        shadow-[1px_0_0_rgba(255,255,255,0.7),-1px_0_0_rgba(163,177,198,0.45)]
        dark:shadow-[1px_0_0_rgba(57,60,68,0.5),-1px_0_0_rgba(0,0,0,0.4)]"
      aria-hidden
    />
    <span className="hidden min-[1190px]:flex shrink-0 items-center justify-center w-8">
      <Icon size={17} strokeWidth={2.5} className="text-[#b0b8c6] dark:text-[#4a4f58]" />
    </span>
  </button>
);

const applianceShell =
  'rounded-[36px] bg-bg-light dark:bg-bg-dark p-8 md:p-12 border border-white/20 dark:border-white/5 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_6px_#1d1e22,inset_-3px_-3px_6px_#393c44]';

/* ================================================================
 *  Detail card
 * ================================================================ */

const DetailPanel: React.FC<{ stage: MethodologyStage; index: number }> = ({ stage, index }) => {
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      key={stage.id}
      id="methodology-detail"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 pt-8 border-t border-text-light/10 dark:border-text-dark/10 text-left"
    >
      <motion.div
        className="grid md:grid-cols-3 gap-6 md:gap-10 text-left"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="md:col-span-2 space-y-4 text-left"
        >
          <div className="flex items-baseline justify-start gap-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-text-light/35 dark:text-text-dark/35">
              {num} / 03
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-text-light dark:text-text-dark font-heading text-left">
              {stage.label}
            </h3>
          </div>
          <p className="text-base leading-relaxed text-text-light/75 dark:text-text-dark/75 font-display text-left">
            {stage.blurb}
          </p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="space-y-4 text-left"
        >
          <div>
            <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-text-light/35 dark:text-text-dark/35 mb-1.5 text-left">
              Methods
            </p>
            <ul className="space-y-0.5 text-left list-none pl-0">
              {stage.methods.map((m) => (
                <li key={m} className="text-[11px] font-mono text-text-light/60 dark:text-text-dark/60 text-left leading-snug">
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-text-light/35 dark:text-text-dark/35 mb-1.5 text-left">
              Tools
            </p>
            <ul className="space-y-0.5 text-left list-none pl-0">
              {stage.tools.map((t) => (
                <li key={t} className="text-[11px] font-mono text-text-light/60 dark:text-text-dark/60 text-left leading-snug">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ================================================================
 *  Section
 * ================================================================ */

export const Methodology: React.FC = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = methodology[activeIndex];

  const selectStage = (index: number) => {
    setHasInteracted(true);
    setActiveIndex(index);
  };

  // Methodology section parallax
  const methodologyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: methodologyScroll } = useScroll({
    target: methodologyRef,
    offset: ['start end', 'end start'],
  });
  const methodologyHeadingY = useTransform(methodologyScroll, [0, 1], [55, -45]);
  const applianceScale = useTransform(methodologyScroll, [0, 0.3, 0.7, 1], [0.70, 1, 1, 0.85]);

  return (
    <section
      ref={methodologyRef}
      id="methodology"
      className="flex flex-col gap-24 md:gap-28 px-4 md:px-12 mt-12 mb-24 md:mt-16 md:mb-32 w-full max-w-7xl mx-auto scroll-mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto flex flex-col items-center"
      >
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-light/40 dark:text-text-dark/40 mb-4">
          From Insight to Impact
        </p>
        <motion.h2
          style={{ y: methodologyHeadingY }}
          className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark leading-tight font-heading mb-10 md:mb-12"
        >
          Designing, Developing, Deploying.
        </motion.h2>
        <p className="text-lg md:text-xl font-normal text-text-light/80 dark:text-text-dark/80 leading-relaxed font-display">
          I translate research insight into systems that meet people where they live—through a
          repeatable pipeline from discovery to evaluation in the wild.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ scale: applianceScale }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className={applianceShell}>
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-text-light/25 dark:text-text-dark/25">
                system ready
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-text-light/25 dark:text-text-dark/25">
              methodology v1.0
            </span>
          </div>

          <LCDBezel
            outerRadiusClassName="rounded-full"
            trenchRadiusClassName="rounded-full"
            trenchPaddingClassName="p-3 md:p-4"
            outerClassName="overflow-hidden"
            trenchClassName="overflow-hidden"
          >
            <div className="relative bg-bg-light text-[#1a2f23] rounded-full overflow-hidden py-2 border-4 border-[#1a2f23]/10">
              <LcdTexture />
              <div className="relative z-10 px-10 md:px-16">
                <LcdModeRow
                  activeIndex={hasInteracted ? activeIndex : -1}
                  onSelect={selectStage}
                />
                <div className={`relative ${LCD_BODY_MIN_H}`}>
                  <AnimatePresence mode="wait">
                    {!hasInteracted ? (
                      <motion.div
                        key="idle"
                        className={`absolute inset-0 flex items-center justify-center ${LCD_BODY_MIN_H}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <LcdIdleAnimation />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="active"
                        className={LCD_BODY_MIN_H}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeStage.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <LcdReadoutRow stage={activeStage} index={activeIndex} />
                            <LcdDescriptorRow stage={activeStage} index={activeIndex} />
                            <MenuGrid stage={activeStage} />
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </LCDBezel>

          <motion.div
            className="grid grid-cols-3 gap-2 min-[1190px]:gap-4 md:gap-6 mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
            }}
          >
            {methodology.map((stage, i) => (
              <motion.div
                key={stage.id}
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <PillButton
                  icon={stageIcons[i]}
                  label={stage.label}
                  onClick={() => selectStage(i)}
                  ariaLabel={`${stage.label} stage`}
                  active={hasInteracted && activeIndex === i}
                />
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {hasInteracted && (
              <DetailPanel stage={activeStage} index={activeIndex} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};
