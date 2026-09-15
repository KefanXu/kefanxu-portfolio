import React from 'react';
import { motion } from 'framer-motion';

interface NeuSwitchProps {
  options: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'segment' | 'cover'; // 'segment' for header (highlight active), 'cover' for projects (cover inactive)
}

export const NeuSwitch: React.FC<NeuSwitchProps> = ({ options, activeId, onChange, className = '', variant = 'segment' }) => {
  
  // Logic for 'cover' variant (Antiswitch for 2 options)
  const isCoverVariant = variant === 'cover';
  
  if (isCoverVariant && options.length === 2) {
      const [option1, option2] = options;
      const isOption1Active = activeId === option1.id;
      // If Option 1 is active, we want to SHOW Option 1. The cover should be over Option 2 (Index 1).
      const buttonPositionIndex = isOption1Active ? 1 : 0;

      return (
        <div 
          className={`relative h-12 w-48 rounded-xl bg-bg-light dark:bg-bg-dark shadow-[inset_3px_3px_6px_rgb(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_6px_#1d1e22,inset_-3px_-3px_6px_#393c44] flex items-center p-1.5 cursor-pointer overflow-hidden ${className}`}
          onClick={() => onChange(isOption1Active ? option2.id : option1.id)}
        >
          {/* Background Texture for Trench */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

          {/* Carved Text Labels (Fixed Background) */}
          <div className="absolute inset-0 flex px-1.5">
            {options.map((option) => (
              <div key={option.id} className="flex-1 flex items-center justify-center">
                 <span 
                   className="font-bold text-xs md:text-sm uppercase tracking-wider text-text-light/70 dark:text-text-dark/70"
                 >
                   {option.label}
                 </span>
              </div>
            ))}
          </div>

          {/* Sliding Physical Button (The Cover) */}
          <motion.div
            className="relative w-1/2 h-full rounded-lg bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark z-10 flex items-center justify-center"
            initial={false}
            animate={{ 
              x: buttonPositionIndex === 1 ? '100%' : '0%' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
              {/* Button Texture & Details */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
                 <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-30">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-[2px] h-4 rounded-full bg-transparent shadow-[1px_0_1px_rgba(255,255,255,0.8),-1px_0_1px_rgba(0,0,0,0.2)] dark:shadow-[1px_0_1px_rgba(255,255,255,0.1),-1px_0_1px_rgba(0,0,0,0.8)]" />
                    ))}
                 </div>
                 <div className="absolute inset-0 rounded-lg border-t border-l border-white/20 dark:border-white/5 pointer-events-none" />
              </div>
          </motion.div>
        </div>
      );
  }

  // Logic for 'segment' variant (Standard Highlight)
  // Calculate active index
  const activeIndex = options.findIndex(o => o.id === activeId);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  
  // Calculate width percentage based on options length
  const widthPercent = 100 / options.length;

  return (
    <div className={`relative h-12 w-full max-w-md rounded-2xl bg-bg-light dark:bg-bg-dark shadow-[inset_3px_3px_6px_rgb(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_6px_#1d1e22,inset_-3px_-3px_6px_#393c44] p-1.5 flex items-center overflow-hidden ${className}`}>
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

      {/* Relative container to respect padding for absolute child */}
      <div className="relative w-full h-full">
        {/* Sliding Highlight Pill */}
        <motion.div
          className="absolute top-0 bottom-0 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark z-10"
          initial={false}
          animate={{ 
            left: `${safeIndex * widthPercent}%`,
            width: `${widthPercent}%`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Texture on Pill */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
              <div className="absolute inset-0 border-t border-l border-white/20 dark:border-white/5" />
          </div>
        </motion.div>

        {/* Text Labels */}
        <div className="relative z-20 w-full h-full flex">
          {options.map((option) => {
              const isActive = activeId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onChange(option.id)}
                  className="flex-1 flex items-center justify-center h-full focus:outline-none"
                >
                  <span 
                    className={`text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-text-light/40 dark:text-text-dark/40'}`}
                    style={isActive ? { textShadow: '0 0 10px rgba(59, 130, 246, 0.3)' } : {}}
                  >
                    {option.label}
                  </span>
                </button>
              );
          })}
        </div>
      </div>
    </div>
  );
};
