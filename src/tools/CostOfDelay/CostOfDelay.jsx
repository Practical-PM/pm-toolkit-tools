import { useEffect, useMemo, useState } from 'react';
import {
  PageLayout,
  Tile,
  TitleBar,
  Button,
  FormField,
  DataTable,
  ChartContainer,
} from '@toolkit-pm/design-system/components';
import {
  applyScenario,
  roundCurrency,
  safeNumber,
  withDerivedEconomics,
} from './utils/calculations';
import { clearCostOfDelayState, loadCostOfDelayState, saveCostOfDelayState } from './utils/storage';
import { defaultToolState } from './utils/defaultData';
import CostOfDelayChart from './components/CostOfDelayChart';
import './CostOfDelay.css';
import './components/CostOfDelayChart.css';

const scenarioOptions = [
  { value: 'conservative', label: 'Conservative' },
  { value: 'expected', label: 'Expected' },
  { value: 'aggressive', label: 'Aggressive' },
];

const sortOptions = [
  { value: 'wsjfScore', label: 'WSJF Score' },
  { value: 'selectedCostOfDelayWeekly', label: 'Weekly CoD' },
  { value: 'selectedCostOfDelayMonthly', label: 'Monthly CoD' },
  { value: 'name', label: 'Name' },
];

function newFeatureTemplate(nextId) {
  return {
    id: nextId,
    name: '',
    revenuePotential: 100000,
    timeToMarketWeeks: 8,
    durationWeeks: 4,
    urgencyFactor: 1,
    riskFactor: 1,
    confidence: 0.85,
  };
}

function formatCurrency(value) {
  return `$${roundCurrency(value).toLocaleString()}`;
}

