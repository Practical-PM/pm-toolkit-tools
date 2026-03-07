import * as d3 from 'd3';

export function createForceSimulation(width, height, nodes, links) {
  // Count nodes on each side
  const leftNodes = nodes.filter(n => n.side === 'left');
  const rightNodes = nodes.filter(n => n.side === 'right');
  
  // Arrange nodes in vertical stacks on each side
  nodes.forEach((node) => {
    if (node.side === 'center') {
      node.x = width / 2;
      node.y = height / 2;
    } else if (node.side === 'left') {
      // Arrange domains in a vertical stack on the left
      const leftIndex = leftNodes.indexOf(node);
      const spacing = Math.min(120, (height * 0.7) / Math.max(leftNodes.length, 1));
      const startY = height / 2 - ((leftNodes.length - 1) * spacing) / 2;
      node.x = width * 0.2;
      node.y = startY + (leftIndex * spacing);
      // Store target position for force
      node.targetY = node.y;
    } else if (node.side === 'right') {
      // Arrange systems in a vertical stack on the right
      const rightIndex = rightNodes.indexOf(node);
      const spacing = Math.min(120, (height * 0.7) / Math.max(rightNodes.length, 1));
      const startY = height / 2 - ((rightNodes.length - 1) * spacing) / 2;
      node.x = width * 0.8;
      node.y = startY + (rightIndex * spacing);
      // Store target position for force
      node.targetY = node.y;
    }
  });

  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(() => {
        // Longer distance for connections to spread them out
        return 200;
      })
      .strength(0.3)) // Weaker link force to allow more structured positioning
    .force('charge', d3.forceManyBody().strength(-800))
    .force('collision', d3.forceCollide().radius(d => d.radius + 25))
    // Strong horizontal positioning to keep nodes on designated sides
    .force('x', d3.forceX()
      .x(d => {
        if (d.side === 'left') return width * 0.2;
        if (d.side === 'right') return width * 0.8;
        return width / 2;
      })
      .strength(0.8))
    // Strong vertical positioning to maintain vertical stack
    .force('y', d3.forceY()
      .y(d => d.targetY || height / 2)
      .strength(d => d.side === 'center' ? 0.1 : 0.5));
}

export function getNodeColor(type, complexity) {
  if (type === 'team') {
    return '#ff8c42'; // Center team - orange gradient color
  }
  
  // For systems and other teams, color by complexity
  const complexityColors = [
    '#10b981', // 1 - Green (low complexity)
    '#3b82f6', // 2 - Blue
    '#f59e0b', // 3 - Amber (medium)
    '#f97316', // 4 - Orange
    '#ef4444', // 5 - Red (high complexity)
  ];
  
  return complexityColors[(complexity || 1) - 1];
}

export function getNodeRadius(type, teamSize) {
  if (type === 'team') {
    // Central team size scales with team size (50% bigger)
    return 75 + (teamSize * 3);
  }
  
  // Larger nodes for better text display (25% bigger)
  return 50; // Default size for systems and other teams
}

export function prepareGraphData(team, systems, teams) {
  const nodes = [];
  const links = [];
  
  // Add central team node (will be positioned in center)
  nodes.push({
    id: 'central-team',
    type: 'team',
    label: team.name || 'Your Team',
    size: team.size,
    radius: getNodeRadius('team', team.size),
    side: 'center',
  });
  
  // Add system nodes and links (positioned on the right)
  systems.forEach((system, index) => {
    const systemId = `system-${index}`;
    nodes.push({
      id: systemId,
      type: 'system',
      label: system.name,
      complexity: system.complexity,
      radius: getNodeRadius('system'),
      side: 'right',
      letItBurn: system.letItBurn || false,
    });
    
    links.push({
      source: 'central-team',
      target: systemId,
      type: 'system',
      letItBurn: system.letItBurn || false,
    });
  });
  
  // Add other team nodes (domains) and links (positioned on the left)
  teams.forEach((t, index) => {
    const teamId = `team-${index}`;
    nodes.push({
      id: teamId,
      type: 'other-team',
      label: t.name,
      complexity: t.complexity,
      radius: getNodeRadius('other-team'),
      side: 'left',
      letItBurn: t.letItBurn || false,
    });
    
    links.push({
      source: 'central-team',
      target: teamId,
      type: 'team',
      letItBurn: t.letItBurn || false,
    });
  });
  
  return { nodes, links };
}

