import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SketchThenShow, type WireShape } from './SketchReveal';

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  /** When set, draw a detailed wireframe of each part before revealing */
  sketchDelay?: number;
}

/** Detailed wireframe: labels → track → rocker → grip lines. */
function toggleSwitchShapes(hasLabel: boolean, isChecked: boolean): WireShape[] {
  // Layout: OFF (~22) + gap(12) + track(96) + gap(12) + ON(~20)
  const tx = 34;
  const ty = 0;
  // Rocker sits in the track; sketch it at its real ON/OFF position
  const rockerX = tx + 6 + (isChecked ? 44 : 0);

  return [
    { kind: 'rect', x: 0, y: 16, w: 22, h: 12, rx: 2, delay: 0, duration: 0.28 },
    { kind: 'rect', x: tx, y: ty, w: 96, h: 48, rx: 12, delay: 0.08, duration: 0.42 },
    { kind: 'rect', x: rockerX, y: ty + 6, w: 40, h: 36, rx: 8, delay: 0.28, duration: 0.38 },
    {
      kind: 'line',
      x1: rockerX + 16,
      y1: ty + 16,
      x2: rockerX + 16,
      y2: ty + 32,
      delay: 0.48,
      duration: 0.18,
    },
    {
      kind: 'line',
      x1: rockerX + 20,
      y1: ty + 16,
      x2: rockerX + 20,
      y2: ty + 32,
      delay: 0.52,
      duration: 0.18,
    },
    {
      kind: 'line',
      x1: rockerX + 24,
      y1: ty + 16,
      x2: rockerX + 24,
      y2: ty + 32,
      delay: 0.56,
      duration: 0.18,
    },
    { kind: 'rect', x: tx + 108, y: 16, w: 20, h: 12, rx: 2, delay: 0.4, duration: 0.28 },
    ...(hasLabel
      ? [{ kind: 'rect' as const, x: 40, y: 56, w: 80, h: 10, rx: 2, delay: 0.62, duration: 0.28 }]
      : []),
  ];
}

const ToggleSwitchInner: React.FC<Omit<ToggleSwitchProps, 'sketchDelay'>> = ({
  isChecked,
  onChange,
  label,
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-text-light/40 dark:text-text-dark/40 uppercase tracking-wider">
          OFF
        </span>

        <div
          className="w-24 h-12 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-pressed-light dark:shadow-neu-pressed-dark p-1.5 cursor-pointer relative"
          onClick={() => onChange(!isChecked)}
        >
          <motion.div
            className="w-10 h-full rounded-lg bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center justify-center border border-white/20 dark:border-white/5 relative z-10"
            animate={{
              x: isChecked ? '100%' : '0%',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="flex gap-[3px]">
              <div className="w-[1px] h-4 bg-text-light/20 dark:bg-text-dark/20" />
              <div className="w-[1px] h-4 bg-text-light/20 dark:bg-text-dark/20" />
              <div className="w-[1px] h-4 bg-text-light/20 dark:bg-text-dark/20" />
            </div>

            {isChecked && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent to-white/10 pointer-events-none" />
            )}
          </motion.div>
        </div>

        <span className="text-[10px] font-bold text-text-light/40 dark:text-text-dark/40 uppercase tracking-wider">
          ON
        </span>
      </div>

      {label && (
        <span className="text-[9px] font-mono uppercase opacity-50 tracking-widest">{label}</span>
      )}
    </div>
  );
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isChecked,
  onChange,
  label,
  sketchDelay,
}) => {
  const shapes = useMemo(
    () => toggleSwitchShapes(!!label, isChecked),
    [label, isChecked],
  );

  if (sketchDelay === undefined) {
    return <ToggleSwitchInner isChecked={isChecked} onChange={onChange} label={label} />;
  }
  return (
    <SketchThenShow baseDelay={sketchDelay} shapes={shapes} revealDuration={0.85}>
      <ToggleSwitchInner isChecked={isChecked} onChange={onChange} label={label} />
    </SketchThenShow>
  );
};

interface ToggleSmallProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sketchDelay?: number;
}

function toggleSmallShapes(hasLabel: boolean, isChecked: boolean): WireShape[] {
  const knobCx = isChecked ? 36 : 12;
  return [
    { kind: 'rect', x: 0, y: 0, w: 48, h: 24, rx: 12, delay: 0, duration: 0.36 },
    { kind: 'circle', cx: knobCx, cy: 12, r: 9, delay: 0.2, duration: 0.32 },
    { kind: 'circle', cx: 56, cy: 12, r: 3, delay: 0.38, duration: 0.22 },
    ...(hasLabel
      ? [{ kind: 'rect' as const, x: 66, y: 6, w: 52, h: 12, rx: 2, delay: 0.48, duration: 0.28 }]
      : []),
  ];
}

const ToggleSmallInner: React.FC<Omit<ToggleSmallProps, 'sketchDelay'>> = ({
  isChecked,
  onChange,
  label,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-6 rounded-full bg-bg-light dark:bg-bg-dark shadow-neu-pressed-light dark:shadow-neu-pressed-dark p-[2px] cursor-pointer relative"
        onClick={() => onChange(!isChecked)}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark border border-white/20 dark:border-white/5"
          animate={{ x: isChecked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>

      <div
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
          isChecked
            ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]'
            : 'bg-gray-300 dark:bg-gray-600'
        }`}
      />

      {label && (
        <span className="text-[9px] font-mono uppercase opacity-50 tracking-widest ml-1">{label}</span>
      )}
    </div>
  );
};

export const ToggleSmall: React.FC<ToggleSmallProps> = ({
  isChecked,
  onChange,
  label,
  sketchDelay,
}) => {
  const shapes = useMemo(
    () => toggleSmallShapes(!!label, isChecked),
    [label, isChecked],
  );

  if (sketchDelay === undefined) {
    return <ToggleSmallInner isChecked={isChecked} onChange={onChange} label={label} />;
  }
  return (
    <SketchThenShow baseDelay={sketchDelay} shapes={shapes} revealDuration={0.85}>
      <ToggleSmallInner isChecked={isChecked} onChange={onChange} label={label} />
    </SketchThenShow>
  );
};

interface SwipeButtonProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const SwipeButton: React.FC<SwipeButtonProps> = ({ isChecked, onChange, label }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-32 h-14 rounded-2xl bg-bg-light dark:bg-bg-dark shadow-neu-pressed-light dark:shadow-neu-pressed-dark p-2 relative cursor-pointer overflow-hidden flex items-center"
        onClick={() => onChange(!isChecked)}
      >
        <div
          className={`absolute left-4 text-text-light/30 dark:text-text-dark/30 transition-opacity duration-300 ${
            isChecked ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <ArrowLeft size={16} />
        </div>

        <motion.div
          className="absolute top-2 bottom-2 w-12 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center justify-center border border-white/20 dark:border-white/5 z-10"
          animate={{
            left: isChecked ? 'calc(100% - 3.5rem)' : '0.5rem',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="grid grid-cols-2 gap-1 opacity-40">
            <div className="w-1 h-1 rounded-full bg-text-light dark:text-text-dark bg-current" />
            <div className="w-1 h-1 rounded-full bg-text-light dark:text-text-dark bg-current" />
            <div className="w-1 h-1 rounded-full bg-text-light dark:text-text-dark bg-current" />
            <div className="w-1 h-1 rounded-full bg-text-light dark:text-text-dark bg-current" />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-blue-500/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChecked ? 1 : 0 }}
        />
      </div>
      {label && (
        <span className="text-[9px] font-mono uppercase opacity-50 tracking-widest">{label}</span>
      )}
    </div>
  );
};