function CostOfDelay() {
  const persisted = loadCostOfDelayState();
  const [features, setFeatures] = useState(persisted?.features || defaultToolState.features);
  const [formulaMode, setFormulaMode] = useState(persisted?.formulaMode || defaultToolState.formulaMode);
  const [weeksDelayed, setWeeksDelayed] = useState(persisted?.weeksDelayed || defaultToolState.weeksDelayed);
  const [scenario, setScenario] = useState(persisted?.scenario || defaultToolState.scenario);
  const [sortBy, setSortBy] = useState('wsjfScore');
  const [sortDir, setSortDir] = useState('desc');
  const [nextId, setNextId] = useState(Math.max(0, ...features.map((f) => f.id)) + 1);
  const [draftFeature, setDraftFeature] = useState(newFeatureTemplate(nextId));
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    saveCostOfDelayState({ features, formulaMode, weeksDelayed, scenario });
  }, [features, formulaMode, weeksDelayed, scenario]);

  useEffect(() => {
    setDraftFeature((prev) => ({ ...prev, id: nextId }));
  }, [nextId]);

  const enrichedFeatures = useMemo(() => {
    const derived = withDerivedEconomics(features, formulaMode);
    const sorted = [...derived].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortBy === 'name') {
        const result = String(aValue).localeCompare(String(bValue));
        return sortDir === 'asc' ? result : -result;
      }
      const result = safeNumber(aValue) - safeNumber(bValue);
      return sortDir === 'asc' ? result : -result;
    });
    return sorted;
  }, [features, formulaMode, sortBy, sortDir]);

  const totalWeeklyCod = useMemo(
    () =>
      enrichedFeatures.reduce((sum, feature) => sum + feature.selectedCostOfDelayWeekly, 0),
    [enrichedFeatures]
  );

  const totalAccumulatedCost = totalWeeklyCod * weeksDelayed;

  const onChangeDraft = (field) => (event) => {
    const value = field === 'name' ? event.target.value : Number(event.target.value);
    setDraftFeature((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    if (!draftFeature.name.trim()) {
      setErrorMessage('Feature name is required.');
      return;
    }
    if (draftFeature.durationWeeks <= 0 || draftFeature.timeToMarketWeeks <= 0) {
      setErrorMessage('Duration and time-to-market must be greater than zero.');
      return;
    }
    setErrorMessage('');
    setFeatures((prev) => [...prev, { ...draftFeature, name: draftFeature.name.trim() }]);
    setNextId((prev) => prev + 1);
    setDraftFeature(newFeatureTemplate(nextId + 1));
  };

  const handleDeleteFeature = (row) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== row.id));
  };

  const handleEditFeature = (row) => {
    setDraftFeature({
      id: row.id,
      name: row.name,
      revenuePotential: row.revenuePotential,
      timeToMarketWeeks: row.timeToMarketWeeks,
      durationWeeks: row.durationWeeks,
      urgencyFactor: row.urgencyFactor,
      riskFactor: row.riskFactor,
      confidence: row.confidence,
    });
    setFeatures((prev) => prev.filter((feature) => feature.id !== row.id));
  };

  const handleApplyScenario = () => {
    setFeatures((prev) => applyScenario(prev, scenario));
  };

  const handleLoadExamples = () => {
    setFeatures(defaultToolState.features);
    setFormulaMode(defaultToolState.formulaMode);
    setWeeksDelayed(defaultToolState.weeksDelayed);
    setScenario(defaultToolState.scenario);
    setNextId(Math.max(...defaultToolState.features.map((f) => f.id)) + 1);
    setDraftFeature(newFeatureTemplate(Math.max(...defaultToolState.features.map((f) => f.id)) + 1));
    setErrorMessage('');
  };

  const handleReset = () => {
    if (!window.confirm('Reset all Cost of Delay data?')) return;
    clearCostOfDelayState();
    setFeatures([]);
    setFormulaMode('adjusted');
    setWeeksDelayed(8);
    setScenario('expected');
    setNextId(1);
    setDraftFeature(newFeatureTemplate(1));
    setErrorMessage('');
  };

  const columns = [
    { key: 'name', label: 'Feature' },
    {
      key: 'selectedCostOfDelayWeekly',
      label: 'Weekly CoD',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'selectedCostOfDelayMonthly',
      label: 'Monthly CoD',
      render: (value) => formatCurrency(value),
    },
    { key: 'durationWeeks', label: 'Duration (weeks)' },
    {
      key: 'wsjfScore',
      label: 'WSJF',
      render: (value) => Number(value).toFixed(2),
    },
  ];

  return (
    <PageLayout>
      <TitleBar
        title="Cost of Delay"
        actions={
          <>
            <Button variant="secondary" onClick={handleLoadExamples}>
              Load Example Data
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset
            </Button>
          </>
        }
      />

      <Tile className="cod-value-banner">
        <p className="cod-kicker">Managing Upwards Value</p>
        <h2>Quantify urgency with financial impact, not opinion</h2>
        <p>
          Delaying high-impact features creates measurable loss each week. Use Cost of Delay and WSJF
          to prioritize work with strongest economic return.
        </p>
        <div className="cod-mode-toggle">
          <Button
            variant={formulaMode === 'simple' ? 'primary' : 'secondary'}
            onClick={() => setFormulaMode('simple')}
          >
            Simple Formula
          </Button>
          <Button
            variant={formulaMode === 'adjusted' ? 'primary' : 'secondary'}
            onClick={() => setFormulaMode('adjusted')}
          >
            Urgency-adjusted
          </Button>
        </div>
      </Tile>

      <Tile>
        <div className="cod-controls-grid">
          <FormField
            label="Delay Window (Weeks)"
            type="range"
            min={1}
            max={26}
            step={1}
            value={weeksDelayed}
            onChange={(e) => setWeeksDelayed(Number(e.target.value))}
            hint={`Current: ${weeksDelayed} weeks`}
          />
          <FormField
            label="Scenario"
            type="select"
            options={scenarioOptions}
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            hint="Adjust urgency/risk multipliers in one click."
          />
          <div className="cod-scenario-actions">
            <Button variant="secondary" onClick={handleApplyScenario}>
              Apply Scenario
            </Button>
            <p>
              Total weekly CoD: <strong>{formatCurrency(totalWeeklyCod)}</strong><br />
              {weeksDelayed}-week impact: <strong>{formatCurrency(totalAccumulatedCost)}</strong>
            </p>
          </div>
        </div>
      </Tile>

      <Tile>
        <h3>Add or edit a feature</h3>
        <div className="cod-add-form">
          <FormField label="Feature Name" value={draftFeature.name} onChange={onChangeDraft('name')} />
          <FormField
            label="Revenue Potential ($)"
            type="number"
            value={draftFeature.revenuePotential}
            onChange={onChangeDraft('revenuePotential')}
            min={0}
            step={1000}
          />
          <FormField
            label="Time to Market (weeks)"
            type="number"
            value={draftFeature.timeToMarketWeeks}
            onChange={onChangeDraft('timeToMarketWeeks')}
            min={1}
            step={1}
          />
          <FormField
            label="Duration (weeks)"
            type="number"
            value={draftFeature.durationWeeks}
            onChange={onChangeDraft('durationWeeks')}
            min={1}
            step={1}
          />
          <FormField
            label="Urgency Factor"
            type="number"
            value={draftFeature.urgencyFactor}
            onChange={onChangeDraft('urgencyFactor')}
            min={0}
            step={0.05}
          />
          <FormField
            label="Risk Factor"
            type="number"
            value={draftFeature.riskFactor}
            onChange={onChangeDraft('riskFactor')}
            min={0}
            step={0.05}
          />
          <FormField
            label="Confidence (0-1)"
            type="number"
            value={draftFeature.confidence}
            onChange={onChangeDraft('confidence')}
            min={0}
            max={1}
            step={0.05}
          />
          <div className="cod-add-action">
            <Button variant="add" onClick={handleAddFeature}>
              Add Feature
            </Button>
            {errorMessage && <p className="cod-error">{errorMessage}</p>}
          </div>
        </div>
      </Tile>

      <ChartContainer
        title="Accumulated Cost Over Time"
        isEmpty={enrichedFeatures.length === 0}
        emptyMessage="Add at least one feature to visualize delay impact."
      >
        <CostOfDelayChart
          features={enrichedFeatures.slice(0, 6)}
          weeksDelayed={weeksDelayed}
          formulaMode={formulaMode}
        />
      </ChartContainer>

      <Tile>
        <div className="cod-table-header">
          <h3>Feature Comparison and WSJF Ranking</h3>
          <div className="cod-sort-controls">
            <FormField
              label="Sort By"
              type="select"
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
            <FormField
              label="Direction"
              type="select"
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' },
              ]}
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={enrichedFeatures.map((feature, index) => ({ ...feature, rank: index + 1 }))}
          onEdit={handleEditFeature}
          onDelete={handleDeleteFeature}
          emptyMessage="No features added yet."
          emptyIcon="💸"
        />
      </Tile>
    </PageLayout>
  );
}

export default CostOfDelay;
