import { Tile, Badge, EmptyState } from '@toolkit-pm/design-system/components';
import './InsightsSummary.css';

const InsightsSummary = ({ competencies }) => {
  const scoredCompetencies = competencies.filter(c => c.score !== null);

  if (scoredCompetencies.length === 0) {
    return (
      <Tile className="insights-summary">
        <h2>Insights</h2>
        <EmptyState
          message="Score your competencies to see insights about your strengths and development areas."
        />
      </Tile>
    );
  }

  const average = scoredCompetencies.reduce((sum, c) => sum + c.score, 0) / scoredCompetencies.length;
  const sorted = [...scoredCompetencies].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3);
  const developmentAreas = sorted.slice(-3).reverse();

  const getScoreColor = (score) => {
    if (score >= 4.5) return '#10b981';
    if (score >= 3.5) return '#ff8c42';
    if (score >= 2.5) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Strong';
    if (score >= 2.5) return 'Developing';
    return 'Needs Focus';
  };

  return (
    <Tile className="insights-summary">
      <h2>Insights</h2>
      
      <div className="overall-score">
        <div className="score-circle" style={{ borderColor: getScoreColor(average) }}>
          <span className="score-value">{average.toFixed(1)}</span>
          <span className="score-max">/5</span>
        </div>
        <div className="score-info">
          <h3>Overall Score</h3>
          <Badge color={getScoreColor(average)} className="score-status">{getScoreLabel(average)}</Badge>
          <p className="score-description">
            Based on {scoredCompetencies.length} of {competencies.length} competencies
          </p>
        </div>
      </div>

      <div className="insights-columns">
        <div className="insights-section">
          <h3 className="section-title strengths-title">💪 Top Strengths</h3>
          <div className="insights-list">
            {strengths.map((comp) => (
              <div key={comp.id} className="insight-item strength-item">
                <span className="insight-name">{comp.name}</span>
                <Badge variant="success">{comp.score}/5</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="insights-section">
          <h3 className="section-title development-title">🎯 Development Areas</h3>
          <div className="insights-list">
            {developmentAreas.map((comp) => (
              <div key={comp.id} className="insight-item development-item">
                <span className="insight-name">{comp.name}</span>
                <Badge variant="warning">{comp.score}/5</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {scoredCompetencies.length < competencies.length && (
        <div className="unscored-notice">
          <p>
            <strong>Note:</strong> You have {competencies.length - scoredCompetencies.length} unscored 
            {competencies.length - scoredCompetencies.length === 1 ? ' competency' : ' competencies'}. 
            Complete all scores for a full picture.
          </p>
        </div>
      )}
    </Tile>
  );
};

export default InsightsSummary;

