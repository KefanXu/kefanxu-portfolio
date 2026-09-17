import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import './ResearchPractice.css';

const practices = [
  {
    name: 'Design',
    description: 'Translate interviews, contextual inquiry, and co-design into interfaces that address patient and clinician needs.',
    tools: ['Interaction design', 'Prototyping', 'Figma'],
    project: 'PECSS', id: 'pecss',
    evidence: 'Designed clinician tools for patient management and patient-facing tools for therapy and communication.',
  },
  {
    name: 'Development',
    description: 'Implement research systems, from mobile applications to sensing and data interfaces.',
    tools: ['Swift', 'React Native', 'Python'],
    project: 'Physicify', id: 'historical-planning',
    evidence: 'Developed an iOS application for physical activity planning and reviewing historical planning records.',
  },
  {
    name: 'Deployment',
    description: 'Deploy functioning systems and evaluate their use through longitudinal field studies and interviews.',
    tools: ['TestFlight', 'Field studies', 'Usability evaluation'],
    project: 'Planneregy', id: 'reflective-iteration',
    evidence: 'Deployed through TestFlight and evaluated in a 42-day field study with 16 participants.',
  },
];

export function ResearchPractice() {
  const reducedMotion = useReducedMotion();
  return <section id="practice" className="practice-section section-shell" aria-labelledby="practice-title">
    <div className="practice-heading">
      <div>
        <p className="eyebrow">04 / Research practice</p>
        <h2 className="section-heading" id="practice-title">From insight<br />to <em>everyday use.</em></h2>
      </div>
      <p>I develop research tools and evaluate them in the settings where they are used.</p>
    </div>

    <div className="practice-sequence">
      {practices.map(({ name, description, tools, project, id, evidence }, index) => <motion.article
        key={name}
        className="practice-row"
        aria-labelledby={`practice-stage-${id}`}
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .15 }}
        transition={{ duration: .5, ease: [.22, 1, .36, 1] }}
      >
        <div className="practice-stage">
          <span className="practice-number" aria-hidden="true">0{index + 1}</span>
          <h3 id={`practice-stage-${id}`}>{name}</h3>
        </div>
        <div className="practice-methods">
          <p className="practice-description">{description}</p>
          <ul className="practice-tools" aria-label={`${name} methods and tools`}>
            {tools.map(tool => <li key={tool}>{tool}</li>)}
          </ul>
        </div>
        <div className="practice-evidence">
          <p className="practice-evidence-label eyebrow">In practice</p>
          <a href={`#project/${id}`} className="practice-project-link">{project}<ArrowUpRight size={18} aria-hidden="true" /></a>
          <p className="practice-evidence-description">{evidence}</p>
        </div>
      </motion.article>)}
    </div>
  </section>;
}
