import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export const NeuKnob: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-3 cursor-pointer group select-none" onClick={toggleTheme}>
        {/* Light Mode Icon (Left) */}
        <div className={`transition-all duration-300 ${!isDark ? 'text-yellow-500 scale-110 drop-shadow-md' : 'text-text-light/20 dark:text-text-dark/20 scale-90'}`}>
            <Sun size={18} />
        </div>

        {/* Minimal Knob Design */}
        <div className="relative w-14 h-14 rounded-full bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center justify-center p-1.5 transition-colors duration-300">
             {/* Recessed Track Ring */}
             <div className="absolute inset-1 rounded-full bg-bg-light dark:bg-bg-dark shadow-neu-pressed-light dark:shadow-neu-pressed-dark opacity-50" />
             
             {/* Rotating Body */}
             <motion.div
                className="relative w-full h-full rounded-full bg-bg-light dark:bg-bg-dark shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.4)] dark:shadow-[4px_4px_8px_#1d1e22,-4px_-4px_8px_#393c44] flex items-center justify-center z-10"
                animate={{ rotate: isDark ? 90 : -90 }} // -90 points Left (Sun), 90 points Right (Moon)
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
                {/* Indicator Light */}
                <div className="absolute top-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)]" />
            </motion.div>
        </div>

        {/* Dark Mode Icon (Right) */}
        <div className={`transition-all duration-300 ${isDark ? 'text-blue-400 scale-110 drop-shadow-md' : 'text-text-light/20 dark:text-text-dark/20 scale-90'}`}>
            <Moon size={18} />
        </div>
    </div>
  );
};
