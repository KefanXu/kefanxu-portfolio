import type { StrategyParticipant } from './types';

/*
 * Planneregy, CHI 2024, Figure 3: every participant's weeks. Each week is one
 * strategy (numbered in order of creation), its plans (g completed as planned,
 * o completed differently, b uncompleted, w unreported), the keywords rated at
 * the end of the week (g helpful, o unhelpful, b not evaluated) and the minutes
 * of activity, read from the figure's duration bars (a full bar is 300 minutes;
 * longer weeks carry their printed value). Ongoing marks the strategy that was
 * still running at the exit interview.
 */

export const planneregyRecord: StrategyParticipant[] = [
  {
    id: 'P1', gender: 'f', started: 'experiment', trend: 'up', disruption: 'Got busy',
    weeks: [
    { strategy: 1, plans: 'oob', keywords: 'b', minutes: 100 },
    { strategy: 1, plans: 'ggb', keywords: 'b', minutes: 100 },
    { strategy: 2, plans: 'gggggg', keywords: '', minutes: 190 },
    { strategy: 2, plans: 'gggggg', keywords: '', minutes: 190 },
    { strategy: 2, plans: 'gggggb', keywords: '', minutes: 160 },
    { strategy: 2, plans: 'gwwwww', keywords: '', minutes: 30, ongoing: true },
    ],
  },
  {
    id: 'P2', gender: 'f', started: 'experiment', trend: null, disruption: 'Had a qualifier',
    weeks: [
    { strategy: 1, plans: 'ggbggggbgobg', keywords: '', minutes: 270 },
    { strategy: 1, plans: 'oboooboggggb', keywords: '', minutes: 270 },
    { strategy: 1, plans: 'gbgobgggbggg', keywords: '', minutes: 270 },
    { strategy: 2, plans: 'gggbggg', keywords: 'bbb', minutes: 60 },
    { strategy: 2, plans: 'gbggggg', keywords: 'g', minutes: 60 },
    { strategy: 1, plans: 'wwwwwwwwwwww', keywords: '', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P3', gender: 'm', started: 'routine', trend: null,
    weeks: [
    { strategy: 1, plans: 'g', keywords: 'bbbb', minutes: 60 },
    { strategy: 1, plans: 'w', keywords: 'gggg', minutes: 0 },
    { strategy: 2, plans: 'gbgo', keywords: 'ggg', minutes: 190 },
    { strategy: 3, plans: 'gbgggb', keywords: 'ggg', minutes: 250 },
    { strategy: 3, plans: 'wwwwww', keywords: 'bbb', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P4', gender: 'f', started: 'experiment', trend: null,
    weeks: [
    { strategy: 1, plans: 'ggggg', keywords: 'ggbgb', minutes: 260 },
    { strategy: 1, plans: 'gggggb', keywords: 'ggb', minutes: 230 },
    { strategy: 1, plans: 'ggggbggwww', keywords: 'bgo', minutes: 340 },
    { strategy: 2, plans: 'ggobggggwww', keywords: 'gggo', minutes: 480 },
    { strategy: 2, plans: 'ggggboww', keywords: 'bbbb', minutes: 140, ongoing: true },
    ],
  },
  {
    id: 'P5', gender: 'm', started: 'experiment', trend: 'up',
    weeks: [
    { strategy: 1, plans: '', keywords: '', minutes: 0 },
    { strategy: 2, plans: 'gggggg', keywords: 'ggb', minutes: 160 },
    { strategy: 3, plans: 'ggggbg', keywords: 'gbgo', minutes: 120 },
    { strategy: 3, plans: 'wwwwww', keywords: 'bbbb', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P6', gender: 'f', started: 'routine', trend: 'down',
    weeks: [
    { strategy: 1, plans: 'gobbb', keywords: 'gobbo', minutes: 60 },
    { strategy: 2, plans: 'bboog', keywords: 'gogbg', minutes: 100 },
    { strategy: 3, plans: 'goobg', keywords: 'gggog', minutes: 100 },
    { strategy: 3, plans: 'bbooo', keywords: 'gggog', minutes: 120 },
    { strategy: 3, plans: 'bbogo', keywords: 'ggbg', minutes: 110 },
    { strategy: 3, plans: 'obogo', keywords: 'gbgb', minutes: 210 },
    { strategy: 3, plans: 'ogggg', keywords: 'ggbg', minutes: 190 },
    { strategy: 3, plans: 'wwwww', keywords: 'bbbb', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P7', gender: 'f', started: 'experiment', trend: 'up', disruption: 'Sick',
    weeks: [
    { strategy: 1, plans: 'oggb', keywords: 'gbgo', minutes: 250 },
    { strategy: 2, plans: 'gggbb', keywords: 'gog', minutes: 190 },
    { strategy: 3, plans: 'bgb', keywords: 'bbbb', minutes: 60 },
    { strategy: 3, plans: 'gggg', keywords: 'gggb', minutes: 250 },
    { strategy: 3, plans: 'bgg', keywords: 'ggbb', minutes: 120 },
    { strategy: 3, plans: 'ggo', keywords: 'gggg', minutes: 120 },
    { strategy: 3, plans: '', keywords: 'ggbb', minutes: 0 },
    { strategy: 3, plans: 'ggbgg', keywords: 'gogg', minutes: 220 },
    { strategy: 4, plans: 'wwwwwwww', keywords: 'bbbbb', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P8', gender: 'f', started: 'routine', trend: 'down', disruption: 'Changed lifestyle',
    weeks: [
    { strategy: 1, plans: 'g', keywords: 'bb', minutes: 30 },
    { strategy: 2, plans: 'g', keywords: 'bb', minutes: 30 },
    { strategy: 3, plans: 'www', keywords: 'bb', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P9', gender: 'f', started: 'routine', trend: 'up',
    weeks: [
    { strategy: 1, plans: 'bbo', keywords: '', minutes: 30 },
    { strategy: 2, plans: 'ggb', keywords: '', minutes: 250 },
    { strategy: 1, plans: 'bgb', keywords: '', minutes: 250 },
    { strategy: 1, plans: 'www', keywords: '', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P10', gender: 'f', started: 'experiment', trend: null, disruption: 'Spring break',
    weeks: [
    { strategy: 1, plans: 'bbbbb', keywords: 'goo', minutes: 0 },
    { strategy: 2, plans: 'bbbb', keywords: 'ogg', minutes: 0 },
    { strategy: 3, plans: 'bgbbb', keywords: 'gg', minutes: 0 },
    { strategy: 3, plans: 'bbbbb', keywords: 'gg', minutes: 0 },
    { strategy: 4, plans: 'bbbbbb', keywords: 'ggo', minutes: 0 },
    { strategy: 3, plans: 'wwwww', keywords: 'bbbb', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P11', gender: 'f', started: 'experiment', trend: 'up', disruption: 'Travel',
    weeks: [
    { strategy: 1, plans: 'bgggb', keywords: 'g', minutes: 190 },
    { strategy: 2, plans: 'ggggbbbbwww', keywords: 'obgbb', minutes: 600 },
    { strategy: 3, plans: 'wwwwwwwwww', keywords: 'bbbbbb', minutes: 0 },
    { strategy: 3, plans: 'wwwwwwwwww', keywords: 'bbbbbb', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P12', gender: 'f', started: 'routine', trend: 'up', disruption: 'Got busy, changed lifestyle, lost gym access',
    weeks: [
    { strategy: 1, plans: 'gobo', keywords: 'gbggggbob', minutes: 190 },
    { strategy: 2, plans: 'obogg', keywords: 'ggbg', minutes: 250 },
    { strategy: 2, plans: 'oggww', keywords: 'bbob', minutes: 190 },
    { strategy: 3, plans: 'wwwwww', keywords: 'bb', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P13', gender: 'f', started: 'experiment', trend: 'up',
    weeks: [
    { strategy: 1, plans: 'obg', keywords: 'ggb', minutes: 120 },
    { strategy: 2, plans: 'gggbgg', keywords: 'g', minutes: 210 },
    { strategy: 2, plans: 'ggggggg', keywords: 'b', minutes: 250 },
    { strategy: 3, plans: 'bbbgbgg', keywords: 'g', minutes: 100 },
    { strategy: 4, plans: 'ggggbwww', keywords: '', minutes: 360 },
    { strategy: 5, plans: 'bbww', keywords: '', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P15', gender: 'f', started: 'routine', trend: null, disruption: 'Travel',
    weeks: [
    { strategy: 1, plans: 'g', keywords: 'gbo', minutes: 60 },
    { strategy: 2, plans: 'ggg', keywords: 'go', minutes: 190 },
    { strategy: 3, plans: 'gbb', keywords: 'g', minutes: 60 },
    { strategy: 4, plans: 'ww', keywords: '', minutes: 0, ongoing: true },
    ],
  },
  {
    id: 'P16', gender: 'm', started: 'routine', trend: 'up', disruption: 'Travel',
    weeks: [
    { strategy: 1, plans: 'ggg', keywords: 'ogb', minutes: 190 },
    { strategy: 1, plans: 'ggg', keywords: 'bb', minutes: 190 },
    { strategy: 1, plans: 'bgb', keywords: 'bb', minutes: 60 },
    { strategy: 3, plans: 'bobwww', keywords: 'ob', minutes: 360 },
    { strategy: 1, plans: 'obb', keywords: 'bb', minutes: 250 },
    { strategy: 1, plans: 'bog', keywords: 'go', minutes: 190 },
    { strategy: 1, plans: 'gww', keywords: '', minutes: 60, ongoing: true },
    ],
  },
  {
    id: 'P17', gender: 'f', started: 'routine', trend: 'up', disruption: 'Birthday',
    weeks: [
    { strategy: 1, plans: 'ggggg', keywords: 'ggg', minutes: 150 },
    { strategy: 2, plans: 'gggggg', keywords: 'ggo', minutes: 200 },
    { strategy: 2, plans: 'gggggg', keywords: 'go', minutes: 200 },
    { strategy: 3, plans: 'gggggg', keywords: 'gb', minutes: 200 },
    { strategy: 3, plans: 'gggggg', keywords: 'gb', minutes: 200 },
    { strategy: 3, plans: 'ggwwww', keywords: 'gg', minutes: 60, ongoing: true },
    ],
  },
];
