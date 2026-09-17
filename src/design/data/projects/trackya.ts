import { img } from '../img';
import type { Project } from '../types';

export const trackya: Project = {
  slug: 'trackya',
  name: 'Trackya',
  kicker: 'Mobile app · Personal informatics',
  year: '2025 — Now',
  headline: 'Making sedentary time *visible,* one hour at a time.',
  summary:
    'A mobile tracker that turns raw step counts into an hour-by-hour picture of the day, adds the context sensors miss, and helps people decide where tomorrow can move a little more.',
  status: 'Built · field study in progress',
  tags: ['Product design', 'Data visualisation', 'Visual identity', 'Study design'],
  cover: 'trackya',
  theme: { panel: '#e4e2fb', ink: '#17163a', accent: '#5d5fee', soft: '#f3f2ff' },
  meta: [
    { label: 'Role', value: 'Lead product designer & researcher: interface, interaction model, identity, three-phase study protocol' },
    { label: 'Timeline', value: '2025 — present' },
    { label: 'With', value: 'Myeonghan Ryu, Alan Matias, Upasana Bhattacharjee, Rosa I. Arriaga · Ubicomp Health & Wellness Lab, Georgia Tech' },
    { label: 'Status', value: 'Shipped to participants; early findings presented at a CHI 2026 workshop' },
  ],
  stats: [
    { value: '3', label: 'Modes: plan, track, reflect' },
    { value: '4', label: 'Context filters' },
    { value: '1 hr', label: 'Unit of the whole interface' },
    { value: '3', label: 'Study phases' },
  ],
  heroDevice: 'phone',
  heroShots: [
    { src: img('trackya/records-cal.webp'), alt: 'Trackya records screen with a week grid of mint and pink capsules.' },
    { src: img('trackya/app-1.webp'), alt: 'Trackya day view in the shipped app: hourly step counts shown as mint and pink capsules.' },
    { src: img('trackya/day-filter-plan.webp'), alt: 'Trackya planning sheet asking which of tomorrow’s time slots could be less sedentary.' },
  ],
  blocks: [
    {
      type: 'text',
      eyebrow: '01 — The problem',
      title: 'A step count is a verdict *without a story.*',
      body: [
        'Similar step-count patterns can describe very different days. A quiet hour might be a desk-bound afternoon, a strength workout, or a phone left on the table. Most trackers flatten all of it into one daily number, which hides when sedentary time happens and why.',
        'Trackya explores what changes when the data keeps its context. Step counts stay attached to the hour, the weather, the place and the person’s own account of what was going on, so the record supports interpretation instead of judgement.',
      ],
      aside: [
        { label: 'What I did', items: ['Interface & interaction design', 'Data visualisation language', 'Brand, icon & recruitment materials', 'Three-phase study protocol'] },
        { label: 'Designed for', items: ['People who want to sit less', 'Researchers studying sense-making'] },
      ],
    },
    {
      type: 'demo',
      eyebrow: '02 — The core idea',
      title: 'Every hour becomes *a capsule.*',
      body:
        'Mint means the hour cleared a personal activity threshold; pink means it did not. Stack the capsules and a day becomes a column. Line the columns up and a week becomes a texture you can read without a single axis label.',
      demo: 'capsules',
      hint: 'Switch the view, or hover an hour.',
    },
    {
      type: 'sequence',
      eyebrow: '03 — The flow',
      title: 'Plan, track, reflect.',
      intro: 'The same capsule carries the whole product, from the first glance at today to the conversation about what to change next week.',
      device: 'phone',
      steps: [
        {
          title: 'Read the day at a glance',
          body: 'Each waking hour is one capsule with its step count inside. The share of sedentary time sits at the top, so the headline and the evidence share a screen.',
          shot: { src: img('trackya/day.webp'), alt: 'Day view: a vertical list of hourly capsules in mint and pink with step counts.' },
        },
        {
          title: 'Zoom out to the week',
          body: 'Capsules compress into a week grid. Recurring sedentary blocks appear as pink bands across days, which is far easier to notice than a weekly average.',
          shot: { src: img('trackya/week-plan.webp'), alt: 'Week view: a grid of small capsules for seven days with a planning sheet below.' },
        },
        {
          title: 'Compare like with like',
          body: 'Weather, location, weekday and time-of-day filters dim everything else, so a rainy Tuesday at the lab can be compared with other rainy Tuesdays at the lab.',
          shot: { src: img('trackya/filter-weather.webp'), alt: 'Day view with a weather filter open, dimming hours that do not match.' },
        },
        {
          title: 'Plan small swaps for tomorrow',
          body: 'Planning mode asks one modest question: which of tomorrow’s time slots could be less sedentary? People pick capsules, not a daunting number.',
          shot: { src: img('trackya/day-filter-plan.webp'), alt: 'Planning sheet listing selected time slots for tomorrow.' },
        },
        {
          title: 'Correct what the sensor missed',
          body: 'Reporting mode checks flagged hours with the person. Quick reasons such as “I was doing strength training” or “I didn’t bring my device” turn a false alarm into useful context.',
          shot: { src: img('trackya/report-reasons.webp'), alt: 'Report sheet with suggested reasons for a low step count.' },
        },
        {
          title: 'Look back across weeks',
          body: 'Records keep every plan and report. Weekly milestones replay the grid so change is visible as a pattern, and the next plan starts from evidence.',
          shot: { src: img('trackya/week4.webp'), alt: 'Fourth week summary: a full grid of mint and pink capsules with condition chips.' },
        },
      ],
    },
    {
      type: 'gallery',
      eyebrow: '04 — In production',
      title: 'From Figma to a phone in *someone’s pocket.*',
      intro: 'Screens from the production build running with real step data.',
      kind: 'phones',
      shots: [
        { src: img('trackya/app-1.webp'), alt: 'Shipped app: day view with step capsules.', caption: 'Day' },
        { src: img('trackya/app-2.webp'), alt: 'Shipped app: two days side by side for planning.', caption: 'Compare days' },
        { src: img('trackya/app-3.webp'), alt: 'Shipped app: planning mode sheet.', caption: 'Plan' },
        { src: img('trackya/app-5.webp'), alt: 'Shipped app: report mode sheet.', caption: 'Report' },
        { src: img('trackya/app-6.webp'), alt: 'Shipped app: records list with report actions.', caption: 'Records' },
      ],
    },
    {
      type: 'text',
      eyebrow: '05 — A personal baseline',
      title: '“Active” is *not the same* for everyone.',
      body: [
        'A fixed goal would make the grid wrong for most people. Onboarding therefore asks three short questions: how many steps make an hour count as active, how much sedentary time feels realistic to reduce, and which hours of the day should be tracked at all.',
        'Those answers set the colour of every capsule afterwards, so the visual language stays honest to the person rather than to a population average.',
      ],
    },
    {
      type: 'gallery',
      eyebrow: '',
      title: '',
      kind: 'phones',
      shots: [
        { src: img('trackya/splash.webp'), alt: 'Trackya sign-in screen with the app icon.', caption: 'Sign in' },
        { src: img('trackya/onb-threshold.webp'), alt: 'Onboarding: choose the step threshold for an active hour.', caption: 'Threshold' },
        { src: img('trackya/onb-reduce.webp'), alt: 'Onboarding: choose how many sedentary hours to reduce.', caption: 'Target' },
        { src: img('trackya/onb-active.webp'), alt: 'Onboarding: choose the hours of the day to track.', caption: 'Active window' },
        { src: img('trackya/conditions.webp'), alt: 'Conditions screen with weather, location, weekday and time filters.', caption: 'Conditions' },
      ],
    },
    {
      type: 'identity',
      eyebrow: '06 — Identity',
      title: 'One shape, *everywhere.*',
      body:
        'The capsule is the data mark, the app icon, the tab bar and the recruitment poster. Two data colours carry meaning; one interface colour carries everything else, so the chart never competes with the chrome.',
      swatches: [
        { name: 'Mint', hex: '#47d5b3', role: 'Active hour' },
        { name: 'Pink', hex: '#f078b5', role: 'Sedentary hour' },
        { name: 'Periwinkle', hex: '#5d5fee', role: 'Interface' },
        { name: 'Lilac', hex: '#e1e0f6', role: 'Surface' },
      ],
      marks: [
        { src: img('trackya/icon.png'), alt: 'Trackya app icon: mint and pink capsules on white.', caption: 'App icon' },
        { src: img('trackya/flyer-1.webp'), alt: 'Recruitment flyer with diagonal mint and pink capsules.', caption: 'Recruitment flyer' },
        { src: img('trackya/flyer-2.webp'), alt: 'Alternate recruitment flyer.', caption: 'Flyer, alternate' },
      ],
    },
    {
      type: 'figure',
      shot: {
        src: img('trackya/styleguide.webp'),
        alt: 'Trackya component sheet: colours, date headers, mode switches, capsule rows, filter chips, tab bar and record cards.',
        caption: 'The working component sheet from Figma: every screen is assembled from these parts. Scroll to pan through it.',
      },
      frame: 'pan',
    },
    {
      type: 'outcome',
      eyebrow: '07 — Where it stands',
      title: 'Built, deployed, and *still being studied.*',
      body: [
        'Trackya is running with participants in a multi-phase field study, and I presented early findings at a CHI 2026 workshop. The design rationale is documented in a CHI 2025 workshop paper.',
        'Because the study is ongoing I am not reporting outcomes here. What I can share in conversation: the design decisions that survived contact with real routines, and the ones that did not.',
      ],
      links: [{ label: 'Read the workshop paper', href: 'https://arxiv.org/abs/2509.19420' }],
    },
  ],
};
