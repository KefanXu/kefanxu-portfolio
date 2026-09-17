export interface ProjectFigure {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectVideo {
  youtubeId: string;
  url: string;
  title: string;
  caption: string;
  poster?: string;
}

export interface ProjectFigureSource {
  label: string;
  url: string;
  credit: string;
  license?: { label: string; url: string };
}

export interface ProjectCaseStudy {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  overview: string;
  context: string;
  design: { title: string; description: string }[];
  evidence: { value: string; label: string }[];
  study: string;
  designLabel?: string;
  designHeading?: string;
  studyLabel?: string;
  studyHeading?: string;
  video?: ProjectVideo;
  figures?: ProjectFigure[];
  figureLayout?: 'gallery' | 'editorial';
  figureSource?: ProjectFigureSource;
  placeholder?: { title: string; description: string };
  paper?: { label: string; url: string };
  publicationId?: string;
}

// Detailed presentation supplements the original project records; contribution,
// role, collaboration, and period fields remain sourced from portfolio.ts.
export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    id: 'ducss',
    name: 'DUCSS',
    category: 'Health informatics · Sensing systems',
    subtitle: 'Sensing systems for everyday diabetes care',
    overview: 'Designing sensing systems and mobile technologies to support diabetes self-management.',
    context: 'Diabetes management takes place within everyday routines and relationships. This work investigates patients’ self-management challenges and the collaborative dynamics of caregiving to inform the design of health technologies.',
    design: [
      { title: 'Patient-centered study design', description: 'Designing user studies to understand self-management challenges and the circumstances in which people manage diabetes.' },
      { title: 'Sensing and mobile technologies', description: 'Leading the creation of sensors and mobile technologies that support patients, with attention to caregiving and collaborative management.' },
    ],
    evidence: [{ value: '2022–', label: 'Ongoing research' }, { value: 'Lead', label: 'Research role' }],
    study: 'The project brings together research on self-management, caregiving dynamics, and sensing technology in collaboration with Emory University and Grady Memorial Hospital.',
    video: {
      youtubeId: 'uYy52PRKmug',
      url: 'https://youtu.be/uYy52PRKmug',
      title: 'DUCSS project video',
      caption: 'An overview of DUCSS, a mobile sensing system for diabetic foot health monitoring.',
    },
  },
  {
    id: 'caregiving-reddit',
    name: 'Caregiving',
    category: 'Social computing · Qualitative research',
    subtitle: 'Understanding caregiving through life-changing events',
    overview: 'Studying how informal caregivers make sense of conflicts and life-changing events over time through online health communities.',
    context: 'Family caregiving changes as diagnoses, care transitions, shifts in a patient’s condition, and other life-changing events disrupt what once felt normal. This research follows caregivers’ histories across online communities to examine how conflicts emerge, how expectations change, and how people make decisions while living through those transitions.',
    design: [
      { title: 'Following caregiver histories', description: 'The collection began with one post from each of 118 informal caregivers and followed relevant author histories to preserve the temporal context that a single thread can miss.' },
      { title: 'Four-phase template analysis', description: 'The team combined inductive and deductive coding across four phases, using a psychodynamic conflict framework while refining categories from the data.' },
      { title: 'Designing for temporal sense-making', description: 'The resulting framework shows how online communities can help caregivers interpret and justify feelings, recognize life-changing events, consider decisions, and place the present within a longer trajectory.' },
    ],
    evidence: [
      { value: '427', label: 'Posts analyzed' },
      { value: '888', label: 'Comments analyzed' },
      { value: '118', label: 'Informal caregivers' },
      { value: '5', label: 'Undisclosed subreddits' },
    ],
    study: 'The final corpus contained 427 posts from 118 informal caregivers across five undisclosed general caregiving subreddits. Seventy-eight posts described both conflicts and life-changing events; their threads contributed 888 comments, bringing the analyzed corpus to 1,315 entries. The four-phase template analysis identified six conflict types and eight common life-changing events, then traced how caregivers compared perceived normalcy, present experience, and anticipated futures while making sense of change.',
    figures: [
      { src: 'caregiving-study-process.webp', alt: 'Four-phase caregiving study process, from initial post collection through author-history analysis, conflict and life-changing-event coding, and comment analysis.', caption: 'Four-phase data collection and template analysis, from 118 initial posts to 427 posts and 888 comments.' },
      { src: 'caregiving-temporal-sensemaking-framework.webp', alt: 'Temporal sense-making framework connecting patient conditions, life-changing events, conflicts, perceived normalcy, present experience, anticipated futures, caregiver decisions, and online-community support.', caption: 'A temporal sense-making framework for understanding conflicts, life-changing events, decisions, and support across a caregiving trajectory.' },
    ],
    figureSource: {
      label: 'Figures 1–2 · Xu et al., CSCW 2025',
      url: 'https://doi.org/10.1145/3757519',
      credit: 'Adapted from the published figures; extracted and converted to WebP.',
      license: { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    },
    paper: { label: 'Read the CSCW 2025 paper', url: 'https://doi.org/10.1145/3757519' },
    publicationId: 'cscw2025',
  },
  {
    id: 'reflective-iteration',
    name: 'Planneregy',
    category: 'Personal informatics · Mobile health',
    subtitle: 'Reflectively iterating on physical activity routines',
    overview: 'Designing, building, and deploying an iOS app that helps people plan, track, reflect on, and revise weekly physical activity strategies.',
    context: 'Physical activity plans can stop fitting when schedules, health, travel, or other circumstances change. Planneregy operationalizes reflective iteration as a weekly loop: people create seven days of activity plans, bundle them into a named strategy described with keywords, report daily outcomes, and reflect before continuing, revisiting, or replacing that strategy.',
    designLabel: '02 / System design',
    designHeading: 'A weekly loop from plans to self-knowledge',
    design: [
      { title: 'Plan as a strategy', description: 'People specify activities by type, date, and time; view them beside calendar and weather context; then summarize the week with their own keywords and a strategy name.' },
      { title: 'Track lived outcomes', description: 'Daily reports distinguish activities completed as planned, completed differently, or not completed, while preserving unplanned activity and contextual details.' },
      { title: 'Reflect, then revise', description: 'On day seven, people mark strategy keywords helpful or unhelpful, rate overall satisfaction from 1–7, and choose to continue, return to a previous strategy, or start a new one.' },
    ],
    evidence: [
      { value: '42', label: 'Days in the field' },
      { value: '16', label: 'Participants who completed' },
      { value: '48', label: 'Distinct strategies' },
      { value: '434', label: 'Activity plans created' },
    ],
    studyLabel: '03 / Study & findings',
    studyHeading: 'Learning what works as life changes',
    study: 'Seventeen U.S. college students were recruited and one withdrew after the initial interview, leaving 16 participants in the 42-day deployment. Participants completed six weekly questionnaires and attended an initial interview, an unrecorded week-three check-in, and an exit interview. Researchers paired in-vivo thematic analysis of interview transcripts with app records through data-driven retrospective interviews. Participants created 48 distinct strategies, 203 keyword instances, and 434 activity plans. Ten of 16 encountered life changes or temporary disruptions, and 11 changed strategy after their first week. The findings suggest that named strategies and high-level reflection helped participants unpack routines, update self-knowledge, and revise plans as circumstances changed.',
    figures: [
      { src: 'planneregy-planning-sequence.webp', alt: 'Four Planneregy phone screens showing a participant specifying eight exercise plans, choosing descriptive keywords, naming a strategy, and beginning daily tracking.', caption: 'From plans to strategy: P7 scheduled eight activities, summarized them with five keywords, named the strategy, and began tracking.' },
      { src: 'planneregy-weekly-workflow.webp', alt: 'Sixteen Planneregy screens showing the weekly planning, daily tracking and reporting, and day-seven reflection flow.', caption: 'The full reflective-iteration loop: plan and name a strategy, report activity outcomes, evaluate its attributes, then continue, revisit, or replace it.' },
      { src: 'planneregy-strategy-overview.webp', alt: 'Study visualization mapping 16 participants’ weekly strategies, physical activity plans, keyword evaluations, and reported disruptions across six weeks.', caption: 'Across the deployment, 16 participants created 48 distinct strategies, 203 keyword instances, and 434 physical activity plans.' },
      { src: 'planneregy-interview-method.webp', alt: 'Diagram showing participant screen sharing and the researcher version of Planneregy used to tailor retrospective interview questions from app records.', caption: 'Data-driven retrospective interviews connected participants’ narratives to their planning, reporting, and reflection records.' },
    ],
    figureLayout: 'editorial',
    figureSource: {
      label: 'Figures 1–4 · Xu et al., CHI 2024',
      url: 'https://doi.org/10.1145/3613904.3641937',
      credit: 'Figures 1–3 were extracted from the published paper; the planning sequence was exported from the author-supplied Figma source and cross-checked against Figure 4. Converted to WebP.',
      license: { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    },
    paper: { label: 'Read the CHI 2024 paper', url: 'https://doi.org/10.1145/3613904.3641937' },
    publicationId: 'chi2024',
  },
  {
    id: 'sedentary',
    name: 'Trackya',
    category: 'Personal informatics · Contextual sensing',
    subtitle: 'Making sense of activity data in context',
    overview: 'Investigating how contextual information can help people interpret physical activity data and identify sedentary behavior.',
    context: 'Similar step-count patterns can correspond to very different activities. This research explores how contextual information and self-reports can make those differences visible and support more situated interpretations of tracking data.',
    design: [
      { title: 'Contextualized tracking views', description: 'The related MotionShift design proposes day and week views that connect step counts with contextual information and calendar events.' },
      { title: 'Reporting and reflection', description: 'The proposed interface lets people annotate activities, fill gaps in their records, and review weekly summaries. The design is documented in the 2025 workshop paper.' },
    ],
    evidence: [{ value: 'Mobile', label: 'Proposed system' }, { value: '2025', label: 'Workshop paper' }],
    study: 'The workshop paper presents a proposed system and study plan. The figure shown here documents that proposed MotionShift interface; it does not represent a completed deployment or reported outcome.',
    figures: [{ src: 'motionshift-proposed-design.webp', alt: 'Five proposed MotionShift phone interfaces showing activity reporting, record completion, day view, week view, and summary.', caption: 'Proposed MotionShift design: reporting, contextual activity views, and reflection.' }],
    figureSource: { label: 'Figure 1 · Xu & Arriaga, 2025', url: 'https://arxiv.org/html/2509.19420v1', credit: 'Original figure, converted to WebP.', license: { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' } },
    paper: { label: 'Read the workshop paper', url: 'https://arxiv.org/abs/2509.19420' },
    publicationId: 'chi2025-workshop',
  },
  {
    id: 'pecss',
    name: 'PECSS',
    category: 'Mental health · Clinical interfaces',
    subtitle: 'Interfaces for Prolonged Exposure therapy',
    overview: 'Designing and implementing tools that support clinicians and patients throughout Prolonged Exposure therapy for PTSD.',
    context: 'Therapy extends beyond the clinical session. This project investigates treatment practices and clinical workflows, and develops patient-facing and clinician-facing tools to support therapy and communication.',
    design: [
      { title: 'Tools grounded in clinical practice', description: 'Studied PTSD treatment experiences and Prolonged Exposure procedures to inform tools for patient management, therapy, and communication.' },
      { title: 'The Clinician Homework Review', description: 'The related CHR prototype presents sensor-data similarity measures and detailed comparisons, allowing clinicians to examine therapeutic exercise data alongside patient self-reports.' },
    ],
    evidence: [{ value: '10', label: 'Clinicians in CHR study' }, { value: 'CSCW', label: 'Published in 2024' }],
    study: 'The published CHR study used a Figma prototype with mock data in concept-testing sessions with ten clinicians. The figures show the team’s research prototype, rather than real patient records or a deployed clinical product.',
    figures: [
      { src: 'pecss-overview.webp', alt: 'CHR prototype overview showing a composite similarity score and expandable sensor-data categories.', caption: 'Overview of collected data streams.' },
      { src: 'pecss-comparison.webp', alt: 'CHR prototype comparing heart-rate data across therapeutic sessions.', caption: 'Comparison across sessions.' },
      { src: 'pecss-session.webp', alt: 'CHR prototype displaying noise levels and physical activity for a selected session.', caption: 'A closer look at an individual session.' },
    ],
    figureSource: { label: 'Figure 1 · Evans et al., CSCW 2024', url: 'https://jiaweizhou.me/assets/cscw24_sensor_ptsd.pdf', credit: 'Panels extracted from the published figure and converted to WebP.', license: { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' } },
    paper: { label: 'Read the CSCW 2024 paper', url: 'https://doi.org/10.1145/3637426' },
    publicationId: 'cscw2024',
  },
  {
    id: 'historical-planning',
    name: 'Physicify',
    category: 'Personal informatics · iOS application',
    subtitle: 'Planning physical activity with the benefit of hindsight',
    overview: 'An iOS research probe examining how historical planning records shape physical activity planning and execution.',
    context: 'A plan depends on more than intention: routines, anticipated energy, nearby events, and unexpected interruptions can determine whether exercise fits into the day. Physicify examined everyday planning first without historical reference, then with a record of prior plans and their context.',
    design: [
      { title: 'Two iOS research probes', description: 'Physicify 1 supported planning and daily reporting. Physicify 2 added historical summaries, calendar views, and record details so participants could revisit earlier plans while making a new one.' },
      { title: 'History in context', description: 'The app grouped completed and uncompleted plans by weather, activity type, weekday, and time, and placed color-coded outcomes beside weather, temperature, and anonymized Google Calendar events.' },
      { title: 'Planning through comparison', description: 'When participants chose a date, activity, or time, Physicify highlighted similar records and exposed the outcome and stated reason behind a selected plan.' },
    ],
    evidence: [
      { value: '28', label: 'Days in the field' },
      { value: '17', label: 'Completing participants' },
      { value: '248', label: 'Plans reported' },
      { value: '3', label: 'Interviews per participant' },
    ],
    study: 'Twenty participants enrolled and 17 completed a 28-day exploratory field study. They used Physicify 1 for 14 days without historical reference, then Physicify 2 for 14 days with their prior planning records, completing a semi-structured interview at baseline and after each phase. Across both phases they made and reported 248 plans—136 in phase one and 112 in phase two—and followed 183 as planned, with a 70.4% average completion rate. Historical records helped participants identify patterns and adjust planning strategies; the exploratory design does not establish that access to history improved adherence.',
    figures: [
      { src: 'physicify-history-summary.png', alt: 'Physicify planning-history screen summarizing completed and uncompleted plans across weather, activity type, weekday, and time.', caption: 'Historical summaries exposed patterns across weather, activity type, weekday, and time.' },
      { src: 'physicify-calendar-planning.png', alt: 'Physicify calendar screen connecting color-coded planning outcomes with weather, anonymized schedule events, and a future planning action.', caption: 'The calendar connected color-coded plan outcomes with weather, schedules, and future planning.' },
      { src: 'physicify-record-detail.png', alt: 'Physicify record-detail screen showing an uncompleted plan, its stated reason, weather, temperature, and adjacent calendar events.', caption: 'A selected record preserved its outcome, stated reason, conditions, and surrounding events.' },
    ],
    figureSource: {
      label: 'Physicify interface studies · author source',
      url: 'https://www.figma.com/design/F5hIMzRhYagDBnYZWBBh0z/Experiment-Design?node-id=2739-83',
      credit: 'Exported from the author-supplied Figma design source and optimized for the web.',
    },
    paper: { label: 'Read the CHI 2022 paper', url: 'https://doi.org/10.1145/3491102.3501997' },
    publicationId: 'chi2022',
  },
  {
    id: 'moodloop',
    name: 'Moodloop',
    category: 'Personal informatics · Mental-state reporting',
    subtitle: 'Making numerical reports meaningful over time',
    overview: 'A cross-platform research probe for studying how people translate complex mental states into numbers, adapt their reporting scales, and preserve the context behind each score.',
    context: 'A single number can compress a subtle, mixed, and situated experience. Moodloop examines how people establish personal meanings for numerical values, recalibrate those meanings over time, and recover the circumstances behind a report when they reflect on it later.',
    design: [
      { title: 'Reporting on a personal scale', description: 'Participants could report with a slider or direct numeric entry, choose common scales, define custom ranges and steps, and revisit their scale every seven days.' },
      { title: 'Context for later reflection', description: 'Six optional annotation modes—images, video, audio, tags, descriptions, and drawings—connected scores to lived experience, while calendar, history, and researcher views supported longitudinal reflection.' },
    ],
    evidence: [
      { value: '42', label: 'Days in the field' },
      { value: '15', label: 'Completing participants' },
      { value: '45', label: 'Valid interviews' },
      { value: '594', label: 'Reports in study windows' },
    ],
    study: 'The six-week deployment began with three weeks of numerical reporting and continued with three weeks in which participants could add annotations. Fifteen participants completed three interviews each. The study found that people constructed personal anchors for scores, balanced expressive detail against reporting effort when choosing scale granularity, and used annotations as part of reasoning during both reporting and later reflection.',
    video: {
      youtubeId: 'otqw3gwkwbE',
      url: 'https://youtu.be/otqw3gwkwbE',
      title: 'Moodloop project film',
      caption: 'A 2:29 overview of Moodloop’s configurable mental-state reporting, contextual annotations, reflection views, and interview-based study.',
      poster: 'moodloop-video-poster.jpg',
    },
    figures: [
      { src: 'moodloop-phone.svg', alt: 'Moodloop phone interface showing a personal 1-to-30 reflection scale, a reporting calendar, and the next reflection date.', caption: 'A configurable reflection scale and longitudinal reporting calendar.' },
      { src: 'moodloop-study.png', alt: 'Diagram of the six-week Moodloop study, with three weeks of numerical reporting, three weeks with annotations, and three participant interviews.', caption: 'The six-week deployment and three-stage interview study.' },
    ],
  },
  {
    id: 'carework',
    name: 'CareWork',
    category: 'Clinical informatics · Human-centered AI',
    subtitle: 'Keeping care coherent between visits',
    overview: 'An AI-assisted clinician dashboard that connects clinical goals, patient-reported evidence, evaluation, and care-plan revision across visits.',
    context: 'Between-session care begins in a clinical visit, continues through patients’ everyday practices, and returns at follow-up. CareWork treats that work as one recurring process so an assignment can preserve the relationship between a care goal, its tasks, the resulting patient-generated data, the clinician’s evaluation, and the next revision.',
    designLabel: '02 / System design',
    designHeading: 'From a care goal to the next assignment',
    design: [
      { title: 'Create, evaluate, iterate', description: 'The HomeWork framework structures between-session care as a recurring cycle. Clinicians translate a goal into actionable tasks, review task-linked evidence, and revise the assignment for the next care period.' },
      { title: 'AI with clinical oversight', description: 'AI can draft assignments, summarize patient reports, prepare evaluation notes, and propose revisions. Every output remains inspectable and editable, and the clinician initiates, approves, rejects, or changes consequential content.' },
      { title: 'Evidence in context', description: 'Assignment-level briefs provide orientation while task cards retain the original instruction, completion history, exact patient-generated data, and clinician notes needed for closer review.' },
    ],
    evidence: [
      { value: '6', label: 'Formative HCP interviews' },
      { value: '11', label: 'Prototype sessions' },
      { value: '14', label: 'Unique HCP participants' },
      { value: '3', label: 'Connected stages' },
    ],
    studyLabel: '03 / Studies & evidence',
    studyHeading: 'Two studies with healthcare professionals',
    study: 'Six formative interviews characterized between-session care and informed the HomeWork framework. Eleven healthcare professionals then evaluated CareWork in approximately hour-long prototype sessions using fictional cases and three months of AI-synthesized patient-generated data. Participants valued its connected workflow and clinician oversight while identifying workload, privacy, resource, and EHR-integration concerns. The study assessed perceived usefulness in a simulated session; it did not test safety, clinical effectiveness, workload reduction, or patient outcomes.',
    figures: [
      { src: 'carework-create.webp', alt: 'CareWork Create interface with an editable assignment, task cards, an AI-generated draft, and an AI assistant.', caption: 'Create: translate a clinical goal into an editable assignment and care tasks.' },
      { src: 'carework-evaluate.webp', alt: 'CareWork Evaluate interface with an assignment overview, task-linked outcomes, clinician notes, and AI-assisted summaries.', caption: 'Evaluate: move from an assignment overview to task-level evidence and clinician notes.' },
      { src: 'carework-iterate.webp', alt: 'CareWork Iterate interface comparing an earlier assignment with editable AI-suggested modifications.', caption: 'Iterate: inspect the rationale and before-and-after details of proposed changes.' },
    ],
  },
  {
    id: 'ecocare',
    name: 'EcoCare',
    category: 'Health informatics · Human-centered AI',
    subtitle: 'Seeing how life changes ripple through care',
    overview: 'A proposed interactive visualization for helping patients, caregivers, and clinicians examine how life-changing events may reshape chronic diabetes care.',
    context: 'A change in insurance, work, mobility, or caregiving can alter many connected parts of chronic care at once. EcoCare proposes a shared view of that care ecology so different stakeholders can examine its people, practices, technologies, information, and dependencies when considering a coping or treatment decision.',
    designLabel: '02 / Proposed system',
    designHeading: 'A navigable view of the care ecology',
    design: [
      { title: 'Relationships across ecological layers', description: 'The interface maps stakeholders, care components, practices, and information across concentric layers, with distinct flows for data, guidance, feedback, communication, and breaks in those connections.' },
      { title: 'Life-changing events as scenarios', description: 'Users can inspect, move, add, or remove entities and explore how situations such as changing insulin coverage or a caregiver’s surgery may propagate through a simulated diabetes case.' },
      { title: 'AI as a sense-making assistant', description: 'Selected entities, relationships, and the active event become context for an AI assistant grounded in the simulated case, clinical guidance, and prior interviews. The proposal positions AI as support for human reasoning rather than a replacement for it.' },
    ],
    evidence: [
      { value: 'Proposed', label: 'Current study status' },
      { value: '15', label: 'Planned participants' },
      { value: '3', label: 'Stakeholder groups' },
      { value: '22', label: 'Foundational patient interviews' },
    ],
    studyLabel: '03 / Planned study',
    studyHeading: 'A mixed-methods evaluation across stakeholder roles',
    study: 'The proposed study plans individual sessions with five patients, five caregivers, and five clinicians. Each participant would make a baseline decision for a simulated case, interact with EcoCare for another life-changing event, make a second decision, and reflect on the experience. The plan combines the Decisional Conflict Scale and timestamped interaction logs with interviews, screen recordings, and thematic analysis of AI conversations. These are planned methods and expected contributions; the dissertation proposal does not report EcoCare results.',
    figures: [
      { src: 'ecocare-interface.webp', alt: 'EcoCare prototype showing a concentric visualization of a simulated diabetes care ecology beside an AI sense-making assistant.', caption: 'Proposed EcoCare interface: inspect a care ecology and ask about the effects of a life-changing event.' },
    ],
  },
];
