export interface Publication {
  id: string;
  displayId?: string;
  hideDisplayId?: boolean;
  title: string;
  authors: string[];
  conference: string;
  year: number;
  doi?: string;
  publicationDate?: string;
  scholarId?: string;
  scholarUrl?: string;
  status?: string;
  abstract?: string;
  tags?: string[];
  image?: string;
  methodology?: string;
  keyFindings?: string[];
  bibtex?: string;
}

export interface Project {
  id: string;
  title: string;
  period: string;
  description: string[];
  tags?: string[];
  collaboration?: string;
  image?: string;
  role?: string;
  involvement?: 'lead' | 'collaborator';
  paperUrl?: string;
}

export const personalInfo = {
  name: "Kefan Xu",
  role: "PhD Student in Human-Centered Computing",
  school: "Georgia Institute of Technology",
  advisor: "Dr. Rosa I. Arriaga",
  location: "Atlanta, GA, U.S.",
  about: `I am a PhD student in Human-Centered Computing at Georgia Tech, advised by Dr. Rosa I. Arriaga. My research lies at the intersection of HCI, Health Informatics, and Personal Informatics. I investigate how to support individuals with chronic conditions and their caregivers through the design of novel sensing systems and reflection mechanisms.`,
  vision: {
    title: "Research Vision",
    content: [
      "My research focuses on bridging the gap between clinical requirements and the lived experiences of patients with chronic conditions. I believe that effective health technologies must be grounded in a deep understanding of users' everyday lives.",
      "I am particularly interested in how we can leverage ubiquitous computing and sensing technologies to create 'Ecological Informatics'—systems that capture and present health data in ways that are meaningful and actionable for both patients and clinicians within their specific contexts."
    ]
  },
  social: {
    github: "https://github.com/kefanxu",
    scholar: "https://scholar.google.com/citations?user=ocdZFbwAAAAJ&hl=en",
    linkedin: "https://www.linkedin.com/in/kefan-xu-8a8b2b1b3/",
    email: "mailto:kefan.xu@gatech.edu"
  }
};

