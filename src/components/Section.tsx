import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, title, children, className = '' }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
           <div className="h-px bg-text-light/20 dark:bg-text-dark/20 flex-1"></div>
           <h2 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark uppercase tracking-widest font-mono">
             {title}
           </h2>
           <div className="h-px bg-text-light/20 dark:bg-text-dark/20 flex-1"></div>
        </div>
        {children}
      </div>
    </section>
  );
};





