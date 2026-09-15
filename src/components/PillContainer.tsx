import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';

type PillSize = 'default' | 'small';

interface PillContainerProps {
  children: React.ReactNode;
  className?: string;
  topText?: string;
  bottomText?: string;
  size?: PillSize;
}

const SIZE_CONFIG = {
  default: {
    width: 300,
    height: 540,
    padding: 'p-14',
    centerX: 150,
    centerY: 270,
    textClass: 'text-[10px]',
  },
  small: {
    width: 210,
    height: 378,
    padding: 'p-10',
    centerX: 105,
    centerY: 189,
    textClass: 'text-[12px]',
  },
} as const;

export const PillContainer: React.FC<PillContainerProps> = ({
  children,
  className = '',
  topText,
  bottomText,
  size = 'default',
}) => {
  const config = SIZE_CONFIG[size];
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXStart = useMotionValue<number>(config.centerX);
  const mouseYStart = useMotionValue<number>(config.centerY);

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const isHovering = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
    mouseXStart.set(mouseX);
    mouseYStart.set(mouseY);
    isHovering.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseXStart.set(config.centerX);
    mouseYStart.set(config.centerY);
    isHovering.set(0);
  };

  const bgGradient = useMotionTemplate`radial-gradient(circle at ${mouseXStart}px ${mouseYStart}px, rgba(255, 170, 50, var(--light-intensity-start, 0.25)) 0%, rgba(255, 170, 50, var(--light-intensity-end, 0.05)) 50%, transparent 70%)`;

  const shadowX = useTransform(mouseXStart, [0, config.width], [-20, 20]);
  const shadowY = useTransform(mouseYStart, [0, config.height], [-20, 20]);
  const shadowOpacity = useTransform([x, y], ([latestX, latestY]: number[]) => {
    const dist = Math.sqrt(latestX * latestX + latestY * latestY);
    return 0.15 + dist * 0.4;
  });

  return (
    <div className={`flex justify-center items-center relative group ${className}`}>
      <div className="relative p-[2px] rounded-full bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark">
        <div
          className={`relative rounded-full ${config.padding} bg-bg-light dark:bg-bg-dark shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.3),inset_-3px_-3px_6px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_2px_2px_5px_#1d1e22,inset_-2px_-2px_5px_#393c44] flex items-center justify-center`}
          style={{ perspective: 1000, width: config.width, height: config.height }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {(topText || bottomText) && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 300 540">
              <defs>
                <path id="topCurve" d="M 28,150 A 122,122 0 0,1 272,150" />
                <path id="bottomCurve" d="M 28,390 A 122,122 0 0,0 272,390" />
              </defs>
              {topText && (
                <text
                  className={`${config.textClass} font-mono font-bold uppercase tracking-[0.2em] text-text-light/50 dark:text-text-dark/50 fill-current`}
                  dominantBaseline="middle"
                >
                  <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
                    {topText}
                  </textPath>
                </text>
              )}
              {bottomText && (
                <text
                  className={`${config.textClass} font-mono font-bold uppercase tracking-[0.2em] text-text-light/50 dark:text-text-dark/50 fill-current`}
                  dominantBaseline="middle"
                >
                  <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
                    {bottomText}
                  </textPath>
                </text>
              )}
            </svg>
          )}

          <motion.div
            className="w-full h-full rounded-full relative [--base-shadow-color:rgba(163,177,198,0.5)] dark:[--base-shadow-color:#1d1e22] group-hover:dark:[--base-shadow-color:transparent]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              rotateX: rotateXSpring,
              rotateY: rotateYSpring,
              boxShadow: useMotionTemplate`${shadowX}px ${shadowY}px 40px rgba(255,170,50,${useTransform(() => (isHovering.get() ? shadowOpacity.get() : 0))}), 0px 20px 40px var(--base-shadow-color)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                transform: 'translateZ(0)',
              }}
            >
              <div className="absolute inset-0 bg-bg-light dark:bg-bg-dark">
                <div
                  className="absolute inset-0 opacity-40 dark:opacity-20 mix-blend-overlay"
                  style={{
                    filter: 'contrast(120%) brightness(100%)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>

              <motion.div
                className="hidden dark:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none z-0 [--light-intensity-start:0.45] [--light-intensity-end:0.15]"
                style={{
                  background: bgGradient,
                  filter: 'blur(30px)',
                }}
              />

              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] rounded-full" />
              <div className="absolute inset-0 border border-white/30 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />

              <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>

              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white opacity-20 blur-3xl rounded-full pointer-events-none dark:hidden" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
