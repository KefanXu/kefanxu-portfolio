import { img } from '../img';
import type { Project } from '../types';

export const ecocare: Project = {
  slug: 'ecocare',
  name: 'EcoCare',
  kicker: 'Web app · AI + data visualisation',
  year: '2026 — Now',
  headline: 'Seeing how one life change *ripples* through a whole care ecology.',
  summary:
    'A proposed interactive visualisation with an AI sense-making assistant. Patients, caregivers and clinicians explore how an event, such as losing insulin coverage, travels through the people, practices, tools and information that chronic care depends on.',
  status: 'Proposed system · dissertation work',
  tags: ['Concept & interaction design', 'Data visualisation', 'AI assistant', 'Study planning'],
  cover: 'ecocare',
  theme: { panel: '#dbe9f3', ink: '#0e2730', accent: '#1f6f66', soft: '#eef5f9' },
  meta: [
    { label: 'Role', value: 'Researcher & system designer: visualisation model, interface, assistant grounding, study plan' },
    { label: 'Timeline', value: '2026 — present' },
    { label: 'With', value: 'Ubicomp Health & Wellness Lab, Georgia Tech · advised by Rosa I. Arriaga' },
    { label: 'Status', value: 'Prototype in progress; evaluation planned, no results reported yet' },
  ],
  stats: [
    { value: '22', label: 'Foundational patient interviews' },
    { value: '3', label: 'Stakeholder viewpoints' },
    { value: '15', label: 'Planned participants' },
    { value: '3', label: 'Ecological layers' },
  ],
  heroDevice: 'browser',
  heroShots: [
    { src: img('ecocare/ui-latest.webp'), alt: 'EcoCare prototype: a concentric map of a simulated diabetes care ecology beside an AI sense-making assistant.' },
  ],
  blocks: [
    {
      type: 'text',
      eyebrow: '01 — The problem',
      title: 'Chronic care is *a network,* not a checklist.',
      body: [
        'A change in insurance, work, mobility or caregiving can alter many connected parts of chronic care at once. The patient sees a disrupted routine, the caregiver sees a new burden, the clinician sees a missed target. Nobody sees the whole.',
        'EcoCare proposes a shared view of that care ecology, so different stakeholders can examine its people, practices, technologies, information and dependencies when they are weighing a coping or treatment decision.',
      ],
      aside: [
        { label: 'What I did', items: ['Ecological model from 22 interviews', 'Visualisation & interaction design', 'AI assistant behaviour & grounding', 'Mixed-methods study plan'] },
        { label: 'Designed for', items: ['Patients', 'Family caregivers', 'Clinicians'] },
      ],
    },
    {
      type: 'demo',
      eyebrow: '02 — The model',
      title: 'Same ecology, *different weather.*',
      body:
        'Entities sit on concentric layers around the patient: daily practices closest, then the people who help, then systems such as insurance and work. Pick a life-changing event and watch which connections strain or break.',
      demo: 'ecology',
      hint: 'Choose an event.',
    },
    {
      type: 'figure',
      eyebrow: '03 — The interface',
      title: 'A map you can *ask questions of.*',
      shot: {
        src: img('ecocare/ui-latest.webp'),
        alt: 'EcoCare interface: life-changing event tabs, a concentric ecology map with information flows, an inspector and an AI assistant panel with sample questions.',
        caption: 'Event scenarios across the top, the ecology in the centre, and an assistant that takes whatever is selected on the map as its context.',
      },
      frame: 'browser',
      wide: true,
    },
    {
      type: 'live',
      eyebrow: '04 — Try it',
      title: 'Explore the *ecology.*',
      body: 'The working prototype, live in the page, around one simulated case: Jane, who lives with type 2 diabetes and a diabetic foot ulcer.',
      url: 'https://eco-care-bice.vercel.app',
      poster: { src: img('ecocare/ui-latest.webp'), alt: 'EcoCare prototype: the concentric care-ecology map beside the AI sense-making assistant.' },
      guide: [
        { title: 'Choose an event', body: 'The tabs along the top switch between the baseline and three life-changing events. Watch which connections strain or break.' },
        { title: 'Inspect the map', body: 'Hover or click any entity or flow. Selected items appear in the inspector and become context for the assistant.' },
        { title: 'Ask the assistant', body: 'Start from a sample question or write your own. Answers are grounded in the case, clinical guidance and prior interviews.' },
      ],
      note: 'A simulated case, not a real patient. The assistant calls a live model and can take a moment to answer. Best explored on a laptop or larger screen.',
    },
    {
      type: 'insights',
      eyebrow: '05 — Design decisions',
      title: 'Three ideas *hold it together.*',
      items: [
        { title: 'Relationships are the data', body: 'Stakeholders, components, practices and information sit on ecological layers, with distinct flows for data, guidance, feedback, communication, and breaks in those connections.' },
        { title: 'Events are scenarios', body: 'People can inspect, move, add or remove entities and explore how a situation such as changing insulin coverage or a caregiver’s surgery may propagate through a simulated case.' },
        { title: 'AI supports reasoning', body: 'Selected entities, relationships and the active event become context for an assistant grounded in the case, clinical guidance and prior interviews. It is positioned as support for human reasoning, not a replacement for it.' },
      ],
    },
    {
      type: 'text',
      eyebrow: '06 — What happens next',
      title: 'A study designed to *measure a decision.*',
      body: [
        'The planned evaluation runs individual sessions with five patients, five caregivers and five clinicians. Each participant makes a baseline decision for a simulated case, works with EcoCare through another life-changing event, makes a second decision and reflects on the experience.',
        'It combines the Decisional Conflict Scale and timestamped interaction logs with interviews, screen recordings and thematic analysis of the AI conversations. These are planned methods; there are no results to report yet.',
      ],
    },
    {
      type: 'outcome',
      eyebrow: '07 — Status',
      title: 'Proposed, prototyped, *honest about it.*',
      body: [
        'EcoCare is part of my dissertation proposal. I include it here because it shows how I think about complex systems and AI: start from field evidence, make the structure visible, and give people a way to question it.',
      ],
      links: [],
    },
  ],
};
