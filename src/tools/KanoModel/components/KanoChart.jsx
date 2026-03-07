import { useMemo, useRef, useState } from 'react';
import { Button } from '@toolkit-pm/design-system/components';

const viewBox = { width: 1000, height: 620 };
const padding = { top: 60, right: 80, bottom: 80, left: 100 };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const categoryMeta = {
  performance: {
    label: 'Performance',
    color: '#3b82f6',
    description: 'More is better; satisfaction scales with execution.',
  },
  attractive: {
    label: 'Attractive',
    color: '#10b981',
    description: 'Unexpected delight; absence does not hurt.',
  },
  indifferent: {
    label: 'Indifferent',
    color: '#6b7280',
    description: 'Little to no impact on satisfaction.',
  },
  reverse: {
    label: 'Reverse',
    color: '#f59e0b',
    description: 'Some users prefer this feature to be absent.',
  },
};

const satisfactionFor = (category, fulfillment) => {
  const normalized = clamp(fulfillment, 0, 100) / 100;
  let satisfaction = 0;

  if (category === 'performance') {
    satisfaction = -100 + 200 * normalized;
  } else if (category === 'attractive') {
    satisfaction = -20 + 120 * Math.pow(normalized, 2);
  } else if (category === 'indifferent') {
    satisfaction = -5 + 10 * normalized;
  } else {
    satisfaction = 60 - 160 * normalized;
  }

  return clamp(Math.round(satisfaction), -100, 100);
};

const buildCurvePath = (category) => {
  const points = [];
  for (let step = 0; step <= 100; step += 5) {
    const x = toChartX(step);
    const y = toChartY(satisfactionFor(category, step));
    points.push(`${x},${y}`);
  }
  return `M ${points.join(' L ')}`;
};

const toChartX = (fulfillment) => {
  const plotWidth = viewBox.width - padding.left - padding.right;
  return padding.left + (fulfillment / 100) * plotWidth;
};

const toChartY = (satisfaction) => {
  const plotHeight = viewBox.height - padding.top - padding.bottom;
  const normalized = (satisfaction + 100) / 200;
  return padding.top + (1 - normalized) * plotHeight;
};

const fromClientX = (clientX, rect) => {
  const relative = (clientX - rect.left) / rect.width;
  const svgX = relative * viewBox.width;
  const plotWidth = viewBox.width - padding.left - padding.right;
  const fulfillment = ((svgX - padding.left) / plotWidth) * 100;
  return clamp(Math.round(fulfillment), 0, 100);
};

const fromClientY = (clientY, rect) => {
  const relative = (clientY - rect.top) / rect.height;
  const svgY = relative * viewBox.height;
  const plotHeight = viewBox.height - padding.top - padding.bottom;
  const normalized = 1 - ((svgY - padding.top) / plotHeight);
  const satisfaction = normalized * 200 - 100;
  return clamp(Math.round(satisfaction), -100, 100);
};

const nearestCategory = (fulfillment, satisfaction) => {
  let best = 'performance';
  let bestDistance = Number.POSITIVE_INFINITY;

  Object.keys(categoryMeta).forEach((category) => {
    const curveY = satisfactionFor(category, fulfillment);
    const distance = Math.abs(curveY - satisfaction);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = category;
    }
  });

  return best;
};

function KanoChart({ features, onFeatureClick, onUpdateFeature, onAddFeature }) {
  const svgRef = useRef(null);
  const [activeFeatureId, setActiveFeatureId] = useState(null);
  const dragMovedRef = useRef(false);

  const gridLines = useMemo(() => {
    const lines = [];
    for (let step = 0; step <= 100; step += 20) {
      lines.push({ value: step });
    }
    return lines;
  }, []);

  const satisfactionLines = useMemo(() => {
    const lines = [];
    for (let step = -100; step <= 100; step += 50) {
      lines.push({ value: step });
    }
    return lines;
  }, []);

  const handlePointerMove = (event) => {
    if (activeFeatureId === null || !svgRef.current) return;
    dragMovedRef.current = true;
    const rect = svgRef.current.getBoundingClientRect();
    const fulfillment = fromClientX(event.clientX, rect);
    const satisfaction = fromClientY(event.clientY, rect);
    const category = nearestCategory(fulfillment, satisfaction);
    onUpdateFeature(activeFeatureId, { fulfillment, category });
  };

  const handlePointerUp = () => {
    setActiveFeatureId(null);
    setTimeout(() => {
      dragMovedRef.current = false;
    }, 0);
  };

  return (
    <div className="kano-chart">
      <div className="kano-chart-header">
        <div>
          <h3>Kano Satisfaction Map</h3>
        </div>
        <Button className="kano-add-action" variant="primary" onClick={onAddFeature}>Add</Button>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        className="kano-chart-svg"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <rect
          x={padding.left}
          y={padding.top}
          width={viewBox.width - padding.left - padding.right}
          height={viewBox.height - padding.top - padding.bottom}
          className="chart-panel"
        />

        {gridLines.map(line => (
          <g key={line.value}>
            <line
              x1={toChartX(line.value)}
              y1={padding.top}
              x2={toChartX(line.value)}
              y2={viewBox.height - padding.bottom}
              className="grid-line"
            />
          </g>
        ))}

        {satisfactionLines.map(line => (
          <g key={line.value}>
            <line
              x1={padding.left}
              y1={toChartY(line.value)}
              x2={viewBox.width - padding.right}
              y2={toChartY(line.value)}
              className="grid-line"
            />
          </g>
        ))}

        <text
          x={(viewBox.width + padding.left - padding.right) / 2}
          y={viewBox.height - 24}
          textAnchor="middle"
          className="axis-title"
        >
          Fulfillment (Absent → Fulfilled)
        </text>
        <text
          x={24}
          y={(viewBox.height + padding.top - padding.bottom) / 2}
          textAnchor="middle"
          transform={`rotate(-90 24 ${(viewBox.height + padding.top - padding.bottom) / 2})`}
          className="axis-title"
        >
          Satisfaction (Dissatisfaction → Satisfaction)
        </text>

        {Object.keys(categoryMeta).map((category) => (
          <path
            key={category}
            d={buildCurvePath(category)}
            className={`curve ${category}`}
          />
        ))}

        {features.map(feature => {
          if (!categoryMeta[feature.category]) {
            return null;
          }
          const satisfaction = satisfactionFor(feature.category, feature.fulfillment);
          return (
            <g key={feature.id}>
              <circle
                cx={toChartX(feature.fulfillment)}
                cy={toChartY(satisfaction)}
                r={12}
                className={`feature-point ${feature.category}`}
                aria-label={`${feature.name} in ${categoryMeta[feature.category].label}`}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setActiveFeatureId(feature.id);
                }}
                onClick={() => {
                  if (!dragMovedRef.current) {
                    onFeatureClick(feature.id);
                  }
                }}
              />
              <text
                x={toChartX(feature.fulfillment)}
                y={toChartY(satisfaction) - 18}
                textAnchor="middle"
                className="point-label"
              >
                {feature.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="kano-legend kano-legend-under">
        {Object.entries(categoryMeta).map(([key, value]) => (
          <div key={key} className="legend-item">
            <span className="legend-swatch" style={{ background: value.color }} />
            {value.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanoChart;
