import { formatCurrency } from '../utils/calculations';

const W = 600;
const H = 360;

function ScenarioCard({ cx, y, w, label, customers, pnl, isBreakEven }) {
  const profitable = pnl >= 0;
  const color = isBreakEven ? 'var(--text-tertiary)' : profitable ? 'var(--success)' : 'var(--error)';
  const bgFill = isBreakEven
    ? 'var(--chart-background-fill)'
    : profitable
    ? 'var(--chart-positive-fill)'
    : 'var(--chart-negative-fill)';

  return (
    <g>
      <rect x={cx - w / 2} y={y} width={w} height={88} rx={6}
        fill={bgFill} stroke={color} strokeWidth={1} strokeOpacity={0.4} />
      <text x={cx} y={y + 18} textAnchor="middle" fontSize={10}
        fill="var(--text-tertiary)" fontFamily="var(--font-body)" fontWeight="600"
        letterSpacing="0.05em">
        {label.toUpperCase()}
      </text>
      <text x={cx} y={y + 38} textAnchor="middle" fontSize={13}
        fill="var(--text-secondary)" fontFamily="var(--font-body)">
        {customers.toLocaleString()} customers
      </text>
      <text x={cx} y={y + 62} textAnchor="middle" fontSize={17}
        fontWeight="700" fill={color} fontFamily="var(--font-heading)">
        {formatCurrency(pnl)}
      </text>
      <text x={cx} y={y + 80} textAnchor="middle" fontSize={10}
        fill={color} fontFamily="var(--font-body)">
        {profitable ? 'profit / month' : 'loss / month'}
      </text>
    </g>
  );
}

