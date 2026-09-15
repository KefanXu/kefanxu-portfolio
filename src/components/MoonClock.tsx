import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LCDBezel } from './LCDBezel';

interface MoonClockProps {
  onSliderChange?: (value: number) => void;
  value?: number; // Controlled value from parent
}

export const MoonClock: React.FC<MoonClockProps> = ({ onSliderChange, value }) => {
  const [sliderValue, setSliderValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isManuallySet, setIsManuallySet] = useState(false);

  // Helper to get current system time as slider value (0-100)
  const getSystemTimeValue = () => {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const totalDayMinutes = 24 * 60;
    return (totalMinutes / totalDayMinutes) * 100;
  };

  const isSettingFromParent = useRef(false);
  const lastValueFromParent = useRef<number | undefined>(undefined);

  // Sync with controlled value from parent (when moon phase is clicked)
  useEffect(() => {
    if (value !== undefined && !isDragging) {
      const newValue = value * 100; // Convert 0-1 to 0-100
      // Only update if the value from parent actually changed
      if (lastValueFromParent.current !== value) {
        lastValueFromParent.current = value;
        isSettingFromParent.current = true;
        setSliderValue(newValue);
        setIsManuallySet(true); // Mark as manually set - will stay until user drags
        // Don't call onSliderChange here - parent already knows the value
        // Reset flag after a brief moment to allow future updates
        setTimeout(() => {
          isSettingFromParent.current = false;
        }, 200);
      }
    }
  }, [value, isDragging]);

  // Notify parent of change (when user interacts, not when set from parent)
  useEffect(() => {
    if (onSliderChange && !isSettingFromParent.current) {
      onSliderChange(sliderValue);
    }
  }, [sliderValue, onSliderChange]);

  // Update time every second
  useEffect(() => {
    // Initial sync only if not manually set
    if (!isDragging && !isManuallySet) {
        setSliderValue(getSystemTimeValue());
    }

    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Update slider if not being dragged and not manually set
      if (!isDragging && !isManuallySet) {
        setSliderValue(getSystemTimeValue());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isDragging, isManuallySet]);

  // Handle Drag Start
  const handleDragStart = () => {
      setIsDragging(true);
      lastValueFromParent.current = undefined; // Clear parent value tracking when user drags
  };

  // Handle Drag Release - always bounce back to system time
  const handleDragEnd = () => {
      setIsDragging(false);
      setIsManuallySet(false); // Reset to system time after drag
      lastValueFromParent.current = undefined; // Clear parent value tracking
      setSliderValue(getSystemTimeValue());
  };

  // Derived time values
  const displayHours = isDragging ? Math.floor((sliderValue / 100) * 24) : time.getHours();
  const displayMinutes = isDragging ? Math.floor(((sliderValue / 100) * 24 * 60) % 60) : time.getMinutes();
  const displaySeconds = isDragging ? 0 : time.getSeconds();
  
  // Calculate rotation for hands
  const hourRotation = (displayHours % 12) * 30 + (displayMinutes / 2);
  const minuteRotation = displayMinutes * 6;
  const secondRotation = displaySeconds * 6;

  // Moon Phase Calculation
  const shadowX = (sliderValue - 50) * 1.2; 

  // Calendar Calculation
  const year = time.getFullYear();
  const month = time.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Determine displayed day:
  // If dragging, map slider (0-100) to days (1-31).
  // If not dragging, use system date.
  const displayedDay = isDragging 
    ? Math.max(1, Math.min(daysInMonth, Math.ceil((sliderValue / 100) * daysInMonth)))
    : time.getDate();

  const displayDateObject = new Date(year, month, displayedDay);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto lg:mx-0 relative z-10">
      
      {/* Retro LCD Clock Face */}
      <LCDBezel
        outerRadiusClassName="rounded-[40px]"
        trenchRadiusClassName="rounded-[38px]"
        outerClassName="w-64 h-64"
        trenchClassName="w-full h-full"
        trenchPaddingClassName="p-[6px]"
      >
        {/* LCD Screen Container */}
        <div className="w-full h-full bg-bg-light rounded-[32px] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] flex items-center justify-center">
            
            {/* Pixel Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
                style={{ 
                backgroundImage: 'linear-gradient(to right, #1a2f23 1px, transparent 1px), linear-gradient(to bottom, #1a2f23 1px, transparent 1px)',
                backgroundSize: '4px 4px'
                }} 
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay pointer-events-none" />

            {/* Moon Visual */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-40 h-40 rounded-full border-2 border-[#1a2f23]/20 flex items-center justify-center bg-[#1a2f23]/5">
                    {/* Stars (Dark Dots) */}
                    <div className="absolute inset-0 opacity-40">
                        {[...Array(12)].map((_, i) => (
                        <div 
                            key={i} 
                            className="absolute bg-[#1a2f23] rounded-full w-[2px] h-[2px]"
                            style={{ 
                            top: `${Math.random() * 100}%`, 
                            left: `${Math.random() * 100}%`,
                            }} 
                        />
                        ))}
                    </div>

                    {/* The Moon (LCD Style) */}
                    <div className="relative w-24 h-24 rounded-full bg-[#1a2f23] overflow-hidden shadow-inner opacity-90">
                        {/* Moon shadow phase mask matches the soft LCD surface */}
                        <motion.div 
                            className="absolute inset-0 bg-bg-light rounded-full"
                            animate={{ x: `${shadowX}%` }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        />
                        {/* Pixelated Texture on Moon */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    </div>
                </div>
            </div>

            {/* Clock Hands (Retro Digital/Analog Hybrid) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Hour Hand */}
                <motion.div 
                    className="absolute w-2 h-16 bg-[#1a2f23] origin-bottom -translate-y-1/2 rounded-sm"
                    animate={{ rotate: hourRotation }}
                    style={{ bottom: '50%' }}
                />
                {/* Minute Hand */}
                <motion.div 
                    className="absolute w-1.5 h-24 bg-[#1a2f23] origin-bottom -translate-y-1/2 opacity-80 rounded-sm"
                    animate={{ rotate: minuteRotation }}
                    style={{ bottom: '50%' }}
                />
                {/* Second Hand */}
                <motion.div 
                    className="absolute w-[1px] h-28 bg-[#1a2f23] origin-bottom -translate-y-1/2 opacity-60"
                    animate={{ rotate: secondRotation }}
                    style={{ bottom: '50%' }}
                />
                {/* Center Pin */}
                <div className="w-3 h-3 bg-[#1a2f23] rounded-full z-10" />
            </div>

            {/* Markers */}
            {[...Array(12)].map((_, i) => (
                <div 
                    key={i} 
                    className="absolute w-full h-full flex justify-center pt-4 pointer-events-none"
                    style={{ transform: `rotate(${i * 30}deg)` }}
                >
                    <div className="w-1.5 h-3 bg-[#1a2f23]/40 rounded-sm" />
                </div>
            ))}
        </div>
      </LCDBezel>

      {/* Location Label */}
      <div className="text-center font-mono space-y-1">
        <div className="text-xs text-text-light/50 dark:text-text-dark/50">
          {displayHours.toString().padStart(2, '0')}:{displayMinutes.toString().padStart(2, '0')}:{displaySeconds.toString().padStart(2, '0')} • {sliderValue < 50 ? 'WAXING' : 'WANING'}
        </div>
      </div>

      {/* Tuner Style Slider */}
      <div className="w-full relative h-20 flex items-center justify-center">
        {/* Recessed Track */}
        <div className="w-full h-16 bg-bg-light dark:bg-bg-dark rounded-2xl shadow-[inset_3px_3px_6px_rgb(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_3px_3px_6px_#1d1e22,inset_-3px_-3px_6px_#393c44] relative overflow-hidden px-2 flex items-center">
            
            {/* Ticks/Ruler Background */}
            <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none opacity-20">
                {[...Array(40)].map((_, i) => (
                    <div key={i} className={`w-[1px] bg-text-light dark:bg-text-dark ${i % 5 === 0 ? 'h-4' : 'h-2'}`} />
                ))}
            </div>
            
            {/* Track Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

            {/* The Tuner Handle */}
            <motion.div
                className="absolute h-12 w-24 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center justify-center gap-1 z-10 pointer-events-none"
                animate={{ 
                    scale: isDragging ? 0.98 : 1,
                    left: `calc(0.5rem + (100% - 1rem - 6rem) * ${sliderValue / 100})`
                }}
                transition={{
                    left: {
                        type: isDragging ? "tween" : "spring",
                        duration: isDragging ? 0 : undefined,
                        stiffness: isDragging ? undefined : 150,
                        damping: isDragging ? undefined : 15,
                    },
                    scale: { duration: 0.1 }
                }}
            >
                {/* Grip Texture (Debossed Lines) */}
                <div className="flex gap-1.5 opacity-40">
                    {[...Array(4)].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-[2px] h-6 rounded-full bg-transparent shadow-[1px_0_1px_rgba(255,255,255,0.8),-1px_0_1px_rgba(0,0,0,0.2)] dark:shadow-[1px_0_1px_rgba(255,255,255,0.1),-1px_0_1px_rgba(0,0,0,0.8)]"
                        />
                    ))}
                </div>
                
                {/* Center Indicator (Subtle Divot) */}
                <div className="absolute top-1 w-1 h-1 rounded-full bg-primary-light/50 dark:bg-primary-dark/50 shadow-inner" />
            </motion.div>

            {/* Actual Input */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
        </div>
      </div>

      {/* Calendar Label */}
      <div className="text-center font-mono space-y-1">
        <div className="text-xs text-text-light/50 dark:text-text-dark/50">
          {displayDateObject.getFullYear()}-{(displayDateObject.getMonth() + 1).toString().padStart(2, '0')}-{displayDateObject.getDate().toString().padStart(2, '0')} • {displayDateObject.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
        </div>
      </div>

      {/* Retro LCD Calendar */}
      <LCDBezel
        outerRadiusClassName="rounded-[40px]"
        trenchRadiusClassName="rounded-[38px]"
        outerClassName="w-64 h-64"
        trenchClassName="w-full h-full"
        trenchPaddingClassName="p-[6px]"
      >
        <div className="w-full h-full bg-bg-light rounded-[32px] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] flex flex-col items-center p-5">
            {/* Pixel Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
                style={{ 
                backgroundImage: 'linear-gradient(to right, #1a2f23 1px, transparent 1px), linear-gradient(to bottom, #1a2f23 1px, transparent 1px)',
                backgroundSize: '4px 4px'
                }} 
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay pointer-events-none" />

            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4 border-b-2 border-[#1a2f23]/20 pb-2 relative z-10">
                <span className="font-mono font-bold text-[#1a2f23] tracking-widest text-xl uppercase">
                    {time.toLocaleString('default', { month: 'short' })}
                </span>
                <span className="font-mono font-bold text-[#1a2f23] tracking-widest text-xl">
                    {time.getFullYear()}
                </span>
            </div>
            
            {/* Days Grid */}
            <div className="w-full grid grid-cols-7 gap-1 text-center relative z-10">
                {['S','M','T','W','T','F','S'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-[#1a2f23] opacity-60 mb-1">{d}</div>
                ))}
                {/* Calendar Logic */}
                {(() => {
                    const firstDay = new Date(year, month, 1).getDay();
                    const days: (number | null)[] = [];
                    for (let i = 0; i < firstDay; i++) days.push(null);
                    for (let i = 1; i <= daysInMonth; i++) days.push(i);
                    while (days.length < 35) days.push(null);
                    return days;
                })().map((day, i) => (
                    <div key={i} className={`
                        h-6 flex items-center justify-center text-xs font-bold font-mono rounded-sm transition-colors duration-200
                        ${day === displayedDay ? 'bg-[#1a2f23] text-[#8aa899] shadow-sm' : 'text-[#1a2f23]'}
                        ${!day ? 'opacity-0' : ''}
                    `}>
                        {day}
                    </div>
                ))}
            </div>
        </div>
      </LCDBezel>

    </div>
  );
};
