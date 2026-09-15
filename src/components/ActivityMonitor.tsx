import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Clock, Zap } from 'lucide-react';
import { NeuSwitch } from './NeuSwitch';
import { LCDBezel } from './LCDBezel';

export const ActivityMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  // Simulate data updates
  useEffect(() => {
    // Generate random bars
    const generateData = () => Array.from({ length: 8 }, () => Math.random() * 0.8 + 0.2);
    setDataPoints(generateData());

    const interval = setInterval(() => {
      setDataPoints(prev => {
        const newData = [...prev.slice(1), Math.random() * 0.8 + 0.2];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center justify-center text-blue-500">
            <Activity size={20} />
          </div>
          <div>
             <h3 className="text-sm font-bold uppercase tracking-wider text-text-light dark:text-text-dark">Activity Log</h3>
             <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-mono text-text-light/50 dark:text-text-dark/50 uppercase">Live Stream</span>
             </div>
          </div>
        </div>
        <Clock size={16} className="text-text-light/30 dark:text-text-dark/30" />
      </div>

      {/* Screen / Graph */}
      <LCDBezel
        outerRadiusClassName="rounded-xl"
        trenchRadiusClassName="rounded-[10px]"
        outerClassName="h-48 w-full"
        trenchClassName="w-full h-full"
        trenchPaddingClassName="p-[3px]"
      >
        <div className="relative w-full h-full rounded-lg bg-bg-light text-[#1a2f23] shadow-neu-pressed-light dark:shadow-neu-pressed-dark p-4 overflow-hidden">
          {/* Grid Lines */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-10 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-current" />
            ))}
          </div>

          {/* Bars */}
          <div className="h-full flex items-end justify-between gap-2 relative z-10">
            {dataPoints.map((h, i) => (
              <motion.div
                key={i}
                layout
                className="w-full bg-blue-500 rounded-t-sm opacity-80"
                initial={{ height: '0%' }}
                animate={{ height: `${h * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            ))}
          </div>
        </div>
      </LCDBezel>

      {/* Controls */}
      <div className="flex flex-col gap-4">
         <NeuSwitch 
           options={[
             { id: 'daily', label: 'Daily' },
             { id: 'weekly', label: 'Weekly' },
             { id: 'monthly', label: 'Monthly' }
           ]}
           activeId={activeTab}
           onChange={setActiveTab}
         />
         
         <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center gap-3">
               <Database size={16} className="text-text-light/40 dark:text-text-dark/40" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold uppercase text-text-light/40 dark:text-text-dark/40">Storage</span>
                  <span className="text-xs font-mono font-bold">2.4 GB</span>
               </div>
            </div>
            <div className="p-3 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center gap-3">
               <Zap size={16} className="text-yellow-500/80" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold uppercase text-text-light/40 dark:text-text-dark/40">Sensor</span>
                  <span className="text-xs font-mono font-bold text-green-500">Active</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