export default function MarginHealth({ inputs, derived }) {
  const { fixedCosts, arpu, cogs, customerCount } = inputs;
  const { grossMarginPerCustomer, grossMarginPct, breakEvenCustomers, monthlyPnL } = derived;

  const hasBadMargin = grossMarginPerCustomer <= 0;
  const pct = Math.max(0, Math.min(100, grossMarginPct));

  // Margin bar dimensions
  const BAR_Y = 52;
  const BAR_H = 28;
  const BAR_X = 40;
  const BAR_W = W - 80;
  const fillW = (pct / 100) * BAR_W;

  // Margin color zones (behind the bar)
  const zones = [
    { from: 0, to: 0.2, color: 'var(--chart-negative-fill)' },
    { from: 0.2, to: 0.5, color: 'color-mix(in srgb, var(--chart-amber) 22%, transparent)' },
    { from: 0.5, to: 1.0, color: 'var(--chart-positive-fill)' },
  ];

  // Margin color for fill
  const marginColor = hasBadMargin ? 'var(--chart-red)'
    : pct < 20 ? 'var(--chart-red)'
    : pct < 50 ? 'var(--chart-amber)'
    : 'var(--chart-green)';

  // Margin label
  const marginLabel = hasBadMargin ? 'Negative'
    : pct < 20 ? 'Low'
    : pct < 50 ? 'Moderate'
    : 'Healthy';

  // Three P&L scenarios
  const beCount = Number.isFinite(breakEvenCustomers) ? Math.ceil(breakEvenCustomers) : null;
  const doubleCount = customerCount * 2;
  const doublePnL = (grossMarginPerCustomer * doubleCount) - fixedCosts;

  const CARD_Y = 140;
  const CARD_W = 160;
  const CARD_GAP = (W - CARD_W * 3) / 4;

  return (
    <div className="ltv-cac-visual-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="ltv-cac-svg"
        aria-label="Margin health and P&L scenarios" role="img">

        {/* Section: Gross Margin % */}
        <text x={40} y={24} fontSize={11} fontWeight="700"
          fill="var(--text-tertiary)" fontFamily="var(--font-body)" letterSpacing="0.06em">
          GROSS MARGIN %
        </text>

        {/* Zone background bands */}
        {zones.map((z, i) => (
          <rect key={i}
            x={BAR_X + z.from * BAR_W} y={BAR_Y}
            width={(z.to - z.from) * BAR_W} height={BAR_H}
            fill={z.color}
            rx={i === 0 ? 4 : 0}
            style={i === zones.length - 1 ? { borderRadius: '0 4px 4px 0' } : {}}
          />
        ))}

        {/* Margin fill bar */}
        {!hasBadMargin && fillW > 0 && (
          <rect x={BAR_X} y={BAR_Y + 4} width={fillW} height={BAR_H - 8}
            rx={3} fill={marginColor} opacity={0.9} />
        )}

        {/* Bar outline */}
        <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={BAR_H}
          rx={4} fill="none" stroke="var(--border-color)" strokeWidth={1} />

        {/* Zone threshold markers */}
        {[20, 50].map(threshold => (
          <g key={threshold}>
            <line
              x1={BAR_X + (threshold / 100) * BAR_W} y1={BAR_Y - 4}
              x2={BAR_X + (threshold / 100) * BAR_W} y2={BAR_Y + BAR_H + 4}
              stroke="var(--chart-axis-line)" strokeWidth={1} strokeDasharray="3,2"
            />
            <text
              x={BAR_X + (threshold / 100) * BAR_W} y={BAR_Y + BAR_H + 15}
              textAnchor="middle" fontSize={9}
              fill="var(--text-tertiary)" fontFamily="var(--font-body)">
              {threshold}%
            </text>
          </g>
        ))}

        {/* Big % value */}
        <text x={W - 40} y={BAR_Y + 22} textAnchor="end"
          fontSize={28} fontWeight="700" fill={marginColor}
          fontFamily="var(--font-heading)">
          {hasBadMargin ? '—' : `${pct.toFixed(0)}%`}
        </text>
        <text x={W - 40} y={BAR_Y + BAR_H + 14} textAnchor="end"
          fontSize={11} fill={marginColor} fontFamily="var(--font-body)" fontWeight="600">
          {marginLabel}
        </text>

        {/* Per-customer breakdown strip */}
        <text x={40} y={112} fontSize={10}
          fill="var(--text-tertiary)" fontFamily="var(--font-body)">
          {`Income ${formatCurrency(arpu)}  ·  Variable cost ${formatCurrency(cogs)}  ·  Gross margin ${formatCurrency(grossMarginPerCustomer)} per customer`}
        </text>

        {/* Section: P&L Scenarios */}
        <text x={40} y={134} fontSize={11} fontWeight="700"
          fill="var(--text-tertiary)" fontFamily="var(--font-body)" letterSpacing="0.06em">
          MONTHLY P&L SCENARIOS
        </text>

        {/* Break-even scenario */}
        {beCount !== null ? (
          <ScenarioCard
            cx={CARD_GAP + CARD_W / 2}
            y={CARD_Y} w={CARD_W}
            label="Break-even"
            customers={beCount}
            pnl={(grossMarginPerCustomer * beCount) - fixedCosts}
            isBreakEven
          />
        ) : (
          <g>
            <rect x={CARD_GAP} y={CARD_Y} width={CARD_W} height={88} rx={6}
              fill="var(--chart-negative-fill)" stroke="var(--chart-red)" strokeWidth={1} />
            <text x={CARD_GAP + CARD_W / 2} y={CARD_Y + 44} textAnchor="middle"
              fontSize={11} fill="var(--chart-red)" fontFamily="var(--font-body)">
              No break-even possible
            </text>
          </g>
        )}

        {/* Today scenario */}
        <ScenarioCard
          cx={CARD_GAP * 2 + CARD_W * 1.5}
          y={CARD_Y} w={CARD_W}
          label="Today"
          customers={customerCount}
          pnl={monthlyPnL}
        />

        {/* 2× customers scenario */}
        <ScenarioCard
          cx={CARD_GAP * 3 + CARD_W * 2.5}
          y={CARD_Y} w={CARD_W}
          label="2× customers"
          customers={doubleCount}
          pnl={doublePnL}
        />

        {/* Connector arrows between scenarios */}
        {[
          CARD_GAP + CARD_W,
          CARD_GAP * 2 + CARD_W * 2,
        ].map((x, i) => (
          <g key={i}>
            <line x1={x + 4} y1={CARD_Y + 44} x2={x + CARD_GAP - 4} y2={CARD_Y + 44}
              stroke="var(--border-color)" strokeWidth={1} />
            <text x={x + CARD_GAP / 2} y={CARD_Y + 40}
              textAnchor="middle" fontSize={14} fill="var(--text-tertiary)"
              fontFamily="var(--font-body)">
              →
            </text>
          </g>
        ))}

        {/* Fixed cost line */}
        <rect x={40} y={260} width={W - 80} height={36} rx={6}
          fill="color-mix(in srgb, var(--chart-blue) 14%, transparent)" stroke="var(--chart-blue)" strokeWidth={1} />
        <text x={56} y={282} fontSize={11}
          fill="var(--text-secondary)" fontFamily="var(--font-body)">
          Fixed costs to cover every month:
        </text>
        <text x={W - 56} y={282} textAnchor="end"
          fontSize={14} fontWeight="700" fill="var(--chart-blue)" fontFamily="var(--font-heading)">
          {formatCurrency(fixedCosts)}
        </text>

        {/* Progress toward covering fixed costs */}
        {!hasBadMargin && customerCount > 0 && (
          <g>
            <rect x={40} y={304} width={W - 80} height={10} rx={5}
              fill="var(--chart-background-fill)" />
            <rect x={40} y={304}
              width={Math.min((customerCount / Math.max(beCount ?? Infinity, 1)), 1) * (W - 80)}
              height={10} rx={5}
              fill={monthlyPnL >= 0 ? 'var(--chart-green)' : 'var(--chart-blue)'} opacity={0.7} />
            <text x={40} y={326} fontSize={9}
              fill="var(--text-tertiary)" fontFamily="var(--font-body)">
              {beCount !== null
                ? `${Math.min(Math.round((customerCount / beCount) * 100), 100)}% of the way to break-even`
                : 'Break-even unreachable at current margin'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
