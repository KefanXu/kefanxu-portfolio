import React, { useMemo } from 'react';

interface AbstractPatternProps {
  id: string;
  className?: string;
}

export const AbstractPattern: React.FC<AbstractPatternProps> = ({ id, className = '' }) => {
  // Generate deterministic "random" values based on string ID
  const seed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }, [id]);

  const getColor = (offset: number) => {
    const hue = Math.abs((seed + offset) % 360);
    return `hsl(${hue}, 70%, 65%)`;
  };

  const patternType = Math.abs(seed % 3); // 0: Circles, 1: Lines, 2: Grid

  return (
    <div className={`w-full h-full overflow-hidden bg-bg-light/50 dark:bg-bg-dark/50 ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getColor(0)} stopOpacity="0.6" />
            <stop offset="100%" stopColor={getColor(100)} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill={`url(#grad-${id})`} />
        
        {patternType === 0 && (
          <g fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2">
            {[...Array(5)].map((_, i) => (
              <circle 
                key={i} 
                cx={Math.abs((seed * (i + 1)) % 400)} 
                cy={Math.abs((seed * (i + 2)) % 300)} 
                r={Math.abs((seed * (i + 3)) % 100) + 20} 
              />
            ))}
          </g>
        )}

        {patternType === 1 && (
           <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="3">
             {[...Array(8)].map((_, i) => (
               <line 
                 key={i}
                 x1="0" 
                 y1={i * 50} 
                 x2="400" 
                 y2={i * 50 + Math.abs(seed % 100)} 
               />
             ))}
           </g>
        )}

        {patternType === 2 && (
          <pattern id={`pat-${id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
             <circle cx="2" cy="2" r="2" fill="currentColor" fillOpacity="0.1" />
          </pattern>
        )}
        {patternType === 2 && <rect width="100%" height="100%" fill={`url(#pat-${id})`} />}

        {/* Hero Shape */}
        <circle cx="350" cy="50" r="100" fill={getColor(180)} fillOpacity="0.2" filter="blur(40px)" />
        <circle cx="50" cy="250" r="80" fill={getColor(240)} fillOpacity="0.2" filter="blur(30px)" />
      </svg>
    </div>
  );
};





