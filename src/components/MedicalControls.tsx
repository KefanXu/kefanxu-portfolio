import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Power, Settings, RefreshCcw, Activity } from 'lucide-react';

export const MedicalControls: React.FC = () => {
  const [power, setPower] = useState(true);
  const [mode, setMode] = useState(0); // 0: Auto, 1: Manual
  const [dialRotation, setDialRotation] = useState(0);

  const togglePower = () => setPower(!power);
  // const toggleMode = () => setMode(mode === 0 ? 1 : 0);

  return (
    <div className="flex flex-col gap-6 p-4">
      
      {/* Top Row: Power & Status */}
      <div className="flex justify-between items-center">
        {/* Power Toggle */}
        <div className="flex flex-col items-center gap-2">
           <button 
             onClick={togglePower}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-neu-light dark:shadow-neu-dark ${power ? 'text-green-500' : 'text-red-400 opacity-50'}`}
           >
             <Power size={20} />
           </button>
           <span className="text-[8px] font-mono uppercase tracking-wider opacity-50">PWR</span>
        </div>

        {/* Status LEDs */}
        <div className="flex gap-3">
           <div className="flex flex-col items-center gap-1">
              <div className={`w-3 h-3 rounded-full shadow-inner border border-white/10 transition-colors duration-300 ${power ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-green-900/20'}`} />
              <span className="text-[6px] font-mono uppercase opacity-40">OK</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <div className={`w-3 h-3 rounded-full shadow-inner border border-white/10 transition-colors duration-300 ${!power ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-red-900/20'}`} />
              <span className="text-[6px] font-mono uppercase opacity-40">ERR</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500/20 shadow-inner border border-white/10 animate-pulse" />
              <span className="text-[6px] font-mono uppercase opacity-40">DATA</span>
           </div>
        </div>
      </div>

      {/* Middle: Mode Switch */}
      <div className="flex items-center justify-between bg-bg-light dark:bg-bg-dark rounded-xl p-2 shadow-neu-pressed-light dark:shadow-neu-pressed-dark">
         <button 
           onClick={() => setMode(0)}
           className={`flex-1 py-2 text-[10px] font-bold font-mono rounded-lg transition-all ${mode === 0 ? 'bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark text-primary-light dark:text-primary-dark' : 'opacity-40'}`}
         >
           AUTO
         </button>
         <button 
           onClick={() => setMode(1)}
           className={`flex-1 py-2 text-[10px] font-bold font-mono rounded-lg transition-all ${mode === 1 ? 'bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark text-primary-light dark:text-primary-dark' : 'opacity-40'}`}
         >
           MANUAL
         </button>
      </div>

      {/* Bottom: Analog Dial & Func Buttons */}
      <div className="flex justify-between items-center pt-2">
         {/* Rotary Dial */}
         <div className="relative w-16 h-16 rounded-full bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center justify-center cursor-grab active:cursor-grabbing"
              onClick={() => setDialRotation(prev => prev + 45)}
         >
            <motion.div 
              className="w-12 h-12 rounded-full bg-bg-light dark:bg-bg-dark shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_5px_#1d1e22,inset_-2px_-2px_5px_#393c44] flex items-center justify-center relative"
              animate={{ rotate: dialRotation }}
            >
               <div className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark absolute top-2" />
            </motion.div>
            {/* Ticks */}
            {[...Array(8)].map((_, i) => (
               <div 
                 key={i}
                 className="absolute w-[1px] h-1.5 bg-text-light/30 dark:text-text-dark/30"
                 style={{ 
                   transform: `rotate(${i * 45}deg) translateY(-26px)`,
                   transformOrigin: 'center center'
                 }} 
               />
            ))}
         </div>

         {/* Small Function Buttons */}
         <div className="grid grid-cols-2 gap-3">
            <button className="w-10 h-10 rounded-lg bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark active:shadow-neu-pressed-light dark:active:shadow-neu-pressed-dark flex items-center justify-center text-text-light/60 hover:text-primary-light transition-colors">
               <Settings size={16} />
            </button>
            <button className="w-10 h-10 rounded-lg bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark active:shadow-neu-pressed-light dark:active:shadow-neu-pressed-dark flex items-center justify-center text-text-light/60 hover:text-primary-light transition-colors">
               <RefreshCcw size={16} />
            </button>
            <button className="w-10 h-10 rounded-lg bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark active:shadow-neu-pressed-light dark:active:shadow-neu-pressed-dark flex items-center justify-center text-text-light/60 hover:text-primary-light transition-colors">
               <Activity size={16} />
            </button>
            <div className="w-10 h-10 rounded-lg bg-bg-light dark:bg-bg-dark shadow-neu-pressed-light dark:shadow-neu-pressed-dark flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
         </div>
      </div>

    </div>
  );
};