export const publicationEnrichments: Publication[] = [
  {
    id: "chi2026",
    title:
      "Human-centered Perspectives on a Clinical Decision Support System for Intensive Outpatient Veteran PTSD Care",
    authors: ["Cynthia M Baseman", "Myeonghan Ryu", "Nathaniel Swinger", "Kefan Xu", "Andrew M Sherrill", "Rosa I Arriaga"],
    conference: "CHI2026",
    displayId: "CHI2026",
    year: 2026,
  },
  {
    id: "chi2025-workshop",
    title: "Facilitating Individuals' Sensemaking about Sedentary Behavior via Contextualized Data",
    authors: ["Kefan Xu", "Rosa I Arriaga"],
    conference: "CHI2025 Workshop",
    displayId: "CHI2025",
    year: 2025,
  },
  {
    id: "master-thesis-2021",
    title:
      "Examining the Effect of Historical Planning Records on People's Planning and Execution of Subsequent Daily Physical Exercise",
    authors: ["Kefan Xu"],
    conference: "Master Thesis",
    hideDisplayId: true,
    year: 2021,
  },
  {
    id: "cscw2025",
    title: "Understanding the Temporality of Informal Caregivers' Sense-Making on Conflicts and Life-Changing Events through Online Health Communities",
    authors: ["Kefan Xu", "Cynthia M. Baseman", "Nathaniel Swinger", "Myeonghan Ryu", "Rosa I. Arriaga"],
    conference: "CSCW 2025",
    year: 2025,
    doi: "https://doi.org/10.1145/3757519",
    tags: ["Caregiving", "Online Health Communities", "Sense-Making"],
    abstract: "Informal caregivers play a crucial role in caring for family members with chronic diseases. Their mental health can be adversely affected by life-changing events, such as a patient's diagnosis or care transitions, leading to interpersonal and intrapersonal conflicts, disorientation, and escalating malaise. This study qualitatively analyzes data from online health communities to investigate caregivers' experiences with these conflicts and events. Conflicts are categorized using a psychodynamic framework, and the interplay between life-changing events and conflicts is examined to understand caregivers' sense-making and conflict mediation decisions. The study also finds that online health communities support caregivers by helping them interpret and navigate conflicts and by raising awareness of the temporal resolution of life-changing events. The paper concludes with a discussion on designing online health communities to better support caregivers in these practices.",
    methodology: "Qualitative analysis of online health community forum posts, focusing on temporal patterns and conflict narratives.",
    keyFindings: [
      "Caregivers' sense-making evolves distinctly through pre-, peri-, and post-event phases.",
      "Online communities serve as a vital 'temporal anchor' for navigating long-term care trajectories.",
      "Peer support helps mediate both interpersonal (family) and intrapersonal (self) conflicts."
    ],
    bibtex: `@article{Xu2025Caregivers,
  author = {Xu, Kefan and Baseman, Cynthia M. and Swinger, Nathaniel and Ryu, Myeonghan and Arriaga, Rosa I.},
  title = {Understanding the Temporality of Informal Caregivers' Sense-Making on Conflicts and Life-Changing Events through Online Health Communities},
  journal = {Proceedings of the ACM on Human-Computer Interaction},
  volume = {9},
  number = {CSCW},
  year = {2025},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  doi = {10.1145/3757519}
}`
  },
  {
    id: "dis2025",
    title: "Explainable AI for Daily Scenarios from End-Users' Perspective: Non-Use, Concerns, and Ideal Design",
    authors: ["Lingqing Wang", "Chidimma Lois Anyi", "Kefan Xu", "Yifan Liu", "Rosa I. Arriaga", "Ashok K. Goel"],
    conference: "DIS 2025",
    year: 2025,
    doi: "https://doi.org/10.1145/3715336.3735796",
    tags: ["XAI", "End-Users", "Design"],
    abstract: "Centering humans in explainable artificial intelligence (XAI) research has primarily focused on AI model development and high-stake scenarios. However, as AI becomes increasingly integrated into everyday applications in often opaque ways, the need for explainability tailored to end-users has grown more urgent. To address this gap, we explore end-users' perspectives on embedding XAI into daily AI application scenarios. Our findings reveal that XAI is not naturally accepted by end-users in their daily lives. When users seek explanations, they envision XAI design that promotes contextualized understanding, empowers adoption and adaption to AI systems, and considers multistakeholders' values. We further discuss supporting users' agency in XAI non-use and alternatives to XAI for managing ambiguity in AI interactions. Additionally, we provide design implications for XAI design at personal and societal levels.",
    methodology: "User study with N=87 participants exploring reactions to XAI in everyday scenarios.",
    keyFindings: [
      "Comprehensibility is the top priority for end-users over technical accuracy.",
      "Contrastive explanations (why P and not Q) often negatively impact user trust in daily contexts.",
      "Users desire a 'reverse engineering' approach where XAI aligns with their personal goals rather than model logic."
    ],
    bibtex: `@inproceedings{Wang2025Explainable,
  author = {Wang, Lingqing and Anyi, Chidimma Lois and Xu, Kefan and Liu, Yifan and Arriaga, Rosa I. and Goel, Ashok K.},
  title = {Explainable AI for Daily Scenarios from End-Users' Perspective: Non-Use, Concerns, and Ideal Design},
  booktitle = {Proceedings of the 2025 Designing Interactive Systems Conference},
  series = {DIS '25},
  year = {2025},
  location = {Stuttgart, Germany},
  pages = {2328--2349},
  numpages = {22},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  doi = {10.1145/3715336.3735796}
}`
  },
  {
    id: "chi2024",
    title: "Understanding the Effect of Reflective Iteration on Individuals' Physical Activity Planning",
    authors: ["Kefan Xu", "Xinghui Yan", "Myeonghan Ryu", "Mark W. Newman", "Rosa I. Arriaga"],
    conference: "CHI 2024",
    year: 2024,
    doi: "https://doi.org/10.1145/3613904.3641937",
    tags: ["Physical Activity", "Planning", "Reflection"],
    abstract: "Many people do not get enough physical activity. Establishing routines to incorporate physical activity into people's daily lives is known to be effective, but many people struggle to establish and maintain routines when facing disruptions. In this paper, we build on prior self-experimentation work to assist people in establishing or improving physical activity routines using a framework we call 'reflective iteration.' This framework encourages individuals to articulate, reflect upon, and iterate on high-level 'strategies' that inform their day-to-day physical activity plans. We designed and deployed a mobile application, Planneregy, that implements this framework. Sixteen U.S. college students used the Planneregy app for 42 days to reflectively iterate on their weekly physical exercise routines. Based on an analysis of usage data and interviews, we found that the reflective iteration approach has the potential to help people find and maintain effective physical activity routines, even in the face of life changes and temporary disruptions.",
    methodology: "42-day field deployment of 'Planneregy' app with N=16 participants, combined with semi-structured interviews.",
    keyFindings: [
      "Reflective iteration helps individuals separate high-level strategies from day-to-day execution.",
      "Iterating on plans allows users to adapt to life disruptions without abandoning their goals.",
      "The framework supports the formation of sustainable physical activity routines by turning failures into learning opportunities."
    ],
    bibtex: `@inproceedings{Xu2024Reflective,
  author = {Xu, Kefan and Yan, Xinghui and Ryu, Myeonghan and Newman, Mark W. and Arriaga, Rosa I.},
  title = {Understanding the Effect of Reflective Iteration on Individuals' Physical Activity Planning},
  booktitle = {Proceedings of the CHI Conference on Human Factors in Computing Systems},
  series = {CHI '24},
  year = {2024},
  location = {Honolulu, HI, USA},
  articleno = {Article 647},
  numpages = {17},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  doi = {10.1145/3613904.3641937}
}`
  },
  {
    id: "cscw2024",
    title: "Using Sensor-Captured Patient-Generated Data to Support Clinical Decisionmaking in PTSD Therapy",
    authors: ["Hayley I. Evans", "Myeonghan Ryu", "Theresa Hsieh", "Jiawei Zhou", "Kefan Xu", "Kenneth W. Akers", "Andrew M. Sherrill", "Rosa I. Arriaga"],
    conference: "CSCW 2024",
    year: 2024,
    doi: "https://doi.org/10.1145/3637426",
    tags: ["PTSD", "Clinical Decision Support", "Sensors"],
    abstract: "We investigate the use of sensor-captured patient-generated data (PGD) in PTSD therapy. The study reveals how such data can support clinical decision-making by providing objective insights into patient progress and symptom fluctuations.",
    methodology: "Concept testing with N=10 clinicians using a 'Clinician Homework Review' (CHR) interface visualizing sensor data.",
    keyFindings: [
      "Sensor data provides 'situated objectivity' that complements patient self-reports.",
      "Clinicians assign 'perceived reference weight' to data based on its context and source.",
      "Objective sensor metrics can reveal symptom fluctuations that patients might forget or underreport."
    ],
    bibtex: `@article{Evans2024Sensor,
  author = {Evans, Hayley I. and Ryu, Myeonghan and Hsieh, Theresa and Zhou, Jiawei and Xu, Kefan and Akers, Kenneth W. and Sherrill, Andrew M. and Arriaga, Rosa I.},
  title = {Using Sensor-Captured Patient-Generated Data to Support Clinical Decisionmaking in PTSD Therapy},
  journal = {Proceedings of the ACM on Human-Computer Interaction},
  volume = {8},
  number = {CSCW1},
  year = {2024},
  articleno = {Article 143},
  numpages = {28},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  doi = {10.1145/3637426}
}`
  },
  {
    id: "chi2022",
    title: "Understanding People's Experience for Physical Activity Planning and Exploring the Impact of Historical Records on Plan Creation and Execution",
    authors: ["Kefan Xu", "Xinghui Yan", "Mark W. Newman"],
    conference: "CHI 2022",
    year: 2022,
    doi: "https://doi.org/10.1145/3491102.3501997",
    tags: ["Physical Activity", "Historical Data", "Planning"],
    abstract: "Making and executing physical activity plans can help people improve their physical activity levels. However, little is known about how people make physical activity plans in everyday settings and how people can be assisted in creating more successful plans. In this paper, we developed and deployed a mobile app as a probe to investigate the in-the-wild physical activity planning experience for 28 days with 17 participants. Additionally, we explored the impact of presenting successful and unsuccessful planning records on participants' planning behaviors. Based on interviews before, during, and after the deployment, we offer a description of what factors participants considered to fit their exercise plans into their existing routines, as well as factors leading to plan failures and dissatisfaction with planned physical activity. With access to historical records, participants derived insights to improve their plans, including trends in successes and failures.",
    methodology: "28-day in-the-wild study with N=17 participants using a planning probe app.",
    keyFindings: [
      "Reviewing historical records helps users identify personal patterns of success and failure.",
      "Successful planning requires finding a 'fit' within existing daily routines.",
      "Visualizing past data shifts user focus from outcome goals to process improvements."
    ],
    bibtex: `@inproceedings{Xu2022Understanding,
  author = {Xu, Kefan and Yan, Xinghui (Erica) and Newman, Mark W.},
  title = {Understanding People's Experience for Physical Activity Planning and Exploring the Impact of Historical Records on Plan Creation and Execution},
  booktitle = {Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems},
  series = {CHI '22},
  year = {2022},
  location = {New Orleans, LA, USA},
  articleno = {Article 232},
  numpages = {15},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  doi = {10.1145/3491102.3501997}
}`
  }
];

