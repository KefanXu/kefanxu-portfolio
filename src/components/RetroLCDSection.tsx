import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Pixel animation grid dimensions (square for circular screen)
const GRID_SIZE = 20; // 20x20 grid for better circular fit
const ANIMATION_SPEED = 200; // ms per frame
// For an even-sized grid, the true visual center is between pixels (e.g. 9.5 for 20).
const GRID_CENTER = (GRID_SIZE - 1) / 2;
const MAX_RADIUS = GRID_CENTER; // Use the true grid center for symmetric patterns

export const RetroLCDSection: React.FC = () => {
  const [pixels, setPixels] = useState<boolean[][]>([]);
  const animationFrameRef = useRef<number>(0);
  const patternRef = useRef<number>(0);

  // Helper function to check if pixel is within circular boundary
  const isWithinCircle = (row: number, col: number, radius?: number): boolean => {
    const dist = Math.sqrt((col - GRID_CENTER) ** 2 + (row - GRID_CENTER) ** 2);
    const maxR = radius ?? MAX_RADIUS;
    // Allow slightly beyond MAX_RADIUS to ensure outer pixels show
    return dist <= maxR + 0.5;
  };

  // Initialize pixel grid
  useEffect(() => {
    const initialGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(false));
    setPixels(initialGrid);
  }, []);

  // Pixel animation patterns (circular-aware)
  const patterns = [
    // Pattern 1: Pulsing circular rings
    (frame: number): boolean[][] => {
      const grid = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(false));
      const radius = (Math.sin(frame * 0.08) * 4 + MAX_RADIUS * 0.6);
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (!isWithinCircle(row, col)) continue;
          const dist = Math.sqrt((col - GRID_CENTER) ** 2 + (row - GRID_CENTER) ** 2);
          grid[row][col] = Math.abs(dist - radius) < 0.8;
        }
      }
      return grid;
    },
    // Pattern 2: Rotating radial lines
    (frame: number): boolean[][] => {
      const grid = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(false));
      const angle = (frame * 0.1) % (Math.PI * 2);
      const numLines = 8;
      for (let i = 0; i < numLines; i++) {
        const lineAngle = angle + (i * Math.PI * 2 / numLines);
        for (let r = 2; r < MAX_RADIUS; r += 0.5) {
          const x = Math.round(GRID_CENTER + Math.cos(lineAngle) * r);
          const y = Math.round(GRID_CENTER + Math.sin(lineAngle) * r);
          if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && isWithinCircle(y, x)) {
            grid[y][x] = true;
          }
        }
      }
      return grid;
    },
    // Pattern 3: Expanding/contracting circle wave
    (frame: number): boolean[][] => {
      const grid = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(false));
      const wavePhase = frame * 0.15;
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (!isWithinCircle(row, col)) continue;
          const dist = Math.sqrt((col - GRID_CENTER) ** 2 + (row - GRID_CENTER) ** 2);
          const wave = Math.sin(dist * 0.8 - wavePhase) * 0.5 + 0.5;
          grid[row][col] = wave > 0.6;
        }
      }
      return grid;
    },
    // Pattern 4: Spiral animation
    (frame: number): boolean[][] => {
      const grid = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(false));
      const turns = 3;
      for (let angle = 0; angle < Math.PI * 2 * turns; angle += 0.15) {
        const radius = (angle / (Math.PI * 2)) * (MAX_RADIUS / turns) + frame * 0.2;
        if (radius > MAX_RADIUS) break;
        const x = Math.round(GRID_CENTER + Math.cos(angle) * radius);
        const y = Math.round(GRID_CENTER + Math.sin(angle) * radius);
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && isWithinCircle(y, x)) {
          grid[y][x] = true;
        }
      }
      return grid;
    },
    // Pattern 5: Concentric circles pulsing
    (frame: number): boolean[][] => {
      const grid = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(false));
      const pulsePhase = frame * 0.12;
      const numCircles = 4;
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (!isWithinCircle(row, col)) continue;
          const dist = Math.sqrt((col - GRID_CENTER) ** 2 + (row - GRID_CENTER) ** 2);
          for (let i = 0; i < numCircles; i++) {
            const radius = (MAX_RADIUS / numCircles) * (i + 1);
            const pulse = Math.sin(pulsePhase + i * 0.5) * 1.5;
            if (Math.abs(dist - radius - pulse) < 0.9) {
              grid[row][col] = true;
              break;
            }
          }
        }
      }
      return grid;
    },
  ];

  // Animate pixels
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      // Switch pattern every ~4 seconds
      if (frame % 20 === 0) {
        patternRef.current = (patternRef.current + 1) % patterns.length;
      }
      
      // Get current animation pattern
      const currentPattern = patterns[patternRef.current];
      const baseGrid = currentPattern(frame);
      setPixels(baseGrid);
      
      frame++;
      animationFrameRef.current = window.setTimeout(animate, ANIMATION_SPEED);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-20">
      <div className="relative flex flex-col items-center justify-center gap-8 min-h-[300px] py-12">
        {/* Text */}
        <div className="text-sm font-display text-text-light/60 dark:text-text-dark/60 leading-relaxed space-y-1 text-center max-w-[240px]">
          <p>Visiting my old website</p>
          <p>for other interesting projects</p>
        </div>

        {/* Arrow Icon with Dark Background (pointing down) */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-text-light/90 dark:bg-text-dark/90 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-bg-light dark:text-bg-dark rotate-90" strokeWidth={2.5} />
          </div>
        </div>

        {/* Circular Retro LCD Screen in center */}
        <a 
          href="https://kefanxu.github.io/portfolio4.1/index.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="lcd-link relative flex-shrink-0 cursor-pointer group isolate focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light dark:focus-visible:ring-offset-bg-dark"
        >
          {/* Warm back-emission (same idea as PillContainer glow) */}
          <div
            className="lcd-warm-glow absolute -inset-14 rounded-full pointer-events-none opacity-0 z-0"
            style={{
              background:
                'radial-gradient(circle at 50% 65%, rgba(255,170,50,0.55) 0%, rgba(255,170,50,0.22) 35%, rgba(255,170,50,0.10) 55%, transparent 75%)',
              filter: 'blur(34px)',
            }}
          />

          {/* Outer Raised Rim (circular) */}
          <div className="relative z-10 p-[2px] rounded-full bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark">
            {/* Inner Trench (Concave Border) */}
            <div className="relative rounded-full bg-bg-light dark:bg-bg-dark shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.3),inset_-3px_-3px_6px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_2px_2px_5px_#1d1e22,inset_-2px_-2px_5px_#393c44] p-[3px] w-[200px] h-[200px]">
              {/* Screen Display (circular) */}
              <div className="relative bg-bg-light text-[#1a2f23] rounded-full w-full h-full p-4 overflow-hidden flex items-center justify-center">
                {/* Slight warm lift inside the LCD (helps sell “backlight”) */}
                <div
                  className="lcd-warm-glow-inner absolute inset-0 rounded-full pointer-events-none opacity-0"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 65%, rgba(255,170,50,0.10) 0%, rgba(255,255,255,0.10) 28%, transparent 70%)',
                  }}
                />
                {/* Inner Shadow & Texture */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)] pointer-events-none rounded-full" />
                <div 
                  className="absolute inset-0 opacity-[0.15] pointer-events-none rounded-full" 
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                    backgroundSize: '4px 4px'
                  }} 
                />

                {/* Pixel Grid with circular mask */}
                <div 
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    clipPath: 'circle(50%)',
                  }}
                >
                  <div 
                    className="absolute"
                    style={{
                      width: `${GRID_SIZE * 8}px`,
                      height: `${GRID_SIZE * 8}px`,
                      transform: 'translate(-50%, -50%)',
                      top: '50%',
                      left: '50%',
                    }}
                  >
                    {pixels.map((row, rowIndex) =>
                      row.map((isActive, colIndex) => {
                        // Only render pixels within circular boundary
                        if (!isWithinCircle(rowIndex, colIndex)) return null;
                        return (
                          <motion.div
                            key={`${rowIndex}-${colIndex}`}
                            className={`absolute ${
                              isActive ? 'bg-[#1a2f23]' : 'bg-bg-light/30'
                            }`}
                            initial={false}
                            animate={{
                              backgroundColor: isActive ? '#1a2f23' : '#E0E5EC',
                              opacity: isActive ? 1 : 0.25,
                            }}
                            transition={{ duration: 0.1 }}
                            style={{
                              left: `${colIndex * 8}px`,
                              top: `${rowIndex * 8}px`,
                              width: '6px',
                              height: '6px',
                              borderRadius: '1px',
                            }}
                          />
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-b from-transparent via-[#1a2f23] to-transparent lcd-scanline rounded-full" 
                     style={{ 
                       backgroundSize: '100% 2px'
                     }} 
                />
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
