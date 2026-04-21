export const defaultFeatures = [
  {
    id: 1,
    name: 'Checkout Redesign',
    revenuePotential: 300000,
    timeToMarketWeeks: 12,
    durationWeeks: 6,
    urgencyFactor: 1.4,
    riskFactor: 1.2,
    confidence: 0.85,
  },
  {
    id: 2,
    name: 'Onboarding Optimization',
    revenuePotential: 180000,
    timeToMarketWeeks: 10,
    durationWeeks: 4,
    urgencyFactor: 1.2,
    riskFactor: 1.1,
    confidence: 0.9,
  },
  {
    id: 3,
    name: 'Pricing Experiment Engine',
    revenuePotential: 420000,
    timeToMarketWeeks: 20,
    durationWeeks: 8,
    urgencyFactor: 1.1,
    riskFactor: 1.25,
    confidence: 0.75,
  },
];

export const defaultToolState = {
  features: defaultFeatures,
  formulaMode: 'adjusted',
  weeksDelayed: 8,
  scenario: 'expected',
};
