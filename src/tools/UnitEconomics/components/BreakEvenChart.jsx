import { useMemo } from 'react';
import { formatCurrency } from '../utils/calculations';

const MARGIN = { top: 28, right: 24, bottom: 52, left: 80 };
const W = 600;
const H = 340;
const INNER_W = W - MARGIN.left - MARGIN.right;
const INNER_H = H - MARGIN.top - MARGIN.bottom;

const TIERS = [
  {
    label: 'Tier 1',
    maxCustomers: 1000,
    maxY: 100000,
    xTicks: [0, 200, 400, 600, 800, 1000],
    yTicks: [0, 20000, 40000, 60000, 80000, 100000],
    seriesStep: 10,
  },
  {
    label: 'Tier 2',
    maxCustomers: 10000,
    maxY: 1000000,
    xTicks: [0, 2000, 4000, 6000, 8000, 10000],
    yTicks: [0, 200000, 400000, 600000, 800000, 1000000],
    seriesStep: 100,
  },
];

function selectTier(breakEvenCustomers, fixedCosts, arpu) {
  if (
    (Number.isFinite(breakEvenCustomers) && breakEvenCustomers > 1000) ||
    fixedCosts > 50000 ||
    arpu > 100
  ) {
    return TIERS[1];
  }
  return TIERS[0];
}

function lerp(value, domainMin, domainMax, rangeMin, rangeMax) {
  if (domainMax === domainMin) return rangeMin;
  return rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
}

