import { img, sharedImg } from '../img';
import type { Project } from '../types';

export const physicify: Project = {
  slug: 'physicify',
  name: 'Physicify',
  kicker: 'iOS app · Planning with history',
  year: '2021 — 2022',
  headline: 'Planning exercise with the *benefit of hindsight.*',
  summary:
    'An iOS research probe, built in two versions, that shows people their own planning history in context, so the next plan starts from what has actually worked. Deployed for 28 days and published at CHI 2022.',
  status: 'Shipped · CHI 2022',
  tags: ['Product design', 'iOS development', 'Data visualisation', 'Field study'],
  cover: 'physicify',
  theme: { panel: '#dfe4dc', ink: '#141713', accent: '#38a826', soft: '#eef1eb' },
  meta: [
    { label: 'Role', value: 'Lead researcher, designer & iOS developer: two app versions, history views, two-phase study' },
    { label: 'Timeline', value: '2021 — 2022' },
    { label: 'With', value: 'Xinghui (Erica) Yan, Mark W. Newman · School of Information, University of Michigan' },
    { label: 'Platform', value: 'iOS · two research builds' },
  ],
  stats: [
    { value: '28', label: 'Days in the field' },
    { value: '17', label: 'Participants completed' },
    { value: '248', label: 'Plans reported' },
    { value: '70.4%', label: 'Average completion' },
  ],
  heroDevice: 'phone',
  heroShots: [
    { src: img('physicify/final-history-summary.webp'), alt: 'Physicify planning history: completion broken down by weather, activity type, weekday and timing.' },
    { src: img('physicify/final-calendar-planning.webp'), alt: 'Physicify calendar: colour-coded plan outcomes beside weather and calendar events.' },
    { src: img('physicify/final-record-detail.webp'), alt: 'Physicify record detail: an uncompleted plan with its reason, weather and nearby events.' },
  ],
  blocks: [
    {
      type: 'text',
      eyebrow: '01 — The problem',
      title: 'A plan depends on *more than intention.*',
      body: [
        'Routines, anticipated energy, nearby events and unexpected interruptions all decide whether exercise fits into a day. People rarely get to see those factors together, so each new plan is made from a hazy memory of the last one.',
        'Physicify examined everyday planning first without any historical reference, then with a record of prior plans and their context. The design question was how to show history so that it informs a decision rather than delivering a score.',
      ],
      aside: [
        { label: 'What I did', items: ['Designed & built Physicify 1 and 2', 'History summaries, calendar, record detail', 'Two-phase study design', 'Three interviews per participant'] },
      ],
    },
    {
      type: 'sequence',
      eyebrow: '02 — The app',
      title: 'History, *in context.*',
      device: 'phone',
      steps: [
        {
          title: 'Plan on the calendar you already live in',
          body: 'Plans sit beside weather, temperature and anonymised Google Calendar events. Green and red blocks mark completed and missed plans; grey blocks are the rest of the day’s schedule.',
          shot: { src: img('physicify/final-calendar-planning.webp'), alt: 'Calendar with colour-coded plan outcomes, weather and schedule events.' },
        },
        {
          title: 'Choose a slot, see similar days',
          body: 'Picking a date, activity or time highlights similar past records, so the comparison happens at the moment of decision.',
          shot: { src: img('physicify/week-plan.webp'), alt: 'Week view with a planning panel for a selected day, weather and activity type.' },
        },
        {
          title: 'Report in a few taps',
          body: 'A short daily check-in records whether the plan happened, how closely, and how it felt, in language people actually use.',
          shot: { src: img('physicify/report.webp'), alt: 'Daily report: how the plan went, from “followed with extra effort” to “didn’t do any workout”.' },
        },
        {
          title: 'Patterns across conditions',
          body: 'Completed and uncompleted plans are grouped by weather, activity type, weekday and time, which turns a pile of records into a few readable tendencies.',
          shot: { src: img('physicify/final-history-summary.webp'), alt: 'Planning history charts by weather, activity type, weekday and timing.' },
        },
        {
          title: 'Every record keeps its reasons',
          body: 'A single plan opens to its outcome, the stated reason, the conditions that day and the events around it.',
          shot: { src: img('physicify/final-record-detail.webp'), alt: 'Record detail for an uncompleted indoor workout with the reason and the day’s schedule.' },
        },
      ],
    },
    {
      type: 'gallery',
      eyebrow: '03 — Process',
      title: 'Flows before *pixels.*',
      intro: 'Study logic and app logic were designed together: what each version reveals, when, and what that lets us compare.',
      kind: 'wide',
      shots: [
        { src: img('physicify/method-flow.webp'), alt: 'Flow diagram comparing experiment methods for the two app versions.', caption: 'Mapping the two experimental conditions onto app behaviour.' },
        { src: img('physicify/wireboard.webp'), alt: 'Board of wireframes and interaction notes for planning, reporting and history views.', caption: 'Wireframe board: planning, reporting and history.' },
      ],
    },
    {
      type: 'gallery',
      eyebrow: '',
      title: '',
      kind: 'phones',
      shots: [
        { src: img('physicify/month.webp'), alt: 'Month calendar with outcomes.', caption: 'Month' },
        { src: img('physicify/week.webp'), alt: 'Week timeline with outcomes.', caption: 'Week' },
        { src: img('physicify/day-records.webp'), alt: 'Records for a selected day with the reported outcome.', caption: 'Day record' },
        { src: img('physicify/week-confirm.webp'), alt: 'Confirmation of a newly planned walk.', caption: 'Plan confirmed' },
        { src: img('physicify/app-2.webp'), alt: 'Shipped app: month calendar filled with a participant-style schedule.', caption: 'Shipped build' },
      ],
    },
    {
      type: 'figure',
      eyebrow: '04 — The study',
      title: 'Two phases, *one comparison.*',
      shot: {
        src: sharedImg('physicify-study-phases.png'),
        alt: 'Study phases: fourteen days planning without historical reference, fourteen days with it, and three interviews.',
        caption: 'Participants used Physicify 1 for fourteen days without history, then Physicify 2 with their own records, with an interview at baseline and after each phase.',
      },
      frame: 'card',
    },
    {
      type: 'insights',
      eyebrow: '05 — Findings',
      title: 'What history *was good for.*',
      items: [
        { title: 'Likelihoods, not events', body: 'Rather than spotting one disruptive event, participants noticed when they were likely to be disrupted, such as a weekday where plans kept failing.' },
        { title: 'Fit beats willpower', body: 'Records showed how neighbouring events affected plans, so people moved exercise to parts of the day that were less exposed.' },
        { title: 'Preferred conditions emerge', body: 'People unsure of their capacity tried different conditions and used the records to find the ones where activity came easily.' },
      ],
      note: 'The study was exploratory. It does not establish that access to history improved adherence.',
    },
    {
      type: 'outcome',
      eyebrow: '06 — Outcome',
      title: 'Published at *CHI 2022.*',
      body: [
        'Twenty people enrolled and seventeen completed the 28-day study, making and reporting 248 plans, 183 of them followed as planned. Physicify set up the questions that Planneregy went on to answer.',
      ],
      links: [{ label: 'Read the CHI 2022 paper', href: 'https://doi.org/10.1145/3491102.3501997' }],
    },
  ],
};
