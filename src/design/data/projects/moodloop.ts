import { img, sharedImg } from '../img';
import type { Project } from '../types';

export const moodloop: Project = {
  slug: 'moodloop',
  name: 'Moodloop',
  kicker: 'Mobile app · Mental-state journaling',
  year: '2025 — 2026',
  headline: 'A mood journal where the scale *belongs to you.*',
  summary:
    'Moodloop lets people define, review and change their own reporting scale, and keeps the story behind every score through six kinds of annotation. A companion app gives the research team the same clarity.',
  status: 'Shipped · six-week field deployment',
  tags: ['Product design', 'Interaction design', 'Research tooling', 'Field study'],
  cover: 'moodloop',
  theme: { panel: '#fae1ce', ink: '#15263e', accent: '#5b7df5', soft: '#fff3e9' },
  meta: [
    { label: 'Role', value: 'Research & product design: flows and interface in Figma, researcher companion app, pilot testing, thematic analysis' },
    { label: 'Timeline', value: '2025 — 2026' },
    { label: 'With', value: 'Ubicomp Health & Wellness Lab, Georgia Tech · advised by Rosa I. Arriaga' },
    { label: 'Platform', value: 'Cross-platform mobile app + researcher portal' },
  ],
  stats: [
    { value: '42', label: 'Days in the field' },
    { value: '15', label: 'Participants completed' },
    { value: '45', label: 'Interviews' },
    { value: '594', label: 'Reports in study windows' },
  ],
  heroDevice: 'phone',
  heroShots: [
    { src: img('moodloop/app-10.webp'), alt: 'Moodloop: choosing a new reflection scale from several ranges and step sizes.' },
    { src: img('moodloop/app-08.webp'), alt: 'Moodloop report screen: “How are you feeling right now?” with a value of 22 out of 30.' },
    { src: img('moodloop/app-11.webp'), alt: 'Moodloop scale review day: reviewing the current scale against recent scores.' },
  ],
  blocks: [
    {
      type: 'text',
      eyebrow: '01 — The problem',
      title: 'What does a *seven* mean?',
      body: [
        'A single number can compress a subtle, mixed and situated experience. Two people who both report “7 out of 10” may mean different things, and the same person may mean something different a month later. When they look back, the circumstances behind the score are usually gone.',
        'Moodloop treats the scale as part of the design material. People choose how fine their scale is, revisit that choice on a rhythm, and attach context in whatever form is quickest in the moment.',
      ],
      aside: [
        { label: 'What I did', items: ['User flow & interface design in Figma', 'Researcher-facing companion app', 'Pilot testing & iteration', 'Interview study & thematic analysis'] },
      ],
    },
    {
      type: 'demo',
      eyebrow: '02 — Early concept',
      title: 'First, a scale *with a face.*',
      body:
        'The earliest explorations paired the slider with a character whose colour and expression follow the score. The probe that shipped went number-first instead, and made the scale itself the thing people shape. I rebuilt the first concept here because it is still fun to play with.',
      demo: 'mood',
      hint: 'Drag the slider.',
    },
    {
      type: 'gallery',
      eyebrow: '03 — Process',
      title: 'From structure to *screens.*',
      intro: 'Information architecture, low-fidelity wireframes, then a first visual pass on reporting, onboarding and scale set-up.',
      kind: 'phones',
      shots: [
        { src: img('moodloop/wf-report.webp'), alt: 'Wireframe: report list with emotion, mood and stress level.', caption: 'Wireframe · report' },
        { src: img('moodloop/wf-emotion.webp'), alt: 'Wireframe: radial emotion picker.', caption: 'Wireframe · picker' },
        { src: img('moodloop/x-login.webp'), alt: 'Visual exploration: sign-in with two characters.', caption: 'Exploration · sign in' },
        { src: img('moodloop/x-describe.webp'), alt: 'Visual exploration: choosing words that describe a feeling.', caption: 'Exploration · describe' },
        { src: img('moodloop/x-onboard-scale.webp'), alt: 'Visual exploration: choosing a reporting scale during onboarding.', caption: 'Exploration · choose a scale' },
        { src: img('moodloop/x-selfscale.webp'), alt: 'Visual exploration: defining a custom scale with minimum, maximum and interval.', caption: 'Exploration · custom scale' },
        { src: img('moodloop/x-review-prev.webp'), alt: 'Visual exploration: weekly review offering previously used scales.', caption: 'Exploration · weekly review' },
      ],
    },
    {
      type: 'sequence',
      eyebrow: '04 — The shipped probe',
      title: 'Report, annotate, *recalibrate.*',
      intro: 'Screens from the app participants used for six weeks.',
      device: 'phone',
      steps: [
        {
          title: 'A home that shows the rhythm',
          body: 'The current scale, the days left until the next review, and a calendar of past reports. Nothing else competes for attention.',
          shot: { src: img('moodloop/app-07.webp'), alt: 'Home: current reflection scale, days until reflection, and a reporting calendar.' },
        },
        {
          title: 'Report in one gesture',
          body: 'Slide, or type the number directly. The value sits in a large wheel with its neighbours, so “22 out of 30” is read in relation to what it could have been.',
          shot: { src: img('moodloop/app-08.webp'), alt: 'Report: slider and number wheel showing 22 out of 30.' },
        },
        {
          title: 'Keep the story, optionally',
          body: 'After the number, six optional annotation modes: images, video, audio, tags, descriptions and drawings. Every one is skippable, because reporting effort was a design constraint.',
          shot: { src: img('moodloop/app-13.webp'), alt: 'Annotation options below the reported score: media, voice note, tags, description.' },
        },
        {
          title: 'Every seven days, review the scale',
          body: 'A review day replays recent scores against the scale and asks how well it expresses the range of what the person feels.',
          shot: { src: img('moodloop/app-11.webp'), alt: 'Scale review: current scale with recent scores and annotations.' },
        },
        {
          title: 'Change it when it stops fitting',
          body: 'Common scales are one tap away and custom ranges and steps are allowed. The previous scale stays in the history so old scores keep their meaning.',
          shot: { src: img('moodloop/app-10.webp'), alt: 'Change reflection scale: a list of ranges with different maximums and steps.' },
        },
        {
          title: 'See scores with their context',
          body: 'Journal trends place each score beside its scale and annotations, which is what makes later reflection possible.',
          shot: { src: img('moodloop/app-09.webp'), alt: 'Journal trends with per-period charts and annotation cards.' },
        },
      ],
    },
    {
      type: 'gallery',
      eyebrow: '05 — Annotation',
      title: 'Five ways to say *why.*',
      kind: 'phones',
      shots: [
        { src: img('moodloop/app-14.webp'), alt: 'Annotation with photos or video.', caption: 'Images & video' },
        { src: img('moodloop/app-15.webp'), alt: 'Annotation with a voice note.', caption: 'Voice note' },
        { src: img('moodloop/app-16.webp'), alt: 'Annotation with tags such as work, family and health.', caption: 'Tags' },
        { src: img('moodloop/app-17.webp'), alt: 'Annotation with a written description.', caption: 'Description' },
        { src: img('moodloop/app-18.webp'), alt: 'Annotation with a free-hand drawing.', caption: 'Drawing' },
      ],
    },
    {
      type: 'figure',
      eyebrow: '06 — The other user',
      title: 'A companion app for *the research team.*',
      shot: {
        src: img('moodloop/app-03.webp'),
        alt: 'Researcher portal: overview of reports, participants reporting and average score by scale.',
        caption: 'The researcher portal summarises reporting histories, so every interview could start from what a participant actually did rather than from a generic script.',
      },
      frame: 'phone',
    },
    {
      type: 'research',
      eyebrow: '07 — The study',
      title: 'Forty-two days of *daily numbers.*',
      intro: 'Fifteen people rated how they felt once a day for six weeks, reviewed their scale every seventh day, and in the second half could attach context to the number. Every period they reported is drawn below.',
      numbers: [
        { value: '594', label: 'reports in the study windows' },
        { value: '6', label: 'different scales in use' },
        { value: '10 / 15', label: 'switched scale at least once' },
        { value: '45', label: 'interviews, three per person' },
      ],
      timeline: {
        kind: 'days',
        days: 42,
        phases: [{ from: 1, to: 21, label: 'Numbers only', tone: 'a' }, { from: 22, to: 42, label: 'Numbers with annotations', tone: 'b' }],
        marks: [{ day: 0, label: 'Interview I' }, { day: 21, label: 'Interview II' }, { day: 42, label: 'Interview III' }],
        ticks: { every: 7, label: 'Scale review: keep or change' },
      },
      record: {
        kind: 'scales',
        title: 'Fifteen people, *six weeks of numbers.*',
        body: 'Each bar is one person’s 42 days, split into the periods between scale reviews and coloured by the scale in use. Dots are reports, filled when annotated. Hover a period for its numbers; use the filters to follow a scale.',
        caption: 'Redrawn from Figure 3 of the paper. Days are to scale; a period longer than seven days is one where the review was postponed.',
      },
      insights: [
        { title: 'A number needs a personal anchor', body: 'Neutral days were harder to score than extremes, and most people could not tell nearby values apart. They built their own meanings for scores and ranges instead.', evidence: { kind: 'quote', text: 'When I’m at a baseline level, then it’s harder for me to tell if I’m slightly above or slightly below normal.', who: 'P5, on scoring an ordinary day' } },
        { title: 'Granularity is a trade', body: 'Small scales were quick and intuitive, large ones caught nuance but brought doubt. Everyone passed through 1–10; two thirds tried something else and weighed effort against detail.', evidence: { kind: 'quote', text: 'Let’s say I’m feeling 60 today, but I don’t know if I’m feeling 67 or 68 tomorrow.', who: 'P11, on the 1–100 scale' } },
        { title: 'Annotation shaped the number itself', body: 'Once context could be attached, reporting became more deliberate: people chose the medium by the day they had, and the note became proof for the score.', evidence: { kind: 'share', n: 10, of: 15, label: 'said annotating made scores more thoughtful' } },
        { title: 'Context is what made looking back possible', body: 'Without notes, people could not say why they had given a score a week earlier. With them, most could recover the nuance behind a number weeks later.', evidence: { kind: 'quote', text: 'If I go another five months from now, it’s going to be harder to remember. I would love to have notes.', who: 'P9, before annotations were switched on' } },
      ],
      method: [
        { label: 'Who', value: '17 adults enrolled, 15 completed: graduate students, engineers and other professionals; 11 had tracked their mood before.' },
        { label: 'Design', value: 'Two phases of three weeks: numeric reports only, then reports with optional annotations in six media.' },
        { label: 'Scales', value: 'Pick 1–5, 1–10 or 1–100, or define your own; every seventh day rate the scale on range, speed, clarity and design.' },
        { label: 'Data', value: '711 reports overall, 55 scale reviews, 45 recorded interviews on Zoom with the app on a shared screen.' },
        { label: 'Analysis', value: 'Team-based codebook thematic analysis in Dovetail, one codebook per interview phase, refined weekly.' },
        { label: 'Ethics', value: 'IRB approved; adults without diagnosed conditions and outside therapy; paid for interviews, not for reporting.' },
      ],
      note: 'Findings speak to everyday self-tracking rather than clinical monitoring. The full paper is under review.',
    },
    {
      type: 'video',
      eyebrow: '08 — Film',
      title: 'Two and a half minutes of Moodloop.',
      youtubeId: 'otqw3gwkwbE',
      poster: sharedImg('moodloop-video-poster.jpg'),
      caption: 'Overview film: configurable reporting, contextual annotations, reflection views and the interview study.',
    },
    {
      type: 'outcome',
      eyebrow: '09 — Outcome',
      title: 'A probe that *earned its findings.*',
      body: [
        'Fifteen participants completed the six-week deployment and three interviews each, and the probe held up through 594 reports inside the study windows.',
        'The work changed how I approach self-report in any product that asks people to rate something about themselves: the scale is an interface, and it deserves the same design attention as the screen around it.',
      ],
      links: [{ label: 'Watch the project film', href: 'https://youtu.be/otqw3gwkwbE' }],
    },
  ],
};
