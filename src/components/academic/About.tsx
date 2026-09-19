import { ArrowUpRight } from 'lucide-react';
import cvPdf from '../../assets/KefanXu_CV.pdf';
import { Reveal } from '../../design/components/Reveal';
import { Words } from './Words';
import './About.css';

const education = [
  { period: '2022 — Present', degree: 'Ph.D. in Computer Science', school: 'Georgia Institute of Technology' },
  { period: '2019 — 2021', degree: 'M.S. in Information Science', school: 'University of Michigan' },
  { period: '2015 — 2019', degree: 'B.S. in Data Science & Interactive Media Arts', school: 'New York University' },
];

export function About() {
  return (
    <section id="about" className="biography section-shell" aria-labelledby="about-title">
      <div className="biography-copy">
        <Reveal as="p" kind="fade" className="eyebrow">01 / ABOUT</Reveal>
        <Words as="h2" id="about-title" text="Kefan Xu" />
        <Reveal as="p" delay={160}>I am a PhD student in Human-Centered Computing at Georgia Tech, advised by Dr. Rosa I. Arriaga. I design and study sensing systems and reflection tools for people with chronic conditions and their caregivers.</Reveal>
        <Reveal as="a" kind="fade" delay={320} className="text-link" href={cvPdf} target="_blank" rel="noopener noreferrer">Curriculum vitae <ArrowUpRight size={16} aria-hidden="true" /></Reveal>
      </div>
      <div className="biography-education">
        <Reveal as="h3" kind="fade" className="eyebrow" delay={120}>EDUCATION</Reveal>
        <ol>
          {education.map((item, index) => (
            <Reveal as="li" key={item.period} delay={200 + index * 110}>
              <span className="biography-period">{item.period}</span>
              <div><p className="biography-degree">{item.degree}</p><p className="biography-school">{item.school}</p></div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
