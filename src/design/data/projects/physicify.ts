import { img } from '../img';
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
      type: 'research',
      eyebrow: '04 — The study',
      title: 'Twenty-eight days, *two phases.*',
      intro: 'Seventeen people planned exercise every day for four weeks. For the first two they saw nothing of their past; for the second, their own history sat beside every plan. Three interviews asked what changed.',
      numbers: [
        { value: '248', label: 'plans made, 136 then 112' },
        { value: '183', label: 'carried out as planned' },
        { value: '70.4%', label: 'average completion, 75.3% then 65.0%' },
        { value: '51', label: 'interviews, three per person' },
      ],
      timeline: {
        kind: 'days',
        days: 28,
        phases: [{ from: 1, to: 14, label: 'Physicify 1: plans without history', tone: 'a' }, { from: 15, to: 28, label: 'Physicify 2: plans beside the record', tone: 'b' }],
        marks: [{ day: 0, label: 'Interview I' }, { day: 14, label: 'Interview II' }, { day: 28, label: 'Interview III' }],
      },
      record: {
        kind: 'planning',
        title: 'What a plan *has to survive.*',
        body: 'The interviews produced a small model of everyday exercise planning: what people weigh when they make a plan, what breaks it, and what their own records taught them once they could see them. Each bar counts the seventeen participants.',
        columns: [
          { label: 'Making the plan', items: [{ title: 'Fitting it around routines', n: 9, of: 17 }, { title: 'The energy they expected to have', n: 5, of: 17 }, { title: 'How a similar session went before', n: 8, of: 17 }] },
          { label: 'Why it broke', items: [{ title: 'Unexpected events', n: 7, of: 17 }, { title: 'Events just before or after', n: 6, of: 17 }, { title: 'Physical or mental exhaustion', n: 11, of: 17 }] },
          { label: 'What history taught', items: [{ title: 'When a slot is likely to be disrupted', n: 11, of: 17 }, { title: 'Where to move exercise to', n: 6, of: 17 }, { title: 'The conditions that make it easy', n: 6, of: 17 }] },
        ],
        caption: 'Counts are participants who raised each point in Interview II (planning, barriers) or Interview III (history).',
      },
      insights: [
        { title: 'Failures drew the eye first', body: 'Given their history, people went straight to the plans that had not happened, to extreme values, and to clusters of records with something in common.', evidence: { kind: 'shot', shot: { src: img('physicify/study-p7-weekday.webp'), alt: 'P7’s planning history in Physicify 2: a bar chart by weekday shows every Tuesday and Wednesday plan uncompleted.', caption: 'P7: every Tuesday and Wednesday plan had failed' } } },
        { title: 'Records became likelihoods', body: 'Over half read from their records how likely a given day or time was to be disrupted, and planned around it instead of hoping.', evidence: { kind: 'share', n: 11, of: 17, label: 'identified likely disruptions' } },
        { title: 'Some saw a pattern in their absences', body: 'The calendar made gaps visible. P3 noticed she rarely planned anything on weekends; others moved sessions away from events that kept getting in the way.', evidence: { kind: 'shot', shot: { src: img('physicify/study-p3-calendar.webp'), alt: 'P3’s calendar view in Physicify 2: plans cluster on weekdays and the weekend columns are almost empty.', caption: 'P3: weekends stayed empty' } } },
        { title: 'The record spoke to what people already valued', body: 'The most persuasive chart was the one that matched a person’s own question, whether that was activity type, weekday or time of day.', evidence: { kind: 'quote', text: 'The bar chart that is showing activities by types is more important and influential on my decisions.', who: 'P2, Interview III' } },
      ],
      method: [
        { label: 'Who', value: '20 students and alumni at the University of Michigan enrolled, 17 completed: 16 women, 1 man, aged 18–55.' },
        { label: 'Design', value: 'Within-subject, 28 days: Physicify 1 (no history) then Physicify 2 (calendar and history views) on the same records.' },
        { label: 'Eligibility', value: 'Unsatisfied with their activity level (3 or lower of 5), able to do moderate exercise, iPhone.' },
        { label: 'Interviews', value: 'Start, day 14 and day 28; think-aloud plans for the next day and walkthroughs of critical incidents.' },
        { label: 'Analysis', value: 'In vivo coding grouped by research question, then by emergent themes such as reflecting on records.' },
        { label: 'Ethics', value: 'IRB approved; three participants left for scheduling or installation reasons and were excluded.' },
      ],
      note: 'Exploratory: completion fell in the second phase, and the study does not claim that history improves adherence.',
      source: { label: 'Read the CHI 2022 paper', href: 'https://doi.org/10.1145/3491102.3501997' },
    },
    {
      type: 'outcome',
      eyebrow: '05 — Outcome',
      title: 'Published at *CHI 2022.*',
      body: [
        'Twenty people enrolled and seventeen completed the 28-day study, making and reporting 248 plans, 183 of them followed as planned. Physicify set up the questions that Planneregy went on to answer.',
      ],
      links: [{ label: 'Read the CHI 2022 paper', href: 'https://doi.org/10.1145/3491102.3501997' }],
    },
  ],
};
