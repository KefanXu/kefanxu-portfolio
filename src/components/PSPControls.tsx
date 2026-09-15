import React from 'react';
import { Triangle, Circle, X, Square, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface PSPControlsProps {
  onExit?: () => void;
}

export const PSPControls: React.FC<PSPControlsProps> = ({ onExit }) => {
  const triggerKey = (key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    window.dispatchEvent(event);
  };

  // Glassy / Plastic Texture Style:
  // - High-contrast shadows for depth
  // - Radial gradients for spherical surface feel
  // - Inner glow/highlight for plastic material
  const ButtonBase = "relative flex items-center justify-center transition-transform active:scale-95 duration-100 bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] dark:shadow-[4px_4px_8px_#1d1e22,-4px_-4px_8px_#393c44] active:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] dark:active:shadow-[inset_2px_2px_4px_#1d1e22,inset_-2px_-2px_4px_#393c44] overflow-hidden group";

  // Overlay for glossy reflection
  const GlossOverlay = () => (
    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 pointer-events-none" />
  );

  // 3D Icon Filter & Shadow
  const IconWrapper = ({ children, colorClass }: { children: React.ReactNode, colorClass?: string }) => (
      <div className={`
        relative transform transition-transform group-active:scale-95 group-active:translate-y-[1px]
        filter drop-shadow-[0_2px_1px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_1px_rgba(255,255,255,0.1)]
      `}>
         {/* Inner engraved shadow effect */}
         <div className={`relative z-10 ${colorClass}`}>
            {children}
         </div>
         {/* Deep inset shadow for "engraved" look (simulated via offset copy) */}
         <div className="absolute inset-0 z-0 text-black/20 dark:text-black/50 translate-y-[1px] blur-[0.5px]">
            {children}
         </div>
      </div>
  );

  return (
    <div className="w-full flex justify-between items-center px-4 py-8 max-w-md mx-auto select-none gap-8">
      {/* D-Pad Container (Incurved) */}
      <div className="relative w-40 h-40 rounded-full bg-bg-light dark:bg-bg-dark shadow-[inset_3px_3px_6px_rgb(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_6px_#1d1e22,inset_-3px_-3px_6px_#393c44] flex items-center justify-center">
        {/* Recessed noise texture */}
        <div className="absolute inset-0 rounded-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
        
        <div className="relative w-32 h-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <button
              className={`${ButtonBase} w-10 h-10 rounded-t-lg rounded-b-sm`}
              onMouseDown={() => triggerKey('ArrowUp')}
              onTouchStart={(e) => { e.preventDefault(); triggerKey('ArrowUp'); }}
            >
              <GlossOverlay />
              <IconWrapper colorClass="text-text-light/60 dark:text-text-dark/60">
                 <ChevronUp size={22} strokeWidth={3} />
              </IconWrapper>
            </button>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <button
              className={`${ButtonBase} w-10 h-10 rounded-b-lg rounded-t-sm`}
              onMouseDown={() => triggerKey('ArrowDown')}
              onTouchStart={(e) => { e.preventDefault(); triggerKey('ArrowDown'); }}
            >
              <GlossOverlay />
              <IconWrapper colorClass="text-text-light/60 dark:text-text-dark/60">
                 <ChevronDown size={22} strokeWidth={3} />
              </IconWrapper>
            </button>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <button
              className={`${ButtonBase} w-10 h-10 rounded-l-lg rounded-r-sm`}
              onMouseDown={() => triggerKey('ArrowLeft')}
              onTouchStart={(e) => { e.preventDefault(); triggerKey('ArrowLeft'); }}
            >
              <GlossOverlay />
              <IconWrapper colorClass="text-text-light/60 dark:text-text-dark/60">
                 <ChevronLeft size={22} strokeWidth={3} />
              </IconWrapper>
            </button>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <button
              className={`${ButtonBase} w-10 h-10 rounded-r-lg rounded-l-sm`}
              onMouseDown={() => triggerKey('ArrowRight')}
              onTouchStart={(e) => { e.preventDefault(); triggerKey('ArrowRight'); }}
            >
              <GlossOverlay />
              <IconWrapper colorClass="text-text-light/60 dark:text-text-dark/60">
                 <ChevronRight size={22} strokeWidth={3} />
              </IconWrapper>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Container (Incurved) */}
      <div className="relative w-40 h-40 rounded-full bg-bg-light dark:bg-bg-dark shadow-[inset_3px_3px_6px_rgb(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_6px_#1d1e22,inset_-3px_-3px_6px_#393c44] flex items-center justify-center">
        {/* Recessed noise texture */}
        <div className="absolute inset-0 rounded-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
        
        <div className="relative w-32 h-32">
          {/* Triangle (Top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <button
              className={`${ButtonBase} w-12 h-12 rounded-full`}
              onMouseDown={() => triggerKey(' ')} 
              onTouchStart={(e) => { e.preventDefault(); triggerKey(' '); }}
            >
              <GlossOverlay />
              <IconWrapper colorClass="text-green-500">
                 <Triangle size={16} fill="currentColor" />
              </IconWrapper>
            </button>
          </div>

          {/* Circle (Right) -> Restart/Enter */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <button
              className={`${ButtonBase} w-12 h-12 rounded-full`}
              onMouseDown={() => triggerKey('Enter')}
              onTouchStart={(e) => { e.preventDefault(); triggerKey('Enter'); }}
            >
              <GlossOverlay />
              <IconWrapper colorClass="text-red-500">
                 <Circle size={16} fill="currentColor" />
              </IconWrapper>
            </button>
          </div>

          {/* Cross (Bottom) -> Exit */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <button
              className={`${ButtonBase} w-12 h-12 rounded-full`}
              onMouseDown={() => {
                if (onExit) onExit();
                triggerKey('Escape'); // Also trigger ESC just in case
              }}
              onTouchStart={(e) => { 
                e.preventDefault(); 
                if (onExit) onExit();
                triggerKey('Escape');
              }}
            >
              <GlossOverlay />
              <IconWrapper colorClass="text-blue-500">
                 <X size={16} strokeWidth={4} />
              </IconWrapper>
            </button>
          </div>

          {/* Square (Left) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <button
              className={`${ButtonBase} w-12 h-12 rounded-full`}
              onMouseDown={() => triggerKey(' ')} 
              onTouchStart={(e) => { e.preventDefault(); triggerKey(' '); }}
            >
              <GlossOverlay />
              <IconWrapper colorClass="text-pink-500">
                 <Square size={16} fill="currentColor" />
              </IconWrapper>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
