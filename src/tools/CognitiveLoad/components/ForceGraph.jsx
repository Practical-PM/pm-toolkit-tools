import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { prepareGraphData, createForceSimulation, getNodeColor } from '../utils/forceSimulation';
import './ForceGraph.css';

export default function ForceGraph({ team, systems, teams }) {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const { nodes, links } = prepareGraphData(team, systems, teams);

    if (nodes.length === 0) {
      // Show empty state message
      d3.select(svgRef.current)
        .append('text')
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('text-anchor', 'middle')
        .attr('fill', '#999')
        .attr('font-size', '16px')
        .text('Add systems and teams to see the visualization');
      return;
    }

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add arrow markers for links
    svg.append('defs').selectAll('marker')
      .data(['system', 'team'])
      .enter().append('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    const g = svg.append('g');

    // Create force simulation
    const simulation = createForceSimulation(width, height, nodes, links);
    simulationRef.current = simulation;

    // Create links with curved paths instead of straight lines
    const link = g.append('g')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('stroke', d => d.letItBurn ? '#ccc' : '#999')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.letItBurn ? '5,5' : '0')
      .attr('opacity', d => d.letItBurn ? 0.3 : 0.6)
      .attr('fill', 'none')
      .attr('marker-end', d => `url(#arrow-${d.type})`);

    // Create node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add shapes to nodes - circles for teams, rounded rectangles for systems
    node.each(function(d) {
      const nodeGroup = d3.select(this);
      
      if (d.type === 'system') {
        // Rectangles for systems
        const rectWidth = d.radius * 2.2;
        const rectHeight = d.radius * 1.8;
        nodeGroup.append('rect')
          .attr('x', -rectWidth / 2)
          .attr('y', -rectHeight / 2)
          .attr('width', rectWidth)
          .attr('height', rectHeight)
          .attr('rx', 8)
          .attr('ry', 8)
          .attr('fill', d.letItBurn ? '#999' : getNodeColor(d.type, d.complexity))
          .attr('stroke', d.letItBurn ? '#ef4444' : '#fff')
          .attr('stroke-width', d.letItBurn ? 4 : 3)
          .attr('opacity', d.letItBurn ? 0.5 : 1);
        
        // Store dimensions for text wrapping
        d.textWidth = rectWidth - 16;
        d.textHeight = rectHeight - 16;
      } else {
        // Circles for teams
        nodeGroup.append('circle')
          .attr('r', d.radius)
          .attr('fill', d.letItBurn ? '#999' : getNodeColor(d.type, d.complexity))
          .attr('stroke', d.letItBurn ? '#ef4444' : '#fff')
          .attr('stroke-width', d.letItBurn ? 4 : 3)
          .attr('opacity', d.letItBurn ? 0.5 : 1);
        
        // Store dimensions for text wrapping
        d.textWidth = d.radius * 1.6;
        d.textHeight = d.radius * 1.6;
      }
    });

    // Add labels with text wrapping using foreignObject
    node.append('foreignObject')
      .attr('x', d => -d.textWidth / 2)
      .attr('y', d => -d.textHeight / 2)
      .attr('width', d => d.textWidth)
      .attr('height', d => d.textHeight)
      .style('pointer-events', 'none')
      .append('xhtml:div')
      .attr('class', 'node-label')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('text-align', 'center')
      .style('padding', '4px')
      .style('font-size', d => d.type === 'team' ? '14px' : '12px')
      .style('font-weight', d => d.type === 'team' ? 'bold' : '600')
      .style('color', d => d.type === 'team' ? '#fff' : '#fff')
      .style('line-height', '1.2')
      .style('word-wrap', 'break-word')
      .style('overflow-wrap', 'break-word')
      .style('hyphens', 'auto')
      .style('opacity', d => d.letItBurn ? 0.6 : 1)
      .style('text-decoration', d => d.letItBurn ? 'line-through' : 'none')
      .text(d => d.label);

    // Add fire icon overlay AFTER labels so it appears on top
    node.each(function(d) {
      if (d.letItBurn) {
        d3.select(this).append('text')
          .attr('class', 'burn-overlay')
          .attr('text-anchor', 'middle')
          .attr('dy', 8)
          .attr('font-size', '36px')
          .style('pointer-events', 'none')
          .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))')
          .text('🔥');
      }
    });

    // Add tooltips
    node.append('title')
      .text(d => {
        if (d.type === 'team') {
          return `${d.label}\nSize: ${d.size}`;
        } else if (d.type === 'system') {
          return `${d.label}\nComplexity: ${d.complexity}/5`;
        } else {
          return `${d.label}\nDomain Complexity: ${d.complexity}/5`;
        }
      });

    // Update positions on tick
    simulation.on('tick', () => {
      // Update curved link paths
      link.attr('d', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        
        // Create a curved path with control point offset
        // Control point for the curve - offset perpendicular to the line
        const offsetX = -dy * 0.15; // Perpendicular offset
        const offsetY = dx * 0.15;
        
        const midX = (d.source.x + d.target.x) / 2 + offsetX;
        const midY = (d.source.y + d.target.y) / 2 + offsetY;
        
        // Quadratic bezier curve
        return `M${d.source.x},${d.source.y} Q${midX},${midY} ${d.target.x},${d.target.y}`;
      });

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [team, systems, teams]);

  return (
    <div className="force-graph-container">
      <div className="graph-header">
        <h3>Team Interaction Network</h3>
        <div className="graph-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#ff8c42', borderRadius: '50%' }}></div>
            <span>Your Team (center)</span>
          </div>
          <div className="legend-item">
            <div className="legend-shape-rect"></div>
            <span>Systems (right)</span>
          </div>
          <div className="legend-separator">•</div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#10b981' }}></div>
            <span>Low</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#f59e0b' }}></div>
            <span>Med</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#ef4444' }}></div>
            <span>High</span>
          </div>
        </div>
      </div>
      <svg ref={svgRef} className="force-graph-svg" />
    </div>
  );
}

