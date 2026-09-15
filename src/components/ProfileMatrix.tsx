import React from 'react';
import { motion } from 'framer-motion';

interface ProfileMatrixProps {
  showCross?: boolean;
  showGTLogo?: boolean;
  showGraduationCap?: boolean;
  showLinkedin?: boolean;
  showMail?: boolean;
  showCV?: boolean;
}

export const ProfileMatrix: React.FC<ProfileMatrixProps> = ({ 
  showCross = false, 
  showGTLogo = false,
  showGraduationCap = false,
  showLinkedin = false,
  showMail = false,
  showCV = false
}) => {
  // 5x5 Grid
  const gridSize = 25;
  
  // Cross pattern: middle row (10-14) + middle column (2,7,12,17,22)
  // Combined without duplicate: [2, 7, 10, 11, 12, 13, 14, 17, 22]
  const crossIndices = [2, 7, 10, 11, 12, 13, 14, 17, 22];
  
  // Simple "T" pattern (5x5 grid):
  // Row 0: . T T T .  → [1, 2, 3] (top bar)
  // Row 1: . . T . .  → [7] (vertical stem)
  // Row 2: . . T . .  → [12] (vertical stem)
  // Row 3: . . T . .  → [17] (vertical stem)
  // Row 4: . . T . .  → [22] (vertical stem)
  const gtLogoIndices = [1, 2, 3, 7, 12, 17, 22];

  // Beautiful abstract patterns for button hovers:
  
  // GraduationCap button: Diamond/Rhombus shape
  // Row 0: . . X . .  → [2] (top point)
  // Row 1: . X X X .  → [6, 7, 8] (expanding)
  // Row 2: X X X X X  → [10, 11, 12, 13, 14] (middle)
  // Row 3: . X X X .  → [16, 17, 18] (contracting)
  // Row 4: . . X . .  → [22] (bottom point)
  const graduationCapIndices = [2, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 22];

  // LinkedIn button: Wave/Crescent pattern
  // Row 0: . . X X .  → [2, 3] (wave start)
  // Row 1: . X X . .  → [6, 7] (wave curve)
  // Row 2: X X . . .  → [10, 11] (wave peak)
  // Row 3: . X X . .  → [16, 17] (wave curve)
  // Row 4: . . X X .  → [22, 23] (wave end)
  const linkedinIndices = [2, 3, 6, 7, 10, 11, 16, 17, 22, 23];

  // Mail button: Flower/Star pattern
  // Row 0: . . X . .  → [2] (top petal)
  // Row 1: . X . X .  → [6, 8] (side petals)
  // Row 2: X . X . X  → [10, 12, 14] (center + side petals)
  // Row 3: . X . X .  → [16, 18] (side petals)
  // Row 4: . . X . .  → [22] (bottom petal)
  const mailIndices = [2, 6, 8, 10, 12, 14, 16, 18, 22];

  // CV button: Letter "C" pattern
  // Row 0: . X X X . -> [1, 2, 3]
  // Row 1: X . . . . -> [5]
  // Row 2: X . . . . -> [10]
  // Row 3: X . . . . -> [15]
  // Row 4: . X X X . -> [21, 22, 23]
  const cvIndices = [1, 2, 3, 5, 10, 15, 21, 22, 23];

  // Priority: icon patterns > GT logo > cross
  const activePattern = showGraduationCap ? graduationCapIndices :
                       showLinkedin ? linkedinIndices :
                       showMail ? mailIndices :
                       showCV ? cvIndices :
                       showGTLogo ? gtLogoIndices :
                       showCross ? crossIndices : [];

  return (
    <div className="grid grid-cols-5 gap-3 w-full max-w-[400px] aspect-square mx-auto p-4 bg-bg-light dark:bg-bg-dark rounded-[32px] shadow-neu-light dark:shadow-neu-dark border border-white/20 dark:border-white/5">
      {[...Array(gridSize)].map((_, i) => {
        const isActive = activePattern.includes(i);
        
        return (
          <motion.div
            key={i}
            className="
              relative rounded-lg overflow-hidden cursor-pointer group
              bg-bg-light dark:bg-bg-dark shadow-neu-icon-light dark:shadow-neu-icon-dark
              hover:shadow-inner
            "
            animate={{
              backgroundColor: isActive ? '#8aa899' : 'rgba(0,0,0,0)',
              scale: isActive ? 1.05 : 1,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            whileHover={{ 
              scale: 0.95,
              backgroundColor: '#8aa899',
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Pixel Grid Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
                 style={{ 
                   backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', 
                   backgroundSize: '2px 2px' 
                 }} 
            />
            
            {/* Center detail */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  isActive 
                    ? 'bg-[#1a2f23]' 
                    : 'bg-text-light/10 dark:bg-text-dark/10 group-hover:bg-[#1a2f23]'
                }`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
