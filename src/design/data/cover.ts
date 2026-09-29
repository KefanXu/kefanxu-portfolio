/*
 * Copy for the opening, set like a magazine cover: an issue line, four cover
 * lines (one per stage of the work), four numerals, the stickers pinned on
 * the poster with their "on the cover" credits, and the deck of six stories.
 * Every number here comes from a case study on this site.
 */

export const issue = { number: '01', season: 'Autumn 2026', title: 'The field issue', years: '2021 — 2026' };

export interface CoverLine { n: string; kicker: string; text: string; sub: string }
/** One line per stage of the work, summed across the six case studies. */
export const coverLines: CoverLine[] = [
  { n: '01', kicker: 'Design', text: 'Six products, *sketch to system.*', sub: 'Flows, wireframes and visual systems in Figma' },
  { n: '02', kicker: 'Code', text: 'Three stacks, *one author.*', sub: 'Swift · React Native · React and Node' },
  { n: '03', kicker: 'Ship', text: '48 phones, *two live sites.*', sub: 'TestFlight builds; prototypes deployed on Vercel' },
  { n: '04', kicker: 'In the wild', text: '112 days *in the field.*', sub: 'Three deployments of 28–42 days, then papers' },
];

export interface CoverNumber { value: string; unit?: string; label: string }
/** The numerals, also summed across projects: 28 + 42 + 42 days; 594 + 434 + 248 reports and plans. */
export const coverNumbers: CoverNumber[] = [
  { value: '112', unit: 'days', label: 'In the field, three deployments' },
  { value: '80', unit: '+', label: 'People across my studies' },
  { value: '1,200', unit: '+', label: 'Reports and plans they logged' },
  { value: '6', label: 'Papers · CHI, CSCW, DIS' },
];

export type StickerId = 'phone' | 'calendar' | 'badge' | 'quote' | 'figma' | 'terminal' | 'paper' | 'browser';
export type Stage = 'Research' | 'Design' | 'Build' | 'Ship' | 'Field' | 'Publish';
export interface Sticker { id: StickerId; n: number; stage: Stage; credit: string; slug: string }
/** In credit order; the phone's credit follows the product it is showing. */
export const stickers: Sticker[] = [
  { id: 'phone', n: 1, stage: 'Ship', credit: 'Trackya, production build', slug: 'trackya' },
  { id: 'calendar', n: 2, stage: 'Field', credit: '42 days · 15 phones · 594 reports', slug: 'moodloop' },
  { id: 'badge', n: 3, stage: 'Ship', credit: '16 phones through TestFlight', slug: 'planneregy' },
  { id: 'quote', n: 4, stage: 'Research', credit: 'One of 45 interviews', slug: 'moodloop' },
  { id: 'figma', n: 5, stage: 'Design', credit: 'Component sheet, Figma', slug: 'trackya' },
  { id: 'terminal', n: 6, stage: 'Build', credit: 'The model behind a proxy', slug: 'carework' },
  { id: 'paper', n: 7, stage: 'Publish', credit: 'Planneregy, CHI 2024', slug: 'planneregy' },
  { id: 'browser', n: 8, stage: 'Build', credit: 'EcoCare, live on Vercel', slug: 'ecocare' },
];

/** What the phone shows, in turn, and how the credit reads for each. */
export const phoneProducts = [
  { id: 'trackya', name: 'Trackya', credit: 'Trackya, production build', slug: 'trackya' },
  { id: 'moodloop', name: 'Moodloop', credit: 'Moodloop, shipped to 15 phones', slug: 'moodloop' },
] as const;

/** Interview cards the quote sticker turns through. */
export const quotes = [
  { text: 'Let’s say I’m feeling 60 today, but I don’t know if I’m feeling 67 or 68 tomorrow.', who: 'P11 · Moodloop, interview II', of: '1 of 45', credit: 'One of 45 interviews', slug: 'moodloop' },
  { text: 'Because agents can hallucinate.', who: 'P7 · CareWork, prototype session', of: '1 of 17', credit: 'One of 17 clinician sessions', slug: 'carework' },
  { text: 'The bar chart that is showing activities by types is more important and influential on my decisions.', who: 'P2 · Physicify, interview III', of: '1 of 51', credit: 'One of 51 interviews', slug: 'physicify' },
] as const;

/** One-line teasers for the deck, by project slug. */
export const teasers: Record<string, string> = {
  ecocare: 'a map of care you can question',
  carework: 'an AI that shows its work',
  trackya: 'every hour a capsule',
  moodloop: 'a scale that belongs to you',
  planneregy: 'one-week experiments',
  physicify: 'planning with hindsight',
};

export const totals = [
  { value: '6', label: 'papers' },
  { value: '3', label: 'deployments' },
  { value: '80+', label: 'participants' },
];
