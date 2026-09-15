import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import cvPdf from '../../assets/KefanXu_CV.pdf';
import './About.css';

const education = [
  { period: '2022 — Present', degree: 'Ph.D. in Computer Science', school: 'Georgia Institute of Technology' },
  { period: '2019 — 2021', degree: 'M.S. in Information Science', school: 'University of Michigan' },
  { period: '2015 — 2019', degree: 'B.S. in Data Science & Interactive Media Arts', school: 'New York University' },
];

export function About() {
  const reducedMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  return (
    <section id="about" className="biography section-shell" aria-labelledby="about-title">
      <motion.div className="biography-copy" initial={reducedMotion ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.9, ease }}>
        <p className="eyebrow">01 / ABOUT</p>
        <h2 id="about-title">Kefan Xu</h2>
        <p>I am a PhD student in Human-Centered Computing at Georgia Tech, advised by Dr. Rosa I. Arriaga. I design and study sensing systems and reflection tools for people with chronic conditions and their caregivers.</p>
        <a className="text-link" href={cvPdf} target="_blank" rel="noopener noreferrer">Curriculum vitae <ArrowUpRight size={16} aria-hidden="true" /></a>
      </motion.div>
      <div className="biography-education">
        <h3 className="eyebrow">EDUCATION</h3>
        <ol>
          {education.map((item, index) => (
            <motion.li key={item.period} initial={reducedMotion ? false : { opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: index * 0.1, ease }}>
              <span className="biography-period">{item.period}</span>
              <div><p className="biography-degree">{item.degree}</p><p className="biography-school">{item.school}</p></div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
