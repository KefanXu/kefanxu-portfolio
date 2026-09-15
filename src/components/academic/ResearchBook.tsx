export interface ResearchBookStudy {
  id: string; name: string; theme: string; category: string; overview: string; color: string;
  image: string;
}

export const researchBooks: ResearchBookStudy[] = [
  { id: 'ducss', name: 'DUCSS', theme: 'Sensing in everyday life', category: 'Health informatics', overview: 'Designing sensing technologies around the everyday realities of diabetes self-management and care.', image: 'research-sensing.webp', color: 'sensing' },
  { id: 'caregiving-reddit', name: 'Caregiving', theme: 'Making sense of change', category: 'Social computing', overview: 'Understanding how informal caregivers navigate conflicts and life-changing events through online communities.', image: 'research-care.webp', color: 'care' },
  { id: 'reflective-iteration', name: 'Planneregy', theme: 'Reflection into routines', category: 'Personal informatics', overview: 'Helping people reflect on, adapt, and sustain physical activity plans as everyday life changes.', image: 'research-reflection.webp', color: 'reflection' },
  { id: 'sedentary', name: 'Trackya', theme: 'Activity, in context', category: 'Contextual sensing', overview: 'Making sense of sedentary behavior through contextualized physical activity data.', image: 'research-trackya-v2.webp', color: 'orbit' },
  { id: 'pecss', name: 'PECSS', theme: 'Care between sessions', category: 'Clinical interfaces', overview: 'Patient and clinician tools to support Prolonged Exposure therapy for PTSD.', image: 'research-pecss-v2.webp', color: 'clinical' },
  { id: 'historical-planning', name: 'Physicify', theme: 'Learning from past plans', category: 'Personal informatics', overview: 'An iOS application for exploring how historical records support physical activity planning.', image: 'research-physicify-v2.webp', color: 'planning' },
  { id: 'moodloop', name: 'Moodloop', theme: 'Beyond a number', category: 'Personal informatics', overview: 'Exploring how people construct, calibrate, and contextualize numerical mental-state reports over time.', image: 'research-moodloop.webp', color: 'moodloop' },
  { id: 'carework', name: 'CareWork', theme: 'Care between visits', category: 'Clinical informatics', overview: 'Connecting clinical goals, everyday care tasks, patient reports, and plan revision across visits.', image: 'research-carework.webp', color: 'carework' },
  { id: 'ecocare', name: 'EcoCare', theme: 'Seeing the care ecology', category: 'Human-centered AI', overview: 'A proposed system for examining how life-changing events reshape chronic diabetes care.', image: 'research-ecocare.webp', color: 'ecocare' },
];

export function BookCover({ study, index }: { study: ResearchBookStudy; index: number }) {
  return <div className="folio-cover">
    <div className="folio-cover-top"><span className="folio-number">0{index + 1}</span><span>{study.category}</span></div>
    <div className="folio-cover-title">{study.name}</div><div className="folio-cover-theme">{study.theme}</div>
    <div className="folio-illustration"><img src={`${import.meta.env.BASE_URL}images/${study.image}`} alt="" loading="lazy" decoding="async" width="850" height="850" /></div>
    <div className="folio-cover-bottom"><span>Kefan Xu</span><span>Research studies</span></div>
  </div>;
}
