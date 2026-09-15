import React from 'react';

interface ConcaveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ConcaveCard: React.FC<ConcaveCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-[32px] bg-bg-light dark:bg-bg-dark 
        border border-white/20 dark:border-white/5
        transition-all duration-300 overflow-hidden ${className}`}
    >
        {/* Concave Inset Shadow (similar to ecological lens buttons) */}
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none
            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.10),inset_-2px_-2px_4px_rgba(255,255,255,0.55)]
            dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.55),inset_-2px_-2px_4px_rgba(255,255,255,0.06)]"
        />

        {/* Content Container */}
        <div className="relative z-10 p-6 md:p-8">
             {children}
        </div>
    </div>
  );
};
