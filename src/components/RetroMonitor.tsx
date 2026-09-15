import React from 'react';
import { motion } from 'framer-motion';
import { MethodologyStage } from '../data/portfolio';
import { LCDBezel } from './LCDBezel';

type RetroMonitorProps = {
  stage: MethodologyStage;
  index: number;
  isActive: boolean;
  onActivate: () => void;
};

export const RetroMonitor: React.FC<RetroMonitorProps> = ({
  stage,
  index,
  isActive,
  onActivate,
}) => {
  const stageNum = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Monitor body */}
      <div
        onClick={onActivate}
        className={`
          relative cursor-pointer group transition-all duration-300
          ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
        `}
      >
        {/* Top bar: LED + label + power button */}
        <div className="flex items-center justify-between px-1 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)]" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-text-light/30 dark:text-text-dark/30">
              {stageNum}/03
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-text-light/45 dark:text-text-dark/45">
            {stage.label}
          </span>
          {/* Power button */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 rounded-full bg-bg-light dark:bg-bg-dark
                       shadow-neu-light dark:shadow-neu-dark
                       active:shadow-neu-pressed-light dark:active:shadow-neu-pressed-dark
                       hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
          </div>
        </div>

        {/* LCD screen — reuses LCDBezel + same effects as RetroLCDSection */}
        <LCDBezel outerClassName="max-w-[300px]">
          <div className="relative bg-bg-light text-[#1a2f23] rounded-[10px] overflow-hidden" style={{ width: 270, height: 180 }}>
            {/* Inner shadow (same as RetroLCDSection) */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)] pointer-events-none" />

            {/* Grid texture (same as RetroLCDSection) */}
            <div
              className="absolute inset-0 opacity-[0.15] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                backgroundSize: '4px 4px',
              }}
            />

            {/* Scanlines (same as RetroLCDSection) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-b from-transparent via-[#1a2f23] to-transparent"
                 style={{ backgroundSize: '100% 2px' }} />

            {/* Content */}
            <div className="relative z-10 p-4 flex flex-col gap-2.5 h-full">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-mono font-bold tracking-tighter">
                  {stageNum}
                </span>
                <span className="text-base font-heading font-bold tracking-tight">
                  {stage.label}
                </span>
              </div>

              <p className="text-[11px] leading-relaxed font-mono opacity-75 line-clamp-3">
                {stage.blurb}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {stage.methods.slice(0, 3).map((m) => (
                  <span key={m} className="text-[9px] font-mono opacity-60 border border-current/15 rounded-full px-2 py-0.5">
                    {m}
                  </span>
                ))}
                {stage.methods.length > 3 && (
                  <span className="text-[9px] font-mono opacity-40">+{stage.methods.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </LCDBezel>
      </div>

      {/* Label badge */}
      <button
        onClick={onActivate}
        className={`
          px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest
          transition-all duration-300 cursor-pointer
          ${isActive
            ? 'bg-text-light dark:bg-text-dark text-bg-light dark:text-bg-dark shadow-lg'
            : 'bg-bg-light dark:bg-bg-dark text-text-light/30 dark:text-text-dark/30 shadow-neu-light dark:shadow-neu-dark hover:text-text-light/60 dark:hover:text-text-dark/60'
          }
        `}
      >
        {stage.label}
      </button>
    </motion.div>
  );
};
