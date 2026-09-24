import { img } from '../img';
import type { Project } from '../types';

export const ecocare: Project = {
  slug: 'ecocare',
  name: 'EcoCare',
  kicker: 'Web app · AI + data visualisation',
  year: '2026 — Now',
  headline: 'Seeing how one life change *ripples* through a whole care ecology.',
  summary:
    'A proposed interactive visualisation with an AI sense-making assistant. Patients, caregivers and clinicians explore how an event, such as losing insulin coverage, travels through the people, practices, tools and information that chronic care depends on, and what might repair it.',
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
    { value: '4', label: 'Ecological layers' },
  ],
  heroDevice: 'browser',
  heroShots: [
    {
      src: img('ecocare/ui-event.webp'),
      alt: 'EcoCare prototype with a life-changing event active: the concentric care-ecology map marks disrupted entities and broken flows, a timeline replays the ripple, and the AI sense-making assistant suggests questions for the event.',
    },
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
        { label: 'What I did', items: ['Ecological model from 22 interviews', 'Visualisation & interaction design', 'AI assistant & mediation strategies', 'Mixed-methods study plan'] },
        { label: 'Designed for', items: ['Patients', 'Family caregivers', 'Clinicians'] },
      ],
    },
    {
      type: 'demo',
      eyebrow: '02 — The model',
      title: 'Same ecology, *different weather.*',
      body:
        'A sketch of the model. Entities sit on concentric layers around the patient: daily practices closest, then the people who help, then systems such as insurance and work. Pick a life-changing event and watch which connections strain or break. The prototype itself draws four layers, from the household to the healthcare system.',
      demo: 'ecology',
      hint: 'Choose an event.',
    },
    {
      type: 'figure',
      eyebrow: '03 — The interface',
      title: 'A map you can *ask questions of.*',
      shot: {
        src: img('ecocare/ui-baseline.webp'),
        alt: 'EcoCare interface at baseline: a life-changing event menu at the top, an inspector on the left, the concentric ecology map with a map key and editing toolbar in the centre, and the AI sense-making assistant with sample questions on the right.',
        caption: 'The event menu sits at the top, the inspector on the left and the assistant on the right. The map key and the editing toolbar live on the map itself, so an ecology can be extended by hand: add an entity, draw a flow, mark an impact.',
      },
      frame: 'browser',
      wide: true,
    },
    {
      type: 'figure',
      eyebrow: '04 — Mediation',
      title: 'From ripple *to repair.*',
      shot: {
        src: img('ecocare/ui-mediation.webp'),
        alt: 'EcoCare with the insurance event active and the Mediation ideas panel open: a strategy called Bridge insulin coverage is previewed on the map, four entities carry Repaired badges, a Pharmacy Advocate is added, and a damage bar reads eight to one still affected.',
        caption: 'Mediation ideas for the insurance event: what broke, the ripple by layer, then strategies with what each does, repairs and costs. Previewing the first one repairs seven of eight broken items, adds a pharmacy advocate and leaves one entity affected, before anything is applied.',
      },
      frame: 'browser',
      wide: true,
    },
    {
      type: 'gallery',
      eyebrow: '05 — Two registers',
      title: 'Clinician language, *or plain words.*',
      intro: 'The same ecology speaks two registers. Standard mode uses the vocabulary of the care team; Easy mode renames everything for patients and caregivers and reads it aloud on request.',
      kind: 'wide',
      shots: [
        {
          src: img('ecocare/ui-easy.webp'),
          alt: 'EcoCare in Easy mode: the ecology relabelled in plain words such as Home circle, Care team, Sugar Sensor and Main Doctor, an Ideas to help panel with a place to type your own idea, and a legend of OK, Hurt and Broken.',
          caption: 'Easy mode: Home circle, Care team, Services, Wider world. Strategies become “ideas to help”, and anyone can type their own.',
        },
        {
          src: img('ecocare/ui-inspector.webp'),
          alt: 'The EcoCare inspector with the Insulin Pen selected and marked disrupted: its description, two incoming flows from the medication routine and the pharmacy, and an active conflict, No covered insulin.',
          caption: 'The inspector reads an entity’s role, its incoming flows and any active conflict. Whatever is selected becomes context for the assistant.',
        },
      ],
    },
    {
      type: 'live',
      eyebrow: '06 — Try it',
      title: 'Explore the *ecology.*',
      body: 'The working prototype, live in the page, around one simulated case: Jordan, who lives with type 2 diabetes and a diabetic foot ulcer. It opens on the baseline ecology in Standard mode.',
      url: 'https://eco-care-bice.vercel.app',
      poster: { src: img('ecocare/ui-baseline.webp'), alt: 'EcoCare prototype at baseline: the concentric care-ecology map beside the AI sense-making assistant.' },
      guide: [
        { title: 'Choose an event', body: 'The life-changing event menu at the top switches from the baseline to one of three scenarios. Watch the ripple, then scrub or replay it on the timeline.' },
        { title: 'Inspect and ask', body: 'Click any entity or flow to open it in the inspector. Selections become context for the assistant on the right, which also suggests questions for the active event.' },
        { title: 'Ask for mediation ideas', body: 'Once an event is active, Mediation ideas explains what broke and proposes strategies. Preview one on the map, apply it as a what-if, or describe your own.' },
        { title: 'Switch to Easy', body: 'The Easy toggle rewrites the same ecology in plain language for patients and caregivers, with ideas to help and read-aloud.' },
      ],
      note: 'A simulated case, not a real patient. Mediation ideas and the assistant call a live model, so a response can take a few seconds. Best explored on a laptop or larger screen.',
    },
    {
      type: 'insights',
      eyebrow: '07 — Design decisions',
      title: 'Three ideas *hold it together.*',
      items: [
        {
          title: 'Relationships are the data',
          body: 'Stakeholders, components, practices and information sit on four ecological layers, from the household to the healthcare system, joined by typed flows: data, guidance, feedback, communication. When an event strikes, the flows that break and the entities they disrupt are marked, and a timeline replays the ripple from the moment it strikes to its full extent.',
        },
        {
          title: 'Repair is a what-if',
          body: 'With an event active, Mediation ideas explains what broke and proposes strategies. Each says what it does, what it repairs and what it costs. Previewing one marks repaired and added entities on the map and counts how much damage remains, before anything is applied. People can also describe their own strategy and have it interpreted the same way.',
        },
        {
          title: 'AI supports reasoning',
          body: 'Selected entities, flows and the active event become context for an assistant grounded in the case, clinical guidance and prior interviews. Every strategy ends with questions to ask the care team, and the person decides what to apply. The AI is positioned as support for human reasoning, not a replacement for it.',
        },
      ],
    },
    {
      type: 'text',
      eyebrow: '08 — What happens next',
      title: 'A study designed to *measure a decision.*',
      body: [
        'The planned evaluation runs individual sessions with five patients, five caregivers and five clinicians. Each participant makes a baseline decision for a simulated case, works with EcoCare through another life-changing event, makes a second decision and reflects on the experience.',
        'It combines the Decisional Conflict Scale and timestamped interaction logs with interviews, screen recordings and thematic analysis of the AI conversations. These are planned methods; there are no results to report yet.',
      ],
    },
    {
      type: 'outcome',
      eyebrow: '09 — Status',
      title: 'Proposed, prototyped, *honest about it.*',
      body: [
        'EcoCare is part of my dissertation proposal. I include it here because it shows how I think about complex systems and AI: start from field evidence, make the structure visible, and give people a way to question it.',
      ],
      links: [],
    },
  ],
};
