import { trackya } from './projects/trackya';
import { moodloop } from './projects/moodloop';
import { carework } from './projects/carework';
import { planneregy } from './projects/planneregy';
import { physicify } from './projects/physicify';
import { ecocare } from './projects/ecocare';
import type { Project } from './types';

/** Order here is the order on the home page and in next/previous links. */
export const projects: Project[] = [trackya, moodloop, carework, planneregy, ecocare, physicify];

export const projectBySlug = (slug: string) => projects.find(project => project.slug === slug);
