import React from 'react';
import { NeuCard } from './NeuCard';

interface DashboardPanelProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  className = '',
  headerAction 
}) => {
  return (
    <NeuCard className={`relative overflow-hidden border-2 border-bg-light dark:border-bg-dark ${className}`}>
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />

      {/* Panel Header */}
      <div className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-text-light/5 dark:border-text-dark/5 bg-black/5 dark:bg-white/5">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-blue-500 dark:text-blue-400">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-text-light dark:text-text-dark">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] text-text-light/50 dark:text-text-dark/50 font-mono uppercase">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
           {headerAction}
           <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[8px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">System Active</span>
           </div>
        </div>
      </div>

      {/* Panel Content */}
      <div className="p-6 relative z-10">
        {children}
      </div>
    </NeuCard>
  );
};

