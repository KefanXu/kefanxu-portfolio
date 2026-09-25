/* Study records rebuilt from the papers' figures, so they can be drawn live. */

/** One week of Planneregy: a strategy, its plans and the keywords rated after it. */
export interface StrategyWeek {
  /** Strategy number in the order the participant created them (1 = first). */
  strategy: number;
  /** One letter per plan: g completed as planned, o completed differently, b uncompleted, w unreported. */
  plans: string;
  /** One letter per keyword rating: g helpful, o unhelpful, b not evaluated. */
  keywords: string;
  /** Minutes of activity that week. */
  minutes: number;
  /** Still running at the exit interview. */
  ongoing?: boolean;
}
export interface StrategyParticipant {
  id: string;
  gender: 'f' | 'm';
  /** Started by experimenting with something new, or from the current routine. */
  started: 'experiment' | 'routine';
  /** Weekly activity by the end of the study against before it. */
  trend: 'up' | 'down' | null;
  /** A life change or temporary disruption reported during the study. */
  disruption?: string;
  weeks: StrategyWeek[];
}

/** One period of Moodloop: about a week on one reporting scale. */
export type Scale = '1-5' | '1-10' | '1-20' | '1-50' | '1-100' | '1-100/2';
export interface ScalePeriod {
  scale: Scale;
  days: number;
  reports: number;
  /** Mean score on that scale, or null when nothing was reported. */
  avg: number | null;
  annotations: number;
}
export interface ScaleParticipant {
  id: string;
  periods: ScalePeriod[];
}