export default function BreakEvenChart({ inputs, derived }) {
  const { breakEvenCustomers, grossMarginPerCustomer } = derived;
  const { arpu, cogs, fixedCosts, customerCount } = inputs;

  const tier = selectTier(breakEvenCustomers, fixedCosts, arpu);
  const { maxCustomers, maxY, xTicks, yTicks, seriesStep } = tier;

  const xScale = (n) => lerp(n, 0, maxCustomers, 0, INNER_W);
  const yScale = (v) => lerp(v, 0, maxY, INNER_H, 0);

  // Build series across the full tier x range
  const points = useMemo(() => {
    const pts = [];
    for (let n = 0; n <= maxCustomers; n += seriesStep) {
      pts.push({
        customers: n,
        revenue: arpu * n,
        totalCosts: fixedCosts + cogs * n,
      });
    }
    return pts;
  }, [arpu, cogs, fixedCosts, maxCustomers, seriesStep]);

  const revenuePath = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(p.customers).toFixed(1)},${yScale(p.revenue).toFixed(1)}`
  ).join(' ');

  const costPath = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(p.customers).toFixed(1)},${yScale(p.totalCosts).toFixed(1)}`
  ).join(' ');

  const breakEvenX = Number.isFinite(breakEvenCustomers) && breakEvenCustomers <= maxCustomers
    ? xScale(breakEvenCustomers)
    : null;

  const currentX = xScale(Math.min(customerCount, maxCustomers));
  const currentRevenue = yScale(Math.min(arpu * customerCount, maxY));
  const currentCost = yScale(Math.min(fixedCosts + cogs * customerCount, maxY));

  const hasBreakEven = breakEvenX !== null;

  // Build loss area polygon (below break-even, revenue < cost)
  const lossAreaPoints = points
    .filter(p => p.customers <= (hasBreakEven ? breakEvenCustomers : maxCustomers))
    .map(p => `${xScale(p.customers).toFixed(1)},${yScale(Math.min(p.totalCosts, maxY)).toFixed(1)}`);
  const lossRevPoints = points
    .filter(p => p.customers <= (hasBreakEven ? breakEvenCustomers : maxCustomers))
    .map(p => `${xScale(p.customers).toFixed(1)},${yScale(Math.min(p.revenue, maxY)).toFixed(1)}`);
  const lossPolygon = [...lossAreaPoints, ...[...lossRevPoints].reverse()].join(' ');

  // Build profit area polygon (above break-even)
  const profitAreaPoints = points
    .filter(p => p.customers >= (hasBreakEven ? breakEvenCustomers : maxCustomers))
    .map(p => `${xScale(p.customers).toFixed(1)},${yScale(Math.min(p.totalCosts, maxY)).toFixed(1)}`);
  const profitRevPoints = points
    .filter(p => p.customers >= (hasBreakEven ? breakEvenCustomers : maxCustomers))
    .map(p => `${xScale(p.customers).toFixed(1)},${yScale(Math.min(p.revenue, maxY)).toFixed(1)}`);
  const profitPolygon = [...profitAreaPoints, ...[...profitRevPoints].reverse()].join(' ');

  const breakEvenY = hasBreakEven
    ? yScale(Math.min(arpu * breakEvenCustomers, maxY))
    : null;

  return (
    <div className="break-even-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="break-even-svg"
        aria-label="Break-even chart showing revenue and total cost curves"
        role="img"
      >
        <defs>
          <clipPath id="be-clip">
            <rect x="0" y="0" width={INNER_W} height={INNER_H} />
          </clipPath>
        </defs>

        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <line
              key={i}
              x1={0} y1={yScale(tick)}
              x2={INNER_W} y2={yScale(tick)}
              stroke="var(--chart-grid-line)"
              strokeDasharray="4,4"
            />
          ))}

          {/* Loss zone fill */}
          {lossPolygon && (
            <polygon
              points={lossPolygon}
              fill="var(--chart-negative-fill)"
              clipPath="url(#be-clip)"
            />
          )}

          {/* Profit zone fill */}
          {profitPolygon && hasBreakEven && (
            <polygon
              points={profitPolygon}
              fill="var(--chart-positive-fill)"
              clipPath="url(#be-clip)"
            />
          )}

          {/* Revenue line */}
          <path
            d={revenuePath}
            fill="none"
            stroke="var(--chart-orange)"
            strokeWidth={2.5}
            clipPath="url(#be-clip)"
          />

          {/* Cost line */}
          <path
            d={costPath}
            fill="none"
            stroke="var(--chart-blue)"
            strokeWidth={2.5}
            strokeDasharray="6,3"
            clipPath="url(#be-clip)"
          />

          {/* Break-even vertical */}
          {hasBreakEven && (
            <>
              <line
                x1={breakEvenX} y1={0}
                x2={breakEvenX} y2={INNER_H}
                stroke="var(--chart-axis-line)"
                strokeWidth={1.5}
                strokeDasharray="4,3"
              />
              <circle
                cx={breakEvenX}
                cy={breakEvenY}
                r={5}
                fill="var(--text-primary)"
                stroke="var(--chart-orange)"
                strokeWidth={2}
              />
              <text
                x={breakEvenX + 6}
                y={breakEvenY - 8}
                fontSize={10}
                fill="var(--chart-annotation)"
                fontFamily="var(--font-body)"
              >
                {Math.ceil(breakEvenCustomers)} customers
              </text>
            </>
          )}

          {/* Current customer dot on revenue line */}
          {customerCount <= maxCustomers && (
            <>
              <line
                x1={currentX} y1={currentRevenue}
                x2={currentX} y2={currentCost}
                stroke="var(--chart-axis-line)"
                strokeWidth={1}
              />
              <circle
                cx={currentX}
                cy={currentRevenue}
                r={5}
                fill="var(--chart-orange)"
                stroke="var(--text-primary)"
                strokeWidth={1.5}
              />
              <circle
                cx={currentX}
                cy={currentCost}
                r={4}
                fill="var(--chart-blue)"
                stroke="var(--text-primary)"
                strokeWidth={1.5}
              />
            </>
          )}

          {/* Y axis */}
          <line x1={0} y1={0} x2={0} y2={INNER_H} stroke="var(--chart-axis-line)" />
          {yTicks.map((tick, i) => (
            <g key={i} transform={`translate(0,${yScale(tick)})`}>
              <line x1={-4} y1={0} x2={0} y2={0} stroke="var(--chart-axis-line)" />
              <text
                x={-8}
                y={4}
                textAnchor="end"
                fontSize={10}
                fill="var(--chart-label)"
                fontFamily="var(--font-body)"
              >
                {formatCurrency(tick, true)}
              </text>
            </g>
          ))}

          {/* X axis */}
          <line x1={0} y1={INNER_H} x2={INNER_W} y2={INNER_H} stroke="var(--chart-axis-line)" />
          {xTicks.map((tick, i) => (
            <g key={i} transform={`translate(${xScale(tick)},${INNER_H})`}>
              <line x1={0} y1={0} x2={0} y2={4} stroke="var(--chart-axis-line)" />
              <text
                x={0}
                y={16}
                textAnchor="middle"
                fontSize={10}
                fill="var(--chart-label)"
                fontFamily="var(--font-body)"
              >
                {tick.toLocaleString()}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={INNER_W / 2}
            y={INNER_H + 40}
            textAnchor="middle"
            fontSize={11}
            fill="var(--chart-label)"
            fontFamily="var(--font-body)"
          >
            Number of Customers
          </text>
        </g>
      </svg>

      <div className="break-even-legend">
        <span className="be-legend-item">
          <span className="be-legend-dot" style={{ background: 'var(--chart-orange)' }} />
          Revenue
        </span>
        <span className="be-legend-item">
          <span className="be-legend-dot be-legend-dot--dashed" style={{ background: 'var(--chart-blue)' }} />
          Total Costs
        </span>
        {hasBreakEven && (
          <span className="be-legend-item">
            <span className="be-legend-dot" style={{ background: 'var(--text-secondary)', opacity: 0.5 }} />
            Break-even: {Math.ceil(breakEvenCustomers).toLocaleString()} customers
          </span>
        )}
        <span className="be-legend-scale">
          Scale: {formatCurrency(maxY, true)} / {maxCustomers.toLocaleString()} customers
        </span>
        {grossMarginPerCustomer <= 0 && (
          <span className="be-legend-item be-legend-warn">
            ⚠ Negative gross margin — costs exceed revenue per customer
          </span>
        )}
      </div>
    </div>
  );
}
