export const defaultDomains = [
  {
    id: 1,
    name: 'Email Service',
    description: 'Transactional and marketing email delivery',
    x: 1.5,
    y: 2,
  },
  {
    id: 2,
    name: 'Payment Processing',
    description: 'Credit card and payment gateway',
    x: 2,
    y: 7,
  },
  {
    id: 3,
    name: 'Analytics Platform',
    description: 'Product usage tracking and analytics',
    x: 4,
    y: 2,
  },
  {
    id: 4,
    name: 'Core Algorithm',
    description: 'Proprietary recommendation engine',
    x: 7.5,
    y: 8,
  },
  {
    id: 5,
    name: 'Customer Auth',
    description: 'User authentication and session management',
    x: 4.5,
    y: 6,
  },
];

export const quadrants = [
  {
    id: 'commodity',
    name: 'Commodity',
    recommendation: 'Buy or outsource - not differentiating',
    description: 'Low differentiation at any complexity level',
    xMin: 0,
    xMax: 3,
    yMin: 0,
    yMax: 9,
    color: '#e0f2fe', // light blue
  },
  {
    id: 'overhead',
    name: 'Overhead',
    recommendation: 'Tolerate or optimize - necessary but burdensome',
    description: 'High complexity but moderate differentiation',
    xMin: 3,
    xMax: 6,
    yMin: 3,
    yMax: 9,
    color: '#fed7aa', // light orange
  },
  {
    id: 'supporting',
    name: 'Supporting',
    recommendation: 'Build selectively - differentiating but replicable',
    description: 'High differentiation but low complexity',
    xMin: 3,
    xMax: 9,
    yMin: 0,
    yMax: 3,
    color: '#e9d5ff', // light purple
  },
  {
    id: 'core',
    name: 'Core',
    recommendation: 'Invest heavily - strategic competitive advantage',
    description: 'High differentiation and high complexity',
    xMin: 6,
    xMax: 9,
    yMin: 3,
    yMax: 9,
    color: '#d1fae5', // light green
  },
];

export const getQuadrant = (x, y) => {
  return quadrants.find(q => 
    x >= q.xMin && x <= q.xMax && 
    y >= q.yMin && y <= q.yMax
  );
};

