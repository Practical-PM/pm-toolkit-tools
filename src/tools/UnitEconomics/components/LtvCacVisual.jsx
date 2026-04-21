import { ltvCacHealth, formatCurrency } from '../utils/calculations';

const W = 600;
const H = 360;
const CX = 300;
const CY = 185;
const R_OUTER = 120;
const R_INNER = 78;

// Build arc path for a segment of the gauge
function arcPath(cx, cy, r, startAngle, endAngle) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function arcSegment(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const ox1 = cx + rOuter * Math.cos(toRad(startAngle));
  const oy1 = cy + rOuter * Math.sin(toRad(startAngle));
  const ox2 = cx + rOuter * Math.cos(toRad(endAngle));
  const oy2 = cy + rOuter * Math.sin(toRad(endAngle));
  const ix1 = cx + rInner * Math.cos(toRad(endAngle));
  const iy1 = cy + rInner * Math.sin(toRad(endAngle));
  const ix2 = cx + rInner * Math.cos(toRad(startAngle));
  const iy2 = cy + rInner * Math.sin(toRad(startAngle));
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${ox1} ${oy1} A ${rOuter} ${rOuter} 0 ${large} 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${rInner} ${rInner} 0 ${large} 0 ${ix2} ${iy2} Z`;
}

// Gauge goes from 200° to 340° (140° sweep, left-to-right bottom half arc)
const GAUGE_START = 200;
const GAUGE_END = 340;
const GAUGE_SWEEP = GAUGE_END - GAUGE_START;

// Zone boundaries in terms of ratio value
// 0 → danger, 1 → caution, 3 → healthy, 5+ → excellent
// We cap display at ratio = 6 for gauge purposes
const MAX_RATIO = 6;

const ZONES = [
  { from: 0, to: 1, color: 'rgba(239,68,68,0.85)', label: 'Danger' },
  { from: 1, to: 3, color: 'rgba(245,158,11,0.85)', label: 'Caution' },
  { from: 3, to: 6, color: 'rgba(34,197,94,0.85)', label: 'Healthy' },
];

function ratioToAngle(ratio) {
  const clamped = Math.min(Math.max(ratio, 0), MAX_RATIO);
  return GAUGE_START + (clamped / MAX_RATIO) * GAUGE_SWEEP;
}

// Needle
function needlePath(cx, cy, angle, length) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const nx = cx + length * Math.cos(toRad(angle));
  const ny = cy + length * Math.sin(toRad(angle));
  const base1x = cx + 8 * Math.cos(toRad(angle + 90));
  const base1y = cy + 8 * Math.sin(toRad(angle + 90));
  const base2x = cx + 8 * Math.cos(toRad(angle - 90));
  const base2y = cy + 8 * Math.sin(toRad(angle - 90));
  return `M ${base1x} ${base1y} L ${nx} ${ny} L ${base2x} ${base2y} Z`;
}

export default function LtvCacVisual({ inputs, derived }) {
  const { ltv, ltvCacRatio, cacPaybackMonths } = derived;
  const { cac } = inputs;

  const health = ltvCacHealth(ltvCacRatio);
  const needleAngle = ratioToAngle(ltvCacRatio);

  // Bar chart comparison dimensions
  const BAR_SECTION_Y = 268;
  const barMaxW = 220;
  const maxBarVal = Math.max(ltv, cac, 1);
  const ltvBarW = (Math.min(ltv, maxBarVal) / maxBarVal) * barMaxW;
  const cacBarW = (Math.min(cac, maxBarVal) / maxBarVal) * barMaxW;

  // Payback timeline
  const paybackDisplay = Number.isFinite(cacPaybackMonths)
    ? cacPaybackMonths.toFixed(1)
    : '∞';

  const displayRatio = ltvCacRatio > 0
    ? ltvCacRatio > 99 ? '>99' : ltvCacRatio.toFixed(1)
    : '—';

  return (
    <div className="ltv-cac-visual-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="ltv-cac-svg"
        aria-label="LTV to CAC health gauge and comparison"
        role="img"
      >
        {/* Zone segments */}
        {ZONES.map((zone, i) => {
          const startAngle = GAUGE_START + (zone.from / MAX_RATIO) * GAUGE_SWEEP;
          const endAngle = GAUGE_START + (zone.to / MAX_RATIO) * GAUGE_SWEEP;
          return (
            <path
              key={i}
              d={arcSegment(CX, CY, R_OUTER, R_INNER, startAngle, endAngle)}
              fill={zone.color}
              opacity={0.9}
            />
          );
        })}

        {/* Zone labels on arc */}
        {ZONES.map((zone, i) => {
          const midAngle = GAUGE_START + ((zone.from + zone.to) / 2 / MAX_RATIO) * GAUGE_SWEEP;
          const toRad = (deg) => (deg * Math.PI) / 180;
          const labelR = R_OUTER + 18;
          const lx = CX + labelR * Math.cos(toRad(midAngle));
          const ly = CY + labelR * Math.sin(toRad(midAngle));
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              fontSize={10}
              fill={zone.color}
              fontFamily="var(--font-body)"
              fontWeight="600"
            >
              {zone.label}
            </text>
          );
        })}

        {/* Needle */}
        <path
          d={needlePath(CX, CY, needleAngle, R_INNER - 10)}
          fill={health.color}
          opacity={0.95}
        />
        <circle cx={CX} cy={CY} r={10} fill="var(--bg-card, #1c1c22)" stroke={health.color} strokeWidth={2} />

        {/* Centre ratio display */}
        <text
          x={CX}
          y={CY - 28}
          textAnchor="middle"
          fontSize={9}
          fill="rgba(255,255,255,0.45)"
          fontFamily="var(--font-body)"
          letterSpacing="1"
        >
          LTV : CAC
        </text>
        <text
          x={CX}
          y={CY - 5}
          textAnchor="middle"
          fontSize={32}
          fontWeight="700"
          fill={health.color}
          fontFamily="var(--font-heading)"
        >
          {displayRatio}
        </text>
        <text
          x={CX}
          y={CY + 18}
          textAnchor="middle"
          fontSize={11}
          fill={health.color}
          fontFamily="var(--font-body)"
          fontWeight="600"
        >
          {health.label}
        </text>

        {/* Gauge scale labels */}
        {[0, 1, 2, 3, 4, 5, 6].map(val => {
          const toRad = (deg) => (deg * Math.PI) / 180;
          const angle = ratioToAngle(val);
          const tickR = R_INNER - 6;
          const tx = CX + tickR * Math.cos(toRad(angle));
          const ty = CY + tickR * Math.sin(toRad(angle));
          return (
            <text
              key={val}
              x={tx}
              y={ty + 3}
              textAnchor="middle"
              fontSize={8}
              fill="rgba(255,255,255,0.35)"
              fontFamily="var(--font-body)"
            >
              {val}
            </text>
          );
        })}

        {/* LTV vs CAC bar comparison */}
        <text x={28} y={BAR_SECTION_Y - 6} fontSize={10} fill="rgba(255,255,255,0.5)" fontFamily="var(--font-body)">
          LTV vs CAC comparison
        </text>

        {/* LTV bar */}
        <rect x={28} y={BAR_SECTION_Y} width={barMaxW} height={20} rx={4} fill="rgba(255,255,255,0.05)" />
        <rect x={28} y={BAR_SECTION_Y} width={Math.max(ltvBarW, 2)} height={20} rx={4} fill="rgba(34,197,94,0.7)" />
        <text x={28 + barMaxW + 8} y={BAR_SECTION_Y + 14} fontSize={11} fill="#22c55e" fontFamily="var(--font-body)" fontWeight="700">
          LTV {formatCurrency(ltv)}
        </text>

        {/* CAC bar */}
        <rect x={28} y={BAR_SECTION_Y + 28} width={barMaxW} height={20} rx={4} fill="rgba(255,255,255,0.05)" />
        <rect x={28} y={BAR_SECTION_Y + 28} width={Math.max(cacBarW, 2)} height={20} rx={4} fill="rgba(56,189,248,0.7)" />
        <text x={28 + barMaxW + 8} y={BAR_SECTION_Y + 42} fontSize={11} fill="#38bdf8" fontFamily="var(--font-body)" fontWeight="700">
          CAC {formatCurrency(cac)}
        </text>

        {/* Payback timeline */}
        <rect x={W - 190} y={BAR_SECTION_Y - 8} width={162} height={60} rx={6} fill="rgba(255,140,66,0.07)" stroke="rgba(255,140,66,0.2)" strokeWidth={1} />
        <text x={W - 182} y={BAR_SECTION_Y + 9} fontSize={9} fill="rgba(255,255,255,0.45)" fontFamily="var(--font-body)" letterSpacing="0.5">
          CAC PAYBACK PERIOD
        </text>
        <text x={W - 182} y={BAR_SECTION_Y + 34} fontSize={22} fontWeight="700" fill="#ff8c42" fontFamily="var(--font-heading)">
          {paybackDisplay}
        </text>
        <text x={W - 182} y={BAR_SECTION_Y + 50} fontSize={10} fill="rgba(255,255,255,0.4)" fontFamily="var(--font-body)">
          months to recover CAC
        </text>
      </svg>
    </div>
  );
}
