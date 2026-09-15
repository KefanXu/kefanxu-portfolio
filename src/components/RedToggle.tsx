import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export const RedToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isOn = theme === 'dark'; // Dark mode is "ON"

  return (
    <div 
      onClick={toggleTheme}
      className="cursor-pointer relative w-32 h-14 rounded-2xl bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center p-2 gap-2 transition-colors duration-300"
    >
      {/* Label Area (Left) */}
      <div className="flex-1 flex items-center justify-center font-bold font-mono text-sm tracking-widest text-text-light/60 dark:text-text-dark/60 select-none">
        {isOn ? 'ON' : 'OFF'}
      </div>

      {/* Rocker Button Container */}
      <div className="relative w-16 h-full perspective-[200px]"> {/* Low perspective for strong 3D effect */}
          {/* Recessed Housing */}
          <div className="absolute inset-0 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-pressed-light dark:shadow-neu-pressed-dark" />
          
          {/* The Rocker Object */}
          <motion.div
            className="absolute inset-1 rounded-lg"
            initial={false}
            animate={{
               rotateY: isOn ? 18 : -18, 
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{ 
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
            }}
          >
             {/* MAIN FACE (Top Surface) */}
             <div 
               className="absolute inset-0 rounded-lg overflow-hidden border border-black/10 dark:border-white/5"
               style={{
                 // Concave gradient simulation: Darker at edges, slightly lighter in center-ish
                 background: 'linear-gradient(90deg, #b91c1c 0%, #ef4444 40%, #ef4444 60%, #b91c1c 100%)',
                 backfaceVisibility: 'hidden',
               }}
             >
                {/* Texture/Grip Ridges */}
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-60">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-[2px] h-6 rounded-full bg-black/20 shadow-[0.5px_0_0_rgba(255,255,255,0.2)]"
                        />
                    ))}
                </div>

                {/* Dynamic Lighting Overlay for Curve */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-white/30"
                    animate={{ opacity: isOn ? 0 : 1 }} // OFF: Left Sunken (Shadow Left, Light Right)
                />
                 <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/40"
                    animate={{ opacity: isOn ? 1 : 0 }} // ON: Right Sunken (Light Left, Shadow Right)
                />
             </div>

             {/* SIDE FACES (To give it thickness) */}
             {/* Left Side (Visible when rotated right/ON) */}
             <div 
                className="absolute left-0 top-0 bottom-0 w-4 bg-[#991b1b] origin-left"
                style={{
                    transform: 'rotateY(-90deg) translateX(-50%)',
                }}
             />
             {/* Right Side (Visible when rotated left/OFF) */}
             <div 
                className="absolute right-0 top-0 bottom-0 w-4 bg-[#7f1d1d] origin-right"
                style={{
                    transform: 'rotateY(90deg) translateX(50%)',
                }}
             />

          </motion.div>
      </div>
    </div>
  );
};
