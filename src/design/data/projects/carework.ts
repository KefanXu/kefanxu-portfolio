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
      type: 'live',
      eyebrow: '04 — Try it',
      title: 'Run the *prototype.*',
      body: 'The build the clinicians evaluated, live in the page. It opens on a fictional patient ledger with a short built-in tour; skip the tour if you would rather explore on your own.',
      url: 'https://care-work.vercel.app',
      poster: { src: img('carework/shot-04.webp'), alt: 'CareWork dashboard: a patient ledger with the current homework packet, task cards and the stage bar.' },
      guide: [
        { title: 'Open a patient', body: 'The panel on the left holds three fictional patients. Each has one active homework packet and an iteration history along the top.' },
        { title: 'Move through the stages', body: 'The bar at the bottom steps from Create to Review to Iterate. Every AI draft arrives as a proposal you can edit, retry or accept.' },
        { title: 'Ask for help', body: 'The assistant can summarise a month of patient reports or draft an evaluation note, and its source stays beside the output.' },
      ],
      note: 'Every patient and every data point is fictional and AI-synthesised. AI features call a live model, so a draft can take a few seconds. Best explored on a laptop or larger screen.',
    },
    {
      type: 'gallery',
      eyebrow: '05 — Details',
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
      type: 'wireframes',
      eyebrow: '06 — Process',
      title: 'Wireframes *first.*',
      intro: 'Low-fidelity frames from the design file, grouped by flow. Patients sit on the left, the clinician works in the middle, and the phone on the right is what the patient will see.',
      flows: [
        {
          title: 'Set up a homework in *five steps.*',
          body: 'Creation began as a guided conversation: choose the patient, add what the record does not know, let the assistant draft, review the draft task by task, then start tracking. The patient’s phone stays in view the whole way, so the clinician always sees what the patient will receive.',
          shots: [
            { src: img('carework/wireframes/create-01.webp'), alt: 'Wireframe, step 1 of 5: a patient list on the left, the prompt “Describe or drag the patient you are treating”, and an empty patient phone on the right.', caption: '1/5 · Choose the patient' },
            { src: img('carework/wireframes/create-02.webp'), alt: 'Wireframe, step 2 of 5: the prompt asks for information beyond the patient summary; the phone shows the summary and a suggestion to add a medication.', caption: '2/5 · Add what the record misses' },
            { src: img('carework/wireframes/create-03.webp'), alt: 'Wireframe, step 3 of 5: “Would you like to generate the homework for the patient?” with a Generate Homework button.', caption: '3/5 · Generate a draft' },
            { src: img('carework/wireframes/create-04.webp'), alt: 'Wireframe, step 4 of 5: “Anything we missed in the patient’s homework?” with tasks grouped under medication, exercise, lab test and diet, an Assign Homework button, and the created homework on the phone.', caption: '4/5 · Review by task type' },
            { src: img('carework/wireframes/create-05.webp'), alt: 'Wireframe, step 5 of 5: “Completed! Start tracking”, a timeline from the creation date to the next check-in, and the homework on the phone.', caption: '5/5 · Start tracking' },
          ],
        },
        {
          title: 'Change it by *talking.*',
          body: 'Modification was explored as chat before it became a diff: say what to add, react to the generated draft, ask how the homework is going. The shape of every exchange survived into the product: a proposal from the assistant, then a decision from the clinician.',
          shots: [
            { src: img('carework/wireframes/iterate-01.webp'), alt: 'Wireframe: a patient list, the prompt “What do you wish to add to the homework?” and an input field.', caption: 'Ask what to add' },
            { src: img('carework/wireframes/iterate-02.webp'), alt: 'Wireframe: the same prompt with a large summary panel above it and a navigation rail on the left.', caption: 'Same prompt, summary in view' },
            { src: img('carework/wireframes/iterate-03.webp'), alt: 'Wireframe: “Here’s the generated homework. How do you want to modify it?” beside a phone showing the homework as a flow of connected steps.', caption: 'Modify the generated draft' },
            { src: img('carework/wireframes/iterate-04.webp'), alt: 'Wireframe: “Chat to me to see the progress of homework” with an input field and the patient’s homework flow on the right.', caption: 'Ask for progress' },
          ],
        },
        {
          title: 'Read the results *by task type.*',
          body: 'The evaluation view scores each task type for the last cycle, keeps an AI summary underneath and offers one next action: check and evaluate. It is the seed of the assignment brief in the evaluate stage.',
          shots: [
            { src: img('carework/wireframes/evaluate-01.webp'), alt: 'Wireframe: Homework 1 for a patient, with medication rated good, exercise fair and diet poor, a summary area and a Check and Evaluate button.', caption: 'Scores for the cycle' },
            { src: img('carework/wireframes/evaluate-02.webp'), alt: 'Wireframe: the same evaluation view with one medicine selected.', caption: 'One task selected' },
          ],
        },
        {
          title: 'One task, *all its evidence.*',
          body: 'Detail sheets for a single medication or task: how it is checked in, whether it is a trial, an adherence calendar and a summary generated from the logs. The show-more pattern here grew into the task card that keeps instruction, history and data together.',
          shots: [
            { src: img('carework/wireframes/detail-01.webp'), alt: 'Wireframe with a hand-drawn annotation: a Medication A sheet with check-in method and trial selectors, an adherence calendar and an AI summary.', caption: 'Check-in method and adherence' },
            { src: img('carework/wireframes/detail-02.webp'), alt: 'Wireframe: a medication detail sheet with placeholder text, opened from the create flow, and the patient’s task categories on the phone.', caption: 'A medication sheet' },
            { src: img('carework/wireframes/detail-03.webp'), alt: 'Wireframe: a patient list and a homework column with tasks such as “Walk after dining”, expandable details and a Create New Task action.', caption: 'Tasks with details on demand' },
          ],
        },
      ],
      note: 'Frames from the CareWork Figma file, shown as drawn. Scroll to pan a strip, or select a frame to enlarge it.',
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
      eyebrow: '07 — What clinicians said',
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
      eyebrow: '08 — Outcome',
      title: 'A pattern library for *accountable AI.*',
      body: [
        'Two studies with fourteen healthcare professionals in total: six formative interviews that produced the framework, and eleven hour-long prototype sessions that tested it.',
        'The part I would carry into any AI product: make authorship visible, keep every generated artefact editable, and let people see what changed before they commit to it.',
      ],
      links: [],
    },
  ],
};
