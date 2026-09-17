import { img } from '../img';
import type { Project } from '../types';

export const carework: Project = {
  slug: 'carework',
  name: 'CareWork',
  kicker: 'Web dashboard · Human-centered AI',
  year: '2026',
  headline: 'An AI-assisted dashboard that keeps care *coherent* between visits.',
  summary:
    'CareWork connects a clinical goal, the tasks a patient takes home, the evidence they send back, and the next revision, with AI drafting at every step and the clinician approving every word.',
  status: 'Prototype evaluated with healthcare professionals',
  tags: ['Product design', 'AI interaction', 'Clinical workflow', 'Evaluation'],
  cover: 'carework',
  theme: { panel: '#ece4d6', ink: '#2a1b16', accent: '#8a3b2a', soft: '#f8f5ee' },
  meta: [
    { label: 'Role', value: 'Researcher & system designer: framework, interface, AI interaction patterns, two studies' },
    { label: 'Timeline', value: '2026 — ongoing research' },
    { label: 'With', value: 'Ubicomp Health & Wellness Lab, Georgia Tech · advised by Rosa I. Arriaga' },
    { label: 'Platform', value: 'Web dashboard for clinicians' },
  ],
  stats: [
    { value: '6', label: 'Formative interviews' },
    { value: '11', label: 'Prototype sessions' },
    { value: '14', label: 'Healthcare professionals' },
    { value: '3', label: 'Connected stages' },
  ],
  heroDevice: 'browser',
  heroShots: [
    { src: img('carework/shot-04.webp'), alt: 'CareWork dashboard in review mode: an assignment overview, task cards with completion logs, the patient response and clinician notes.' },
  ],
  blocks: [
    {
      type: 'text',
      eyebrow: '01 — The problem',
      title: 'Care does not pause *between appointments.*',
      body: [
        'Between-session care begins in a clinical visit, continues through a patient’s everyday life, and returns at the follow-up. The goal, the tasks, the patient’s data, the clinician’s evaluation and the next revision usually live in different places, so the thread between them is rebuilt from memory at every visit.',
        'CareWork treats that thread as one recurring process. An assignment preserves the relationship between a care goal, its tasks, the resulting patient-generated data, the clinician’s evaluation and the next revision.',
      ],
      aside: [
        { label: 'What I did', items: ['Formative interviews', 'HomeWork framework', 'Dashboard & AI interaction design', 'Prototype evaluation'] },
        { label: 'Designed for', items: ['Clinicians managing between-visit care', 'Chronic-condition follow-up'] },
      ],
    },
    {
      type: 'figure',
      eyebrow: '02 — The framework',
      title: 'Create, evaluate, *iterate.*',
      shot: {
        src: img('carework/framework.webp'),
        alt: 'HomeWork framework diagram: clinical goals become an assignment of tasks, tasks are evaluated with notes, and the assignment is modified for the next session cycle.',
        caption: 'The HomeWork framework structures between-session care as a recurring cycle. It came out of six formative interviews and became the information architecture of the product.',
      },
      frame: 'plain',
      wide: true,
    },
    {
      type: 'sequence',
      eyebrow: '03 — The product',
      title: 'One assignment, *three stages.*',
      intro: 'A stage bar at the bottom of the workspace keeps the clinician oriented: create, review, assign.',
      device: 'browser',
      steps: [
        {
          title: 'Create: from a goal to tasks',
          body: 'The clinician states the goal; AI can draft the assignment, its rationale and the task cards. Every field stays editable, and nothing reaches the patient until the clinician assigns it.',
          shot: { src: img('carework/shot-03.webp'), alt: 'Create stage: an editable assignment with task cards and an AI copilot panel.' },
        },
        {
          title: 'Evaluate: evidence where you need it',
          body: 'An assignment-level brief gives orientation. Task cards keep the original instruction, the completion history, the exact patient-generated data and room for clinician notes.',
          shot: { src: img('carework/shot-04.webp'), alt: 'Evaluate stage: task cards with completion logs, patient response and clinician notes.' },
        },
        {
          title: 'AI that shows its work',
          body: 'AI can summarise a month of patient reports or draft an evaluation note. Each output arrives as a proposal with its source beside it, and the clinician retries, edits or accepts.',
          shot: { src: img('carework/shot-05.webp'), alt: 'Evaluate stage with an AI-generated summary in the side panel.' },
        },
        {
          title: 'Iterate: a diff for care plans',
          body: 'The next assignment is shown against the previous one. Suggested modifications carry their rationale, so change is inspected rather than trusted.',
          shot: { src: img('carework/shot-09.webp'), alt: 'Iterate stage: the previous assignment compared with AI-suggested modifications.' },
        },
      ],
    },
    {
      type: 'gallery',
      eyebrow: '04 — Details',
      title: 'Editorial calm for *clinical work.*',
      intro: 'Warm paper, a serif for the things clinicians write, a mono for the things the system says. The hierarchy makes authorship legible at a glance, which matters when some of the words come from a model.',
      kind: 'wide',
      shots: [
        { src: img('carework/ui-assignment.webp'), alt: 'Assignment editor with a title, summary and the reason given to the patient.', caption: 'The assignment reads like a letter, because part of it is one.' },
        { src: img('carework/ui-tasks.webp'), alt: 'Task cards grouped by type: self-report, medications, exercise, lifestyle, learn.', caption: 'Task cards by type, each editable in place.' },
        { src: img('carework/shot-08.webp'), alt: 'An AI summary popover and an AI-drafted clinician note with retry and accept actions.', caption: 'AI output is always a proposal: retry, edit or accept.' },
        { src: img('carework/shot-10.webp'), alt: 'Planning the next homework with a refinement diff of modified tasks.', caption: 'A refinement diff: what changed, and why.' },
      ],
    },
    {
      type: 'figure',
      eyebrow: '05 — Process',
      title: 'Wireframes first.',
      shot: {
        src: img('carework/wireframes.webp'),
        alt: 'Low-fidelity wireframes of the CareWork workspace across the three stages.',
        caption: 'Low-fidelity wireframes set the three-panel workspace before any visual design: patients, the assignment, the assistant. Scroll to pan through them.',
      },
      frame: 'pan',
    },
    {
      type: 'figure',
      shot: {
        src: img('carework/study.webp'),
        alt: 'Study procedure: pre-use survey, interaction with CareWork across creation, evaluation and revision, and post-use interview.',
        caption: 'Evaluation procedure. Sessions used fictional cases and three months of AI-synthesised patient-generated data.',
      },
      frame: 'plain',
      wide: true,
    },
    {
      type: 'insights',
      eyebrow: '06 — What clinicians said',
      title: 'Useful, *with conditions.*',
      items: [
        { title: 'The connection is the feature', body: 'Participants valued seeing goal, tasks, evidence and revision in one continuous workflow more than any single screen.' },
        { title: 'Oversight builds trust', body: 'Inspectable, editable AI output, with the clinician initiating and approving consequential content, was what made the assistance acceptable.' },
        { title: 'Adoption has real costs', body: 'Workload, privacy, resources and EHR integration were raised as conditions for use in practice. They shape what I would design next.' },
      ],
      note: 'The study assessed perceived usefulness in a simulated session. It did not test safety, clinical effectiveness, workload reduction or patient outcomes.',
    },
    {
      type: 'outcome',
      eyebrow: '07 — Outcome',
      title: 'A pattern library for *accountable AI.*',
      body: [
        'Two studies with fourteen healthcare professionals in total: six formative interviews that produced the framework, and eleven hour-long prototype sessions that tested it.',
        'The part I would carry into any AI product: make authorship visible, keep every generated artefact editable, and let people see what changed before they commit to it.',
      ],
      links: [],
    },
  ],
};