export const projects: Project[] = [
  {
    id: "ducss",
    title: "Diabetes Ubiquitous Computational Sensing System (DUCSS)",
    period: "2022 - Present",
    collaboration: "Emory University & Grady Memorial Hospital",
    description: [
      "Designing user studies to understand diabetes self-management challenges.",
      "Studying collaboration and caregiving in diabetes management.",
      "Leading the development of sensing and mobile technologies to support patients."
    ],
    tags: ["Health Informatics", "Diabetes", "Sensing"],
    role: "Lead Researcher",
    involvement: "lead"
  },
  {
    id: "sedentary",
    title: "Understanding Individual's Sense Making in Contextual Situated Sedentary Behavior Data",
    period: "2022 - Present",
    collaboration: "Georgia Tech",
    description: [
      "Designing studies of how people interpret their physical activity data.",
      "Evaluating sensors for capturing physical activity and its context.",
      "Adapting experience sampling methods to collect contextual annotations."
    ],
    tags: ["Sense-Making", "Data Viz", "Activity Tracking"],
    role: "Co-Investigator",
    involvement: "lead"
  },
  {
    id: "pecss",
    title: "Prolonged Exposure Collective Sensing System (PECSS)",
    period: "2022 - 2025",
    collaboration: "Georgia Tech × Emory",
    description: [
      "Investigated patients' experiences of PTSD treatment.",
      "Studied the clinical procedures of Prolonged Exposure therapy.",
      "Designed and implemented clinician tools for patient management.",
      "Developed patient-facing tools for therapy and communication."
    ],
    tags: ["Mental Health", "Clinical Tools", "PTSD"],
    role: "UX Researcher & Developer",
    involvement: "collaborator"
  },
  {
    id: "caregiving-reddit",
    title: "Understanding the Temporality of Informal Caregivers' Sense-Making on Conflicts and Life-Changing Events through Online Health Communities",
    period: "2021 - 2023",
    collaboration: "Georgia Tech",
    description: [
      "First-authored the study and contributed across its four-phase qualitative analysis.",
      "Helped analyze 427 posts from 118 informal caregivers across five undisclosed general caregiving subreddits.",
      "Contributed to analysis of 888 comments from threads that described both conflicts and life-changing events.",
      "Developed design implications for supporting caregivers' temporal sense-making in online communities."
    ],
    tags: ["Caregiving", "Social Computing", "Qualitative Analysis"],
    role: "First Author & Researcher",
    involvement: "lead",
    paperUrl: "https://doi.org/10.1145/3757519"
  },
  {
    id: "reflective-iteration",
    title: "Understanding the Effect of Reflective Iteration on Individuals' Physical Activity Planning",
    period: "2021 - 2022",
    collaboration: "Georgia Tech × University of Michigan",
    description: [
      "Implemented the reflective-iteration framework in the Planneregy iOS app.",
      "Built participant and researcher workflows for planning, reporting, reflection, and data-driven interviews.",
      "Managed TestFlight distribution and contributed to a 42-day deployment completed by 16 participants.",
      "Contributed to analysis of 48 strategies, 203 keyword instances, and 434 activity plans."
    ],
    tags: ["Physical Activity", "Reflection", "Mobile App"],
    role: "Lead Researcher",
    involvement: "lead",
    paperUrl: "https://doi.org/10.1145/3613904.3641937"
  },
  {
    id: "historical-planning",
    title: "Understanding People's Experience for Physical Activity Planning and Exploring the Impact of Historical Records on Plan Creation and Execution",
    period: "2021 - 2022",
    collaboration: "University of Michigan",
    description: [
      "Developed two versions of the Physicify iOS research probe.",
      "Designed historical summaries, calendar views, and record details for reviewing prior plans in context.",
      "Designed a two-phase study comparing planning without and with historical records.",
      "Contributed to a 28-day field study completed by 17 participants, covering 248 reported plans."
    ],
    tags: ["Personal Informatics", "Planning", "iOS"],
    role: "Lead Researcher",
    involvement: "lead",
    paperUrl: "https://doi.org/10.1145/3491102.3501997"
  },
  {
    id: "moodloop",
    title: "Moodloop: Beyond a Number",
    period: "2026 - Present",
    collaboration: "Georgia Institute of Technology",
    description: [
      "Designed Moodloop's interface and user flow in Figma, including configurable reporting scales and contextual annotations.",
      "Created a researcher-facing companion app for reviewing reporting histories before interviews.",
      "Refined the research experience through pilot testing and contributed to a six-week field deployment.",
      "Contributed to thematic analysis of how participants constructed, calibrated, and contextualized numerical reports."
    ],
    tags: ["Personal Informatics", "Mental Health", "Interaction Design", "Qualitative Research"],
    role: "Research & Product Design",
    involvement: "lead"
  },
  {
    id: "carework",
    title: "CareWork: An AI-Assisted Dashboard for Between-Session Care",
    period: "Current research",
    collaboration: "Georgia Institute of Technology",
    description: [
      "Developed the HomeWork framework for a coherent create-evaluate-iterate care cycle.",
      "Designed an AI-assisted clinician dashboard for task creation, evaluation, and revision.",
      "Conducted formative interviews and a prototype-based evaluation with healthcare professionals."
    ],
    tags: ["Clinical Informatics", "Human-Centered AI", "Interaction Design"],
    role: "Researcher & System Designer",
    involvement: "lead"
  },
  {
    id: "ecocare",
    title: "EcoCare: AI-Assisted Sense-Making Across the Care Ecology",
    period: "2026 - Present",
    collaboration: "Georgia Institute of Technology",
    description: [
      "Proposing an interactive visualization of chronic diabetes care across ecological layers.",
      "Designing an AI assistant that explains how life-changing events may affect connected care practices.",
      "Planning a mixed-methods study with patients, caregivers, and clinicians."
    ],
    tags: ["Health Informatics", "Human-Centered AI", "Data Visualization"],
    role: "Researcher & System Designer",
    involvement: "lead"
  }
];

