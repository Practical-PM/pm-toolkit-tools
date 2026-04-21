import { useMemo, useState } from 'react';
import {
  Button,
  PageLayout,
  Slider,
  TabBar,
  Tile,
  Tooltip,
  TitleBar,
  WelcomeBanner,
} from '@toolkit-pm/design-system/components';
import { deriveMetrics, formatCurrency, formatNumber } from './utils/calculations';
import { defaultInputs } from './utils/defaultData';
import BreakEvenChart from './components/BreakEvenChart';
import UnitWaterfall from './components/UnitWaterfall';
import MarginHealth from './components/MarginHealth';
import './UnitEconomics.css';

const VIEWS = [
  { id: 'breakeven', label: 'Break-even', icon: '⚖️' },
  { id: 'waterfall', label: 'Unit P&L', icon: '💧' },
  { id: 'margin', label: 'Margin Health', icon: '📊' },
];

const EXPLAINERS = {
  breakeven:
    'Shows the number of customers needed before total revenue exceeds total costs. Below the crossing point, the business loses money each month. Above it, every additional customer adds to profit.',
  waterfall:
    'Breaks down the economics of a single customer — from the income they generate, through the variable cost to serve them, down to their contribution after accounting for a share of fixed costs.',
  margin:
    'Shows how healthy your gross margin is as a percentage, and how your monthly P&L looks at three customer counts: break-even, today, and double your current base.',
};

const INPUT_META = {
  fixedCosts: {
    label: 'Monthly Costs',
    tooltip: 'All costs that stay the same regardless of how many customers you have — e.g. salaries, office rent, software subscriptions, insurance, and accountancy fees.',
    min: 0, max: 500000, step: 500,
  },
  arpu: {
    label: 'Monthly Income Per Customer',
    tooltip: 'The average amount each paying customer generates per month. For subscriptions, use your plan price. For usage-based products, use the average monthly spend per active customer.',
    min: 1, max: 5000, step: 1,
  },
  cogs: {
    label: 'Variable Cost Per Customer',
    tooltip: 'Costs that rise with every additional customer — e.g. payment processing fees (typically 1–3%), cloud hosting per user, third-party API calls, or customer support hours.',
    min: 0, max: 2000, step: 1,
  },
  customerCount: {
    label: 'Current Customer Count',
    tooltip: 'Your current number of active paying customers. This anchors the monthly P&L snapshot and is shown on the break-even chart.',
    min: 0, max: 100000, step: 1,
  },
};

function MetricCard({ label, value, sub, highlight, warn }) {
  return (
    <div className={`ue-metric-card ds-surface-card ${highlight ? 'ue-metric-card--highlight' : ''} ${warn ? 'ue-metric-card--warn' : ''}`}>
      <p className="ue-metric-label ds-type">{label}</p>
      <p className="ue-metric-value">{value}</p>
      {sub && <p className="ue-metric-sub ds-type">{sub}</p>}
    </div>
  );
}

function InputRow({ fieldKey, inputs, onChange }) {
  const meta = INPUT_META[fieldKey];
  const value = inputs[fieldKey];

  const handleSlider = (e) => onChange(fieldKey, Number(e.target.value));
  const handleNumber = (e) => {
    const n = Number(e.target.value);
    if (!Number.isNaN(n)) onChange(fieldKey, n);
  };

  return (
    <div className="ue-input-row">
      <div className="ue-input-header">
        <span className="ue-input-label ds-type">
          {meta.label}
          <Tooltip content={meta.tooltip} position="top">
            <span className="ue-tooltip-icon" aria-hidden="true">ℹ</span>
          </Tooltip>
        </span>
        <input
          type="number"
          className="ue-number-input"
          value={value}
          min={meta.min}
          max={meta.max}
          step={meta.step}
          onChange={handleNumber}
        />
      </div>
      <Slider
        min={meta.min}
        max={meta.max}
        step={meta.step}
        value={value}
        onChange={handleSlider}
      />
    </div>
  );
}

