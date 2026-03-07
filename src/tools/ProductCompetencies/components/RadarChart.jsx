import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartContainer } from '@toolkit-pm/design-system/components';
import './RadarChart.css';

const RadarChart = ({ competencies }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const scoredCompetencies = competencies.filter(c => c.score !== null);
    if (scoredCompetencies.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Chart dimensions - wider to accommodate labels
    const width = 900;
    const height = 550;
    const margin = 100;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const maxValue = 5;
    const levels = 5;
    const angleSlice = (Math.PI * 2) / scoredCompetencies.length;

    // Create radial scale
    const rScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);

    // Draw circular grid lines
    for (let level = 1; level <= levels; level++) {
      g.append('circle')
        .attr('r', radius * (level / levels))
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);

      // Add level labels
      g.append('text')
        .attr('x', 5)
        .attr('y', -radius * (level / levels))
        .attr('dy', '0.4em')
        .attr('font-size', '11px')
        .attr('fill', '#999')
        .text(level);
    }

    // Draw axes
    const axes = g.selectAll('.axis')
      .data(scoredCompetencies)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axes.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1.5);

    // Add axis labels with background
    const labelDistance = radius * 1.2;
    
    axes.each(function(d, i) {
      const angle = angleSlice * i - Math.PI / 2;
      const x = labelDistance * Math.cos(angle);
      const y = labelDistance * Math.sin(angle);

      const label = d3.select(this).append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .attr('fill', '#333')
        .text(d.name);

      // Add background box to labels
      const bbox = label.node().getBBox();
      const padding = 6;
      
      d3.select(this).insert('rect', 'text')
        .attr('x', bbox.x - padding)
        .attr('y', bbox.y - padding)
        .attr('width', bbox.width + padding * 2)
        .attr('height', bbox.height + padding * 2)
        .attr('fill', 'white')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .attr('rx', 4);
    });

    // Add gradient definition
    const defs = svg.append('defs');
    
    const gradient = defs.append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ff8c42');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff5e3a');

    // Create the data points for the polygon
    const dataPoints = scoredCompetencies.map((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      return {
        x: rScale(d.score) * Math.cos(angle),
        y: rScale(d.score) * Math.sin(angle),
        score: d.score,
        name: d.name
      };
    });

    // Draw the filled polygon area
    const polygonPoints = dataPoints.map(d => `${d.x},${d.y}`).join(' ');
    
    g.append('polygon')
      .attr('points', polygonPoints)
      .attr('fill', 'url(#gradient)')
      .attr('fill-opacity', 0.4)
      .attr('stroke', '#ff8c42')
      .attr('stroke-width', 2.5);

    // Add dots at data points
    g.selectAll('.radar-dot')
      .data(dataPoints)
      .enter()
      .append('circle')
      .attr('class', 'radar-dot')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 5)
      .attr('fill', '#ff8c42')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 7);

        // Show tooltip
        const tooltip = d3.select('.radar-tooltip');
        tooltip.style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>Score: ${d.score}/5`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5);

        d3.select('.radar-tooltip').style('opacity', 0);
      });

  }, [competencies]);

  const scoredCompetencies = competencies.filter(c => c.score !== null);

  return (
    <ChartContainer
      title="Competency Radar"
      isEmpty={scoredCompetencies.length === 0}
      emptyIcon="📊"
      emptyMessage="👈 Start scoring competencies to see your radar chart"
      className="radar-chart-container"
    >
      <svg ref={svgRef} className="radar-chart"></svg>
      <div className="radar-tooltip"></div>
    </ChartContainer>
  );
};

export default RadarChart;

