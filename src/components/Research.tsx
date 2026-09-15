import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { EcologicalDiagram } from './EcologicalDiagram';
import { Publication } from '../data/portfolio';
import { publications } from '../data/publications';
import {
  FileText,
  X,
  User,
  Database,
  Search,
  Orbit,
  Network,
  Globe2,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

export const Research: React.FC<{ setIsDetailOpen?: (isOpen: boolean) => void }> = ({ setIsDetailOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [activeSystems, setActiveSystems] = useState<Set<'Microsystem' | 'Mesosystem' | 'Macrosystem' | 'Chronosystem'>>(new Set());
  const [direction, setDirection] = useState(0);

  // Ecological Lens section parallax
  const ecologicalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ecologicalScroll } = useScroll({
    target: ecologicalRef,
    offset: ['start end', 'end start'],
  });
  const ecologicalHeadingY = useTransform(ecologicalScroll, [0, 1], [85, -60]);
  const ecologicalLeftY = useTransform(ecologicalScroll, [0, 1], [100, -120]);  // text — fast
  const ecologicalRightY = useTransform(ecologicalScroll, [0, 1], [-8, 14]);    // visual — much slower
  const diagramRotate = useTransform(ecologicalScroll, [0, 1], [0, 30]);        // strong spin

  // Notify parent about detail view state
  useEffect(() => {
    if (setIsDetailOpen) {
      setIsDetailOpen(!!selectedPub);
    }
  }, [selectedPub, setIsDetailOpen]);

  // Lock body scroll logic
  useEffect(() => {
    if (selectedPub) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPub]);

  const filteredPubs = publications.filter(pub => 
    pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPublicationDisplayId = (pub: Publication) => (pub.displayId ?? pub.id).toUpperCase();
  const showPublicationDisplayId = (pub: Publication) => !pub.hideDisplayId;

  const selectedIndex = selectedPub ? filteredPubs.findIndex(p => p.id === selectedPub.id) : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex > 0) {
      setDirection(-1);
      setSelectedPub(filteredPubs[selectedIndex - 1]);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex < filteredPubs.length - 1) {
      setDirection(1);
      setSelectedPub(filteredPubs[selectedIndex + 1]);
    }
  };

  const handleClose = () => {
    setDirection(0);
    setSelectedPub(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPub) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPub, selectedIndex, filteredPubs]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : direction > 0 ? "-100%" : 0,
      opacity: 0
    })
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      
      {/* Ecological Diagram Section - Above Publications */}
      <div ref={ecologicalRef} id="ecological-lens" className="mb-16 scroll-mt-32">
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-16 py-8 px-4 md:px-12">
          {/* Left controls */}
          <motion.div style={{ y: ecologicalLeftY }} className="shrink-0 max-w-lg">
            <div className="flex flex-col mb-4">
              <motion.h3
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              style={{ y: ecologicalHeadingY }}
              className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark leading-tight mb-10 lg:mb-20 font-heading"
            >
                Ecological Lens.
            </motion.h3>
              
              <motion.div
                className="flex flex-wrap grid grid-cols-2 lg:flex lg:flex-wrap gap-5 mb-10 lg:mb-14 order-last lg:order-none"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
                }}
              >
              {(['Microsystem', 'Mesosystem', 'Macrosystem', 'Chronosystem'] as const).map((label) => {
                const isActive = activeSystems.has(label);
                const Icon =
                  label === 'Microsystem'
                    ? Orbit
                    : label === 'Mesosystem'
                      ? Network
                      : label === 'Macrosystem'
                        ? Globe2
                        : Clock3;
                return (
                  <motion.button
                    key={label} type="button" onClick={() => {
                    const newActiveSystems = new Set(activeSystems);
                    if (isActive) {
                      newActiveSystems.delete(label);
                    } else {
                      newActiveSystems.add(label);
                    }
                    setActiveSystems(newActiveSystems);
                  }}
                    className="group select-none"
                    variants={{
                      hidden: { opacity: 0, y: 12, scale: 0.92 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                    }}
                  >
                    <div
                      className={`relative h-16 w-full lg:w-[280px] rounded-2xl bg-bg-light dark:bg-bg-dark
                        border border-transparent
                        flex items-center overflow-hidden transition-colors`}
                    >
                      {/* Engraved border only (plain surface) */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none
                          shadow-[inset_1px_1px_2px_rgba(0,0,0,0.10),inset_-1px_-1px_2px_rgba(255,255,255,0.55)]
                          dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.55),inset_-1px_-1px_2px_rgba(255,255,255,0.06)]"
                      />

                      {/* Left segment */}
                      <div className="relative z-10 flex-1 h-full flex items-center gap-4 pl-5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-text-light/20 dark:bg-text-dark/20'}`} />
                        <span className="text-xs font-bold uppercase tracking-widest text-text-light/60 dark:text-text-dark/60">
                          {label}
                        </span>
                      </div>

                      {/* Right segment */}
                      <div className="relative z-10 w-16 h-full hidden lg:flex items-center justify-center">
                        {/* Neumorphic toggle switch (visual only; whole button toggles) */}
                        <div
                          className={`relative w-12 h-7 rounded-full transition-all duration-300
                            bg-bg-light dark:bg-bg-dark
                            border border-text-light/5 dark:border-text-dark/5
                            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.10),inset_-2px_-2px_4px_rgba(255,255,255,0.70)]
                            dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.55),inset_-2px_-2px_4px_rgba(255,255,255,0.06)]
                            ${isActive ? 'ring-1 ring-blue-500/30' : ''}`}
                        >
                          {/* Slider knob */}
                          <div
                            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center
                              bg-bg-light dark:bg-bg-dark
                              shadow-[2px_2px_5px_rgba(0,0,0,0.12),-2px_-2px_5px_rgba(255,255,255,0.75)]
                              dark:shadow-[2px_2px_6px_rgba(0,0,0,0.65),-2px_-2px_6px_rgba(255,255,255,0.06)]
                              transition-transform duration-300 ease-out
                              ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
                          >
                            <Icon
                              size={14}
                              className={`transition-all duration-300 ${
                                isActive
                                  ? 'text-blue-500 dark:text-blue-400 opacity-100'
                                  : 'text-text-light dark:text-text-dark opacity-40'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl font-normal text-text-light/80 dark:text-text-dark/80 leading-[30px] max-w-sm mt-0 lg:mt-10 mb-8 lg:mb-0 font-display"
              >
                My research applies an <span className="font-bold text-text-light dark:text-text-dark">ecological lens</span> that situates individuals at the center of multiple interconnected layers, aiming to investigate how the information is transiting between and how the ecology evolves over time.
              </motion.p>
            </div>
          </motion.div>

          {/* Right: Diagram (kept on right, but closer to controls) */}
          <motion.div style={{ y: ecologicalRightY }} className="flex-1 w-full flex justify-center lg:justify-end">
            <EcologicalDiagram activeSystems={activeSystems} spinRotation={diagramRotate} />
          </motion.div>
        </div>
      </div>

      {/* Section Header */}
      <div id="publications" className="flex items-center gap-3 border-b border-text-light/10 dark:border-text-dark/10 pb-4 scroll-mt-32">
          <Database size={20} className="text-blue-500" />
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Publications</h2>
          <span className="text-[10px] font-mono opacity-40 ml-auto">{filteredPubs.length} papers</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light/30 dark:text-text-dark/30" />
        <input
          type="text"
          placeholder="Search publications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-text-light/15 dark:border-text-dark/15 bg-transparent text-text-light dark:text-text-dark placeholder:text-text-light/30 dark:placeholder:text-text-dark/30 focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
        />
      </div>

      {/* Publications List */}
      <div className="min-h-[500px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
          }}
        >
          {filteredPubs.map((pub, i) => (
            <motion.div
              layoutId={`card-container-${pub.id}`}
              key={pub.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
              }}
              transition={{ duration: 0 }}
              onClick={() => setSelectedPub(pub)}
              className={`group cursor-pointer flex items-start justify-between gap-8 py-8 border-t border-text-light/[0.07] dark:border-text-dark/[0.07] ${i === 0 ? 'border-t-0' : ''} hover:bg-text-light/[0.02] dark:hover:bg-text-dark/[0.02] -mx-2 px-2 rounded-lg transition-colors duration-150`}
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base md:text-lg text-text-light dark:text-text-dark group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {pub.title}
                </h3>
                <p className="mt-1.5 text-xs text-text-light/50 dark:text-text-dark/50 font-mono truncate">
                  <User size={10} className="inline mr-1.5 -mt-0.5" />
                  {pub.authors.join(", ")}
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0 pt-1 gap-1.5">
                <span className="text-[11px] font-mono font-semibold text-blue-500 text-right leading-snug max-w-[14rem]">
                  {pub.conference}
                </span>
                <span className="text-[10px] font-mono text-text-light/35 dark:text-text-dark/35">
                  {pub.year}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

            {/* Detail Modal - Belgium Poster Style */}
      {createPortal(
        <AnimatePresence>
          {selectedPub && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="fixed inset-0 bg-black/80 z-[60] top-0 backdrop-blur-sm"
              />
              {/* Modal Container - Half shown / Bottom Sheet style */}
              <motion.div 
                key="modal-container"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 top-0 z-[70] flex justify-center pointer-events-none p-4 pb-0 pt-12 md:pt-20"
              >
                {/* Navigation Buttons */}
                <div className="absolute bottom-8 md:top-1/2 md:-translate-y-1/2 md:bottom-auto left-4 md:left-8 z-[80] pointer-events-auto">
                   {selectedIndex > 0 && (
                      <button 
                         onClick={handlePrev}
                         className="p-3 md:p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-sm border bg-black/10 hover:bg-black/20 text-black border-black/5 dark:bg-black/40 dark:hover:bg-black/60 dark:text-white dark:border-white/10 2xl:bg-white/10 2xl:hover:bg-white/20 2xl:text-white 2xl:border-white/10"
                      >
                         <ChevronLeft size={32} />
                      </button>
                   )}
                </div>
                <div className="absolute bottom-8 md:top-1/2 md:-translate-y-1/2 md:bottom-auto right-4 md:right-8 z-[80] pointer-events-auto">
                   {selectedIndex < filteredPubs.length - 1 && (
                      <button 
                         onClick={handleNext}
                         className="p-3 md:p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-sm border bg-black/10 hover:bg-black/20 text-black border-black/5 dark:bg-black/40 dark:hover:bg-black/60 dark:text-white dark:border-white/10 2xl:bg-white/10 2xl:hover:bg-white/20 2xl:text-white 2xl:border-white/10"
                      >
                         <ChevronRight size={32} />
                      </button>
                   )}
                </div>

                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div 
                    key={selectedPub.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full max-w-7xl h-full bg-[#f0f0f0] dark:bg-[#1a1a1a] shadow-2xl rounded-t-[30px] overflow-hidden pointer-events-auto flex flex-col relative will-change-transform"
                  >
                    {/* Close Button */}
                    <button 
                        onClick={handleClose}
                        className="absolute top-6 right-6 z-50 p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors backdrop-blur-md"
                    >
                        <X size={24} className="text-black dark:text-white" />
                    </button>

                    {/* Poster Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain" data-lenis-prevent>
                        <div className="min-h-full bg-white text-black p-8 md:p-16 relative overflow-hidden">
                            
                            {/* Top Header Info */}
                            <div className="relative z-10 flex justify-end gap-12 mb-32 pt-12 text-xs font-bold tracking-widest uppercase">
                                {showPublicationDisplayId(selectedPub) && (
                                  <div className="flex flex-col items-end">
                                      <span className="opacity-40 mb-1">Paper ID</span>
                                      <span className="text-2xl border-b-2 border-black pb-1 min-w-[60px] text-right">{getPublicationDisplayId(selectedPub)}</span>
                                  </div>
                                )}
                                <div className="flex flex-col items-end">
                                    <span className="opacity-40 mb-1">Venue</span>
                                    <span className="text-xl md:text-2xl border-b-2 border-black pb-1 min-w-[60px] max-w-[320px] text-right leading-tight">
                                        {selectedPub.conference}
                                    </span>
                                </div>
                            </div>

                            {/* Main Title */}
                            <h2 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-['Oswald'] font-bold leading-[1.1] tracking-tight mb-16 max-w-5xl uppercase mix-blend-multiply text-[#1a1a1a]">
                                {selectedPub.title}
                            </h2>

                            {/* Content Columns */}
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
                                
                                {/* Left Column: Authors & Year */}
                                <div className="md:col-span-4 space-y-12">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 border-b border-black pb-2">Authors</h4>
                                        <ul className="space-y-2 font-bold text-sm">
                                            {selectedPub.authors.map((author, i) => (
                                                <li key={i} className={author === "Kefan Xu" ? "text-red-600" : ""}>
                                                    {author}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 border-b border-black pb-2">Year</h4>
                                        <div className="font-bold text-xl">{selectedPub.year}</div>
                                    </div>

                                    {selectedPub.tags && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 border-b border-black pb-2">Keywords</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPub.tags.map(tag => (
                                                    <span key={tag} className="text-xs font-bold px-2 py-1 bg-black text-white rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Abstract & Extra Details */}
                                <div className="md:col-span-8 space-y-12">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 border-b border-black pb-2 font-sans">Abstract</h4>
                                        <p className="text-base font-serif font-normal leading-relaxed text-justify text-neutral-800">
                                            {selectedPub.abstract || "No abstract available."}
                                        </p>
                                    </div>

                                    {selectedPub.methodology && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 border-b border-black pb-2 font-sans">Methodology</h4>
                                            <p className="text-base font-serif font-normal leading-relaxed text-neutral-800">
                                                {selectedPub.methodology}
                                            </p>
                                        </div>
                                    )}

                                    {selectedPub.keyFindings && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 border-b border-black pb-2 font-sans">Key Findings</h4>
                                            <ul className="list-disc list-outside ml-4 space-y-2 text-base font-serif font-normal text-neutral-800">
                                                {selectedPub.keyFindings.map((finding, idx) => (
                                                    <li key={idx} className="pl-2">{finding}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {selectedPub.bibtex && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 border-b border-black pb-2 font-sans">BibTeX</h4>
                                            <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-sm font-mono text-xs overflow-x-auto whitespace-pre text-neutral-600 dark:text-neutral-400">
                                                {selectedPub.bibtex}
                                            </div>
                                        </div>
                                    )}

                                    {selectedPub.doi && (
                                        <div className="mt-16 flex justify-end">
                                            <a href={selectedPub.doi} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 group">
                                                <span className="text-xs font-bold uppercase tracking-widest group-hover:underline">Read Full Paper</span>
                                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <FileText size={20} />
                                                </div>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Decoration */}
                            <div className="mt-24 pt-8 border-t-4 border-black flex justify-between items-center font-black text-4xl tracking-tighter opacity-10">
                                <span>WEBSITE2026</span>
                                <span>{selectedPub.year}</span>
                            </div>
                        </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};