export default function UnitEconomics() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [activeView, setActiveView] = useState('breakeven');
  const [showWelcome, setShowWelcome] = useState(true);

  const derived = useMemo(() => deriveMetrics(inputs), [inputs]);

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setShowWelcome(false);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all inputs to default values?')) return;
    setInputs(defaultInputs);
    setShowWelcome(true);
  };

  const isProfitable = derived.monthlyPnL >= 0;
  const hasBadMargin = derived.grossMarginPerCustomer <= 0;

  return (
    <PageLayout>
      <TitleBar
        title="Unit Economics"
        actions={
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
        }
      />

      {showWelcome && (
        <WelcomeBanner
          title="Understand the economics of a single customer"
          description="Adjust your monthly costs, pricing, and variable costs to see how each variable shapes your break-even point and monthly P&L."
          actionLabel="Start with example values"
          onAction={() => setShowWelcome(false)}
        />
      )}

      <div className="ue-layout">
        {/* Left: Inputs */}
        <Tile className="ue-inputs-panel">
          <h3 className="ue-panel-title ds-type">Inputs</h3>
          <div className="ue-inputs-list">
            {Object.keys(INPUT_META).map((key) => (
              <InputRow key={key} fieldKey={key} inputs={inputs} onChange={handleChange} />
            ))}
          </div>
        </Tile>

        {/* Right: Summary + Visualisation */}
        <div className="ue-right-panel">
          {/* Summary metrics */}
          <div className="ue-metrics-grid">
            <MetricCard
              label="Gross Margin / Customer"
              value={formatCurrency(derived.grossMarginPerCustomer)}
              sub={`${formatNumber(derived.grossMarginPct, 0)}% of income`}
              warn={hasBadMargin}
            />
            <MetricCard
              label="Break-even Customers"
              value={Number.isFinite(derived.breakEvenCustomers) ? Math.ceil(derived.breakEvenCustomers).toLocaleString() : '—'}
              sub={`You have ${inputs.customerCount.toLocaleString()}`}
              highlight={inputs.customerCount >= Math.ceil(derived.breakEvenCustomers)}
            />
            <MetricCard
              label="Monthly P&L"
              value={formatCurrency(derived.monthlyPnL)}
              sub={isProfitable ? '✓ Profitable' : '✗ Loss-making'}
              highlight={isProfitable}
              warn={!isProfitable && !hasBadMargin}
            />
            <MetricCard
              label="Monthly Contribution"
              value={formatCurrency(derived.monthlyContribution)}
              sub="Gross margin × customers"
            />
          </div>

          {/* Visualisation tabs */}
          <Tile className="ue-viz-tile">
            <TabBar
              className="ue-viz-tabs"
              tabs={VIEWS.map((v) => ({
                id: v.id,
                label: <span className="ue-tab-label"><span className="ue-tab-icon">{v.icon}</span>{v.label}</span>,
              }))}
              activeTab={activeView}
              onTabChange={setActiveView}
            />

            <p className="ue-viz-explainer ds-type">{EXPLAINERS[activeView]}</p>

            <div className="ue-viz-body">
              {activeView === 'breakeven' && (
                <BreakEvenChart inputs={inputs} derived={derived} />
              )}
              {activeView === 'waterfall' && (
                <UnitWaterfall inputs={inputs} derived={derived} />
              )}
              {activeView === 'margin' && (
                <MarginHealth inputs={inputs} derived={derived} />
              )}
            </div>
          </Tile>

          {/* Narrative summary */}
          <Tile className="ue-narrative ds-surface-card">
            <h4 className="ds-type">Model Summary</h4>
            <p className="ds-type">
              At <strong>£{inputs.arpu}/month</strong> per customer with <strong>£{inputs.cogs}</strong> variable costs,
              each customer generates a gross margin of{' '}
              <strong style={{ color: hasBadMargin ? 'var(--error)' : 'var(--success)' }}>
                {formatCurrency(derived.grossMarginPerCustomer)} ({formatNumber(derived.grossMarginPct, 0)}%)
              </strong>.{' '}
              {Number.isFinite(derived.breakEvenCustomers) ? (
                <>
                  You need <strong>{Math.ceil(derived.breakEvenCustomers).toLocaleString()} customers</strong> to cover
                  your <strong>£{inputs.fixedCosts.toLocaleString()}/month</strong> in fixed costs.
                  {' '}With <strong>{inputs.customerCount.toLocaleString()}</strong> customers today, you're{' '}
                  {inputs.customerCount >= Math.ceil(derived.breakEvenCustomers)
                    ? <strong style={{ color: 'var(--success)' }}>generating a profit of {formatCurrency(derived.monthlyPnL)}/month</strong>
                    : <strong style={{ color: 'var(--error)' }}>making a loss of {formatCurrency(Math.abs(derived.monthlyPnL))}/month — {Math.ceil(derived.breakEvenCustomers) - inputs.customerCount} more customers needed to break even</strong>
                  }.
                </>
              ) : (
                ' Variable costs exceed income per customer — fixed costs can never be recovered at this margin. Revisit your pricing or reduce variable costs.'
              )}
            </p>
          </Tile>
        </div>
      </div>
    </PageLayout>
  );
}
