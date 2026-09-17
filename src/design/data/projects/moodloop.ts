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
      type: 'figure',
      shot: {
        src: img('moodloop/study.webp'),
        alt: 'Six-week study design: three weeks of numerical reporting, three weeks with annotations, and three interviews.',
        caption: 'Study design: three weeks of numerical reporting, three weeks with annotations, three interviews per participant.',
      },
      frame: 'plain',
      wide: true,
    },
    {
      type: 'video',
      eyebrow: '07 — Film',
      title: 'Two and a half minutes of Moodloop.',
      youtubeId: 'otqw3gwkwbE',
      poster: sharedImg('moodloop-video-poster.jpg'),
      caption: 'Overview film: configurable reporting, contextual annotations, reflection views and the interview study.',
    },
    {
      type: 'insights',
      eyebrow: '08 — What we learned',
      title: 'Numbers are *personal instruments.*',
      items: [
        { title: 'People build their own anchors', body: 'Participants constructed personal reference points for scores and calibrated them over time, rather than reading the scale as given.' },
        { title: 'Granularity is a trade', body: 'Choosing a finer scale bought expressive detail at the cost of reporting effort. People moved between scales as that balance shifted.' },
        { title: 'Annotation is reasoning', body: 'Notes, tags and images were not just records. They were part of how people arrived at a number, and how they made sense of it later.' },
      ],
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
