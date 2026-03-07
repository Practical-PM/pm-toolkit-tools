// Cognitive Load Calculation Logic

// Calculate team efficiency based on size
// Small teams (2-3): High efficiency per person (1.2-1.4x), but limited parallelism
// Medium teams (5-7): Optimal balance (1.0x)
// Large teams (10+): Lower efficiency (0.6-0.8x) due to coordination/communication overhead
function getEfficiencyFactor(teamSize) {
  return 2.0 / (1 + teamSize * 0.2);
}

export function calculateCognitiveLoad(team, systems, teams) {
  const teamSize = team.size || 1;
  
  // Efficiency factor: models Brooks's Law - communication overhead grows faster than productivity
  const efficiencyFactor = getEfficiencyFactor(teamSize);
  
  // Sum of system complexities (excluding burned-out systems)
  const systemLoad = systems
    .filter(system => !system.letItBurn)
    .reduce((sum, system) => sum + (system.complexity || 0), 0);
  
  // Sum of team complexities (excluding burned-out teams)
  const teamLoad = teams
    .filter(t => !t.letItBurn)
    .reduce((sum, t) => sum + (t.complexity || 0), 0);
  
  // Rule of thumb: Every 4 people can handle:
  // - 1 complex team (complexity 5) = 5 points
  // - 2.5 complex systems (avg 2.5, complexity 5 each) = 12.5 points
  // This means team interactions are 2.5x more cognitively demanding than system interactions
  
  // Weight team load more heavily (team coordination is harder than system integration)
  const teamWeight = 3.5;
  const systemWeight = 2.5;
  
  // Weighted total load
  const weightedTeamLoad = teamLoad * teamWeight;
  const weightedSystemLoad = systemLoad * systemWeight;
  const totalLoad = weightedTeamLoad + weightedSystemLoad;
  
  // Base capacity calculation (weighted):
  // For 4 people: 1 team × 5 complexity × 2.5 weight = 12.5
  //             + 2.5 systems × 5 complexity × 1.0 weight = 12.5
  //             = 25 total weighted capacity points
  // Per person = 25 / 4 = 6.25 weighted points
  const baseCapacityPerPerson = 10;
  const capacity = teamSize * baseCapacityPerPerson * efficiencyFactor;
  
  // Cognitive load score (0-100 scale)
  // We normalize so that a load equal to capacity = 50 points
  // Higher ratios push towards 100, lower towards 0
  const rawScore = (totalLoad / capacity) * 50;
  const score = Math.min(100, Math.max(0, rawScore));
  
  return {
    score: Math.round(score),
    systemLoad,
    teamLoad,
    weightedTeamLoad,
    weightedSystemLoad,
    totalLoad,
    capacity,
    efficiencyFactor,
    teamWeight,
    systemWeight,
    status: getLoadStatus(score),
  };
}

export function getLoadStatus(score) {
  if (score < 50) {
    return {
      level: 'healthy',
      color: '#10b981',
      label: 'Healthy Load',
      message: 'Team has good capacity to handle current complexity.',
    };
  } else if (score < 75) {
    return {
      level: 'moderate',
      color: '#f59e0b',
      label: 'Moderate Load',
      message: 'Team is approaching capacity. Consider monitoring closely.',
    };
  } else {
    return {
      level: 'high',
      color: '#ef4444',
      label: 'High Load',
      message: 'Team may be overloaded. Consider reducing complexity or increasing capacity.',
    };
  }
}

export function getRecommendations(loadData, team, systems, teams) {
  const recommendations = [];
  
  if (loadData.score >= 75) {
    // High load recommendations
    if (team.size < 6) {
      recommendations.push({
        type: 'team',
        icon: '👥',
        text: 'Consider adding team members, but be aware of coordination overhead.',
      });
    } else if (team.size > 9) {
      recommendations.push({
        type: 'team',
        icon: '⚠️',
        text: 'Large team size is reducing efficiency. Consider splitting into smaller teams.',
      });
    }
    
    if (systems.length > 5) {
      recommendations.push({
        type: 'systems',
        icon: '📦',
        text: 'Reduce number of systems or simplify system integrations.',
      });
    }
    
    if (teams.length > 2) {
      recommendations.push({
        type: 'focus',
        icon: '🎯',
        text: 'Consider temporarily reducing the number of domains/teams you support to provide focus. This may mean those domains reduce service levels/quality while you focus elsewhere.',
      });
    } else if (teams.length > 4) {
      recommendations.push({
        type: 'collaboration',
        icon: '🤝',
        text: 'Too many team dependencies. Aim for clearer boundaries.',
      });
    }
  } else if (loadData.score >= 50) {
    // Moderate load recommendations
    recommendations.push({
      type: 'monitor',
      icon: '👀',
      text: 'Monitor load carefully as you approach capacity limits.',
    });
    
    if (team.size > 10) {
      recommendations.push({
        type: 'efficiency',
        icon: '📊',
        text: 'Team size is large. Consider if coordination overhead is affecting productivity.',
      });
    }
  } else {
    // Healthy load
    recommendations.push({
      type: 'opportunity',
      icon: '✨',
      text: 'Team has capacity for additional responsibilities or innovation time.',
    });
    
    if (team.size >= 5 && team.size <= 7) {
      recommendations.push({
        type: 'optimal',
        icon: '🎯',
        text: 'Team size is in the optimal range for efficiency and capacity.',
      });
    }
  }
  
  return recommendations;
}

