const WEEKS_PER_MONTH = 4.345;

export function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function roundCurrency(value) {
  return Math.round(safeNumber(value, 0));
}

export function computeFeatureEconomics(feature) {
  const revenuePotential = Math.max(0, safeNumber(feature.revenuePotential));
  const timeToMarketWeeks = Math.max(1, safeNumber(feature.timeToMarketWeeks, 1));
  const durationWeeks = Math.max(1, safeNumber(feature.durationWeeks, 1));
  const urgencyFactor = Math.max(0, safeNumber(feature.urgencyFactor, 1));
  const riskFactor = Math.max(0, safeNumber(feature.riskFactor, 1));
  const confidence = Math.min(1, Math.max(0, safeNumber(feature.confidence, 1)));

  const costOfDelayWeekly = revenuePotential / timeToMarketWeeks;
  const costOfDelayMonthly = costOfDelayWeekly * WEEKS_PER_MONTH;

  const costOfDelayAdjustedWeekly = costOfDelayWeekly * urgencyFactor * riskFactor * confidence;
  const costOfDelayAdjustedMonthly = costOfDelayAdjustedWeekly * WEEKS_PER_MONTH;

  return {
    ...feature,
    revenuePotential,
    timeToMarketWeeks,
    durationWeeks,
    urgencyFactor,
    riskFactor,
    confidence,
    costOfDelayWeekly,
    costOfDelayMonthly,
    costOfDelayAdjustedWeekly,
    costOfDelayAdjustedMonthly,
  };
}

export function withDerivedEconomics(features, formulaMode = 'simple') {
  const enhanced = features.map((feature) => computeFeatureEconomics(feature));

  return enhanced
    .map((feature) => {
      const selectedWeekly =
        formulaMode === 'adjusted' ? feature.costOfDelayAdjustedWeekly : feature.costOfDelayWeekly;

      return {
        ...feature,
        selectedCostOfDelayWeekly: selectedWeekly,
        selectedCostOfDelayMonthly: selectedWeekly * WEEKS_PER_MONTH,
        wsjfScore: selectedWeekly / Math.max(1, feature.durationWeeks),
      };
    })
    .sort((a, b) => {
      if (b.wsjfScore !== a.wsjfScore) return b.wsjfScore - a.wsjfScore;
      return b.selectedCostOfDelayWeekly - a.selectedCostOfDelayWeekly;
    });
}

export function accumulatedDelayCost(feature, weeksDelayed, formulaMode = 'simple') {
  const economics = computeFeatureEconomics(feature);
  const selectedWeekly =
    formulaMode === 'adjusted' ? economics.costOfDelayAdjustedWeekly : economics.costOfDelayWeekly;
  return Math.max(0, safeNumber(weeksDelayed)) * selectedWeekly;
}

export function scenarioToMultipliers(scenario) {
  switch (scenario) {
    case 'conservative':
      return { urgencyMultiplier: 0.9, riskMultiplier: 0.9 };
    case 'aggressive':
      return { urgencyMultiplier: 1.2, riskMultiplier: 1.15 };
    case 'expected':
    default:
      return { urgencyMultiplier: 1, riskMultiplier: 1 };
  }
}

export function applyScenario(features, scenario) {
  const { urgencyMultiplier, riskMultiplier } = scenarioToMultipliers(scenario);
  return features.map((feature) => ({
    ...feature,
    urgencyFactor: roundTo(feature.urgencyFactor * urgencyMultiplier, 2),
    riskFactor: roundTo(feature.riskFactor * riskMultiplier, 2),
  }));
}

export function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
