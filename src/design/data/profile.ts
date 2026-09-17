import { img, researchHref } from './img';

export const profile = {
  name: 'Kefan Xu',
  title: 'Product Designer',
  location: 'Atlanta, GA',
  timezone: 'America/New_York',
  email: 'kefanxu@gatech.edu',
  availability: 'Open to product & UX design roles',
  links: {
    linkedin: 'https://www.linkedin.com/in/kefan-xu-8a8b2b1b3/',
    github: 'https://github.com/kefanxu',
    scholar: 'https://scholar.google.com/citations?user=ocdZFbwAAAAJ&hl=en',
  },
  portraits: [
    { src: img('about/portrait-1.webp'), alt: 'Portrait of Kefan Xu, film-style frame.' },
    { src: img('about/portrait-2.webp'), alt: 'Portrait of Kefan Xu, second frame.' },
    { src: img('about/portrait-3.webp'), alt: 'Portrait of Kefan Xu, third frame with a light leak.' },
    { src: img('about/portrait-4.webp'), alt: 'Portrait of Kefan Xu, fourth frame.' },
  ],
};

export const heroWords = ['Product design', 'UX research', 'Interaction design', 'Prototyping', 'Design systems', 'iOS & React Native', 'Human-centered AI', 'Data visualisation'];

export const principles = [
  {
    index: '01',
    title: 'Start in the field',
    body: 'Interviews, contextual inquiry and co-design sessions come before screens. I have run formative and evaluative studies with patients, caregivers, clinicians and students, and I turn what I hear into structure through thematic analysis and affinity mapping.',
    proof: 'Interviews · Contextual inquiry · Co-design · Thematic analysis',
  },
  {
    index: '02',
    title: 'Make the idea touchable',
    body: 'Flows and wireframes in Figma, then interaction concepts people can react to early. I care about the small decisions, such as what a colour means or what a default implies, because that is where a product earns trust.',
    proof: 'Figma · Wireframes · Prototypes · Visual systems',
  },
  {
    index: '03',
    title: 'Build it for real',
    body: 'I write Swift and React Native, so my designs ship as working apps rather than as decks. Engineering choices follow from field constraints, not the other way round.',
    proof: 'Swift · React Native · Expo · TestFlight',
  },
  {
    index: '04',
    title: 'Live with the result',
    body: 'Multi-week deployments show what a usability test cannot: whether people still open the app in week five, and what they have turned it into by then. I design the study as carefully as the product.',
    proof: '28 · 42 · 42-day deployments · CHI · CSCW',
  },
];

export const experience = [
  { period: '2022 — Now', role: 'PhD researcher, Human-Centered Computing', place: 'Georgia Institute of Technology · Ubicomp Health & Wellness Lab', note: 'Design and research lead on Trackya, Moodloop, CareWork, EcoCare and DUCSS. Advised by Dr. Rosa I. Arriaga.' },
  { period: '2025 — 2026', role: 'Instructor, Developing Mobile Experience for Well-Being', place: 'Georgia Institute of Technology', note: 'Designed and taught a 16-week course on health informatics and mobile app design.' },
  { period: '2021 — 2022', role: 'Research intern', place: 'Michigan Medicine', note: 'Designed and deployed Taperology, a clinician-facing web tool for building taper schedules.' },
  { period: '2019 — 2022', role: 'Graduate researcher, MS Information Science', place: 'University of Michigan School of Information', note: 'Designed, built and deployed Physicify and Planneregy on iOS; built Pace to Plan in React Native. Advised by Dr. Mark W. Newman.' },
  { period: '2015 — 2019', role: 'BS Data Science · BS Interactive Media Arts', place: 'New York University · New York & Shanghai', note: 'Double degree across data and interaction design.' },
];

export const recognition = [
  { year: '2026', label: 'CHI 2026 · full paper (co-author)' },
  { year: '2025', label: 'CSCW 2025 · first-author paper' },
  { year: '2025', label: 'DIS 2025 · explainable AI for everyday use' },
  { year: '2025', label: 'OMSCS Pre-Doc Fellowship, Georgia Tech' },
  { year: '2024', label: 'CHI 2024 · first-author paper (Planneregy)' },
  { year: '2022', label: 'CHI 2022 · first-author paper (Physicify)' },
  { year: '2022', label: 'Google Health Equity Research Initiative' },
];

export const toolkit = [
  { label: 'Design', items: ['Figma', 'Prototyping', 'Interaction design', 'Design systems', 'Data visualisation', 'Adobe Creative Suite'] },
  { label: 'Research', items: ['Interviews', 'Contextual inquiry', 'Co-design', 'Usability evaluation', 'Thematic analysis', 'Affinity mapping'] },
  { label: 'Build', items: ['Swift', 'React Native & Expo', 'HTML / CSS / JS', 'Python', 'd3.js', 'Unity'] },
];

export interface ArchiveEntry {
  year: string;
  name: string;
  type: string;
  note: string;
  href?: string;
  external?: boolean;
}

/** Work that is not written up as a full case study here. */
export const archive: ArchiveEntry[] = [
  { year: '2022 — 25', name: 'PECSS · Clinician Homework Review', type: 'Clinical dashboard', note: 'Sensor-data review tools for Prolonged Exposure therapy. CSCW 2024.', href: researchHref('#project/pecss') },
  { year: '2022 — Now', name: 'DUCSS', type: 'Sensing + mobile', note: 'A mobile sensing system for diabetic foot health, with Emory and Grady Memorial Hospital.', href: researchHref('#project/ducss') },
  { year: '2021 — 23', name: 'Caregiving over time', type: 'UX research', note: 'How 118 informal caregivers make sense of conflict and change. CSCW 2025.', href: researchHref('#project/caregiving-reddit') },
  { year: '2021', name: 'Taperology', type: 'Web tool', note: 'Helps clinicians create taper schedules for benzodiazepine misuse.' },
  { year: '2021', name: 'mARze', type: 'AR game', note: 'An AR board game that builds spatial awareness in children.' },
  { year: '2020', name: 'Pace to Plan', type: 'Mobile · React Native', note: 'Activity pacing for people managing chronic fatigue: plan, track, reflect.' },
  { year: '2020', name: 'Principal', type: 'UX · Fintech', note: 'A financial platform designed around the needs of micro-business owners.' },
  { year: '2020', name: 'NetBor', type: 'UX · Community', note: 'A social platform that gets neighbours talking to each other.' },
  { year: '2019', name: 'MentorNet', type: 'UX · Education', note: 'A better way for medical students to find mentors.' },
  { year: '2019', name: 'Tapto', type: 'UX · Social', note: 'A social app with a new way to interact with friends.' },
  { year: '2019', name: 'Doodling+', type: 'AR · Social', note: 'An AR doodling app with social interaction.' },
  { year: '2018', name: 'Color & Emo', type: 'Data visualisation', note: 'Visualising colour and emotion in Chinese poetry.' },
  { year: '2018', name: 'Plain OS', type: 'Concept UI', note: 'A pared-back mobile interface designed to counter phone addiction.' },
  { year: '2015', name: 'Life of Butterflies', type: 'Animation', note: 'Hand drawing combined with digital technique.' },
];
