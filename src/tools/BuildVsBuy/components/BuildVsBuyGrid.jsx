import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { quadrants, getQuadrant } from '../utils/defaultDomains';
import './BuildVsBuyGrid.css';

const BuildVsBuyGrid = ({ domains, onUpdateDomain, onSelectDomain }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Chart dimensions
    const margin = { top: 40, right: 40, bottom: 60, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear().domain([0, 9]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 9]).range([height, 0]);

    // Draw quadrant backgrounds
    quadrants.forEach(quad => {
      g.append('rect')
        .attr('x', xScale(quad.xMin))
        .attr('y', yScale(quad.yMax))
        .attr('width', xScale(quad.xMax) - xScale(quad.xMin))
        .attr('height', yScale(quad.yMin) - yScale(quad.yMax))
        .attr('fill', quad.color)
        .attr('opacity', 0.3);
    });

    // Draw grid lines
    for (let i = 0; i <= 9; i++) {
      // Vertical lines
      g.append('line')
        .attr('x1', xScale(i))
        .attr('x2', xScale(i))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);

      // Horizontal lines
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(i))
        .attr('y2', yScale(i))
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);
    }

    // Draw quadrant boundary lines (thicker)
    g.append('line')
      .attr('x1', xScale(3))
      .attr('x2', xScale(3))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#666')
      .attr('stroke-width', 2);

    g.append('line')
      .attr('x1', xScale(6))
      .attr('x2', xScale(6))
      .attr('y1', yScale(9))
      .attr('y2', yScale(3))
      .attr('stroke', '#666')
      .attr('stroke-width', 2);

    g.append('line')
      .attr('x1', xScale(3))
      .attr('x2', width)
      .attr('y1', yScale(3))
      .attr('y2', yScale(3))
      .attr('stroke', '#666')
      .attr('stroke-width', 2);

    // Quadrant labels (positioned in center of each quadrant)
    quadrants.forEach(quad => {
      const centerX = xScale((quad.xMin + quad.xMax) / 2);
      const centerY = yScale((quad.yMin + quad.yMax) / 2);
      
      g.append('text')
        .attr('x', centerX)
        .attr('y', centerY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '20px')
        .attr('font-weight', '700')
        .attr('fill', '#333')
        .attr('opacity', 0.4)
        .text(quad.name);
    });

    // Axes (without tick numbers)
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(9).tickFormat(''))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 45)
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text('Business Differentiation →');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(9).tickFormat(''))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .text('Complexity →');

    // Drag behavior
    const drag = d3.drag()
      .on('start', function() {
        d3.select(this).raise().classed('dragging', true);
      })
      .on('drag', function(event) {
        // Get mouse position relative to the group (g element)
        const [mouseX, mouseY] = d3.pointer(event, g.node());
        const newX = Math.max(0, Math.min(9, xScale.invert(mouseX)));
        const newY = Math.max(0, Math.min(9, yScale.invert(mouseY)));
        
        d3.select(this)
          .attr('transform', `translate(${xScale(newX)},${yScale(newY)})`);
      })
      .on('end', function(event, d) {
        d3.select(this).classed('dragging', false);
        
        // Get final position relative to the group
        const [mouseX, mouseY] = d3.pointer(event, g.node());
        const newX = Math.max(0, Math.min(9, xScale.invert(mouseX)));
        const newY = Math.max(0, Math.min(9, yScale.invert(mouseY)));
        
        onUpdateDomain(d.id, { x: newX, y: newY });
      });

    // Draw domains
    const domainGroups = g.selectAll('.domain-group')
      .data(domains)
      .enter()
      .append('g')
      .attr('class', 'domain-group')
      .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`)
      .style('cursor', 'move')
      .call(drag)
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectDomain(d);
      });

    // Domain circles
    domainGroups.append('circle')
      .attr('r', 8)
      .attr('fill', d => {
        const quad = getQuadrant(d.x, d.y);
        return quad ? quad.color.replace('0.3', '1') : '#ff8c42';
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Domain labels
    domainGroups.append('text')
      .attr('x', 16)
      .attr('y', -12)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#333')
      .text(d => d.name);

    // Add background box for labels
    domainGroups.each(function() {
      const text = d3.select(this).select('text');
      const bbox = text.node().getBBox();
      const padding = 4;
      
      d3.select(this).insert('rect', 'text')
        .attr('x', bbox.x - padding)
        .attr('y', bbox.y - padding)
        .attr('width', bbox.width + padding * 2)
        .attr('height', bbox.height + padding * 2)
        .attr('fill', 'white')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .attr('rx', 4)
        .attr('opacity', 0.95);
    });

  }, [domains, onUpdateDomain, onSelectDomain]);

  return (
    <div className="build-vs-buy-grid">
      <svg ref={svgRef} className="grid-svg"></svg>
    </div>
  );
};

export default BuildVsBuyGrid;

