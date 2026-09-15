import React, { useState, useRef } from 'react';
import { NeuInput } from './NeuInput';
import { NeuSwitch } from './NeuSwitch';
import { projects } from '../data/portfolio';
import { 
  Calendar, Cpu, Search, Activity, LayoutDashboard, 
  MessageSquare, RefreshCw, History, FileText
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { AbstractPattern } from './AbstractPattern';

import { GlowingPill } from './GlowingPill';
import { PillContainer } from './PillContainer';

const RoleBadge = ({ involvement }: { involvement: 'lead' | 'collaborator' }) => (
  <span
    className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full text-text-light/60 dark:text-text-dark/60 shrink-0 ${
      involvement === 'lead'
        ? 'bg-text-light/20 dark:bg-text-dark/20'
        : 'border border-text-light/20 dark:border-text-dark/20'
    }`}
  >
    {involvement === 'lead' ? 'Lead' : 'Collaborator'}
  </span>
);

const PeriodRow = ({ period, involvement }: { period: string; involvement: 'lead' | 'collaborator' }) => (
  <div className="flex items-center justify-between gap-4 mb-4">
    <div className="flex items-center gap-2 text-xs font-mono text-text-light/40 dark:text-text-dark/40 uppercase tracking-widest">
      <Calendar size={14} />
      {period}
    </div>
    <RoleBadge involvement={involvement} />
  </div>
);

const PaperPdfButton = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark text-text-light/60 dark:text-text-dark/60 hover:text-blue-500 transition-all hover:scale-105 active:scale-95 font-mono text-xs font-bold uppercase tracking-widest"
    aria-label="Read paper on ACM Digital Library"
  >
    <FileText size={16} />
    PDF
  </a>
);

const ProjectIcon = ({
  icon: Icon,
  title,
  subtitle,
  topText,
  bottomText,
  size = 'default',
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  topText?: string;
  bottomText?: string;
  size?: 'default' | 'small';
}) => {
  const iconSize = size === 'small' ? 72 : 96;
  const py = size === 'small' ? 'py-12' : 'py-16';
  const pb = size === 'small' ? 'pb-24' : 'pb-32';

  return (
    <PillContainer topText={topText} bottomText={bottomText} size={size}>
      <div className={`h-full w-full flex flex-col items-center justify-between ${py} px-6 relative z-10`}>
        <div className={`flex-grow flex items-center justify-center ${pb}`}>
          <Icon
            size={iconSize}
            strokeWidth={1}
            className="text-text-light dark:text-text-dark opacity-80 drop-shadow-md"
          />
        </div>
        <div className="text-center">
          <h3 className={`font-bold text-text-light dark:text-text-dark tracking-wider uppercase mb-2 ${size === 'small' ? 'text-base' : 'text-lg'}`}>
            {title}
          </h3>
          <p className="text-[10px] font-medium text-text-light/60 dark:text-text-dark/60 uppercase tracking-widest">
            {subtitle}
          </p>
        </div>
      </div>
    </PillContainer>
  );
};

/* ================================================================
 *  ProjectRow — scroll parallax for visual vs text card
 * ================================================================ */

const ProjectRow: React.FC<{
  proj: (typeof projects)[number];
  index: number;
  getProjectVisual: (id: string) => React.ReactNode;
}> = ({ proj, index, getProjectVisual }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [22, -18]);    // visual
  const textCardY = useTransform(scrollYProgress, [0, 1], [-70, 95]);  // text — fast, big move
  const isImageRight = index % 2 === 0;
  const involvement = proj.involvement ?? 'lead';

  return (
    <div
      ref={rowRef}
      id={proj.id}
      className={`flex flex-col ${isImageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-24 lg:gap-60 scroll-mt-32`}
    >
      <motion.div
        className="shrink-0 flex justify-center w-full lg:w-auto"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: visualY }}
      >
        {getProjectVisual(proj.id)}
      </motion.div>

      <motion.div
        className="max-w-xl w-full"
        initial={{ opacity: 0, x: isImageRight ? -30 : 30, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: textCardY }}
      >
        <PeriodRow period={proj.period} involvement={involvement} />
        <h3 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark leading-tight mb-6 font-heading">
          {proj.title}
        </h3>
        <div className="mb-10 flex flex-wrap gap-2">
          {proj.tags?.map((tag) => (
            <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-text-light/50 dark:text-text-dark/50 tracking-wider">
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-8 text-sm md:text-base font-normal text-text-light/80 dark:text-text-dark/80 leading-[30px] font-display">
          {proj.description.map((desc, i) => (
            <p key={i}>
              {desc.split(' ').map((word, wI) => (
                ['studies', 'sensors', 'clinicians', 'technologies', 'contextual', 'physical'].some((k) => word.toLowerCase().includes(k))
                  ? <span key={wI} className="font-bold text-text-light dark:text-text-dark">{word} </span>
                  : word + ' '
              ))}
            </p>
          ))}
        </div>
        {proj.paperUrl && (
          <div className="mt-8">
            <PaperPdfButton href={proj.paperUrl} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const itemsRef = useRef(new Map<string, HTMLDivElement>());
  const ducssRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ducssScroll } = useScroll({
    target: ducssRef,
    offset: ['start end', 'end start'],
  });
  const ducssLeftY = useTransform(ducssScroll, [0, 1], [20, -15]);    // visual
  const ducssRightY = useTransform(ducssScroll, [0, 1], [-80, 110]);  // text — very fast

  const filteredProjects = projects.filter(proj => 
    proj.id !== 'ducss' && (
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const compactProjects = projects.filter(proj => 
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProjectClick = (id: string) => {
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    } else {
      setSelectedProjectId(id);

      setTimeout(() => {
        const node = itemsRef.current.get(id);
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }, 100);

      setTimeout(() => {
        const node = itemsRef.current.get(id);
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }, 400);
    }
  };

  const getProjectVisual = (id: string) => {
    const project = projects.find(p => p.id === id);
    const topText = project?.collaboration || (project?.role ? `Role: ${project.role}` : '');
    const bottomText = project?.period;

    switch (id) {
      case 'sedentary':
        return <ProjectIcon icon={Activity} title="Activity Monitor" subtitle="Sedentary Behavior Analysis" topText={topText} bottomText={bottomText} />;
      case 'pecss':
        return <ProjectIcon icon={LayoutDashboard} title="PECSS" subtitle="Clinical Support Interface" topText={topText} bottomText={bottomText} />;
      case 'caregiving-reddit':
        return <ProjectIcon icon={MessageSquare} title="Caregiving" subtitle="Social Media Analysis" topText={topText} bottomText={bottomText} />;
      case 'reflective-iteration':
        return <ProjectIcon icon={RefreshCw} title="Planneregy" subtitle="Reflective Iteration" topText={topText} bottomText={bottomText} />;
      case 'historical-planning':
        return <ProjectIcon icon={History} title="Physicify" subtitle="Historical Data Planning" topText={topText} bottomText={bottomText} />;
      default:
        return (
          <PillContainer topText={topText} bottomText={bottomText}>
             <div className="h-full w-full flex items-center justify-center opacity-50 relative z-10">
               <AbstractPattern id={id} />
             </div>
          </PillContainer>
        );
    }
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto">
      
       <div className="flex flex-col gap-6 mb-16">
         <div className="flex items-center justify-between border-b border-text-light/10 dark:border-text-dark/10 pb-4">
            <div className="flex items-center gap-3">
              <Cpu size={20} className="text-blue-500" />
              <div>
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Projects</h2>
                  <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono">Selected Works</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NeuSwitch 
                variant="cover"
                options={[
                  { id: 'list', label: 'List' }, 
                  { id: 'compact', label: 'Compact' }
                ]}
                activeId={viewMode}
                onChange={(id) => setViewMode(id as 'list' | 'compact')}
              />
            </div>
         </div>

         <div className="w-full md:w-1/2">
           <label className="text-[10px] uppercase font-bold text-text-light/50 dark:text-text-dark/50 mb-2 block tracking-wider flex items-center gap-2">
             <Search size={12} /> Search Projects
           </label>
           <NeuInput 
             placeholder="Enter search terms..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="font-mono text-sm"
           />
         </div>
       </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div 
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-64"
          >
                {/* Featured Project: DUCSS */}
                <div ref={ducssRef} id="ducss" className="flex flex-col lg:flex-row items-center gap-24 lg:gap-60 scroll-mt-32">
                  <motion.div style={{ y: ducssLeftY }} className="shrink-0 transform scale-90 lg:scale-100 flex justify-center w-full lg:w-auto">
                     <GlowingPill />
                  </motion.div>

                  <motion.div style={{ y: ducssRightY }} className="max-w-xl w-full">
                      <PeriodRow period="2022 - Present" involvement="lead" />

                      <h3 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark leading-tight mb-6 font-heading">
                        Diabetes Ubiquitous Computational Sensing System.
                      </h3>

                      <div className="mb-10 flex flex-wrap gap-2">
                          {['Health Informatics', 'Diabetes', 'Sensing'].map(tag => (
                            <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-text-light/50 dark:text-text-dark/50 tracking-wider">
                              {tag}
                            </span>
                          ))}
                      </div>
                      
                      <div className="space-y-8 text-sm md:text-base font-normal text-text-light/80 dark:text-text-dark/80 leading-[30px] font-display">
                         <p>
                           Designing user studies to uncover diabetes patients' <span className="font-bold text-text-light dark:text-text-dark">self-management challenges</span>.
                         </p>
                         <p>
                           Exploring <span className="font-bold text-text-light dark:text-text-dark">caregiving dynamics</span> in diabetes management.
                         </p>
                         <p>
                           Leading the creation of <span className="font-bold text-text-light dark:text-text-dark">patient-empowering sensors</span> and mobile technologies.
                         </p>
                      </div>
                  </motion.div>
                </div>
                
                <div className="space-y-64">
                  {filteredProjects.map((proj, index) => (
                    <ProjectRow
                      key={proj.id}
                      proj={proj}
                      index={index}
                      getProjectVisual={getProjectVisual}
                    />
                  ))}
                </div>
          </motion.div>
        ) : (
          <motion.div
            key="compact-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full relative py-12"
          >
            <div 
              className="relative"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
              }}
            >
              <div className="overflow-x-auto pb-8 scrollbar-hide flex items-end px-[5%]" style={{ minHeight: '650px' }}>
                {compactProjects.map((proj, index) => {
                  const isSelected = selectedProjectId === proj.id;
                  
                  return (
                    <div key={proj.id} id={proj.id} className="flex flex-col items-center scroll-mt-32">
                      <div className="px-8 transition-all duration-500 ease-in-out">
                        <motion.div 
                          layout
                          ref={(node) => {
                             if (node) itemsRef.current.set(proj.id, node);
                             else itemsRef.current.delete(proj.id);
                          }}
                          onClick={() => handleProjectClick(proj.id)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            width: isSelected ? 1200 : 400
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="shrink-0 relative cursor-pointer"
                        >
                          <div className="flex flex-row h-full items-center gap-12">
                            <motion.div layout className="shrink-0 p-10 flex justify-center items-center">
                               <div className="relative" style={{ width: 300, height: 540 }}>
                                  {proj.id === 'ducss' ? <GlowingPill /> : getProjectVisual(proj.id)}
                               </div>
                            </motion.div>

                            <AnimatePresence>
                              {isSelected && (
                                <motion.div 
                                  initial={{ opacity: 0, width: 0, x: -20 }}
                                  animate={{ opacity: 1, width: 'auto', x: 0 }}
                                  exit={{ opacity: 0, width: 0, x: -20 }}
                                  transition={{ delay: 0.1 }}
                                  className="py-8 pr-8 flex-grow overflow-hidden flex flex-col justify-center h-[540px]"
                                >
                                    <div className="overflow-y-auto pr-4 max-h-full">
                                      <PeriodRow
                                        period={proj.period}
                                        involvement={proj.involvement ?? 'lead'}
                                      />

                                      <h3 className="text-xl md:text-3xl font-bold text-text-light dark:text-text-dark leading-tight mb-4 font-heading">
                                        {proj.title}
                                      </h3>

                                      <div className="mb-6 flex flex-wrap gap-2">
                                        {proj.tags?.map(tag => (
                                          <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-text-light/50 dark:text-text-dark/50 tracking-wider">
                                            {tag}
                                          </span>
                                        ))}
                                      </div>

                                      <div className="space-y-4 text-sm font-normal text-text-light/80 dark:text-text-dark/80 leading-relaxed font-display">
                                          {proj.description.map((desc, i) => (
                                             <p key={i}>{desc}</p>
                                          ))}
                                      </div>
                                      {proj.paperUrl && (
                                        <div className="mt-6">
                                          <PaperPdfButton href={proj.paperUrl} />
                                        </div>
                                      )}
                                    </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      </div>

                      <div className="w-full relative h-20 flex justify-center items-center mt-4">
                         <div 
                           className={`absolute top-1/2 h-2 -mt-1 overflow-hidden
                             ${index === 0 ? 'left-1/2 right-0' : ''} 
                             ${index === compactProjects.length - 1 ? 'left-0 right-1/2' : ''}
                             ${index > 0 && index < compactProjects.length - 1 ? 'left-0 right-0' : ''}
                           `}
                         >
                            <div 
                              className={`h-full bg-bg-light dark:bg-bg-dark shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] dark:shadow-[inset_2px_2px_4px_#1d1e22,inset_-2px_-2px_4px_#393c44]
                                ${index === 0 ? 'w-[calc(100%+10px)] rounded-l-full' : ''}
                                ${index === compactProjects.length - 1 ? 'w-[calc(100%+10px)] -ml-[10px] rounded-r-full' : ''}
                                ${index > 0 && index < compactProjects.length - 1 ? 'w-[calc(100%+20px)] -ml-[10px]' : ''}
                              `}
                            />
                         </div>
                         
                         <motion.div 
                            className="relative z-10 w-6 h-6 rounded-full cursor-pointer bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark flex items-center justify-center transition-all duration-300"
                            onClick={() => handleProjectClick(proj.id)}
                            whileHover={{ scale: 1.1 }}
                         >
                            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isSelected ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-text-light/20 dark:bg-text-dark/20'}`} />
                         </motion.div>

                         <div className={`absolute top-full mt-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors duration-300 ${isSelected ? 'text-blue-500 dark:text-blue-400' : 'text-text-light/40 dark:text-text-dark/40'}`}>
                            {proj.period.split(' ')[0]}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
