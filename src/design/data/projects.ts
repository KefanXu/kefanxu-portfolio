import { ecocare } from './projects/ecocare';
import { carework } from './projects/carework';
import { trackya } from './projects/trackya';
import { moodloop } from './projects/moodloop';
import { planneregy } from './projects/planneregy';
import { physicify } from './projects/physicify';
import type { Project } from './types';

/** Order here is the order on the home page and in next/previous links. */
export const projects: Project[] = [ecocare, carework, trackya, moodloop, planneregy, physicify];

export const projectBySlug = (slug: string) => projects.find(project => project.slug === slug);
