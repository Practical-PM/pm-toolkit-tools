import { formatCurrency } from '../utils/calculations';

const W = 600;
const H = 300;
const BAR_HEIGHT = 40;
const BAR_GAP = 16;
const LABEL_W = 172;
const CHART_LEFT = LABEL_W + 16;
const CHART_W = W - CHART_LEFT - 24;
const START_Y = 24;

const COLORS = {
  revenue: 'var(--chart-orange)',
  cost: 'var(--chart-blue)',
  margin: 'var(--chart-green)',
  net: 'var(--chart-purple)',
};

export default function UnitWaterfall({ inputs, derived }) {
  const { arpu, cogs, customerCount } = inputs;
  const { grossMarginPerCustomer, fixedCostPerCustomer, netPerCustomer } = derived;

  const steps = [
    {
      label: 'Monthly Income',
      description: 'What each customer pays per month',
      value: arpu,
      color: COLORS.revenue,
      isResult: false,
    },
    {
      label: '− Variable Cost',
      description: 'Cost to serve this customer (hosting, fees, support)',
      value: -cogs,
      color: COLORS.cost,
      isResult: false,
    },
    {
      label: '= Gross Margin',
      description: 'Profit before fixed costs are accounted for',
      value: grossMarginPerCustomer,
      color: COLORS.margin,
      isResult: true,
    },
    {
      label: '− Fixed Cost Share',
      description: customerCount > 0
        ? `Monthly costs ÷ ${customerCount.toLocaleString()} customers`
        : 'Monthly costs spread across all customers',
      value: Number.isFinite(fixedCostPerCustomer) ? -fixedCostPerCustomer : null,
      color: COLORS.cost,
      isResult: false,
    },
    {
      label: '= Net Per Customer',
      description: 'Monthly profit or loss attributed to each customer',
      value: Number.isFinite(netPerCustomer) ? netPerCustomer : null,
      color: netPerCustomer >= 0 ? COLORS.net : 'var(--chart-red)',
      isResult: true,
    },
  ];

  const maxAbsVal = Math.max(arpu, Math.abs(netPerCustomer ?? 0), 1);
  const barWidth = (value) =>
    value === null ? 0 : Math.max(2, (Math.abs(value) / maxAbsVal) * CHART_W);

  return (
    <div className="unit-waterfall-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="unit-waterfall-svg"
        aria-label="Unit economics waterfall per customer"
        role="img"
      >
        {steps.map((step, i) => {
          const y = START_Y + i * (BAR_HEIGHT + BAR_GAP);
          const bw = step.value !== null ? barWidth(step.value) : 0;
          const isNeg = step.value !== null && step.value < 0;

          return (
            <g key={step.label}>
              {step.isResult && (
                <line
                  x1={CHART_LEFT - 8} y1={y - BAR_GAP / 2}
                  x2={W - 16} y2={y - BAR_GAP / 2}
                  stroke="var(--border-light)" strokeWidth={1}
                />
              )}

              {/* Row label */}
              <text
                x={LABEL_W} y={y + BAR_HEIGHT / 2 + 4}
                textAnchor="end"
                fontSize={11}
                fontWeight={step.isResult ? '700' : '400'}
                fill={step.isResult ? 'var(--text-primary)' : 'var(--text-secondary)'}
                fontFamily="var(--font-body)"
              >
                {step.label}
              </text>

              {/* Background track */}
              <rect
                x={CHART_LEFT} y={y}
                width={CHART_W} height={BAR_HEIGHT}
                rx={4} fill="var(--chart-background-fill)"
              />

              {/* Value bar */}
              {step.value !== null && (
                <rect
                  x={CHART_LEFT}
                  y={y + 5}
                  width={bw}
                  height={BAR_HEIGHT - 10}
                  rx={3}
                  fill={step.color}
                  opacity={step.isResult ? 1 : 0.72}
                />
              )}

              {/* Value label */}
              <text
                x={CHART_LEFT + bw + 8} y={y + BAR_HEIGHT / 2 + 4}
                fontSize={12} fontWeight="700"
                fill={step.value === null ? 'var(--text-tertiary)' : step.color}
                fontFamily="var(--font-body)"
              >
                {step.value === null ? '—' : formatCurrency(step.value)}
              </text>

              {/* Description */}
              <text
                x={CHART_LEFT + 6} y={y + BAR_HEIGHT - 6}
                fontSize={9} fill="var(--text-tertiary)"
                fontFamily="var(--font-body)"
              >
                {step.description}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="waterfall-legend">
        <span className="wf-legend-item">
          <span className="wf-dot" style={{ background: COLORS.revenue }} />Income
        </span>
        <span className="wf-legend-item">
          <span className="wf-dot" style={{ background: COLORS.cost }} />Cost
        </span>
        <span className="wf-legend-item">
          <span className="wf-dot" style={{ background: COLORS.margin }} />Gross Margin
        </span>
        <span className="wf-legend-item">
          <span className="wf-dot" style={{ background: COLORS.net }} />Net
        </span>
      </div>
    </div>
  );
}
