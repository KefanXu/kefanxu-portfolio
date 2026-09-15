import React from 'react';

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
  circle?: boolean;
}

export const NeuButton: React.FC<NeuButtonProps> = ({ 
  children, 
  className = '', 
  active = false, 
  circle = false,
  ...props 
}) => {
  // Logic:
  // Default: Raised shadow, standard text color, transparent border to prevent shift.
  // Active (prop or click): Inset shadow (pressed/hollow), Blue text/icon color, Visible border.
  
  const baseClasses = "bg-bg-light dark:bg-bg-dark transition-all duration-200 ease-in-out font-medium flex items-center justify-center select-none border";
  
  const shapeClasses = circle ? 'rounded-full p-3' : 'rounded-2xl px-6 py-4';

  const stateClasses = active 
    ? 'shadow-neu-pressed-light dark:shadow-neu-pressed-dark text-blue-500 dark:text-blue-400 border-white/50 dark:border-white/5' 
    : 'shadow-neu-light dark:shadow-neu-dark text-text-light dark:text-text-dark border-transparent active:shadow-neu-pressed-light dark:active:shadow-neu-pressed-dark active:text-blue-500 dark:active:text-blue-400 active:border-white/50 dark:active:border-white/5 hover:text-blue-500/80 dark:hover:text-blue-400/80';

  return (
    <button 
      className={`
        ${baseClasses}
        ${shapeClasses}
        ${stateClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
