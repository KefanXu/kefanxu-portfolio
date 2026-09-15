import React from 'react';
import { PillContainer } from './PillContainer';
import { Footprints } from 'lucide-react';

export const GlowingPill: React.FC = () => {
  return (
    <PillContainer 
      topText="Georgia Tech × Emory"
      bottomText="2022 - Present"
    >
       <div className="h-full flex flex-col items-center justify-between py-16 px-6 relative z-10">
           <div className="flex-grow flex items-center justify-center pb-32">
             <Footprints 
               size={96} 
               strokeWidth={1}
               className="text-text-light dark:text-text-dark opacity-80 drop-shadow-md"
             />
           </div>
           <div className="space-y-1 text-center">
               <h3 className="text-lg font-bold text-text-light dark:text-text-dark tracking-wider">DUCSS</h3>
               <p className="text-[10px] font-medium text-text-light/60 dark:text-text-dark/60 uppercase tracking-widest">A Diabetic Foot Monitoring System</p>
           </div>
       </div>
    </PillContainer>
  );
};