export const skills = {
  research: [
    "Interviews", "Co-Design", "Thematic Analysis", "Contextual Inquiry",
    "Focus Group", "Usability Evaluation", "Affinity Mapping",
    "Prototyping", "Interaction Design"
  ],
  tools: [
    "Unity", "Git", "Figma", "Adobe Creative Suite", "Tableau", "NVivo"
  ],
  languages: [
    "Python", "Java", "C++", "C#", "Swift", "HTML/CSS/JS", 
    "React Native", "R", "MySQL", "d3.js"
  ]
};

export interface MethodologyStage {
  id: string;
  label: string;
  blurb: string;
  methods: string[];
  tools: string[];
  exampleProjectId: string;
  exampleNote: string;
}

export const methodology: MethodologyStage[] = [
  {
    id: "design",
    label: "Design",
    blurb:
      "I start in the field—interviews, contextual inquiry, and co-design sessions that surface what people actually need. Findings become structured insight through thematic analysis and affinity mapping, then tangible interaction concepts clinicians and participants can react to early.",
    methods: [
      "Interviews",
      "Contextual Inquiry",
      "Co-Design",
      "Thematic Analysis",
      "Affinity Mapping",
      "Prototyping",
    ],
    tools: ["Figma", "NVivo"],
    exampleProjectId: "pecss",
    exampleNote: "PECSS — clinician and patient-facing tools for Prolonged Exposure therapy",
  },
  {
    id: "develop",
    label: "Develop",
    blurb:
      "I turn validated concepts into working systems—mobile apps, sensing pipelines, and dashboards built for the environments where people live and work. Engineering choices follow from field constraints, not the other way around.",
    methods: ["Prototyping", "Interaction Design"],
    tools: ["Swift", "React Native", "Python", "Unity", "Git"],
    exampleProjectId: "historical-planning",
    exampleNote: "Physicify — iOS app for exercise planning with historical data",
  },
  {
    id: "deploy",
    label: "Deploy",
    blurb:
      "Systems leave the lab through staged rollouts, field pilots, and study infrastructure that keeps participants supported. I measure impact through usability studies, longitudinal fieldwork, and peer-reviewed dissemination that closes the research loop.",
    methods: ["Usability Evaluation", "Contextual Inquiry"],
    tools: ["TestFlight", "Tableau", "R", "MySQL"],
    exampleProjectId: "reflective-iteration",
    exampleNote:
      "Planneregy — TestFlight deployment, 42-day field study; Caregiving Reddit — CSCW 2025",
  },
];
