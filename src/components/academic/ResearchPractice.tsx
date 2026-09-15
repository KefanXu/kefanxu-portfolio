import { useId, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import './ResearchPractice.css';

type SculptureKind = 'design' | 'development' | 'deployment';

function PracticeSculpture({ kind }: { kind: SculptureKind }) {
  const figure = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const id = `practice-${useId().replace(/:/g, '')}`;
  const { scrollYProgress } = useScroll({ target: figure, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: .6 });
  const firstRotation = useTransform(progress, [0, .48, 1], [-11, 0, 12]);
  const secondRotation = useTransform(progress, [0, .48, 1], [13, 0, -10]);
  const orbitRotation = useTransform(progress, [0, .48, 1], [-22, 0, 24]);
  const firstX = useTransform(progress, [0, .48, 1], [-20, 0, 16]);
  const secondX = useTransform(progress, [0, .48, 1], [22, 0, -14]);
  const firstY = useTransform(progress, [0, .48, 1], [15, 0, -17]);
  const secondY = useTransform(progress, [0, .48, 1], [-18, 0, 13]);
  const threadOpacity = useTransform(progress, [0, .27, .75, 1], [.25, .85, .85, .5]);
  const paint = (name: string) => `url(#${id}-${name})`;
  const leading = reduce ? undefined : { x: firstX, y: firstY, rotate: firstRotation };
  const following = reduce ? undefined : { x: secondX, y: secondY, rotate: secondRotation };
  const orbit = reduce ? undefined : { rotate: orbitRotation };

  return <div ref={figure} className={`practice-figure practice-figure--${kind}`} aria-hidden="true">
    <motion.svg className="practice-sculpture" viewBox="0 0 320 268" fill="none" initial={reduce ? false : { opacity: 0, scale: .94, y: 14 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}>
      <defs>
        <linearGradient id={`${id}-ivory`} x1=".15" y1=".03" x2=".88" y2=".97" gradientUnits="objectBoundingBox"><stop stopColor="#fffef8" /><stop offset=".32" stopColor="#efebdf" /><stop offset=".72" stopColor="#ddd9cc" /><stop offset="1" stopColor="#bec5b5" /></linearGradient>
        <linearGradient id={`${id}-ivory-edge`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d2cdbc" /><stop offset=".5" stopColor="#b8beb0" /><stop offset="1" stopColor="#edf0e4" /></linearGradient>
        <linearGradient id={`${id}-sheet`} x1=".1" y1=".1" x2=".9" y2=".9"><stop stopColor="#fffef8" /><stop offset=".36" stopColor="#e8e5d8" /><stop offset=".56" stopColor="#f4f1e7" /><stop offset="1" stopColor="#c2c9b7" /></linearGradient>
        <radialGradient id={`${id}-teal`} cx=".3" cy=".22" r=".85"><stop stopColor="#739187" /><stop offset=".36" stopColor="#52796e" /><stop offset=".75" stopColor="#315f55" /><stop offset="1" stopColor="#234d45" /></radialGradient>
        <radialGradient id={`${id}-sage`} cx=".28" cy=".2" r=".84"><stop stopColor="#e0e5d2" /><stop offset=".45" stopColor="#bcc7aa" /><stop offset=".8" stopColor="#9baa8d" /><stop offset="1" stopColor="#7e947d" /></radialGradient>
        <radialGradient id={`${id}-pearl`} cx=".28" cy=".22" r=".83"><stop stopColor="#fffef8" /><stop offset=".4" stopColor="#ebe7d9" /><stop offset=".77" stopColor="#d2d5c4" /><stop offset="1" stopColor="#b8c1ad" /></radialGradient>
        <linearGradient id={`${id}-thread`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7b9987" /><stop offset=".42" stopColor="#365f52" /><stop offset="1" stopColor="#789384" /></linearGradient>
        <filter id={`${id}-shadow`} x="-50%" y="-150%" width="200%" height="400%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id={`${id}-grain`} x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="12" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope=".12" /></feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" result="texture" />
          <feBlend in="SourceGraphic" in2="texture" mode="multiply" />
        </filter>
      </defs>
      <ellipse cx="160" cy="231" rx="95" ry="10" fill="#536a54" opacity=".12" filter={paint('shadow')} />
      {kind === 'design' && <>
        <motion.g className="practice-sculpture-piece" style={leading}>
          <path d="M72 192C53 163 56 117 77 78C93 48 117 37 136 47C151 54 158 69 153 82C128 90 113 109 111 132C109 162 132 185 160 205C126 211 88 214 72 192Z" fill={paint('ivory-edge')} />
          <path d="M67 184C49 153 58 110 77 76C93 48 115 38 132 46C145 52 153 65 151 76C126 86 106 110 105 133C105 161 128 183 154 201C119 207 84 208 67 184Z" fill={paint('ivory')} filter={paint('grain')} />
          <path d="M70 182C53 151 63 104 80 76C91 58 104 47 117 45" stroke="#fffef8" strokeOpacity=".72" strokeWidth="1.2" />
        </motion.g>
        <motion.path style={reduce ? undefined : { opacity: threadOpacity }} d="M63 219C75 240 176 242 222 222C255 207 252 178 224 172C207 167 186 179 184 196" stroke={paint('thread')} strokeWidth="1.5" strokeLinecap="round" />
        <motion.g className="practice-sculpture-piece" style={following}>
          <path d="M119 204C154 180 153 142 174 112C195 82 222 80 241 99C248 106 251 115 250 124C228 128 217 143 215 165C213 188 224 198 244 201C221 216 160 230 119 204Z" fill={paint('ivory-edge')} />
          <path d="M112 198C149 174 148 137 171 107C190 82 216 79 235 95C243 102 247 111 247 119C224 123 210 138 208 160C206 183 219 195 237 197C212 214 152 223 112 198Z" fill={paint('sheet')} filter={paint('grain')} />
          <path d="M114 198C150 172 153 132 172 108C190 85 213 82 232 96" stroke="#fffdf5" strokeOpacity=".7" strokeWidth="1.4" />
        </motion.g>
        <motion.g className="practice-sculpture-piece" style={reduce ? undefined : { x: firstX, y: secondY }}>
          <ellipse cx="178" cy="220" rx="36" ry="6" fill="#526950" opacity=".14" filter={paint('shadow')} />
          <circle cx="178" cy="186" r="34" fill={paint('teal')} filter={paint('grain')} />
          <path d="M153 173C157 164 166 158 176 158" stroke="#a5b9a7" strokeOpacity=".25" strokeWidth="1" />
        </motion.g>
      </>}
      {kind === 'development' && <>
        <motion.path style={reduce ? undefined : { opacity: threadOpacity }} d="M74 219C43 228 50 241 112 240C174 240 256 225 260 201C264 183 244 169 224 173" stroke={paint('thread')} strokeWidth="1.5" strokeLinecap="round" />
        <motion.g className="practice-sculpture-piece" style={leading}>
          <path fillRule="evenodd" d="M82 211C52 191 60 120 94 73C113 47 150 42 171 64C195 92 176 174 147 205C127 228 101 226 82 211ZM104 173C119 191 145 152 151 120C156 91 140 82 127 99C114 117 95 156 104 173Z" fill={paint('ivory')} filter={paint('grain')} />
          <path d="M105 175C122 192 147 151 152 121C157 96 144 84 133 93" stroke="#aeb9a8" strokeOpacity=".55" strokeWidth="2.5" />
          <path d="M85 207C59 189 68 121 100 77C118 54 140 49 158 61" stroke="#fffef8" strokeOpacity=".72" strokeWidth="1.5" />
        </motion.g>
        <motion.g className="practice-sculpture-piece" style={following}>
          <path fillRule="evenodd" d="M169 212C149 194 154 148 173 117C191 88 218 82 235 103C260 132 259 178 243 204C227 229 190 230 169 212ZM190 183C200 197 225 181 226 155C227 135 212 121 201 136C189 153 182 171 190 183Z" fill={paint('teal')} filter={paint('grain')} />
          <path d="M189 184C201 199 228 181 228 155C228 137 216 124 208 128" stroke="#173e36" strokeOpacity=".23" strokeWidth="3" />
          <path d="M163 189C162 168 169 138 180 120C194 98 213 93 225 102" stroke="#b0c2ae" strokeOpacity=".35" strokeWidth="1.2" />
        </motion.g>
        <motion.path className="practice-sculpture-piece" style={reduce ? undefined : { y: firstY, rotate: secondRotation }} d="M103 204C124 183 163 181 189 193C207 201 207 215 192 224C169 237 125 234 110 224C102 219 98 211 103 204Z" fill={paint('sage')} filter={paint('grain')} />
        <motion.path style={reduce ? undefined : { opacity: threadOpacity }} d="M111 128C135 146 157 156 180 153C195 152 205 144 208 137" stroke={paint('thread')} strokeWidth="2" strokeLinecap="round" />
      </>}
      {kind === 'deployment' && <>
        <motion.g className="practice-sculpture-piece" style={orbit}>
          <ellipse cx="158" cy="153" rx="103" ry="43" transform="rotate(-24 158 153)" stroke="#95ab97" strokeWidth="1" opacity=".72" />
          <ellipse cx="158" cy="153" rx="117" ry="63" transform="rotate(15 158 153)" stroke={paint('thread')} strokeWidth="1.25" opacity=".82" />
        </motion.g>
        <motion.g className="practice-sculpture-piece" style={leading}>
          <ellipse cx="156" cy="158" rx="79" ry="43" transform="rotate(-23 156 158)" stroke="#c6ccbb" strokeWidth="21" />
          <ellipse cx="154" cy="153" rx="79" ry="43" transform="rotate(-23 154 153)" stroke={paint('ivory')} strokeWidth="20" filter={paint('grain')} />
          <path d="M78 164C78 142 125 109 166 107C185 105 203 109 214 117" stroke="#fffef8" strokeWidth="1.3" strokeOpacity=".65" />
        </motion.g>
        <motion.g className="practice-sculpture-piece" style={following}>
          <ellipse cx="212" cy="104" rx="28" ry="31" transform="rotate(-18 212 104)" fill={paint('pearl')} filter={paint('grain')} />
        </motion.g>
        <motion.g className="practice-sculpture-piece" style={reduce ? undefined : { x: secondX, y: firstY, rotate: firstRotation }}>
          <ellipse cx="106" cy="207" rx="35" ry="25" transform="rotate(12 106 207)" fill={paint('sage')} filter={paint('grain')} />
        </motion.g>
        <motion.g className="practice-sculpture-piece" style={reduce ? undefined : { x: firstX, y: secondY }}>
          <ellipse cx="187" cy="227" rx="34" ry="7" fill="#536a54" opacity=".14" filter={paint('shadow')} />
          <ellipse cx="186" cy="190" rx="36" ry="39" transform="rotate(-14 186 190)" fill={paint('teal')} filter={paint('grain')} />
        </motion.g>
        <motion.path style={reduce ? undefined : { opacity: threadOpacity }} d="M58 175C51 204 113 230 159 225C202 221 259 194 267 171" stroke={paint('thread')} strokeWidth="1.3" strokeLinecap="round" />
      </>}
    </motion.svg>
  </div>;
}

const practices: { name: string; kind: SculptureKind; description: string; tools: string; project: string; id: string; evidence: string }[] = [
  {
    name: 'Design', kind: 'design',
    description: 'Translate interviews, contextual inquiry, and co-design into interfaces that address patient and clinician needs.',
    tools: 'Interaction design · Prototyping · Figma',
    project: 'PECSS', id: 'pecss',
    evidence: 'Designed clinician tools for patient management and patient-facing tools for therapy and communication.',
  },
  {
    name: 'Development', kind: 'development',
    description: 'Implement research systems, from mobile applications to sensing and data interfaces.',
    tools: 'Swift · React Native · Python',
    project: 'Physicify', id: 'historical-planning',
    evidence: 'Developed an iOS application for physical activity planning and reviewing historical planning records.',
  },
  {
    name: 'Deployment', kind: 'deployment',
    description: 'Deploy functioning systems and evaluate their use through longitudinal field studies and interviews.',
    tools: 'TestFlight · Field studies · Usability evaluation',
    project: 'Planneregy', id: 'reflective-iteration',
    evidence: 'Deployed through TestFlight and evaluated in a 42-day field study with 16 participants.',
  },
];

export function ResearchPractice() {
  const reducedMotion = useReducedMotion();
  return <section id="practice" className="practice-section section-shell" aria-labelledby="practice-title">
    <div className="practice-heading">
      <div><p className="eyebrow">04 / RESEARCH PRACTICE</p><h2 className="section-heading" id="practice-title">Design, development<br />and <em>deployment.</em></h2></div>
      <p>I develop research tools and evaluate them in the settings where they are used.</p>
    </div>
    <div className="practice-grid">
      {practices.map(({ name, kind, description, tools, project, id, evidence }, index) => <motion.article key={name} className="practice-card" initial={reducedMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .8, delay: index * .1, ease: [.22, 1, .36, 1] }}>
        <PracticeSculpture kind={kind} />
        <div className="practice-card-heading"><span>0{index + 1}</span><h3>{name}</h3></div>
        <p className="practice-description">{description}</p>
        <p className="practice-tools">{tools}</p>
        <div className="practice-evidence"><a href={`#project/${id}`} className="text-link practice-project-link">{project}<ArrowUpRight size={15} aria-hidden="true" /></a><p>{evidence}</p></div>
      </motion.article>)}
    </div>
  </section>;
}
