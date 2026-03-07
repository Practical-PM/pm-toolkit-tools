import { Tile, Badge } from '@toolkit-pm/design-system/components';
import { getQuadrant } from '../utils/defaultDomains';
import './Recommendations.css';

const Recommendations = ({ domains }) => {
  const domainsByQuadrant = domains.reduce((acc, domain) => {
    const quadrant = getQuadrant(domain.x, domain.y);
    if (quadrant) {
      if (!acc[quadrant.id]) {
        acc[quadrant.id] = [];
      }
      acc[quadrant.id].push(domain);
    }
    return acc;
  }, {});

  const quadrantInfo = [
    {
      id: 'commodity',
      name: 'Commodity',
      recommendation: 'Buy or outsource - not differentiating',
      color: '#0ea5e9',
      icon: '🛒',
    },
    {
      id: 'overhead',
      name: 'Overhead',
      recommendation: 'Tolerate or optimize - necessary but burdensome',
      color: '#f97316',
      icon: '⚙️',
    },
    {
      id: 'supporting',
      name: 'Supporting',
      recommendation: 'Build selectively - differentiating but replicable',
      color: '#a855f7',
      icon: '🔧',
    },
    {
      id: 'core',
      name: 'Core',
      recommendation: 'Invest heavily - strategic competitive advantage',
      color: '#10b981',
      icon: '🎯',
    },
  ];

  return (
    <Tile className="recommendations">
      <h3>Strategic Recommendations</h3>
      <div className="recommendations-grid">
        {quadrantInfo.map(quad => {
          const domainsInQuadrant = domainsByQuadrant[quad.id] || [];
          return (
            <div key={quad.id} className="recommendation-card" style={{ borderColor: quad.color }}>
              <div className="recommendation-header">
                <span className="recommendation-icon">{quad.icon}</span>
                <Badge color={quad.color}>{quad.name}</Badge>
              </div>
              <p className="recommendation-text">{quad.recommendation}</p>
              
              {domainsInQuadrant.length > 0 ? (
                <div className="domains-list">
                  <p className="domains-count">
                    {domainsInQuadrant.length} domain{domainsInQuadrant.length !== 1 ? 's' : ''}:
                  </p>
                  <ul>
                    {domainsInQuadrant.map(domain => (
                      <li key={domain.id}>{domain.name}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="no-domains">No domains in this quadrant</p>
              )}
            </div>
          );
        })}
      </div>

      <section className="buying-2026-section" aria-label="Buying in 2026">
        <h4>Buying in 2026</h4>
        <p>
          The AI tooling landscape is changing quickly, making it easier to build bespoke,
          lightweight internal tools that are tightly aligned to how teams actually work.
          This can unlock faster iteration, lower operational overhead, and flexibility that
          off-the-shelf products often cannot offer.
        </p>
        <p>
          Keep this decision active over the next 6 months: reassess where buying still
          creates clear leverage, and where rapid AI-native build options now provide a
          better long-term fit.
        </p>
      </section>
    </Tile>
  );
};

export default Recommendations;

