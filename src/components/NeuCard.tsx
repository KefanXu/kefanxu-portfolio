import React from 'react';

interface NeuCardProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}

export const NeuCard: React.FC<NeuCardProps> = ({ children, className = '', inset = false }) => {
  const shadowClass = inset
    ? 'shadow-neu-pressed-light dark:shadow-neu-pressed-dark'
    : 'shadow-neu-light dark:shadow-neu-dark';
  
  return (
    <div className={`bg-bg-light dark:bg-bg-dark rounded-xl ${shadowClass} ${className}`}>
      {children}
    </div>
  );
};





