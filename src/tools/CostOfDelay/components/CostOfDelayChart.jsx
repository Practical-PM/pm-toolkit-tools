import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import './CostOfDelayChart.css';

const COLOR_PALETTE = [
  '#ff8c42',
  '#ff5e3a',
  '#f59e0b',
  '#22c55e',
  '#3b82f6',
  '#a855f7',
];

function generateSeries(features, weeksDelayed, formulaMode) {
  const horizon = Math.max(1, Math.round(weeksDelayed));
  return features.map((feature, index) => {
    const weekly =
      formulaMode === 'adjusted'
        ? feature.costOfDelayAdjustedWeekly
        : feature.costOfDelayWeekly;

    return {
      id: feature.id,
      name: feature.name,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      points: d3.range(0, horizon + 1).map((week) => ({
        week,
        value: week * weekly,
      })),
    };
  });
}

export default function CostOfDelayChart({ features, weeksDelayed, formulaMode }) {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(900);

  const series = useMemo(
    () => generateSeries(features, weeksDelayed, formulaMode),
    [features, weeksDelayed, formulaMode]
  );

  useEffect(() => {
    if (!wrapRef.current) return undefined;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect?.width) {
        setWidth(Math.max(540, Math.round(entry.contentRect.width)));
      }
    });
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    if (series.length === 0) return;

    const margin = { top: 18, right: 24, bottom: 42, left: 76 };
    const innerWidth = width - margin.left - margin.right;
    const height = 360;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const allPoints = series.flatMap((s) => s.points);
    const xMax = d3.max(allPoints, (d) => d.week) || 1;
    const yMax = d3.max(allPoints, (d) => d.value) || 1;

    const x = d3.scaleLinear().domain([0, xMax]).range([0, innerWidth]).nice();
    const y = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice();

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    chart
      .append('g')
      .attr('class', 'cod-grid')
      .call(d3.axisLeft(y).ticks(6).tickSize(-innerWidth).tickFormat(''))
      .selectAll('line')
      .attr('stroke', 'var(--border-subtle)')
      .attr('stroke-opacity', 0.65);

    chart
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(Math.min(10, xMax)).tickFormat((d) => `${d}w`))
      .attr('class', 'cod-axis');

    chart
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(6)
          .tickFormat((d) => `$${d3.format('.2s')(d)}`)
      )
      .attr('class', 'cod-axis');

    chart
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 34)
      .attr('text-anchor', 'middle')
      .attr('class', 'cod-axis-label')
      .text('Weeks Delayed');

    chart
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -56)
      .attr('text-anchor', 'middle')
      .attr('class', 'cod-axis-label')
      .text('Accumulated Cost of Delay');

    const line = d3
      .line()
      .x((d) => x(d.week))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const tooltip = d3.select(wrapRef.current).select('.cod-chart-tooltip');

    series.forEach((featureSeries) => {
      chart
        .append('path')
        .datum(featureSeries.points)
        .attr('fill', 'none')
        .attr('stroke', featureSeries.color)
        .attr('stroke-width', 2.5)
        .attr('d', line);

      chart
        .append('g')
        .selectAll('circle')
        .data(featureSeries.points.filter((point) => point.week === Math.round(weeksDelayed)))
        .join('circle')
        .attr('cx', (d) => x(d.week))
        .attr('cy', (d) => y(d.value))
        .attr('r', 4.5)
        .attr('fill', featureSeries.color)
        .on('mouseenter', (event, d) => {
          tooltip
            .style('opacity', 1)
            .html(`<strong>${featureSeries.name}</strong><br/>Week ${d.week}: $${Math.round(d.value).toLocaleString()}`);
        })
        .on('mousemove', (event) => {
          tooltip
            .style('left', `${event.offsetX + 16}px`)
            .style('top', `${event.offsetY + 12}px`);
        })
        .on('mouseleave', () => {
          tooltip.style('opacity', 0);
        });
    });
  }, [series, width, weeksDelayed]);

  return (
    <div className="cod-chart-wrap" ref={wrapRef}>
      <svg ref={svgRef} className="cod-chart-svg" />
      <div className="cod-chart-tooltip" />
      <div className="cod-chart-legend">
        {series.map((s) => (
          <span key={s.id} className="cod-chart-legend-item">
            <span className="cod-chart-legend-dot" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
