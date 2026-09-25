import { img } from '../img';
import type { Project } from '../types';

export const planneregy: Project = {
  slug: 'planneregy',
  name: 'Planneregy',
  kicker: 'iOS app · Behaviour change',
  year: '2021 — 2024',
  headline: 'Exercise plans that *learn* when life changes.',
  summary:
    'An iOS app built around a weekly loop: plan seven days, name the strategy behind the plan, track what really happened, then keep, revisit or replace the strategy. Deployed for 42 days and published at CHI 2024.',
  status: 'Shipped via TestFlight · CHI 2024',
  tags: ['Product design', 'iOS development', 'Brand', 'Field study'],
  cover: 'planneregy',
  theme: { panel: '#0f120e', ink: '#f2f5ec', accent: '#2ed10f', soft: '#1a1f18', dark: true },
  meta: [
    { label: 'Role', value: 'Lead researcher, designer & iOS developer: framework, app, researcher tooling, TestFlight distribution' },
    { label: 'Timeline', value: '2021 — 2022 · published 2024' },
    { label: 'With', value: 'Xinghui (Erica) Yan, Myeonghan Ryu, Mark W. Newman, Rosa I. Arriaga · Georgia Tech × University of Michigan' },
    { label: 'Platform', value: 'iOS · participant and researcher builds' },
  ],
  stats: [
    { value: '42', label: 'Days in the field' },
    { value: '16', label: 'Participants completed' },
    { value: '48', label: 'Distinct strategies' },
    { value: '434', label: 'Activity plans created' },
  ],
  heroDevice: 'phone',
  heroShots: [
    { src: img('planneregy/app-strategy-detail.webp'), alt: 'Planneregy strategy detail with completion, satisfaction, keywords and activity records.' },
    { src: img('planneregy/app-mock-1.webp'), alt: 'Planneregy tracking screen with a month calendar of planned and completed activities and the current strategy.' },
    { src: img('planneregy/app-reflect.webp'), alt: 'Planneregy reflection screen asking which aspects of the strategy were not helpful.' },
  ],
  blocks: [
    {
      type: 'text',
      eyebrow: '01 — The problem',
      title: 'Most plans fail *quietly.*',
      body: [
        'Physical activity plans stop fitting when schedules, health, travel or motivation change. Apps usually answer with a streak counter, which records that the plan failed without helping anyone understand why or what to try instead.',
        'Planneregy turns the plan into something you iterate on. It operationalises a framework we call reflective iteration: articulate a strategy, live with it for a week, then judge the strategy rather than yourself.',
      ],
      aside: [
        { label: 'What I did', items: ['Framework & product design', 'iOS build, participant + researcher versions', 'Brand & recruitment materials', '42-day deployment & interviews'] },
      ],
    },
    {
      type: 'demo',
      eyebrow: '02 — The loop',
      title: 'A week is *one experiment.*',
      body:
        'Seven days of plans are bundled into a named strategy described with the person’s own keywords. On day seven the strategy gets a verdict, and the next week starts from what was learned.',
      demo: 'loop',
      hint: 'Step through the week.',
    },
    {
      type: 'sequence',
      eyebrow: '03 — The app',
      title: 'From plans to *self-knowledge.*',
      device: 'phone',
      steps: [
        {
          title: 'Plan the week in context',
          body: 'Activities are set by type, date and time, beside calendar and weather context, with a running total against the recommended 150 minutes.',
          shot: { src: img('planneregy/app-plan.webp'), alt: 'Plan activities: choose an activity, date and time under a week calendar.' },
        },
        {
          title: 'Say what the strategy is',
          body: 'People summarise the week in their own keywords, such as “morning”, “light exercise” or “outdoor”, then give the strategy a name. Naming is the design move: it creates something to evaluate later.',
          shot: { src: img('planneregy/app-keywords.webp'), alt: 'Summarise the planning strategy with keywords chosen from examples or typed in.' },
        },
        {
          title: 'Track against the plan',
          body: 'The calendar fills with what was planned and what happened. The current strategy stays pinned, so daily reports are always read in its light.',
          shot: { src: img('planneregy/app-mock-1.webp'), alt: 'Tracking calendar with planned and completed activities and the current strategy card.' },
        },
        {
          title: 'Report what really happened',
          body: 'Done as planned, done differently, or not done, each with a reason. Unplanned activity counts too, because real life rarely follows the script.',
          shot: { src: img('planneregy/app-tracking.webp'), alt: 'Tracking list with completed and partially completed activities and the current planning strategy.' },
        },
        {
          title: 'Reflect on day seven',
          body: 'Each keyword is marked helpful or unhelpful, and the strategy gets a satisfaction rating from one to seven.',
          shot: { src: img('planneregy/app-reflect.webp'), alt: 'Reflection: select which aspects of the strategy were not helpful.' },
        },
        {
          title: 'Keep, revisit or replace',
          body: 'Every strategy is saved with its completion, satisfaction and activity level. Going back to one that worked is a first-class action.',
          shot: { src: img('planneregy/app-strategy-detail.webp'), alt: 'Strategy detail with completion rate, satisfaction, activity level, keywords and records.' },
        },
      ],
    },
    {
      type: 'gallery',
      eyebrow: '04 — Process',
      title: 'It started as *self-experiments.*',
      intro: 'The first concept borrowed from self-experimentation: every plan was a trial with conditions. The design then moved up a level, from single trials to named weekly strategies that people could reflect on and revise.',
      kind: 'phones',
      shots: [
        { src: img('planneregy/wf-test-with.webp'), alt: 'Early concept: “I want to test with” conditions for an activity.', caption: 'v0 · experiments' },
        { src: img('planneregy/wf-experiments.webp'), alt: 'Early concept: my experiments with trials, success and failure counts.', caption: 'v0 · trial log' },
        { src: img('planneregy/wf-setup.webp'), alt: 'Design: creating a weekly exercise plan.', caption: 'v1 · weekly plan' },
        { src: img('planneregy/wf-keywords.webp'), alt: 'Design: summarising plan logic with keywords.', caption: 'v1 · plan logic' },
        { src: img('planneregy/wf-name.webp'), alt: 'Design: naming the new strategy.', caption: 'v1 · name it' },
        { src: img('planneregy/wf-tracking.webp'), alt: 'Design: tracking with details of each planned activity.', caption: 'v1 · tracking' },
        { src: img('planneregy/guide-add.webp'), alt: 'Coach marks explaining how to add activities.', caption: 'Shipped · coach marks' },
      ],
    },
    {
      type: 'identity',
      eyebrow: '05 — Identity',
      title: 'Recruitment is *a design problem* too.',
      body:
        'A field study lives or dies on sign-ups. The identity pairs a looping mark with a poster series loud enough for a gym noticeboard, produced in versions for print, email and screens.',
      swatches: [
        { name: 'Go', hex: '#1ab700', role: 'Completed' },
        { name: 'Amber', hex: '#feb800', role: 'Done differently' },
        { name: 'Ink', hex: '#0b0b0b', role: 'Interface' },
        { name: 'Paper', hex: '#f4f4f2', role: 'Surface' },
      ],
      marks: [
        { src: img('planneregy/logo.svg'), alt: 'Planneregy logo: a branching, looping line above the wordmark.', caption: 'Logo' },
        { src: img('planneregy/poster-1.webp'), alt: 'Recruitment poster in teal and yellow gradients.', caption: 'Poster · print' },
        { src: img('planneregy/poster-2.webp'), alt: 'Recruitment poster in magenta outline style.', caption: 'Poster · alternate' },
      ],
    },
    {
      type: 'research',
      eyebrow: '06 — The study',
      title: 'Six weeks *in the wild.*',
      intro: 'Sixteen students ran the loop for 42 days: a named strategy each week, a report each day, a reflection each seventh day. Every plan, keyword and rating they made is drawn below.',
      numbers: [
        { value: '434', label: 'plans under 48 strategies' },
        { value: '155 min', label: 'of activity in an average week' },
        { value: '72%', label: 'of reported plans completed' },
        { value: '9 / 16', label: 'more active by the end than before' },
      ],
      timeline: {
        kind: 'days',
        days: 42,
        phases: [{ from: 1, to: 42, label: 'Plan, report daily, reflect on day seven', tone: 'a' }],
        marks: [{ day: 0, label: 'Interview I' }, { day: 21, label: 'Check-in' }, { day: 42, label: 'Exit interview' }],
        ticks: { every: 7, label: 'Weekly reflection and questionnaire' },
      },
      record: {
        kind: 'strategies',
        title: 'Sixteen people, *week by week.*',
        body: 'Each block is one week under one strategy. Hover a week for its plans, keywords and minutes; use the filters to see who met a disruption, who ended up more active, and who held a strategy for five weeks.',
        caption: 'Redrawn from Figure 3 of the CHI 2024 paper. Weeks beyond the sixth are participants who kept going past the study window.',
      },
      insights: [
        { title: 'People changed course, and kept going', body: 'Ten of sixteen met a life change or a disruption, from exams to being sick. Instead of dropping out they switched strategy; eleven had already changed after week one.', evidence: { kind: 'quote', text: 'The first two weeks everything was morning routine because it worked out for me. But then I changed to afternoon walks, mostly because I had some health issues.', who: 'P7, exit interview' } },
        { title: 'Repeating a strategy taught something', body: 'Fourteen ran the same strategy more than once, changing one aspect at a time. P6 and P7 held one for five weeks and could say exactly why it worked.', evidence: { kind: 'share', n: 14, of: 16, label: 'repeated a strategy' } },
        { title: 'The keyword rating was the decision point', body: 'Rating each keyword before the whole week reinforced what had been learned, and the satisfaction score decided what the next week would look like.', evidence: { kind: 'quote', text: 'I would go into the next week and try and maintain the ones that did work and try and change the ones that didn’t.', who: 'P10, on the weekly reflection' } },
        { title: 'Half started from what they already did', body: 'Eight began by experimenting with something new, eight by naming their current routine. Both routes led to iteration; the second was gentler on failure.', evidence: { kind: 'share', n: 8, of: 16, label: 'started by experimenting' } },
      ],
      method: [
        { label: 'Who', value: '17 students at Georgia Tech enrolled, 16 completed: 13 women, 3 men, aged 18–55, unsatisfied with their activity level.' },
        { label: 'Design', value: 'Single-arm, 42 days. One strategy a week, kept, revised or replaced every seventh day.' },
        { label: 'Data', value: 'App logs, six weekly questionnaires, two recorded interviews and a mid-study check-in.' },
        { label: 'Interviews', value: 'Data-driven retrospective: researchers reviewed each person’s records in a researcher build and asked about them.' },
        { label: 'Analysis', value: 'Thematic analysis with in vivo coding, checked against the records; participant types from usage.' },
        { label: 'Ethics', value: 'Exempt IRB review; compensation tied to interviews and questionnaires, never to app use.' },
      ],
      note: 'No control condition: the rise in activity is descriptive, not causal.',
      source: { label: 'Read the CHI 2024 paper', href: 'https://doi.org/10.1145/3613904.3641937' },
    },
    {
      type: 'outcome',
      eyebrow: '07 — Outcome',
      title: 'Published at *CHI 2024.*',
      body: [
        'Planneregy was designed, built, distributed through TestFlight and studied end to end. The paper reports the reflective-iteration framework and what it takes for planning tools to support change over time.',
      ],
      links: [{ label: 'Read the CHI 2024 paper', href: 'https://doi.org/10.1145/3613904.3641937' }],
    },
  ],
};
