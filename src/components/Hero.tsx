import React, { useRef, useState } from 'react';
import { ToggleSwitch, ToggleSmall } from './NeuControls';
import { Shield, Database, Hash } from 'lucide-react';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { SnakeGame } from './SnakeGame';
import { PSPControls } from './PSPControls';
import { LCDBezel } from './LCDBezel';
import { SketchReveal, SketchScene, SketchThenShow } from './SketchReveal';
import { buildLCDShellShapes } from './heroWireframes';

export const Hero: React.FC = () => {
  const [power, setPower] = useState(true);
  const [backlight, setBacklight] = useState(true); // Default to TRUE (Green Backlight)
  const [secureMode, setSecureMode] = useState(false);
  
  // Right side states
  const [bioMetrics, setBioMetrics] = useState(false);
  const [consoleLock, setConsoleLock] = useState(false);
  // Removed haptics state as it is now just a static indicator

  // Check if Easter Egg condition is met (All 5 switches ON)
  const isEasterEggActive = power && backlight && secureMode && bioMetrics && consoleLock;

  // 3D Tilt Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [2, -2]);
  const rotateY = useTransform(x, [-300, 300], [-2, 2]);

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.62]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const controlsY = useTransform(scrollYProgress, [0, 1], [0, 55]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Match the powered LCD to the soft off-white surface visible before backlighting.
  const screenBg = power 
    ? 'bg-bg-light'
    : 'bg-[#1a1c20]';
  
  const screenText = power
    ? (backlight ? 'text-[#1a2f23]' : 'text-[#1f2937]')
    : 'text-[#333]';

  const borderColor = power
    ? (backlight ? 'border-[#1a2f23]' : 'border-[#1f2937]')
    : 'border-[#333]';

  return (
    <section ref={sectionRef} className="pt-48 pb-12 mb-32 flex flex-col items-center justify-center min-h-[70vh] perspective-1000 w-full max-w-7xl mx-auto px-4" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
      
      <motion.div
        style={{ scale: cardScale, y: cardY }}
        className="w-full flex flex-col items-center"
      >
      <SketchScene className="w-full flex flex-col items-center">
      <motion.div style={{ y: headerY }} className="text-center mb-16 flex flex-col items-center gap-2">
        <SketchReveal delay={0} radius="3px" duration={0.4} strokeWidth={1}>
          <h2 className="text-text-light dark:text-text-dark text-sm tracking-[0.3em] uppercase font-mono">
            About Me
          </h2>
        </SketchReveal>
        <SketchReveal delay={0.08} radius="2px" duration={0.35} strokeWidth={1}>
          <p className="text-text-light dark:text-text-dark text-xs opacity-60">
            Kefan Xu - PhD Student
          </p>
        </SketchReveal>
      </motion.div>

      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-16"
      >
        
        {/* LEFT CONTROLS — detailed per-part wireframes */}
        <motion.div style={{ y: controlsY }} className="hidden lg:flex flex-col gap-10 mt-4 items-center order-1">
          <ToggleSwitch 
            isChecked={power} 
            onChange={setPower} 
            label="System Power"
            sketchDelay={0.15}
          />
          <ToggleSwitch 
            isChecked={secureMode} 
            onChange={setSecureMode} 
            label="Secure Mode"
            sketchDelay={0.28}
          />
          <ToggleSmall 
            isChecked={backlight}
            onChange={setBacklight}
            label="Backlight"
            sketchDelay={0.42}
          />
        </motion.div>

        {/* CENTER LCD — shell sketches first; screen pieces sketch then fade in after */}
        <SketchThenShow
          baseDelay={0.1}
          getShapes={buildLCDShellShapes}
          revealDuration={1.05}
          className="flex-grow max-w-2xl w-full order-1 lg:order-2"
        >
          {(shellRevealed) => (
            <LCDBezel
              outerRadiusClassName="rounded-[40px]"
              trenchRadiusClassName="rounded-[38px]"
              trenchPaddingClassName="p-4"
              outerClassName="transition-all duration-500 font-mono overflow-hidden"
              trenchClassName="overflow-hidden"
            >
                <div className={`
                    ${screenText}
                    rounded-[28px] min-h-[320px] transition-colors duration-500 relative overflow-hidden flex flex-col
                    border-4 ${borderColor} border-opacity-10
                `}>
                    <motion.div
                        className={`absolute inset-0 ${screenBg} pointer-events-none`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: shellRevealed ? 1 : 0 }}
                        transition={{
                          delay: shellRevealed ? 3.15 : 0,
                          duration: 1.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                    />
                    <div className="absolute inset-0 z-[1] shadow-[inset_0_0_60px_rgba(0,0,0,0.15)] pointer-events-none" />
                    <div className="absolute inset-0 z-[2] opacity-[0.12] pointer-events-none" 
                        style={{ 
                          backgroundImage: power ? 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)' : 'none',
                          backgroundSize: '3px 3px'
                        }} 
                    />

                    <motion.div 
                        animate={{ opacity: power ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-grow flex flex-col relative z-10 p-4"
                    >
                        {!shellRevealed ? null : isEasterEggActive ? (
                           <SnakeGame />
                        ) : (
                           <>
                              <div className={`flex border-b-4 ${borderColor} mb-8`}>
                                 <SketchReveal delay={0.2} radius="2px" duration={0.34} strokeWidth={1} revealHold={0.22} revealDuration={1.1} className="shrink-0">
                                   <div className={`
                                     ${backlight ? 'bg-[#1a2f23] text-[#8aa899]' : 'bg-[#1f2937] text-[#9ca3af]'}
                                     px-3 py-1 text-xs font-bold uppercase tracking-widest flex items-center
                                   `}>
                                      KEYS NAME
                                   </div>
                                 </SketchReveal>
                                 <SketchReveal delay={0.34} radius="2px" duration={0.34} strokeWidth={1} revealHold={0.22} revealDuration={1.1} className="flex-grow">
                                   <div className={`flex-grow px-3 py-1 text-xs font-bold font-mono tracking-wider flex items-center justify-between`}>
                                      <span>No.9908032189</span>
                                      {secureMode && <Shield size={12} fill="currentColor" />}
                                   </div>
                                 </SketchReveal>
                              </div>

                              <div className="flex-grow flex flex-col justify-center mb-8 pl-2">
                                 <SketchReveal delay={0.5} radius="4px" duration={0.45} strokeWidth={1.35} revealHold={0.25} revealDuration={1.2}>
                                   <div className="text-5xl md:text-7xl font-bold tracking-tighter uppercase font-mono leading-none">
                                      KEFAN XU
                                   </div>
                                 </SketchReveal>
                                 <SketchReveal delay={0.68} radius="1px" duration={0.28} strokeWidth={1} revealHold={0.18} revealDuration={0.95} className="w-fit mt-2">
                                   <div className="w-8 h-2 bg-current animate-pulse" />
                                 </SketchReveal>
                              </div>

                              <div className={`border-t-4 border-b-4 ${borderColor}`}>
                                 <div className={`grid grid-cols-10 border-b-2 ${borderColor}`}>
                                    <div className={`col-span-3 border-r-2 ${borderColor}`}>
                                      <SketchReveal delay={0.82} radius="2px" duration={0.3} strokeWidth={1} revealHold={0.2} revealDuration={1.05}>
                                        <div className={`${backlight ? 'bg-[#1a2f23] text-[#8aa899]' : 'bg-[#1f2937] text-[#9ca3af]'} px-2 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center`}>
                                           TYPE
                                        </div>
                                      </SketchReveal>
                                    </div>
                                    <div className={`col-span-4 border-r-2 ${borderColor}`}>
                                      <SketchReveal delay={0.94} radius="2px" duration={0.3} strokeWidth={1} revealHold={0.2} revealDuration={1.05}>
                                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center">
                                           ACCESS APPS
                                        </div>
                                      </SketchReveal>
                                    </div>
                                    <div className="col-span-3">
                                      <SketchReveal delay={1.06} radius="2px" duration={0.3} strokeWidth={1} revealHold={0.2} revealDuration={1.05}>
                                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center justify-end">
                                           CREATE TIME
                                        </div>
                                      </SketchReveal>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-10 py-3">
                                    <div className={`col-span-3 px-2 flex flex-col items-center justify-center border-r-2 ${borderColor}`}>
                                       <SketchReveal delay={1.18} radius="2px" duration={0.32} strokeWidth={1} revealHold={0.2} revealDuration={1.05}>
                                         <div className={`border-2 ${borderColor} px-2 py-1 rounded-sm text-[10px] font-bold uppercase`}>
                                            PhD Student
                                         </div>
                                       </SketchReveal>
                                    </div>
                                    <div className={`col-span-4 px-2 flex items-center gap-3 border-r-2 ${borderColor}`}>
                                       <SketchReveal delay={1.3} shape="circle" duration={0.32} strokeWidth={1.15} revealHold={0.2} revealDuration={1.05}>
                                         <div className={`w-6 h-6 rounded-full border-2 ${borderColor} flex items-center justify-center`}>
                                            <Database size={12} />
                                         </div>
                                       </SketchReveal>
                                       <SketchReveal delay={1.42} shape="circle" duration={0.32} strokeWidth={1.15} revealHold={0.2} revealDuration={1.05}>
                                         <div className={`w-6 h-6 rounded-full border-2 ${borderColor} flex items-center justify-center`}>
                                            <Hash size={12} />
                                         </div>
                                       </SketchReveal>
                                       <SketchReveal delay={1.54} radius="2px" duration={0.28} strokeWidth={1} revealHold={0.18} revealDuration={1.0}>
                                         <span className="text-[10px] font-bold">HCI_LAB</span>
                                       </SketchReveal>
                                    </div>
                                    <div className={`col-span-3 px-2 flex items-center justify-end`}>
                                       <SketchReveal delay={1.66} radius="2px" duration={0.3} strokeWidth={1} revealHold={0.2} revealDuration={1.05}>
                                         <span className="text-[10px] font-bold font-mono">2022-09-01</span>
                                       </SketchReveal>
                                    </div>
                                 </div>
                              </div>
                           </>
                        )}

                    </motion.div>
                </div>
            </LCDBezel>
          )}
        </SketchThenShow>

        {/* RIGHT CONTROLS */}
        <motion.div style={{ y: controlsY }} className="hidden lg:flex flex-col gap-10 mt-4 items-center order-3">
          <ToggleSwitch 
            isChecked={bioMetrics} 
            onChange={setBioMetrics} 
            label="Bio-Metrics"
            sketchDelay={0.2}
          />
          <ToggleSwitch 
            isChecked={consoleLock} 
            onChange={setConsoleLock} 
            label="Console Lock"
            sketchDelay={0.34}
          />
          <div className="flex flex-col gap-3 items-start pl-2">
            <div className="flex items-center gap-3">
              <SketchReveal delay={0.48} shape="circle" duration={0.24} strokeWidth={1}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
              </SketchReveal>
              <SketchReveal delay={0.54} radius="2px" duration={0.28} strokeWidth={1}>
                <span className="text-[9px] font-mono uppercase opacity-50 tracking-widest">Haptics</span>
              </SketchReveal>
            </div>
            <div className="flex items-center gap-3">
              <SketchReveal delay={0.58} shape="circle" duration={0.24} strokeWidth={1}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)] animate-pulse" />
              </SketchReveal>
              <SketchReveal delay={0.64} radius="2px" duration={0.28} strokeWidth={1}>
                <span className="text-[9px] font-mono uppercase opacity-50 tracking-widest">Data Link</span>
              </SketchReveal>
            </div>
          </div>
        </motion.div>

        {/* MOBILE CONTROLS */}
        <div className="lg:hidden w-full order-2 mt-8">
           {isEasterEggActive ? (
             <PSPControls onExit={() => {
                setConsoleLock(false); 
             }} />
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex justify-center">
                  <ToggleSwitch isChecked={power} onChange={setPower} label="System Power" sketchDelay={0.55} />
                </div>
                <div className="flex justify-center">
                  <ToggleSwitch isChecked={secureMode} onChange={setSecureMode} label="Secure Mode" sketchDelay={0.62} />
                </div>
                <div className="flex justify-center">
                  <ToggleSwitch isChecked={bioMetrics} onChange={setBioMetrics} label="Bio-Metrics" sketchDelay={0.69} />
                </div>
                <div className="flex justify-center">
                  <ToggleSmall isChecked={backlight} onChange={setBacklight} label="Backlight" sketchDelay={0.76} />
                </div>
                <div className="flex justify-center">
                  <ToggleSwitch isChecked={consoleLock} onChange={setConsoleLock} label="Console Lock" sketchDelay={0.83} />
                </div>
                <div className="flex flex-col gap-3 items-center justify-center pl-2">
                   <div className="flex items-center gap-3">
                      <SketchReveal delay={0.9} shape="circle" duration={0.24} strokeWidth={1}>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                      </SketchReveal>
                      <SketchReveal delay={0.96} radius="2px" duration={0.28} strokeWidth={1}>
                        <span className="text-[9px] font-mono uppercase opacity-50 tracking-widest">Haptics</span>
                      </SketchReveal>
                   </div>
                   <div className="flex items-center gap-3">
                      <SketchReveal delay={1.0} shape="circle" duration={0.24} strokeWidth={1}>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)] animate-pulse" />
                      </SketchReveal>
                      <SketchReveal delay={1.06} radius="2px" duration={0.28} strokeWidth={1}>
                        <span className="text-[9px] font-mono uppercase opacity-50 tracking-widest">Data Link</span>
                      </SketchReveal>
                   </div>
                </div>
             </div>
           )}
        </div>

      </motion.div>
      </SketchScene>

      </motion.div>
    </section>
  );
};
