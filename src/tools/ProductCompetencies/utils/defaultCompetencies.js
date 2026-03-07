export const defaultCompetencies = [
  {
    id: 1,
    name: 'Product Discovery',
    description: 'Validating assumptions, running experiments, and learning fast through prototypes and customer research.',
    score: null,
    levelDescriptions: {
      1: 'Rarely validates assumptions before building. Relies primarily on instinct or stakeholder opinions without gathering customer input or data.',
      2: 'Occasionally gathers user feedback through basic surveys or ad-hoc conversations. Struggles with structured research methods or experiment design.',
      3: 'Regularly conducts user interviews and usability tests. Can design and run simple A/B tests. Validates key assumptions before major decisions.',
      4: 'Designs comprehensive discovery processes using multiple research methods. Runs sophisticated experiments. Mentors others on research best practices.',
      5: 'Leads discovery culture across multiple teams. Innovates new research methodologies. Influences organization-wide approaches to product validation and learning.',
    },
  },
  {
    id: 2,
    name: 'Prioritisation and Trade-offs',
    description: 'Making strategic decisions about what to build (and what not to build) based on impact and value.',
    score: null,
    levelDescriptions: {
      1: 'Struggles to prioritize effectively. Often works on low-impact items or gets paralyzed by competing priorities. Says yes to most requests.',
      2: 'Uses basic prioritization frameworks inconsistently. Can identify obvious high-value items but struggles with difficult trade-offs between good options.',
      3: 'Consistently applies frameworks (RICE, value/effort, etc.) to prioritize work. Makes clear trade-offs and can articulate reasoning. Says no when appropriate.',
      4: 'Balances multiple prioritization dimensions (impact, urgency, strategic fit, risk). Helps stakeholders understand trade-offs. Coaches others on prioritization.',
      5: 'Sets prioritization strategy for teams/org. Makes complex portfolio decisions considering dependencies, capacity, and strategic direction. Influences company strategy.',
    },
  },
  {
    id: 3,
    name: 'Technical Fluency',
    description: 'Understanding technical constraints, architecture, and working effectively with engineering teams.',
    score: null,
    levelDescriptions: {
      1: 'Limited understanding of technical concepts. Struggles to communicate with engineers or grasp technical constraints and feasibility.',
      2: 'Understands basic technical concepts and terminology. Can follow technical discussions but needs significant support to assess feasibility or technical debt.',
      3: 'Comfortable discussing technical architecture and trade-offs with engineers. Understands system constraints. Can assess technical feasibility independently.',
      4: 'Deep technical understanding enables productive architecture discussions. Identifies technical opportunities and risks early. Bridges business and technical contexts effectively.',
      5: 'Technical expertise influences engineering standards and architectural decisions. Recognized technical thought leader. Spots innovative technical solutions to product challenges.',
    },
  },
  {
    id: 4,
    name: 'Execution and Delivery',
    description: 'Shipping products on time, managing scope, and driving to outcomes while maintaining quality.',
    score: null,
    levelDescriptions: {
      1: 'Projects frequently miss deadlines or deliver incomplete scope. Struggles with planning, scope management, or identifying and resolving blockers.',
      2: 'Delivers projects with support, though timelines often slip. Can create basic project plans but needs help managing scope changes or coordinating across teams.',
      3: 'Consistently ships high-quality products on time. Proactively manages scope, identifies risks, and removes blockers. Keeps stakeholders informed throughout delivery.',
      4: 'Leads complex multi-team initiatives to successful delivery. Anticipates and mitigates risks. Adapts quickly to changing priorities while maintaining momentum.',
      5: 'Transforms team delivery capabilities and processes. Delivers highly complex, ambiguous initiatives successfully. Sets standards for execution excellence across organization.',
    },
  },
  {
    id: 5,
    name: 'Leadership and Communications',
    description: 'Inspiring teams, driving change, and clearly articulating ideas through written and verbal communication.',
    score: null,
    levelDescriptions: {
      1: 'Communications often unclear or inconsistent. Struggles to build alignment or influence without authority. Team direction unclear.',
      2: 'Can communicate basic ideas but struggles with storytelling or adapting message to audience. Beginning to build influence through one-on-one relationships.',
      3: 'Communicates vision and strategy clearly through multiple formats. Builds strong team alignment. Influences peers and stakeholders effectively.',
      4: 'Inspires teams and drives significant change. Exceptional storyteller who adapts communication style to audience. Mentors others on communication and leadership.',
      5: 'Recognized organizational leader who influences culture and direction. Communications are referenced as exemplars. Develops other leaders. Drives transformational change.',
    },
  },
];

export const MIN_COMPETENCIES = 3;
export const MAX_COMPETENCIES = 15;

export const scoreLevels = [
  { value: 1, label: 'Developing', shortLabel: '1', description: 'Limited experience or capability in this area' },
  { value: 2, label: 'Functional', shortLabel: '2', description: 'Can perform with guidance, still building capability' },
  { value: 3, label: 'Proficient', shortLabel: '3', description: 'Independently capable, meets expectations' },
  { value: 4, label: 'Advanced', shortLabel: '4', description: 'Strong capability, can mentor others, exceeds expectations' },
  { value: 5, label: 'Expert', shortLabel: '5', description: 'Deep mastery, thought leader, sets standards for others' },
];

